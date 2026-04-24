"use client"

import { useEffect, useState } from 'react'
import Navbar from "@/component/components/Navbar";
import { User, Mail, Calendar, LogOut, Shield, Settings, Activity, HardDrive, Bell } from 'lucide-react';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openLogin, setOpenLogin] = useState(false);

  useEffect(() => {
    let mounted = true
    async function fetchMe() {
      setLoading(true)
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data?.error || 'Failed to fetch')
        }
        const data = await res.json()
        if (mounted) setUser(data.user)
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchMe()
    return () => { mounted = false }
  }, [])

  const signOut = () => {
    try { localStorage.removeItem('token') } catch (e) {}
    try { document.cookie = 'token=; Max-Age=0; path=/'; } catch (e) {}
    window.location.href = '/'
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <button onClick={() => window.location.href = '/'} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
          Go Back Home
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <Navbar setOpenLogin={setOpenLogin} />
      
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row items-center md:items-end gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-blue-600 opacity-10"></div>
          
          <div className="relative z-10 w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-indigo-200">
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
          </div>
          
          <div className="relative z-10 flex-1 text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-1">{user?.name || 'User Profile'}</h1>
            <p className="text-slate-500 flex items-center justify-center md:justify-start gap-2 font-medium">
              <Mail size={16} />
              {user?.email}
            </p>
          </div>
          
          <div className="relative z-10 flex gap-3">
             <button onClick={signOut} className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold transition-all shadow-sm">
                <LogOut size={18} />
                Sign out
             </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                <Shield size={22} className="text-indigo-500" />
                Account Security
              </h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Email Address', value: user?.email, icon: Mail },
                  { label: 'Login Password', value: '••••••••••••', icon: Shield },
                  { label: 'Active Sessions', value: '2 devices connected', icon: Activity },
                ].map((item, i) => (
                  <div key={i} className="group flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                        <p className="text-sm font-bold text-slate-800">{item.value}</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">Edit</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Activity size={22} className="text-indigo-500" />
                  Transfer History
                </h3>
                <button className="text-xs font-bold text-indigo-600 uppercase tracking-widest hover:underline">View All</button>
              </div>
              
              <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity size={28} className="text-slate-300" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">No transfers yet</h4>
                <p className="text-slate-500 text-sm mb-6">Start sharing files to see your activity here.</p>
                <button onClick={() => window.location.href = '/'} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
                  Send Your First File
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-200 overflow-hidden relative group">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute -left-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                    <HardDrive size={20} />
                  </div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider">Cloud Storage</h4>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-4xl font-black text-white tracking-tight">0.0<span className="text-lg font-bold opacity-60">GB</span></span>
                    <span className="text-white/60 font-bold text-xs">20 GB LIMIT</span>
                  </div>
                  <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-white h-full w-[2%] rounded-full shadow-sm"></div>
                  </div>
                </div>
                <button className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-indigo-50 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Upgrade Plan
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
               <h4 className="text-slate-900 font-bold mb-6 text-sm uppercase tracking-widest">Account Details</h4>
               <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined On</p>
                      <p className="font-bold text-slate-800">April 24, 2026</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                      <Shield size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subscription</p>
                      <p className="font-bold text-slate-800">Free Explorer</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                      <Bell size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Notifications</p>
                      <p className="font-bold text-slate-800">Marketing Off</p>
                    </div>
                 </div>
               </div>
            </div>
            
            <div className="p-6 rounded-3xl border-2 border-dashed border-slate-200 flex items-center gap-4 text-slate-400">
               <Settings size={20} />
               <p className="text-xs font-bold uppercase tracking-widest">Platform Settings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
