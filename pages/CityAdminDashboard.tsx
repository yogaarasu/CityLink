import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { Issue, IssueStatus } from '../types';
import { getIssuesByCity, updateIssueStatus, updateIssueSummary } from '../services/storageService';
import { generateIssueAnalysis } from '../services/geminiService';
import { CheckCircle, Clock, AlertTriangle, Search, Filter, Cpu } from 'lucide-react';

interface Props {
  view: 'overview' | 'issues';
}

export const CityAdminDashboard: React.FC<Props> = ({ view }) => {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [analyzing, setAnalyzing] = useState<string | null>(null);

  useEffect(() => {
    if (user?.city) {
      setIssues(getIssuesByCity(user.city));
    }
  }, [user]);

  const handleStatusUpdate = (id: string, status: IssueStatus) => {
    updateIssueStatus(id, status);
    // Optimistic update
    setIssues(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  const handleAnalyze = async (issue: Issue) => {
    setAnalyzing(issue.id);
    const summary = await generateIssueAnalysis(issue);
    updateIssueSummary(issue.id, summary);
    setIssues(prev => prev.map(i => i.id === issue.id ? { ...i, aiSummary: summary } : i));
    setAnalyzing(null);
  };

  const filteredIssues = issues.filter(i => {
    if (filter === 'ALL') return true;
    return i.status === filter;
  });

  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === IssueStatus.PENDING).length,
    progress: issues.filter(i => i.status === IssueStatus.IN_PROGRESS).length,
    resolved: issues.filter(i => i.status === IssueStatus.RESOLVED).length,
  };

  if (view === 'overview') {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold dark:text-white">Dashboard: {user?.city}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-l-4 border-blue-500 shadow-sm">
             <div className="flex items-center justify-between">
                <div>
                   <p className="text-sm text-gray-500">Total Reports</p>
                   <p className="text-2xl font-bold dark:text-white">{stats.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full text-blue-600"><AlertTriangle size={20} /></div>
             </div>
           </div>
           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-l-4 border-yellow-500 shadow-sm">
             <div className="flex items-center justify-between">
                <div>
                   <p className="text-sm text-gray-500">Pending</p>
                   <p className="text-2xl font-bold dark:text-white">{stats.pending}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full text-yellow-600"><Clock size={20} /></div>
             </div>
           </div>
           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-l-4 border-purple-500 shadow-sm">
             <div className="flex items-center justify-between">
                <div>
                   <p className="text-sm text-gray-500">In Progress</p>
                   <p className="text-2xl font-bold dark:text-white">{stats.progress}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full text-purple-600"><Cpu size={20} /></div>
             </div>
           </div>
           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-l-4 border-green-500 shadow-sm">
             <div className="flex items-center justify-between">
                <div>
                   <p className="text-sm text-gray-500">Resolved</p>
                   <p className="text-2xl font-bold dark:text-white">{stats.resolved}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full text-green-600"><CheckCircle size={20} /></div>
             </div>
           </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold mb-4 dark:text-white">Recent Urgent Issues</h2>
           <p className="text-gray-500">No urgent issues flagged by AI analysis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold dark:text-white">Manage Issues</h1>
        <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
           {['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED'].map(s => (
             <button 
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${filter === s ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'}`}
             >
               {s.replace('_', ' ')}
             </button>
           ))}
        </div>
      </div>

      <div className="grid gap-6">
        {filteredIssues.map(issue => (
          <div key={issue.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-start">
                 <div>
                    <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-500 rounded-md mb-2">{issue.category}</span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{issue.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex items-center gap-1">
                      <Clock size={14} /> Reported on {new Date(issue.createdAt).toLocaleDateString()} by {issue.authorName}
                    </p>
                 </div>
                 <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                   issue.status === IssueStatus.RESOLVED ? 'bg-green-100 text-green-700' : 
                   issue.status === IssueStatus.IN_PROGRESS ? 'bg-purple-100 text-purple-700' : 
                   'bg-yellow-100 text-yellow-700'
                 }`}>
                   {issue.status.replace('_', ' ')}
                 </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300">{issue.description}</p>
              
              {issue.address && (
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Search size={14} /> Location: {issue.address}
                </p>
              )}

              {/* AI Section */}
              <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                 <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                       <Cpu size={16} /> Gemini Analysis
                    </h4>
                    {!issue.aiSummary && (
                       <button 
                         onClick={() => handleAnalyze(issue)}
                         disabled={analyzing === issue.id}
                         className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 disabled:opacity-50"
                       >
                         {analyzing === issue.id ? 'Analyzing...' : 'Generate Summary'}
                       </button>
                    )}
                 </div>
                 {issue.aiSummary ? (
                   <p className="text-sm text-indigo-800 dark:text-indigo-200">{issue.aiSummary}</p>
                 ) : (
                   <p className="text-xs text-indigo-400 italic">Click generate to get AI insights on priority and content.</p>
                 )}
              </div>
            </div>

            <div className="md:w-64 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 md:pl-6 pt-4 md:pt-0">
               <h4 className="text-xs font-bold text-gray-400 uppercase">Update Status</h4>
               <button 
                 onClick={() => handleStatusUpdate(issue.id, IssueStatus.PENDING)}
                 className={`w-full py-2 px-4 rounded text-sm font-medium border ${issue.status === IssueStatus.PENDING ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
               >
                 Pending
               </button>
               <button 
                 onClick={() => handleStatusUpdate(issue.id, IssueStatus.IN_PROGRESS)}
                 className={`w-full py-2 px-4 rounded text-sm font-medium border ${issue.status === IssueStatus.IN_PROGRESS ? 'bg-purple-50 border-purple-200 text-purple-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
               >
                 In Progress
               </button>
               <button 
                 onClick={() => handleStatusUpdate(issue.id, IssueStatus.RESOLVED)}
                 className={`w-full py-2 px-4 rounded text-sm font-medium border ${issue.status === IssueStatus.RESOLVED ? 'bg-green-50 border-green-200 text-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
               >
                 Resolved
               </button>
            </div>
          </div>
        ))}
        
        {filteredIssues.length === 0 && (
          <div className="text-center py-12 text-gray-500">No issues found matching this filter.</div>
        )}
      </div>
    </div>
  );
};
