"use client";

import { useState } from 'react';
import { FiShield, FiLock, FiX } from 'react-icons/fi';

interface TwoFactorVerifyProps {
  secret: string;
  onVerified: () => void;
  onCancel: () => void;
}

export default function TwoFactorVerify({ secret, onVerified, onCancel }: TwoFactorVerifyProps) {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const verifyToken = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, secret }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify token');
      }

      onVerified();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to verify token');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <FiShield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Security Verification
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Enter your authentication code
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center space-x-3">
            <FiLock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Enter the 6-digit code from your authenticator app to continue.
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              maxLength={6}
            />

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={verifyToken}
                disabled={isLoading || token.length !== 6}
                className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md disabled:opacity-50 transition-colors duration-200"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>

              <button
                onClick={onCancel}
                disabled={isLoading}
                className="py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg shadow-md disabled:opacity-50 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <FiX className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
} 