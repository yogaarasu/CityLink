import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Shield, CheckCircle } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          CityLink
        </h1>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium transition-colors">Login</Link>
          <Link to="/register" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all shadow-lg hover:shadow-blue-500/30">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Empowering Better <br/>
              <span className="text-blue-600">Communities</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Report local issues, track their progress, and connect with city administrators to build a safer, cleaner environment for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg text-center transition-all shadow-xl hover:shadow-blue-500/30">
                Report an Issue
              </Link>
              <Link to="/login" className="px-8 py-4 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-bold text-lg text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                City Administrator Login
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div>
                <div className="text-3xl font-bold text-blue-600">10k+</div>
                <div className="text-sm text-gray-500">Issues Solved</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">50+</div>
                <div className="text-sm text-gray-500">Cities</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">24h</div>
                <div className="text-sm text-gray-500">Avg Response</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-30"></div>
            <div className="relative bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-2xl space-y-6 border border-gray-100 dark:border-gray-700">
               <div className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Report</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Snap a photo and pinpoint the location of the problem.</p>
                  </div>
               </div>

               <div className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-lg">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Verify</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Admins review and assign the issue to the correct department.</p>
                  </div>
               </div>

               <div className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Resolve</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when the issue is fixed. Transparency first.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
