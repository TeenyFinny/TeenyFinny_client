export default function DesignSystemDemo() {
  return (
    <div className="min-h-screen bg-neutral-6 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Usage Examples */}
        <section>
          <h1 className="text-head-01 text-neutral-1 mb-6">Usage Examples</h1>

          <div className="grid grid-cols-2 gap-6">
            {/* Card Example 1 */}
            <div className="bg-primary-1 p-6 rounded-lg">
              <h3 className="text-head-03 text-neutral-6 mb-2">Primary Card</h3>
              <p className="text-body-06 text-neutral-6">Using primary-1 background with neutral-6 text</p>
            </div>

            {/* Card Example 2 */}
            <div className="bg-neutral-6 border border-neutral-4 p-6 rounded-lg">
              <h3 className="text-head-03 text-neutral-1 mb-2">Neutral Card</h3>
              <p className="text-body-06 text-neutral-2">Using neutral-6 background with neutral-1 text</p>
            </div>

            {/* Alert Examples */}
            <div className="bg-error/10 border border-error p-4 rounded-lg">
              <p className="text-body-02 text-error">Error Message</p>
              <p className="text-body-07 text-neutral-2">Something went wrong</p>
            </div>

            <div className="bg-success/10 border border-success p-4 rounded-lg">
              <p className="text-body-02 text-success">Success Message</p>
              <p className="text-body-07 text-neutral-2">Operation completed</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
