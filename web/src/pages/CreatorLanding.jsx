import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Crown, DollarSign, TrendingUp, ChevronLeft, Loader2 } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000'

const CreatorLanding = () => {
  const navigate = useNavigate()
  const [hasApplication, setHasApplication] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/creator/application-status`)
      .then(res => res.json())
      .then(data => {
        setHasApplication(data.hasApplication)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-brand-navy text-white flex flex-col font-sans max-w-md mx-auto relative overflow-hidden">
      {/* Background elements for premium feel */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-champagne/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 -left-32 w-80 h-80 bg-brand-terracotta/5 rounded-full blur-3xl"></div>

      <header className="p-6 flex items-center justify-between z-10">
        <button 
          onClick={() => navigate('/')} 
          className="p-2 hover:bg-white/10 rounded-full transition-all text-white/70 hover:text-white"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-lg border border-white/10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-champagne">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span className="text-sm font-serif font-bold tracking-tighter uppercase">Bright Abodes</span>
        </div>
        <div className="w-10"></div> {/* Spacer */}
      </header>

      <main className="flex-1 px-8 pt-8 pb-12 z-10 flex flex-col items-center text-center">
        <h1 className="text-5xl font-serif font-bold mb-6 leading-tight flex flex-col">
          <span className="text-brand-champagne">BECOME A</span>
          <span className="text-white">FOUNDING</span>
          <span className="text-brand-champagne">CREATOR</span>
        </h1>

        <p className="text-white/80 text-lg mb-10 max-w-[280px] leading-relaxed">
          Be the first. Set the standard.<br />
          Earn from day one.
        </p>

        {loading ? (
          <div className="w-full py-5 rounded-2xl flex items-center justify-center">
            <Loader2 className="animate-spin text-brand-champagne" />
          </div>
        ) : (
          <button 
            onClick={() => navigate('/creator/onboarding')}
            className="w-full bg-brand-terracotta text-white py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-brand-terracotta/40 active:scale-95 transition-all mb-4"
          >
            {hasApplication ? 'Continue Application' : 'Apply Now'}
          </button>
        )}

        <button className="text-white/60 text-sm font-bold uppercase tracking-widest mb-12 hover:text-white transition-all">
          Learn More
        </button>

        <div className="w-full space-y-4">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-[2rem] text-left flex items-start gap-4">
            <div className="p-3 bg-brand-champagne/20 text-brand-champagne rounded-2xl">
              <Crown size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Exclusive Status</h3>
              <p className="text-white/60 text-sm">Permanent Founding Creator badge on your profile</p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-[2rem] text-left flex items-start gap-4">
            <div className="p-3 bg-brand-terracotta/20 text-brand-terracotta rounded-2xl">
              <DollarSign size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Earn $50-$100 per Lead</h3>
              <p className="text-white/60 text-sm">Recurring commissions on every tour lead</p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-[2rem] text-left flex items-start gap-4">
            <div className="p-3 bg-brand-sage/20 text-brand-sage rounded-2xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Lifetime Profit Sharing</h3>
              <p className="text-white/60 text-sm">Ongoing revenue from your content performance</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center bg-black/20 backdrop-blur-md">
        <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">
          Featured in Nashville, Memphis,<br />
          Knoxville, Chattanooga
        </p>
      </footer>
    </div>
  )
}

export default CreatorLanding
