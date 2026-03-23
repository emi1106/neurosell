export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans">
      <main className="flex-1 max-w-4xl mx-auto px-6 md:px-12 py-24">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-zinc-900 dark:text-white mb-12">
          Terms of Service
        </h1>
        <div className="space-y-8 text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
          <section>
            <h2 className="text-xl font-medium text-zinc-900 dark:text-white mb-4">1. Introduction</h2>
            <p>
              By accessing and using Essential Curations, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-medium text-zinc-900 dark:text-white mb-4">2. Products & Pricing</h2>
            <p>
              All products are subject to availability. We reserve the right to discontinue any product at any time. Prices for our products are subject to change without notice. We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-medium text-zinc-900 dark:text-white mb-4">3. Accuracy of Information</h2>
            <p>
              We attempt to be as accurate as possible in the description of our products. However, we do not warrant that product descriptions or other content is completely accurate, complete, reliable, current, or error-free.
            </p>
          </section>
          <p className="pt-8 text-sm">Last updated: March 2026</p>
        </div>
      </main>
    </div>
  );
}
