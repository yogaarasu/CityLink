import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { Issue, IssueStatus } from '../types';
import { createIssue, getIssuesByAuthor, getIssuesByCity } from '../services/storageService';
import { ISSUE_CATEGORIES } from '../constants';
import { MapPin, Camera, Send, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface Props {
  view: 'overview' | 'report' | 'community';
}

export const CitizenDashboard: React.FC<Props> = ({ view }) => {
  const { user } = useAuth();
  const [myIssues, setMyIssues] = useState<Issue[]>([]);
  const [cityIssues, setCityIssues] = useState<Issue[]>([]);

  // Report Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(ISSUE_CATEGORIES[0]);
  const [address, setAddress] = useState(user?.address || '');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      setMyIssues(getIssuesByAuthor(user.id));
      if (user.city) {
        setCityIssues(getIssuesByCity(user.city));
      }
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    createIssue({
      title,
      description,
      category,
      address, // In a real app, we'd use lat/lng from the map here
      city: user.city || 'Unassigned',
      authorId: user.id,
      authorName: user.name,
      status: IssueStatus.PENDING
    });

    setSuccessMsg('Issue reported successfully!');
    setTitle('');
    setDescription('');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.RESOLVED: return 'text-green-600 bg-green-100';
      case IssueStatus.IN_PROGRESS: return 'text-purple-600 bg-purple-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  if (view === 'report') {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">Report an Issue</h1>
        
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-2">
            <CheckCircle size={20} />
            {successMsg}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Issue Title</label>
              <input 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="E.g., Large Pothole on Main St"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
               <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  {ISSUE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                 <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Location</label>
                 <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input 
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter address or drag pin"
                    />
                 </div>
              </div>
            </div>

            {/* Mock Map Area */}
            <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600">
               <div className="text-center">
                 <MapPin size={32} className="mx-auto mb-2" />
                 <span className="text-sm">Map Integration (Google Maps API Placeholder)</span>
               </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <textarea 
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Describe the issue in detail..."
              />
            </div>

            <div>
               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Photo Evidence</label>
               <input type="file" className="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                "/>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-lg flex items-center justify-center gap-2">
              <Send size={20} /> Submit Report
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'community') {
    return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold dark:text-white">Community Issues in {user?.city}</h1>
          <span className="text-sm text-gray-500">{cityIssues.length} reports</span>
        </div>
        
        <div className="grid gap-4">
          {cityIssues.map(issue => (
            <div key={issue.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
               <div className="flex justify-between items-start mb-2">
                 <h3 className="font-bold text-lg dark:text-white">{issue.title}</h3>
                 <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(issue.status)}`}>
                   {issue.status}
                 </span>
               </div>
               <p className="text-gray-600 dark:text-gray-300 mb-4">{issue.description}</p>
               <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><MapPin size={12}/> {issue.address}</span>
                  <span className="flex items-center gap-1"><Clock size={12}/> {new Date(issue.createdAt).toLocaleDateString()}</span>
               </div>
            </div>
          ))}
          {cityIssues.length === 0 && <div className="text-gray-500">No community issues reported yet.</div>}
        </div>
      </div>
    );
  }

  // Overview View
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Hello, {user?.name.split(' ')[0]}!</h1>
        <p className="opacity-90">Thank you for helping keep {user?.city || 'our city'} clean and safe.</p>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
          <Clock size={20} /> My Recent Reports
        </h2>
        <div className="grid gap-4">
          {myIssues.map(issue => (
            <div key={issue.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center transition-transform hover:scale-[1.01]">
               <div>
                 <h3 className="font-bold dark:text-white">{issue.title}</h3>
                 <p className="text-sm text-gray-500 mt-1">{issue.category}</p>
                 <p className="text-xs text-gray-400 mt-2">Reported: {new Date(issue.createdAt).toLocaleDateString()}</p>
               </div>
               <div className="flex flex-col items-end gap-2">
                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(issue.status)}`}>
                   {issue.status.replace('_', ' ')}
                 </span>
               </div>
            </div>
          ))}
          {myIssues.length === 0 && (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl text-center text-gray-500 border border-dashed border-gray-300 dark:border-gray-700">
              You haven't reported any issues yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
