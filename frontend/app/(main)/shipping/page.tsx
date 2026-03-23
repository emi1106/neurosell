export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans">
      <main className="flex-1 max-w-4xl mx-auto px-6 md:px-12 py-24">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tighter text-zinc-900 dark:text-white mb-12">
          Shipping & Returns
        </h1>
        <div className="space-y-8 text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
          <section>
            <h2 className="text-xl font-medium text-zinc-900 dark:text-white mb-4">Order Processing</h2>
            <p>
              All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-medium text-zinc-900 dark:text-white mb-4">Shipping Rates & Estimates</h2>
            <p>
              Shipping charges for your order will be calculated and displayed at checkout. Standard shipping typically takes 3-5 business days. Expedited shipping options are available at an additional cost.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-medium text-zinc-900 dark:text-white mb-4">Return Policy</h2>
            <p>
              We accept returns within 30 days of delivery. Items must be unworn, unwashed, and have original tags attached to be eligible for a refund. To initiate a return, please visit our contact page.
            </p>
          </section>
          <p className="pt-8 text-sm">Last updated: March 2026</p>
        </div>
      </main>
    </div>
  );
}
