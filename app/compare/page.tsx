import { Eye, List } from 'lucide-react'

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow p-8">
        <h1 className="text-3xl font-bold mb-4">Compare Our Offers</h1>
        <p className="text-slate-600 mb-6">Choose the plan that fits your needs — compare storage, transfer limits, and features.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 border rounded-lg text-center">
            <h3 className="text-xl font-bold">Free</h3>
            <p className="text-slate-500">Basic transfers, 20 GB limit</p>
            <ul className="text-sm text-slate-600 mt-4 space-y-2">
              <li>7-day link expiry</li>
              <li>Basic sharing features</li>
            </ul>
            <button className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded">Choose Free</button>
          </div>

          <div className="p-6 border rounded-lg text-center">
            <h3 className="text-xl font-bold">Pro</h3>
            <p className="text-slate-500">Extended limits, advanced features</p>
            <ul className="text-sm text-slate-600 mt-4 space-y-2">
              <li>Up to 100 GB transfers</li>
              <li>Password protected shares</li>
            </ul>
            <button className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded">Choose Pro</button>
          </div>

          <div className="p-6 border rounded-lg text-center">
            <h3 className="text-xl font-bold">Business</h3>
            <p className="text-slate-500">Team management and white-label</p>
            <ul className="text-sm text-slate-600 mt-4 space-y-2">
              <li>Custom branding</li>
              <li>Admin controls</li>
            </ul>
            <button className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded">Contact Sales</button>
          </div>
        </div>

      </div>
    </main>
  )
}
