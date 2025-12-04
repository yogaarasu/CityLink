import React from 'react';
import { useAuth } from '../App';
import { User, UserRole } from '../types';
import { User as UserIcon, Mail, Phone, MapPin, Shield } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">My Profile</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        <div className="px-8 pb-8">
          <div className="relative -top-12 mb-[-30px]">
            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full p-2">
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                <UserIcon size={40} />
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
            <div className="flex items-center gap-2 text-blue-600 font-medium text-sm mt-1">
              <Shield size={14} />
              {user.role.replace('_', ' ')}
            </div>
          </div>

          <div className="mt-8 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Contact Information</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Mail size={18} className="text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
                  </div>
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Phone</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Phone size={18} className="text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{user.phone || 'Not provided'}</span>
                  </div>
                </div>
             </div>

             {(user.role === UserRole.CITIZEN || user.role === UserRole.CITY_ADMIN) && (
               <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Location Assignment</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <MapPin size={18} className="text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {user.city ? `${user.city}, ${user.state || 'USA'}` : 'No City Assigned'}
                      {user.address && ` - ${user.address}`}
                    </span>
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>
      
      <div className="text-center">
         <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline">
            Edit Profile (Disabled in Demo)
         </button>
      </div>
    </div>
  );
};
