"use client";

import { useState } from 'react';
import Image from 'next/image';
import { FiShield, FiSmartphone, FiKey } from 'react-icons/fi';

interface TwoFactorSetupProps {
  email: string;
  onSetupComplete: (secret: string) => void;
}

export default function TwoFactorSetup({ email, onSetupComplete }: TwoFactorSetupProps) {
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'initial' | 'verify'>('initial');

  const setupTwoFactor = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('/api/auth/setup-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to setup 2FA');
      }

      setQrCode(data.qrCode);
      setSecret(data.secret);
      setStep('verify');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to setup 2FA');
    } finally {
      setIsLoading(false);
    }
  };

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

      onSetupComplete(secret);
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
            Two-Factor Authentication
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Enhance your account security
          </p>
        </div>

        {step === 'initial' && (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Adding two-factor authentication will increase the security of your account by requiring a second form of verification.
              </p>
            </div>
            <button
              onClick={setupTwoFactor}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md disabled:opacity-50 transition-colors duration-200"
            >
              {isLoading ? 'Setting up...' : 'Setup 2FA'}
            </button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <FiSmartphone className="w-5 h-5" />
                <p className="text-sm">1. Install Google Authenticator or any TOTP app</p>
              </div>
              <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                <FiKey className="w-5 h-5" />
                <p className="text-sm">2. Scan this QR code with your app</p>
              </div>
            </div>

            {qrCode && (
              <div className="flex justify-center p-4 bg-white rounded-lg shadow-inner">
                <Image
                  src={qrCode}
                  alt="2FA QR Code"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
            )}

            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                3. Enter the 6-digit code from your authenticator app
              </p>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 text-center text-lg tracking-widest border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                maxLength={6}
              />

              <button
                onClick={verifyToken}
                disabled={isLoading || token.length !== 6}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md disabled:opacity-50 transition-colors duration-200"
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
} 