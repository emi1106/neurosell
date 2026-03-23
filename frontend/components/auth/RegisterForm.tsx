'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center lg:text-left">
        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
        <p className="mt-2 text-gray-600">Fill in your information to get started</p>
      </div>

      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            className="h-12 px-4 bg-white border-gray-200 focus-visible:ring-green-500 rounded-lg text-sm"
            placeholder="Your full name"
          />
        </div>

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
          <div className="relative group">
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

        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </Label>
          <div className="relative group">
            <Input
              id="confirm-password"
              name="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              required
              className="h-12 pl-4 pr-12 bg-white border-gray-200 focus-visible:ring-green-500 rounded-lg text-sm"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-green-600 transition-colors flex items-center justify-center group-hover:bg-transparent"
            >
              <div className="relative h-4 w-4 overflow-hidden">
                <div className={cn(
                  "transition-all duration-300 transform",
                  showConfirmPassword ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
                )}>
                  <Eye className="h-4 w-4" />
                </div>
                <div className={cn(
                  "absolute top-0 left-0 transition-all duration-300 transform",
                  showConfirmPassword ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}>
                  <EyeOff className="h-4 w-4" />
                </div>
              </div>
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-green-800 hover:bg-green-900 text-white rounded-lg font-bold tracking-widest uppercase transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-green-900/10"
        >
          Create Account
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
}
