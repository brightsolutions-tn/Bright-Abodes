import React, { useState, useEffect } from 'react'
import { 
  Building, 
  Video, 
  Users, 
  Star, 
  ChevronRight,
  TrendingUp,
  Map as MapIcon,
  MessageSquare
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export default function PMDashboard() {
  const [stats, setStats] = useState(null)
  const [buildings, setBuildings] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/pm/stats`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/pm/buildings`).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/pm/reviews`).then(res => res.json()),
    ]).then(([statsData, buildingsData, reviewsData]) => {
      setStats(statsData)
      setBuildings(Array.isArray(buildingsData) ? buildingsData : [])
      setReviews(Array.isArray(reviewsData) ? reviewsData : [])
      setLoading(false)
    }).catch(err => {
      console.error('Failed to fetch PM data:', err)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="p-12 text-center font-serif italic">Loading Dashboard...</div>

  return (
    <div className="min-h-screen bg-[#F9F6F2] p-8 pb-24">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-brand-navy">Good morning, Sarah</h1>
          <p className="text-brand-stone mt-1">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-bold text-brand-navy">Sarah Miller</p>
            <p className="text-xs text-brand-stone font-bold uppercase tracking-widest">PM Admin</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-brand-warmGray border border-brand-warmGray overflow-hidden">
             <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Sarah Miller" />
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Buildings" value={stats?.totalBuildings || 0} color="bg-[#B35C44]" />
        <StatCard title="Active Tours" value={stats?.activeTours || 0} color="bg-[#D4A351]" />
        <StatCard title="Avg Sentiment" value={stats?.avgSentiment || '0.0'} color="bg-[#8A9A7A]" />
        <StatCard title="Leads This Month" value={stats?.leadsThisMonth || 0} color="bg-[#C99852]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Sentiment Overview Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-brand-warmGray">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-serif font-bold text-xl">Sentiment Overview</h3>
            <button className="text-xs font-bold uppercase tracking-widest text-brand-stone">View Details</button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={buildings.map(b => ({ name: b.name, sentiment: parseFloat(b.avgSentiment) }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E1DD" />
                <XAxis type="number" domain={[0, 5]} hide />
                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} style={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="sentiment" fill="#B35C44" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Featured Tours Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-brand-warmGray">
          <h3 className="font-serif font-bold text-xl mb-6">Featured Tours</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="aspect-square bg-brand-warmGray rounded-2xl overflow-hidden">
               <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover" alt="Tour 1" />
            </div>
            <div className="aspect-square bg-brand-warmGray rounded-2xl overflow-hidden">
               <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover" alt="Tour 2" />
            </div>
          </div>
          <button className="w-full bg-[#C1A88B] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs">Manage</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reviews Mini Feed */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-brand-warmGray">
          <h3 className="font-serif font-bold text-xl mb-8">Recent Reviews</h3>
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-brand-stone italic text-sm">No recent reviews.</p>
            ) : reviews.slice(0, 5).map(review => (
              <div key={review.id} className="flex flex-col md:flex-row items-start justify-between border-b border-brand-warmGray pb-6 last:border-0 last:pb-0 gap-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-warmGray flex-shrink-0 overflow-hidden">
                    {review.user?.avatarUrl && <img src={review.user.avatarUrl} alt={review.user.username} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-navy">{review.building?.name}</h4>
                    <div className="flex items-center gap-1 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={i < (review.rating || 0) ? "text-brand-warmGold fill-brand-warmGold" : "text-brand-warmGray fill-brand-warmGray"} />
                      ))}
                    </div>
                    <p className="text-sm text-brand-stone line-clamp-2">{review.comment}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-brand-stone uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Detail Card (Summary) */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-brand-warmGray">
          <h3 className="font-serif font-bold text-xl mb-6">Top Performing</h3>
          <div className="space-y-6">
            {buildings.length === 0 ? (
              <p className="text-brand-stone italic text-sm">No data available.</p>
            ) : buildings.slice(0, 3).map((b, i) => (
              <div key={b.id} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#C1A88B]/20 text-[#C1A88B] flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-brand-navy text-sm">{b.name}</h4>
                  <div className="w-full bg-brand-warmGray/30 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#B35C44] h-full rounded-full" style={{ width: `${(parseFloat(b.avgSentiment) / 5) * 100}%` }}></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-brand-navy">{b.avgSentiment}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 border-2 border-[#C1A88B] text-[#C1A88B] py-3 rounded-xl font-bold uppercase tracking-widest text-xs">Full Analytics</button>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, color }) {
  return (
    <div className={`${color} rounded-2xl p-8 text-white shadow-lg`}>
      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">{title}</p>
      <p className="text-5xl font-serif font-bold">{value}</p>
    </div>
  )
}
