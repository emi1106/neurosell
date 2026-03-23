import AuthHero from '@/components/auth/AuthHero';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image (Server Side Rendered) */}
      <AuthHero
        title="Join Us"
        description="Create your account and get started"
        imageSrc="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1971&q=80"
      />

      {/* Right side - Form (Client Side Interactive) */}
      <div className="flex-1 flex items-center justify-center p-8 bg-green-50 relative">
        {/* Quote in top-left corner */}
        <div className="absolute top-8 left-8 text-left hidden lg:block">
          <p className="text-lg font-medium text-gray-700 italic">Buy and sell your clothes with style</p>
          <h2 className="text-4xl font-black text-gray-900 mt-1">THREADS</h2>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}