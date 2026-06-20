import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ChevronLeft, 
  Building, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  XCircle,
  TrendingUp
} from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export default function CampaignHub() {
  const navigate = useNavigate()
  const [collabs, setCollabs] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/creator/collaborations`)
      .then(res => res.json())
      .then(data => {
        setCollabs(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch campaigns:', err)
        setLoading(false)
      })
  }, [])

  const handleAction = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/creator/collaborations/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        setCollabs(collabs.map(c => c.id === id ? { ...c, status } : c))
      }
    } catch (err) {
      console.error('Action failed:', err)
    }
  }

  const filteredCollabs = filter === 'all' 
    ? collabs 
    : collabs.filter(c => c.status === filter)

  const stats = {
    total: collabs.reduce((acc, c) => acc + (c.status === 'completed' ? 150 : 0), 0) + 475 // Baseline from mockup
  }

  if (loading) return (
    <div className="min-h-screen bg-brand-warmIvory flex items-center justify-center p-8">
      <div className="w-8 h-8 border-4 border-brand-terracotta border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-brand-warmIvory pb-24">
      <header className="p-6 pt-12 flex items-center gap-4">
        <button onClick={() => navigate('/creator/dashboard')} className="p-2 bg-white rounded-full border border-brand-warmGray text-brand-stone shadow-sm">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-3xl font-serif font-bold text-brand-navy">Campaign Hub</h1>
      </header>

      <main className="p-6 pt-0 space-y-8">
        {/* Stats Card */}
        <div className="bg-brand-navy rounded-3xl p-6 text-white shadow-xl shadow-brand-navy/20 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-warmGray mb-1">Campaign Earnings</p>
            <h2 className="text-3xl font-serif font-bold text-brand-champagne">${stats.total}</h2>
          </div>
          <div className="bg-brand-terracotta/20 p-3 rounded-2xl border border-brand-terracotta/30">
            <TrendingUp size={24} className="text-brand-terracotta" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['all', 'pending', 'active', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                filter === f 
                  ? 'bg-brand-terracotta text-white shadow-lg shadow-brand-terracotta/20' 
                  : 'bg-white text-brand-stone border border-brand-warmGray hover:border-brand-terracotta/30'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Campaign List */}
        <div className="space-y-6">
          {filteredCollabs.map(collab => (
            <div key={collab.id} className="bg-white rounded-[2rem] border border-brand-warmGray shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand-warmIvory p-3 rounded-2xl text-brand-stone">
                      <Building size={24} />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-lg text-brand-navy">{collab.building.name}</h4>
                      <p className="text-xs text-brand-stone flex items-center gap-1">
                        <MapPin size={12} /> {collab.building.city}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                    collab.status === 'active' ? 'bg-brand-sage/10 text-brand-sage border border-brand-sage/20' :
                    collab.status === 'completed' ? 'bg-brand-warmGray text-brand-stone' :
                    'bg-brand-champagne/20 text-brand-champagne border border-brand-champagne/30'
                  }`}>
                    {collab.status}
                  </span>
                </div>

                <div className="bg-brand-warmIvory/50 rounded-2xl p-4 mb-6">
                   <p className="text-[10px] text-brand-stone uppercase font-bold tracking-widest mb-1">Offer Terms</p>
                   <p className="text-sm font-medium text-brand-navy">{collab.dealTerms || '$150 for 1 Cinematic Tour'}</p>
                </div>

                {collab.status === 'pending' && (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleAction(collab.id, 'active')}
                      className="flex-1 bg-brand-terracotta text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-brand-terracotta/20 active:scale-95 transition-all"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleAction(collab.id, 'declined')}
                      className="px-6 border-2 border-brand-warmGray text-brand-stone py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-warmGray/10 transition-all"
                    >
                      Decline
                    </button>
                  </div>
                )}

                {collab.status === 'active' && (
                  <button className="w-full border-2 border-brand-sage text-brand-sage py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} /> Campaign in Progress
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredCollabs.length === 0 && (
            <div className="p-12 text-center bg-white rounded-[2rem] border border-brand-warmGray border-dashed">
              <Clock size={48} className="text-brand-warmGray mx-auto mb-4 opacity-50" />
              <p className="text-brand-stone italic">No {filter} campaigns found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
