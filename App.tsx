import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { User, UserRole } from './types';
import { initializeSystem, authenticateUser } from './services/storageService';
import { LucideIcon, Menu, X, Sun, Moon, LogOut, LayoutDashboard, FileText, User as UserIcon, MapPin, Users, Settings } from 'lucide-react';
import clsx from 'clsx';
import { tailwindMerge } from 'tailwind-merge';

// --- Imports from components (Internal Definition for XML Simplicity) ---
import { LandingPage } from './pages/Landing';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { CityAdminDashboard } from './pages/CityAdminDashboard';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { ProfilePage } from './pages/Profile';

// --- Contexts ---

interface AuthContextType {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, login: () => {}, logout: () => {} });
export const useAuth = () => useContext(AuthContext);

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ isDark: false, toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);


// --- Components ---

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' '); // Simple join since we don't have tailwind-merge in this specific file scope without importing
}

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: UserRole[] }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role if unauthorized for specific route
    if (user.role === UserRole.SUPER_ADMIN) return <Navigate to="/admin" />;
    if (user.role === UserRole.CITY_ADMIN) return <Navigate to="/city-admin" />;
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getNavItems = () => {
    if (!user) return [];
    switch (user.role) {
      case UserRole.SUPER_ADMIN:
        return [
          { label: 'Overview', path: '/admin', icon: LayoutDashboard },
          { label: 'City Admins', path: '/admin/users', icon: Users },
          { label: 'Profile', path: '/profile', icon: UserIcon },
        ];
      case UserRole.CITY_ADMIN:
        return [
          { label: 'Dashboard', path: '/city-admin', icon: LayoutDashboard },
          { label: 'Issues', path: '/city-admin/issues', icon: FileText },
          { label: 'Profile', path: '/profile', icon: UserIcon },
        ];
      case UserRole.CITIZEN:
        return [
          { label: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { label: 'Report Issue', path: '/report', icon: MapPin },
          { label: 'Community', path: '/community', icon: Users },
          { label: 'Profile', path: '/profile', icon: UserIcon },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl md:shadow-none transform transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CityLink
            </h1>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {getNavItems().map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white dark:bg-gray-800 p-4 shadow-sm flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600 dark:text-gray-300">
            <Menu size={24} />
          </button>
          <span className="font-semibold text-gray-800 dark:text-white">CityLink</span>
          <div className="w-6" /> {/* Spacer */}
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- App Root ---

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Init System (Create Super Admin if needed)
    initializeSystem();
    
    // Check local storage for persistent session
    const storedUser = localStorage.getItem('citylink_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Check theme preference
    const storedTheme = localStorage.getItem('citylink_theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('citylink_current_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('citylink_current_user');
  };

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('citylink_theme', next ? 'dark' : 'light');
      if (next) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return next;
    });
  };

  if (loading) return <div className="h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white">Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <ThemeContext.Provider value={{ isDark, toggleTheme }}>
        <HashRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={user ? <Navigate to="/dashboard-router" /> : <LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard-router" element={
               <ProtectedRoute>
                 {/* Logic to route to correct dashboard based on role */}
                 {user?.role === UserRole.SUPER_ADMIN && <Navigate to="/admin" />}
                 {user?.role === UserRole.CITY_ADMIN && <Navigate to="/city-admin" />}
                 {user?.role === UserRole.CITIZEN && <Navigate to="/dashboard" />}
               </ProtectedRoute>
            } />

            {/* Super Admin */}
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
                <Layout>
                  <Routes>
                    <Route path="/" element={<SuperAdminDashboard view="overview" />} />
                    <Route path="/users" element={<SuperAdminDashboard view="users" />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />

            {/* City Admin */}
            <Route path="/city-admin/*" element={
              <ProtectedRoute allowedRoles={[UserRole.CITY_ADMIN]}>
                 <Layout>
                  <Routes>
                    <Route path="/" element={<CityAdminDashboard view="overview" />} />
                    <Route path="/issues" element={<CityAdminDashboard view="issues" />} />
                  </Routes>
                 </Layout>
              </ProtectedRoute>
            } />

             {/* Citizen */}
             <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={[UserRole.CITIZEN]}>
                <Layout><CitizenDashboard view="overview" /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/report" element={
              <ProtectedRoute allowedRoles={[UserRole.CITIZEN]}>
                <Layout><CitizenDashboard view="report" /></Layout>
              </ProtectedRoute>
            } />
             <Route path="/community" element={
              <ProtectedRoute allowedRoles={[UserRole.CITIZEN]}>
                <Layout><CitizenDashboard view="community" /></Layout>
              </ProtectedRoute>
            } />

            {/* Shared */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout><ProfilePage /></Layout>
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </HashRouter>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
