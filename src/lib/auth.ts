
// This is a simple front-end auth service using localStorage
// In a real application, you would use a more secure solution like JWT tokens, HTTP-only cookies, etc.

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthCredentials {
  email: string;
  password: string;
}

// Simulating network delay for auth operations
const MOCK_DELAY = 800;

// Mock user database
let USERS: Record<string, { id: string; email: string; password: string; name?: string }> = {};

// Initialize with some demo users if needed
if (!localStorage.getItem('auth_users')) {
  USERS = {
    '1': { id: '1', email: 'demo@example.com', password: 'password123', name: 'Demo User' },
  };
  localStorage.setItem('auth_users', JSON.stringify(USERS));
} else {
  USERS = JSON.parse(localStorage.getItem('auth_users') || '{}');
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const user = localStorage.getItem('auth_user');
  return !!user;
}

// Get current user
export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('auth_user');
  if (!userStr) return null;
  
  const user = JSON.parse(userStr);
  return {
    id: user.id,
    email: user.email,
    name: user.name
  };
}

// Sign in
export async function signIn({ email, password }: AuthCredentials): Promise<User> {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('auth_users') || '{}');
      const user = Object.values(users).find(
        (u: any) => u.email === email && u.password === password
      );
      
      if (user) {
        const authUser = { id: user.id, email: user.email, name: user.name };
        localStorage.setItem('auth_user', JSON.stringify(authUser));
        resolve(authUser);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, MOCK_DELAY);
  });
}

// Sign up
export async function signUp({ email, password }: AuthCredentials & { name?: string }): Promise<User> {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('auth_users') || '{}');
      
      // Check if user already exists
      const userExists = Object.values(users).some(
        (u: any) => u.email === email
      );
      
      if (userExists) {
        reject(new Error('User with this email already exists'));
        return;
      }
      
      // Create new user
      const id = Date.now().toString();
      const newUser = { id, email, password };
      
      // Update users in localStorage
      users[id] = newUser;
      localStorage.setItem('auth_users', JSON.stringify(users));
      
      // Set current user and return
      const authUser = { id, email };
      localStorage.setItem('auth_user', JSON.stringify(authUser));
      resolve(authUser);
    }, MOCK_DELAY);
  });
}

// Sign out
export function signOut(): void {
  localStorage.removeItem('auth_user');
}

// Request password reset (simulated)
export async function requestPasswordReset(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('auth_users') || '{}');
      
      const userExists = Object.values(users).some(
        (u: any) => u.email === email
      );
      
      if (userExists) {
        // In a real app, this would send an email
        console.log(`Password reset link sent to ${email}`);
        resolve();
      } else {
        reject(new Error('User not found'));
      }
    }, MOCK_DELAY);
  });
}

// Update user profile
export async function updateProfile(userId: string, data: { name?: string }): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('auth_users') || '{}');
      
      if (!users[userId]) {
        reject(new Error('User not found'));
        return;
      }
      
      // Update user
      users[userId] = { ...users[userId], ...data };
      localStorage.setItem('auth_users', JSON.stringify(users));
      
      // Update current user if needed
      const currentUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
      if (currentUser.id === userId) {
        const updatedUser = { ...currentUser, ...data };
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        resolve(updatedUser);
      } else {
        resolve({ id: userId, email: users[userId].email, name: users[userId].name });
      }
    }, MOCK_DELAY);
  });
}
