import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'
import { 
  Trophy, 
  Eye, 
  Heart, 
  MessageSquare, 
  ChevronRight, 
  CheckCircle2, 
  Wallet,
  Calendar,
  Building,
  ArrowRight
} from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export default function CreatorDashboard() {
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const { user: clerkUser } = useUser()
  const [dbUser, setDbUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [collabs, setCollabs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken()
        const headers = { Authorization: `Bearer ${token}` }
        const [statsRes, collabsRes, meRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/creator/stats`, { headers }),
          fetch(`${API_BASE_URL}/api/creator/collaborations`, { headers }),
          fetch(`${API_BASE_URL}/api/me`, { headers })
        ])
        const statsData = await statsRes.json()
        const collabsData = await collabsRes.json()
        const meData = await meRes.json()
        setStats(statsData)
        setCollabs(Array.isArray(collabsData) ? collabsData : [])
        setDbUser(meData)
      } catch (err) {
        console.error('Failed to fetch creator data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [getToken])

  if (loading) return (
    <div className="min-h-screen bg-brand-warmIvory flex items-center justify-center p-8">
      <div className="w-8 h-8 border-4 border-brand-terracotta border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  const earnings = stats?.earnings || { total: 0, pending: 0, available: 0 }
  const username = dbUser?.username || clerkUser?.username || 'creator'

  return (
    <div className="min-h-screen bg-brand-warmIvory pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-8 bg-white border-b border-brand-warmGray rounded-b-[3rem] shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-brand-warmGray overflow-hidden border-2 border-brand-terracotta/20">
            {clerkUser?.imageUrl ? (
              <img src={clerkUser.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brand-stone bg-brand-warmIvory">
                <Building size={32} />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-brand-navy flex items-center gap-2">
              @{username}
              <div className="bg-brand-champagne/20 text-brand-champagne p-1 rounded-full border border-brand-champagne/30">
                <Trophy size={14} className="fill-current" />
              </div>
            </h1>
            <p className="text-xs text-brand-stone font-bold uppercase tracking-widest flex items-center gap-1">
              <CheckCircle2 size={12} className="text-brand-sage" /> Verified Creator
            </p>
          </div>
        </div>

        {/* Earnings Card */}
        <div className="bg-brand-navy rounded-3xl p-6 text-white shadow-xl shadow-brand-navy/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet size={80} />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-warmGray mb-1">Total Earnings</p>
            <h2 className="text-4xl font-serif font-bold text-brand-terracotta mb-4">${earnings.total}</h2>
            <div className="flex gap-4 border-t border-white/10 pt-4">
              <div>
                <p className="text-[10px] text-brand-warmGray uppercase font-bold">Available</p>
                <p className="text-lg font-serif font-bold text-brand-sage">${earnings.available}</p>
              </div>
              <div className="border-l border-white/10 pl-4">
                <p className="text-[10px] text-brand-warmGray uppercase font-bold">Pending</p>
                <p className="text-lg font-serif font-bold text-brand-champagne">${earnings.pending}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* Performance Section */}
        <section>
          <h3 className="text-lg font-serif font-bold text-brand-navy mb-4">My Performance</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-brand-warmGray text-center shadow-sm">
              <div className="text-brand-navy mb-2 flex justify-center"><Eye size={20} /></div>
              <p className="text-sm font-bold">{(stats?.views / 1000).toFixed(1)}K</p>
              <p className="text-[8px] uppercase tracking-widest text-brand-stone font-bold">Views</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-brand-warmGray text-center shadow-sm">
              <div className="text-brand-terracotta mb-2 flex justify-center"><Heart size={20} /></div>
              <p className="text-sm font-bold">{(stats?.likes / 1000).toFixed(1)}K</p>
              <p className="text-[8px] uppercase tracking-widest text-brand-stone font-bold">Likes</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-brand-warmGray text-center shadow-sm">
              <div className="text-brand-champagne mb-2 flex justify-center"><MessageSquare size={20} /></div>
              <p className="text-sm font-bold">{stats?.leads}</p>
              <p className="text-[8px] uppercase tracking-widest text-brand-stone font-bold">Leads</p>
            </div>
          </div>
        </section>

        {/* Campaign Requests Section */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-serif font-bold text-brand-navy">Campaign Requests</h3>
            <Link to="/creator/campaigns" className="text-[10px] font-bold uppercase tracking-widest text-brand-terracotta flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-4">
            {collabs.slice(0, 2).map(collab => (
              <div key={collab.id} className="bg-white p-4 rounded-2xl border border-brand-warmGray shadow-sm flex items-center justify-between group hover:border-brand-terracotta/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="bg-brand-warmIvory p-3 rounded-xl text-brand-stone">
                    <Building size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-navy text-sm">{collab.building.name}</h4>
                    <p className="text-[10px] text-brand-stone uppercase font-bold tracking-tighter">{collab.dealTerms || '$150 Offer'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/creator/campaigns')}
                  className="bg-brand-terracotta/10 text-brand-terracotta px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest group-hover:bg-brand-terracotta group-hover:text-white transition-all"
                >
                  View
                </button>
              </div>
            ))}
            {collabs.length === 0 && (
              <div className="bg-white p-8 rounded-2xl border border-brand-warmGray border-dashed text-center">
                <p className="text-xs text-brand-stone italic">No active requests. Keep building your influence!</p>
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-brand-terracotta rounded-3xl p-6 text-white text-center shadow-lg shadow-brand-terracotta/20">
          <h4 className="font-serif font-bold text-lg mb-1">Founding Creator Perks</h4>
          <p className="text-xs opacity-90 mb-4">You have 3 building tour invites available this week.</p>
          <button className="w-full bg-white text-brand-terracotta py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg">
            Request a New Tour
          </button>
        </section>
      </main>
    </div>
  )
}
