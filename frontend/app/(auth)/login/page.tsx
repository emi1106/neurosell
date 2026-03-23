import AuthHero from '@/components/auth/AuthHero';
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image (Server Side Rendered) */}
      <AuthHero
        title="Welcome Back"
        description="Sign in to continue to your account"
        imageSrc="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
      />

      {/* Right side - Form (Client Side Interactive) */}
      <div className="flex-1 flex items-center justify-center p-8 bg-green-50 relative">
        {/* Quote in top-left corner */}
        <div className="absolute top-8 left-8 text-left hidden lg:block">
          <p className="text-lg font-medium text-gray-700 italic">Buy and sell your clothes with style</p>
          <Link href="/">
            <h2 className="text-4xl font-black text-gray-900 mt-1 cursor-pointer hover:opacity-70 transition-opacity">THREADS</h2>
          </Link>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
