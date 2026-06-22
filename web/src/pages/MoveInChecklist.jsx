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
  ExternalLink
} from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000'

const MoveInChecklist = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const buildingId = searchParams.get('buildingId') || '9aea42d2-a73b-4129-9c3e-349f8e0fc53b' // Default to first seeded building
  const buildingName = searchParams.get('building') || 'The Gibson'

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

  const categories = [
    { id: 'moving', label: 'Moving', icon: Truck },
    { id: 'insurance', label: 'Insurance', icon: ShieldCheck },
    { id: 'internet', label: 'Internet', icon: Wifi },
    { id: 'furniture', label: 'Furniture', icon: Armchair },
  ]

  const getPartnersForCategory = (catId) => {
    return affiliates.filter(a => a.category === catId || a.serviceType === catId)
  }

  const completedCount = 4 // Mock completed state for now
  const totalCount = categories.length
  const progressPercent = (completedCount / totalCount) * 100

  if (loading) return (
    <div className="min-h-screen bg-brand-warmIvory flex items-center justify-center p-12">
      <div className="w-8 h-8 border-4 border-brand-terracotta border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-brand-warmIvory pb-24">
      <header className="p-6 pt-12 max-w-md mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 p-2 bg-white rounded-full border border-brand-warmGray text-brand-stone hover:text-brand-navy transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-brand-navy mb-4 leading-tight">Move-In Essentials</h1>
          <p className="text-brand-stone text-sm mb-6">Your {buildingName} checklist</p>
          <div className="w-full max-w-xs mx-auto">
            <p className="text-[10px] font-bold text-brand-navy uppercase tracking-widest mb-2">{completedCount} of {totalCount} categories explored</p>
            <div className="h-1 bg-brand-warmGray/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-sage transition-all duration-1000 ease-out" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
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

        <div className="mt-12 bg-brand-navy rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-terracotta/20 blur-3xl rounded-full"></div>
          <h3 className="font-serif font-bold text-2xl mb-4 relative z-10 leading-tight">Need help with your move?</h3>
          <p className="text-brand-warmGray text-sm mb-6 relative z-10 leading-relaxed font-medium">
            Our local Tennessee concierge team is standing by to assist with logistics, utility setup, and neighborhood onboarding.
          </p>
          <button className="bg-brand-champagne text-brand-navy py-4 px-8 rounded-2xl font-bold text-xs uppercase tracking-widest relative z-10 hover:scale-105 transition-all">
            Chat with Concierge
          </button>
        </div>
      </header>
    </div>
  )
}

export default MoveInChecklist
