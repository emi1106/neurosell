export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans">
      <main className="flex-1 max-w-4xl mx-auto px-6 md:px-12 py-24">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-zinc-900 dark:text-white mb-12">
          Privacy Policy
        </h1>
        <div className="space-y-8 text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
          <section>
            <h2 className="text-xl font-medium text-zinc-900 dark:text-white mb-4">1. Data Collection</h2>
            <p>
              We collect information that you provide directly to us when you create an account, make a purchase, or communicate with us. This minimal data includes your name, email address, shipping address, and payment details strictly necessary to fulfill your order.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-medium text-zinc-900 dark:text-white mb-4">2. Use of Information</h2>
            <p>
              Your information is used solely to process orders, communicate regarding your purchase, and improve our services. We do not sell or share your personal data with third-party marketing companies. 
            </p>
          </section>
          <section>
            <h2 className="text-xl font-medium text-zinc-900 dark:text-white mb-4">3. Security</h2>
            <p>
              We implement industry-standard security measures to ensure your personal information is kept safe. Payment processing is handled by secure third-party providers.
            </p>
          </section>
          <p className="pt-8 text-sm">Last updated: March 2026</p>
        </div>
      </main>
    </div>
  );
}
