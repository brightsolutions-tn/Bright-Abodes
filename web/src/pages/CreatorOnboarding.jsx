import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { CheckCircle2, ChevronLeft, Building, User, ClipboardCheck, Loader2 } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000'

const CreatorOnboarding = () => {
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setLoading2] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [application, setApplication] = useState(null)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    city: 'Nashville',
    socialHandle: '',
    videoLink: ''
  })

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = await getToken()
        const res = await fetch(`${API_BASE_URL}/api/creator/application-status`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await res.json()
        if (data.hasApplication) {
          setApplication(data.application)
          if (data.application.agreementSigned) {
            setStep(3)
          } else {
            setStep(2)
          }
        } else {
          setStep(1)
        }
      } catch (err) {
        console.error('Failed to fetch status:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
  }, [getToken])

  const handleApply = async (e) => {
    e.preventDefault()
    setLoading2(true)
    try {
      const token = await getToken()
      const res = await fetch(`${API_BASE_URL}/api/creator/apply`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success) {
        setStep(2)
      }
    } catch (err) {
      console.error('Apply failed:', err)
    } finally {
      setLoading2(false)
    }
  }

  const handleSign = async () => {
    setLoading2(true)
    try {
      const token = await getToken()
      const res = await fetch(`${API_BASE_URL}/api/creator/sign-agreement`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (data.success) {
        setStep(3)
      }
    } catch (err) {
      console.error('Sign failed:', err)
    } finally {
      setLoading2(false)
    }
  }

  const nextStep = () => {
    if (step < 4) setStep(step + 1)
    else navigate('/creator/dashboard')
  }

  if (loading) return (
    <div className="min-h-screen bg-brand-warmIvory flex items-center justify-center">
      <Loader2 className="animate-spin text-brand-terracotta" size={48} />
    </div>
  )

  return (
    <div className="min-h-screen bg-brand-warmIvory p-6 pt-12 max-w-md mx-auto flex flex-col font-sans">
      <header className="mb-8 text-center relative">
        <button 
          onClick={() => navigate('/creator')}
          className="absolute left-0 top-1 p-2 text-brand-stone hover:text-brand-navy transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-serif font-bold text-brand-navy tracking-tight uppercase">Bright Abodes</h1>
        <p className="text-[10px] font-bold text-brand-stone mt-4 uppercase tracking-[0.3em]">Step {step} of 4</p>
      </header>

      {/* Progress Bar */}
      <div className="flex items-center justify-center gap-0 mb-10 px-4">
        <div className="relative w-full h-1 bg-brand-warmGray rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-brand-sage transition-all duration-700" 
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
        <div className="relative">
          <div className={`w-3 h-3 ${step >= 4 ? 'bg-brand-sage' : 'bg-brand-terracotta'} rounded-full -ml-1 border-2 border-brand-warmIvory shadow-sm transition-colors duration-500`}></div>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {/* Step 1: Basic Info / Application */}
        {step === 1 && (
          <div className="bg-white border-2 border-brand-terracotta/10 p-8 rounded-3xl shadow-xl shadow-brand-navy/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-serif font-bold text-brand-navy mb-4">Apply to Join</h2>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-brand-navy mb-1 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-brand-warmIvory/30 border border-brand-warmGray rounded-xl p-4 focus:outline-none focus:border-brand-terracotta transition-all"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-brand-navy mb-1 uppercase tracking-widest ml-1">Email</label>
                <input 
                  required
                  type="email" 
                  className="w-full bg-brand-warmIvory/30 border border-brand-warmGray rounded-xl p-4 focus:outline-none focus:border-brand-terracotta transition-all"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-brand-navy mb-1 uppercase tracking-widest ml-1">Social Handle</label>
                <input 
                  required
                  placeholder="@handle"
                  type="text" 
                  className="w-full bg-brand-warmIvory/30 border border-brand-warmGray rounded-xl p-4 focus:outline-none focus:border-brand-terracotta transition-all"
                  value={formData.socialHandle}
                  onChange={e => setFormData({...formData, socialHandle: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-terracotta text-white py-5 rounded-2xl font-bold shadow-lg shadow-brand-terracotta/20 active:scale-95 transition-all mt-4 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="animate-spin" size={20} />}
                Start Application
              </button>
            </form>
          </div>
        )}

        {/* Step 2+: Vision Sync (Completed) */}
        {step >= 2 && (
          <div className="bg-white/60 border border-brand-warmGray/50 p-6 rounded-2xl flex items-center gap-4 opacity-80 animate-in fade-in duration-500">
            <div className="p-2 bg-brand-sage/20 text-brand-sage rounded-full">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h3 className="font-bold text-brand-navy">Vision Sync</h3>
              <p className="text-xs text-brand-stone">Call completed</p>
            </div>
          </div>
        )}

        {/* Step 2: Creator Agreement (Current) */}
        {step === 2 && (
          <div className="bg-white border-2 border-brand-sage/20 p-8 rounded-3xl shadow-xl shadow-brand-navy/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-serif font-bold text-brand-navy mb-4">Creator Agreement</h2>
            <p className="text-brand-stone text-sm leading-relaxed mb-8">
              You will receive a permanent Founding Creator badge and $50–$100/lead for qualified referrals. 
              Additionally, you will share in profits generated from the properties you help bring to the platform.
            </p>

            <label className="flex items-center gap-3 mb-8 cursor-pointer group">
              <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${agreed ? 'bg-brand-sage border-brand-sage text-white' : 'border-brand-warmGray group-hover:border-brand-stone'}`}>
                {agreed && <CheckCircle2 size={16} />}
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={agreed} 
                  onChange={() => setAgreed(!agreed)}
                />
              </div>
              <span className="text-sm font-medium text-brand-navy">I agree to the Founding Creator terms</span>
            </label>

            <button 
              onClick={handleSign}
              disabled={!agreed || submitting}
              className={`w-full py-5 rounded-2xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${agreed ? 'bg-brand-sage shadow-brand-sage/20 active:scale-95' : 'bg-brand-warmGray cursor-not-allowed opacity-50'}`}
            >
              {submitting && <Loader2 className="animate-spin" size={20} />}
              Sign & Continue
            </button>
          </div>
        )}

        {/* Step 3 & 4 Placeholders when on Step 2 */}
        {step === 2 && (
          <>
            <div className="bg-white/40 border border-brand-warmGray/30 p-6 rounded-2xl flex items-center gap-4 text-brand-stone/60">
              <div className="p-2 bg-brand-warmGray/20 rounded-xl">
                <Building size={20} />
              </div>
              <h3 className="font-bold">Resident Verification</h3>
            </div>
            <div className="bg-white/40 border border-brand-warmGray/30 p-6 rounded-2xl flex items-center gap-4 text-brand-stone/60">
              <div className="p-2 bg-brand-warmGray/20 rounded-xl">
                <User size={20} />
              </div>
              <h3 className="font-bold">Profile Setup</h3>
            </div>
          </>
        )}

        {/* Step 3: Resident Verification */}
        {step === 3 && (
          <div className="bg-white border-2 border-brand-sage/20 p-8 rounded-3xl shadow-xl shadow-brand-navy/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="text-2xl font-serif font-bold text-brand-navy mb-4">Resident Verification</h2>
             <p className="text-brand-stone text-sm leading-relaxed mb-8">
               To maintain the "Anti-Zillow" standard of radical honesty, we verify that our creators are actual residents. 
               Please upload a recent utility bill or lease agreement snippet.
             </p>
             <div className="border-2 border-dashed border-brand-warmGray rounded-2xl p-12 text-center mb-8 bg-brand-warmIvory/20 hover:bg-brand-warmIvory/40 transition-colors cursor-pointer group">
                <Building className="mx-auto text-brand-stone group-hover:text-brand-terracotta transition-colors mb-2" size={32} />
                <p className="text-xs text-brand-stone font-bold uppercase tracking-widest group-hover:text-brand-navy transition-colors">Upload Document</p>
             </div>
             <button 
              onClick={nextStep}
              className="w-full bg-brand-sage text-white py-5 rounded-2xl font-bold shadow-lg shadow-brand-sage/20 active:scale-95 transition-all"
            >
              Verify Identity
            </button>
          </div>
        )}

        {/* Step 4: Profile Setup */}
        {step === 4 && (
          <div className="bg-white border-2 border-brand-sage/20 p-8 rounded-3xl shadow-xl shadow-brand-navy/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="text-2xl font-serif font-bold text-brand-navy mb-4">Profile Setup</h2>
             <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-[10px] font-bold text-brand-navy mb-2 uppercase tracking-widest ml-1">Display Name</label>
                  <input type="text" placeholder="Alex Jordan" className="w-full bg-brand-warmIvory/50 border border-brand-warmGray rounded-xl p-4 focus:outline-none focus:border-brand-sage transition-all shadow-inner" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-brand-navy mb-2 uppercase tracking-widest ml-1">Bio</label>
                  <textarea placeholder="Tell your city's story..." className="w-full bg-brand-warmIvory/50 border border-brand-warmGray rounded-xl p-4 focus:outline-none focus:border-brand-sage h-24 transition-all shadow-inner resize-none" />
                </div>
             </div>
             <button 
              onClick={nextStep}
              className="w-full bg-brand-terracotta text-white py-5 rounded-2xl font-bold shadow-lg shadow-brand-terracotta/20 active:scale-95 transition-all"
            >
              Finish Setup
            </button>
          </div>
        )}
      </div>

      <footer className="mt-8 text-center px-8 pb-4">
        <p className="text-[10px] text-brand-stone font-medium leading-relaxed uppercase tracking-wider opacity-60">
          Permanent Founding Creator badge • $50–$100/lead commissions • lifetime profit sharing
        </p>
      </footer>
    </div>
  )
}

export default CreatorOnboarding
