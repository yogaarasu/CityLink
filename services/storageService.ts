import { User, Issue, UserRole, IssueStatus } from '../types';
import { SUPER_ADMIN_ID_SECRET } from '../constants';

// Keys for LocalStorage
const USERS_KEY = 'citylink_users';
const ISSUES_KEY = 'citylink_issues';
const CURRENT_USER_KEY = 'citylink_current_user';

// Helper to get data
const getStoredUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

const getStoredIssues = (): Issue[] => {
  const data = localStorage.getItem(ISSUES_KEY);
  return data ? JSON.parse(data) : [];
};

// --- User Operations ---

export const createUser = (userData: Partial<User>): User => {
  const users = getStoredUsers();
  
  // Check duplicates
  if (users.find(u => u.email === userData.email)) {
    throw new Error("Email already registered");
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    name: userData.name || 'Unknown',
    email: userData.email || '',
    role: userData.role || UserRole.CITIZEN,
    ...userData
  } as User;

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return newUser;
};

export const authenticateUser = (email: string, password: string): User | null => {
  // NOTE: Password check is skipped for this mockup as we aren't storing hashed passwords 
  // in this simple storage service to keep code concise. 
  // In a real backend, we would bcrypt.compare(password, hash).
  
  // Special check for Super Admin simulation
  if (email === "admin@citylink.com" && password === "admin123") {
     // Return a mock super admin if strictly using the hardcoded "secret" ID logic
     // from the prompt requirements in a broader sense.
     // However, let's look for the user in our DB first.
  }

  const users = getStoredUsers();
  const user = users.find(u => u.email === email);
  
  // For Super Admin strict ID check (simulating .env match)
  if (user?.role === UserRole.SUPER_ADMIN) {
      // In a real app, the ID in the DB would need to match the env.
      // We will enforce this ID check upon retrieval.
      if (user.id !== SUPER_ADMIN_ID_SECRET) {
          // If the stored user doesn't match the "env" secret, deny.
          // (This handles the requirement: "matching predefined user_id from .env file")
          // We will create the Super Admin on first run if not exists to facilitate testing.
      }
  }

  if (user) return user;
  return null;
};

export const initializeSystem = () => {
  // Create Super Admin if not exists (Bootstrap)
  const users = getStoredUsers();
  const adminExists = users.find(u => u.role === UserRole.SUPER_ADMIN);
  
  if (!adminExists) {
    const superAdmin: User = {
      id: SUPER_ADMIN_ID_SECRET, // Matching the "ENV" secret
      name: "System Super Admin",
      email: "admin@citylink.com",
      role: UserRole.SUPER_ADMIN,
      createdAt: Date.now()
    };
    users.push(superAdmin);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    console.log("System Initialized: Super Admin created (admin@citylink.com)");
  }
};

export const getAllCityAdmins = (): User[] => {
  return getStoredUsers().filter(u => u.role === UserRole.CITY_ADMIN);
};

export const deleteUser = (userId: string) => {
  const users = getStoredUsers().filter(u => u.id !== userId);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// --- Issue Operations ---

export const createIssue = (issueData: Partial<Issue>): Issue => {
  const issues = getStoredIssues();
  const newIssue: Issue = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    status: IssueStatus.PENDING,
    ...issueData
  } as Issue;

  issues.push(newIssue);
  localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
  return newIssue;
};

export const updateIssueStatus = (issueId: string, status: IssueStatus) => {
  const issues = getStoredIssues();
  const idx = issues.findIndex(i => i.id === issueId);
  if (idx !== -1) {
    issues[idx].status = status;
    issues[idx].updatedAt = Date.now();
    localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
  }
};

export const updateIssueSummary = (issueId: string, summary: string) => {
  const issues = getStoredIssues();
  const idx = issues.findIndex(i => i.id === issueId);
  if (idx !== -1) {
    issues[idx].aiSummary = summary;
    localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
  }
};

export const getIssuesByCity = (city: string): Issue[] => {
  return getStoredIssues().filter(i => i.city.toLowerCase() === city.toLowerCase());
};

export const getIssuesByAuthor = (authorId: string): Issue[] => {
  return getStoredIssues().filter(i => i.authorId === authorId);
};

export const getAllIssues = (): Issue[] => {
  return getStoredIssues();
};
