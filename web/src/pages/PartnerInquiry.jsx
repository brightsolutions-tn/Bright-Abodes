import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Building, 
  ChevronRight, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  Mail, 
  Phone,
  Target,
  Zap,
  ShieldCheck,
  Building2,
  Users
} from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000'

export default function PartnerInquiry() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0) // 0: Landing, 1-3: Form steps, 4: Success
  const [formData, setFormData] = useState({
    companyName: '',
    websiteUrl: '',
    serviceCategory: 'Moving',
    targetCities: [],
    integrationLevel: 'Level 1: Move-In Checklist',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const cities = ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga']
  const categories = ['Moving', 'Insurance', 'Connectivity', 'Furniture', 'Storage', 'Lifestyle']
  const integrationLevels = [
    { 
      id: 'Level 1: Move-In Checklist', 
      label: 'Level 1: Move-In Checklist', 
      desc: 'Listing in resident dashboard' 
    },
    { 
      id: 'Level 2: Building Hub Spotlights', 
      label: 'Level 2: Building Hub Spotlights', 
      desc: 'Featured partner' 
    },
    { 
      id: 'Level 3: Custom Creator Content', 
      label: 'Level 3: Custom Creator Content', 
      desc: 'Influencer campaigns' 
    }
  ]

  const handleCityToggle = (city) => {
    setFormData(prev => ({
      ...prev,
      targetCities: prev.targetCities.includes(city)
        ? prev.targetCities.filter(c => c !== city)
        : [...prev.targetCities, city]
    }))
  }

  const handleNext = () => setStep(prev => prev + 1)
  const handleBack = () => setStep(prev => prev - 1)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/partner-inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        setStep(4)
      } else {
        alert('Failed to submit inquiry. Please try again.')
      }
    } catch (err) {
      console.error(err)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (step === 0) {
    return (
      <div className="min-h-screen bg-brand-navy text-white font-sans overflow-x-hidden">
        {/* Landing View (Based on partner-inquiry-landing-page.png) */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <Building className="text-brand-champagne" size={24} />
            <span className="font-serif font-bold text-lg tracking-widest text-brand-champagne uppercase">Bright Abodes</span>
          </div>

          <div className="text-center max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-brand-champagne mb-4 leading-tight uppercase">
              Partner <br /> With Us
            </h1>
            <p className="text-xl md:text-2xl font-medium mb-12 opacity-90">
              Reach high-intent movers.
            </p>

            <button 
              onClick={handleNext}
              className="bg-brand-terracotta text-white py-5 px-12 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-2xl shadow-brand-terracotta/40 hover:scale-105 transition-all active:scale-95"
            >
              Get Started
            </button>
          </div>

          <div className="mt-32 flex flex-wrap justify-center gap-x-8 gap-y-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['Bellhop', 'Lemonade', 'Xfinity', 'CORT', 'PODS'].map(p => (
              <span key={p} className="text-xs font-bold uppercase tracking-widest">{p}</span>
            ))}
          </div>
        </section>

        {/* Value Prop Cards */}
        <section className="py-24 px-6 bg-white text-brand-navy">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold mb-4">Context is Everything</h2>
              <div className="w-20 h-1 bg-brand-terracotta mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  icon: Zap, 
                  title: 'Trigger Moments', 
                  desc: 'We integrate your services exactly when renters save a building, sign a lease, or plan their move.' 
                },
                { 
                  icon: Target, 
                  title: 'High-Intent Leads', 
                  desc: 'Our users are active relocators in "solution mode," looking for verified truth and services.' 
                },
                { 
                  icon: ShieldCheck, 
                  title: 'The Trust Halo', 
                  desc: 'By joining our network, your brand inherits the "Bright Standard" of radical honesty.' 
                }
              ].map((card, i) => (
                <div key={i} className="bg-brand-warmIvory p-8 rounded-3xl border border-brand-warmGray hover:border-brand-terracotta/30 transition-all">
                  <div className="bg-brand-terracotta/10 w-12 h-12 rounded-xl flex items-center justify-center text-brand-terracotta mb-6">
                    <card.icon size={24} />
                  </div>
                  <h3 className="font-serif font-bold text-xl mb-3">{card.title}</h3>
                  <p className="text-brand-stone text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (step === 4) {
    return (
      <div className="min-h-screen bg-brand-warmIvory flex flex-col items-center justify-center px-6 text-center">
        <div className="bg-brand-sage/20 w-24 h-24 rounded-full flex items-center justify-center text-brand-sage mb-8">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-brand-navy mb-4">Inquiry Received</h1>
        <p className="text-brand-stone max-w-sm mb-12">
          Our team reviews every inquiry for strategic fit and community trust. We'll be in touch within 48 hours.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="bg-brand-navy text-white py-4 px-10 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl"
        >
          Return Home
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-warmIvory text-brand-navy font-sans pb-24">
      {/* Form Steps (Based on partner-inquiry-form.png) */}
      <header className="px-6 pt-12 pb-8 text-center bg-white/40 border-b border-brand-warmGray mb-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Building className="text-brand-navy" size={20} />
          <span className="font-serif font-bold text-sm tracking-widest uppercase">Bright Abodes</span>
        </div>
        <h1 className="text-4xl font-serif font-bold mb-8">Partner Inquiry</h1>
        
        {/* Stepper */}
        <div className="flex items-center justify-center gap-4 mb-2">
          {[1, 2, 3].map(i => (
            <React.Fragment key={i}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === i ? 'bg-brand-terracotta text-white shadow-lg shadow-brand-terracotta/30' : 
                step > i ? 'bg-brand-sage text-white' : 'bg-brand-warmGray/40 text-brand-stone'
              }`}>
                {step > i ? <CheckCircle2 size={16} /> : i}
              </div>
              {i < 3 && <div className={`w-12 h-0.5 rounded-full ${step > i ? 'bg-brand-sage' : 'bg-brand-warmGray/40'}`}></div>}
            </React.Fragment>
          ))}
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-stone">Step {step} of 3</p>
      </header>

      <main className="px-6 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {step === 1 && (
            <section className="space-y-6">
              <div className="flex items-center gap-2 mb-8">
                <div className="bg-brand-terracotta/10 p-2 rounded-lg text-brand-terracotta">
                  <Building2 size={20} />
                </div>
                <h2 className="text-xl font-serif font-bold">Company Info</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-stone mb-2">Company Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.companyName}
                    onChange={e => setFormData({...formData, companyName: e.target.value})}
                    placeholder="e.g. Bellhop Moving"
                    className="w-full bg-white border border-brand-warmGray rounded-2xl p-4 text-sm focus:ring-2 focus:ring-brand-terracotta/20 focus:border-brand-terracotta transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-stone mb-2">Website URL</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-4 text-brand-stone" size={18} />
                    <input 
                      type="url" 
                      required
                      value={formData.websiteUrl}
                      onChange={e => setFormData({...formData, websiteUrl: e.target.value})}
                      placeholder="https://example.com"
                      className="w-full bg-white border border-brand-warmGray rounded-2xl p-4 pl-12 text-sm focus:ring-2 focus:ring-brand-terracotta/20 focus:border-brand-terracotta transition-all"
                    />
                  </div>
                </div>
              </div>
              <button 
                type="button"
                onClick={handleNext}
                disabled={!formData.companyName || !formData.websiteUrl}
                className="w-full bg-brand-terracotta text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-brand-terracotta/20 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
              >
                Next Step <ArrowRight className="inline-block ml-2" size={16} />
              </button>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-6">
              <div className="flex items-center gap-2 mb-8">
                <div className="bg-brand-terracotta/10 p-2 rounded-lg text-brand-terracotta">
                  <Target size={20} />
                </div>
                <h2 className="text-xl font-serif font-bold">Integration Goals</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-stone mb-2">Service Category</label>
                  <select 
                    value={formData.serviceCategory}
                    onChange={e => setFormData({...formData, serviceCategory: e.target.value})}
                    className="w-full bg-white border border-brand-warmGray rounded-2xl p-4 text-sm focus:ring-2 focus:ring-brand-terracotta/20 focus:border-brand-terracotta transition-all appearance-none"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-stone mb-3">Target Cities</label>
                  <div className="flex flex-wrap gap-2">
                    {cities.map(city => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleCityToggle(city)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                          formData.targetCities.includes(city)
                            ? 'bg-brand-terracotta text-white shadow-md'
                            : 'bg-white text-brand-stone border border-brand-warmGray'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-stone mb-4">Desired Integration Level</label>
                  <div className="space-y-3">
                    {integrationLevels.map(level => (
                      <label 
                        key={level.id}
                        className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                          formData.integrationLevel === level.id 
                            ? 'bg-brand-terracotta/5 border-brand-terracotta' 
                            : 'bg-white border-brand-warmGray hover:border-brand-stone'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="integrationLevel"
                          checked={formData.integrationLevel === level.id}
                          onChange={() => setFormData({...formData, integrationLevel: level.id})}
                          className="mt-1 accent-brand-terracotta"
                        />
                        <div>
                          <p className="text-sm font-bold text-brand-navy">{level.label}</p>
                          <p className="text-[11px] text-brand-stone">{level.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-white border border-brand-warmGray text-brand-stone py-4 rounded-2xl font-bold uppercase tracking-widest text-xs"
                >
                  Back
                </button>
                <button 
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-brand-terracotta text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-brand-terracotta/20"
                >
                  Next
                </button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-6">
              <div className="flex items-center gap-2 mb-8">
                <div className="bg-brand-terracotta/10 p-2 rounded-lg text-brand-terracotta">
                  <Users size={20} />
                </div>
                <h2 className="text-xl font-serif font-bold">Contact Details</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-stone mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.contactName}
                    onChange={e => setFormData({...formData, contactName: e.target.value})}
                    placeholder="e.g. Jane Smith"
                    className="w-full bg-white border border-brand-warmGray rounded-2xl p-4 text-sm focus:ring-2 focus:ring-brand-terracotta/20 focus:border-brand-terracotta transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-stone mb-2">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 text-brand-stone" size={18} />
                    <input 
                      type="email" 
                      required
                      value={formData.contactEmail}
                      onChange={e => setFormData({...formData, contactEmail: e.target.value})}
                      placeholder="jane@company.com"
                      className="w-full bg-white border border-brand-warmGray rounded-2xl p-4 pl-12 text-sm focus:ring-2 focus:ring-brand-terracotta/20 focus:border-brand-terracotta transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-stone mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 text-brand-stone" size={18} />
                    <input 
                      type="tel" 
                      required
                      value={formData.contactPhone}
                      onChange={e => setFormData({...formData, contactPhone: e.target.value})}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-white border border-brand-warmGray rounded-2xl p-4 pl-12 text-sm focus:ring-2 focus:ring-brand-terracotta/20 focus:border-brand-terracotta transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-white border border-brand-warmGray text-brand-stone py-4 rounded-2xl font-bold uppercase tracking-widest text-xs"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-brand-navy text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-brand-navy/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </div>
              <p className="text-[10px] text-center text-brand-stone px-4">
                Our team reviews every inquiry for strategic fit and community trust.
              </p>
            </section>
          )}
        </form>
      </main>
    </div>
  )
}
