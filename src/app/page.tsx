"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TwoFactorSetup from '../components/auth/TwoFactorSetup';
import TwoFactorVerify from '../components/auth/TwoFactorVerify';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [showTwoFactorVerify, setShowTwoFactorVerify] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState('');

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError('');

      // In a real application, validate credentials against your backend
      if (email === 'svceadmin' && password === 'password') {
        // Store email for future use
        localStorage.setItem('userEmail', email);
        
        // Check if 2FA is already set up
        const secret = localStorage.getItem(`2fa_secret_${email}`);
        
        if (secret) {
          // If 2FA is set up, show verification screen
          setTwoFactorSecret(secret);
          setShowTwoFactorVerify(true);
        } else {
          // If 2FA is not set up, show setup screen
          setShowTwoFactorSetup(true);
        }
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorSetupComplete = (secret: string) => {
    // Save the secret in localStorage (in a real app, save in your backend)
    localStorage.setItem(`2fa_secret_${email}`, secret);
    
    // Set authentication and user data
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
    
    // Set authentication cookie
    document.cookie = 'isAuthenticated=true; path=/';
    
    // Redirect to dashboard
    router.push('/dashboard');
  };

  const handleTwoFactorVerified = () => {
    // Set authentication and user data
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
    
    // Set authentication cookie
    document.cookie = 'isAuthenticated=true; path=/';
    
    // Redirect to dashboard
    router.push('/dashboard');
  };

  const handleCancel2FA = () => {
    setShowTwoFactorVerify(false);
    setPassword('');
    // Clear stored email if canceling 2FA
    localStorage.removeItem('userEmail');
  };

  if (showTwoFactorSetup) {
    return (
      <TwoFactorSetup
        email={email}
        onSetupComplete={handleTwoFactorSetupComplete}
      />
    );
  }

  if (showTwoFactorVerify) {
    return (
      <TwoFactorVerify
        secret={twoFactorSecret}
        onVerified={handleTwoFactorVerified}
        onCancel={handleCancel2FA}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            <span className="text-blue-600 dark:text-blue-400">Sidemen</span> Security
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

