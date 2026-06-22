import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Wifi, 
  Armchair, 
  ChevronRight,
  ArrowLeft,
  Info,
  ExternalLink,
  Share2,
  ClipboardCheck,
  Square
} from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000'

const MoveInChecklist = ({ isReadOnly = false }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const buildingId = searchParams.get('buildingId') || '9aea42d2-a73b-4129-9c3e-349f8e0fc53b'
  const buildingName = searchParams.get('building') || 'The Gibson'
  const [showToast, setShowToast] = useState(false)

  const [affiliates, setAffiliates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/buildings/${buildingId}/affiliates`)
      .then(res => res.json())
      .then(data => {
        setAffiliates(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch affiliates:', err)
        setLoading(false)
      })
  }, [buildingId])

  const checklistItems = [
    { id: 'moving', label: 'Moving Booked', icon: Truck, status: 'Done' },
    { id: 'insurance', label: 'Insurance Sorted', icon: ShieldCheck, status: 'Done' },
    { id: 'internet', label: 'Internet Set Up', icon: Wifi, status: 'Done' },
    { id: 'furniture', label: 'Furniture Rental', icon: Armchair, status: 'Still Needed' },
    { id: 'storage', label: 'Storage', icon: Info, status: 'Still Needed' },
  ]

  const categories = [
    { id: 'moving', label: 'Moving', icon: Truck },
    { id: 'insurance', label: 'Insurance', icon: ShieldCheck },
    { id: 'internet', label: 'Internet', icon: Wifi },
    { id: 'furniture', label: 'Furniture', icon: Armchair },
  ]

  const getPartnersForCategory = (catId) => {
    return affiliates.filter(a => a.category === catId || a.serviceType === catId)
  }

  const doneItems = checklistItems.filter(c => c.status === 'Done')
  const todoItems = checklistItems.filter(c => c.status === 'Still Needed')
  const completedCount = doneItems.length
  const totalCount = checklistItems.length
  const progressPercent = (completedCount / totalCount) * 100

  const handleShare = async () => {
    const obfuscatedId = btoa(buildingId).slice(0, 8)
    const shareUrl = `${window.location.origin}/checklist/share/${obfuscatedId}?buildingId=${buildingId}&building=${encodeURIComponent(buildingName)}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${buildingName} Move-In Checklist`,
          url: shareUrl
        })
      } catch (err) {
        console.log('Share failed:', err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      } catch (err) {
        console.error('Copy failed:', err)
      }
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-brand-warmIvory flex items-center justify-center p-12">
      <div className="w-8 h-8 border-4 border-brand-terracotta border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-brand-warmIvory pb-24 relative font-sans">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] bg-brand-navy/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl border border-white/20 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <p className="text-sm font-bold flex items-center gap-2">
            <ClipboardCheck size={16} className="text-brand-champagne" /> Link copied to clipboard
          </p>
        </div>
      )}

      <header className="p-6 pt-12 max-w-md mx-auto text-center">
        <div className="flex justify-between items-center mb-10">
          {!isReadOnly ? (
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 bg-white rounded-full border border-brand-warmGray text-brand-stone hover:text-brand-navy transition-all"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div className="w-10" />
          )}
          
          <h2 className="text-xl font-serif font-bold text-brand-navy tracking-tight uppercase">Bright Abodes</h2>
          <div className="w-10" />
        </div>

        <h1 className="text-5xl font-serif font-bold text-brand-navy mb-8 leading-tight">Move-In Checklist</h1>
        
        {!isReadOnly && (
          <button 
            onClick={handleShare}
            className="w-full mb-12 bg-brand-terracotta text-white py-5 rounded-3xl font-bold uppercase tracking-widest shadow-xl shadow-brand-terracotta/30 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Share2 size={20} /> Send to Roommate
          </button>
        )}

        <div className="space-y-6 text-left max-w-sm mx-auto mb-12">
          {/* Done Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-[2.5rem] p-8 border border-brand-warmGray/50 shadow-sm">
            <h3 className="text-lg font-serif font-bold text-brand-navy mb-6">Done</h3>
            <div className="space-y-4">
              {doneItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 group">
                  <div className="bg-brand-sage text-white p-1 rounded-full shadow-sm">
                    <CheckCircle2 size={18} strokeWidth={3} />
                  </div>
                  <span className="text-brand-navy font-bold text-lg">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* To Do Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-[2.5rem] p-8 border border-brand-warmGray/50 shadow-sm">
            <h3 className="text-lg font-serif font-bold text-brand-navy mb-6">To Do</h3>
            <div className="space-y-4 mb-8">
              {todoItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 group">
                  <div className="bg-brand-terracotta text-white p-1 rounded-lg shadow-sm">
                    <Square size={18} strokeWidth={3} fill="currentColor" />
                  </div>
                  <span className="text-brand-navy font-bold text-lg">{item.label}</span>
                </div>
              ))}
            </div>
            
            {/* Progress Bar */}
            <div className="pt-4 border-t border-brand-warmGray/30">
              <div className="flex justify-between items-center mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-stone">
                <div className="h-2 bg-brand-warmGray/30 flex-1 rounded-full overflow-hidden mr-4">
                  <div 
                    className="h-full bg-brand-sage transition-all duration-1000 ease-out" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <span>{completedCount}/{totalCount}</span>
              </div>
            </div>
          </div>
        </div>

        {!isReadOnly && (
          <>
            <div className="space-y-8 text-left mb-12">
              {categories.map((cat) => {
                const partners = getPartnersForCategory(cat.id)
                return (
                  <div key={cat.id} className="space-y-4">
                    <div className="flex items-center gap-2 mb-2 px-2">
                      <cat.icon size={18} className="text-brand-navy" />
                      <h2 className="font-bold text-brand-navy uppercase tracking-widest text-xs">{cat.label}</h2>
                    </div>
                    
                    {partners.length > 0 ? (
                      <div className="space-y-4">
                        {partners.map(partner => (
                          <div key={partner.id} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-brand-warmGray relative group hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-serif font-bold text-2xl text-brand-navy leading-tight">{partner.name}</h3>
                              <ExternalLink size={16} className="text-brand-stone opacity-50" />
                            </div>
                            <p className="text-sm text-brand-stone leading-relaxed mb-6">{partner.description}</p>
                            
                            <a 
                              href={partner.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all active:scale-95 flex items-center justify-center gap-2 bg-brand-terracotta text-white shadow-lg shadow-brand-terracotta/20 hover:bg-brand-terracotta/90"
                            >
                              Explore Offer
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white/50 border border-brand-warmGray border-dashed rounded-[1.5rem] p-8 text-center">
                        <p className="text-xs text-brand-stone italic">No specific {cat.label.toLowerCase()} partners for this building yet.</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-12 bg-brand-navy rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl text-left">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-terracotta/20 blur-3xl rounded-full"></div>
              <h3 className="font-serif font-bold text-2xl mb-4 relative z-10 leading-tight">Need help with your move?</h3>
              <p className="text-brand-warmGray text-sm mb-6 relative z-10 leading-relaxed font-medium">
                Our local Tennessee concierge team is standing by to assist with logistics, utility setup, and neighborhood onboarding.
              </p>
              <button className="bg-brand-champagne text-brand-navy py-4 px-8 rounded-2xl font-bold text-xs uppercase tracking-widest relative z-10 hover:scale-105 transition-all">
                Chat with Concierge
              </button>
            </div>
          </>
        )}

        {isReadOnly && (
          <div className="mt-12 space-y-6">
            <p className="text-brand-stone text-xs italic">Viewed via shared link</p>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-brand-navy text-white py-5 rounded-3xl font-bold uppercase tracking-widest shadow-xl shadow-brand-navy/20 hover:scale-105 transition-all"
            >
              Join Bright Abodes
            </button>
          </div>
        )}
      </header>
    </div>
  )
}

export default MoveInChecklist
