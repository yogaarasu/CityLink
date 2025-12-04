import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { createUser, getAllCityAdmins, deleteUser } from '../services/storageService';
import { MOCK_CITIES } from '../constants';
import { Trash2, UserPlus, Search, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  view: 'overview' | 'users';
}

export const SuperAdminDashboard: React.FC<Props> = ({ view }) => {
  const [admins, setAdmins] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', phone: '', city: '', password: '' });
  
  useEffect(() => {
    refreshAdmins();
  }, []);

  const refreshAdmins = () => {
    setAdmins(getAllCityAdmins());
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      createUser({
        name: newAdmin.name,
        email: newAdmin.email,
        phone: newAdmin.phone,
        city: newAdmin.city,
        role: UserRole.CITY_ADMIN
      });
      setShowAddModal(false);
      refreshAdmins();
      setNewAdmin({ name: '', email: '', phone: '', city: '', password: '' });
    } catch (error) {
      alert("Failed to create admin");
    }
  };

  const handleDelete = (id: string) => {
    if(window.confirm("Are you sure?")) {
      deleteUser(id);
      refreshAdmins();
    }
  };

  // Mock data for charts
  const chartData = MOCK_CITIES.slice(0, 5).map(city => ({
    name: city,
    issues: Math.floor(Math.random() * 100)
  }));

  if (view === 'overview') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold dark:text-white">System Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total City Admins</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{admins.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
             <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Cities</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{MOCK_CITIES.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
             <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">System Health</h3>
            <p className="text-3xl font-bold text-green-500 mt-2">99.9%</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold dark:text-white mb-4">Issues by Top Cities</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip />
                <Bar dataKey="issues" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Manage City Administrators</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <UserPlus size={18} />
          Add Administrator
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Email</th>
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400">City</th>
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Phone</th>
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="p-4 font-medium text-gray-900 dark:text-white">{admin.name}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{admin.email}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full border border-blue-100 dark:border-blue-900">
                      {admin.city}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{admin.phone}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(admin.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {admins.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No administrators found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold dark:text-white mb-4">Add City Administrator</h2>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <input 
                placeholder="Full Name" 
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={newAdmin.name}
                onChange={e => setNewAdmin({...newAdmin, name: e.target.value})}
              />
              <input 
                placeholder="Email" 
                type="email"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={newAdmin.email}
                onChange={e => setNewAdmin({...newAdmin, email: e.target.value})}
              />
              <input 
                placeholder="Phone (Verification Required)" 
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={newAdmin.phone}
                onChange={e => setNewAdmin({...newAdmin, phone: e.target.value})}
              />
              <select 
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={newAdmin.city}
                onChange={e => setNewAdmin({...newAdmin, city: e.target.value})}
              >
                <option value="">Select City Assignment</option>
                {MOCK_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
               <input 
                placeholder="Temporary Password" 
                type="password"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                value={newAdmin.password}
                onChange={e => setNewAdmin({...newAdmin, password: e.target.value})}
              />
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
