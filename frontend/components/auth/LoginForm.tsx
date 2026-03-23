'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'code' | 'newPassword'>('email');
  const [resetEmail, setResetEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (forgotStep === 'email') {
        setForgotStep('code');
      } else if (forgotStep === 'code') {
        setForgotStep('newPassword');
      } else {
        // Reset successful
        setShowForgotPassword(false);
        setForgotStep('email');
        setResetEmail('');
        setVerificationCode('');
        setNewPassword('');
        setConfirmPassword('');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center lg:text-left">
        <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
        <p className="mt-2 text-gray-600">Enter your credentials to access your account</p>
      </div>

      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            className="h-12 px-4 bg-white border-gray-200 focus-visible:ring-green-500 rounded-lg text-sm"
            placeholder="your@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </Label>
          <div className="relative group items-center">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="h-12 pl-4 pr-12 bg-white border-gray-200 focus-visible:ring-green-500 rounded-lg text-sm"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-green-600 transition-colors flex items-center justify-center group-hover:bg-transparent"
            >
              <div className="relative h-4 w-4 overflow-hidden">
                <div className={cn(
                  "transition-all duration-300 transform",
                  showPassword ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
                )}>
                  <Eye className="h-4 w-4" />
                </div>
                <div className={cn(
                  "absolute top-0 left-0 transition-all duration-300 transform",
                  showPassword ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}>
                  <EyeOff className="h-4 w-4" />
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-gray-100 hover:border-green-200 transition-all shadow-sm">
            <Checkbox id="remember-me" className="border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 rounded-sm" />
            <Label 
              htmlFor="remember-me" 
              className="text-xs font-semibold text-gray-600 cursor-pointer select-none leading-none pt-0.5"
            >
              Remember me
            </Label>
          </div>

          <div className="text-sm">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="font-medium text-green-600 hover:text-green-500"
            >
              Forgot your password?
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-green-800 hover:bg-green-900 text-white rounded-lg font-bold tracking-widest uppercase transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-green-900/10"
        >
          Sign In
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up here
          </a>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {forgotStep === 'email' && 'Reset Password'}
                {forgotStep === 'code' && 'Enter Verification Code'}
                {forgotStep === 'newPassword' && 'Set New Password'}
              </h3>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotStep('email');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              {forgotStep === 'email' && (
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="your@email.com"
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    We'll send a verification code to this email address.
                  </p>
                </div>
              )}

              {forgotStep === 'code' && (
                <div>
                  <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700">
                    Verification Code
                  </label>
                  <input
                    id="verification-code"
                    type="text"
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter 6-digit code"
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    Check your email for the verification code.
                  </p>
                </div>
              )}

              {forgotStep === 'newPassword' && (
                <>
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="••••••••"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-800 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 
                 forgotStep === 'email' ? 'Send Code' :
                 forgotStep === 'code' ? 'Verify Code' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
