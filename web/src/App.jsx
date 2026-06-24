import React, { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth, useUser, SignInButton, UserButton, SignedIn, SignedOut } from '@clerk/clerk-react'
import MuxPlayer from '@mux/mux-player-react'
import PMDashboard from './pages/PMDashboard'
import CreatorDashboard from './pages/CreatorDashboard'
import CampaignHub from './pages/CampaignHub'
import MoveInChecklist from './pages/MoveInChecklist'
import CreatorLanding from './pages/CreatorLanding'
import CreatorOnboarding from './pages/CreatorOnboarding'
import TrustBadge from './components/TrustBadge'
import { 
  Search, 
  MapPin, 
  Compass, 
  LayoutGrid, 
  Bookmark, 
  MessageCircle, 
  User as UserIcon,
  Star,
  ChevronRight,
  Heart,
  Share2,
  Building,
  CheckCircle2,
  X,
  Wallet,
  ArrowRight,
  Wifi,
  Truck,
  ClipboardCheck,
  Crown,
  Plus
  } from 'lucide-react'

// --- Components ---

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000'


function WalletDashboard() {
  const navigate = useNavigate()

  const payoutHistory = [
    { date: 'Apr 18', amount: 120, status: 'Completed' },
    { date: 'Mar 30', amount: 150, status: 'Processing' },
    { date: 'Feb 21', amount: 250, status: 'Completed' },
  ]

  return (
    <div className="min-h-screen bg-brand-warmIvory p-6 pb-24 max-w-md mx-auto">
      <header className="mb-12 pt-4 flex items-center justify-between">
        <h1 className="text-4xl font-serif font-bold text-brand-navy">Wallet</h1>
        <button onClick={() => navigate('/profile')} className="p-2 bg-white rounded-full border border-brand-warmGray text-brand-stone hover:text-brand-navy">
          <X size={20} />
        </button>
      </header>

      <div className="bg-white rounded-[2.5rem] p-10 text-center shadow-xl shadow-brand-navy/5 border border-brand-warmGray mb-8 relative overflow-hidden">
        <p className="text-brand-stone text-sm mb-2 font-medium">Total Earned</p>
        <h2 className="text-6xl font-serif font-bold text-brand-champagne mb-2">$1,247</h2>
        <p className="text-brand-stone text-xs uppercase tracking-widest font-bold opacity-60">Lifetime Earnings</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-brand-terracotta/10 border border-brand-terracotta/20 rounded-3xl p-6 text-center">
          <p className="text-brand-terracotta text-[10px] font-bold uppercase tracking-wider mb-2">Pending Clearances</p>
          <p className="text-3xl font-serif font-bold text-brand-terracotta">$380</p>
        </div>
        <div className="bg-brand-sage/10 border border-brand-sage/20 rounded-3xl p-6 text-center">
          <p className="text-brand-sage text-[10px] font-bold uppercase tracking-wider mb-2">Available Now</p>
          <p className="text-3xl font-serif font-bold text-brand-sage">$867</p>
        </div>
      </div>

      <section className="mb-10">
        <h3 className="font-serif font-bold text-xl mb-6">Payout History</h3>
        <div className="space-y-4">
          {payoutHistory.map((payout, i) => (
            <div key={i} className="flex items-center justify-between p-2">
              <p className="font-bold text-brand-navy">{payout.date}</p>
              <p className="font-serif font-bold text-lg">${payout.amount}</p>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                payout.status === 'Completed' ? 'bg-brand-sage/20 text-brand-sage' : 'bg-brand-warmGold/20 text-brand-warmGold'
              }`}>
                {payout.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h3 className="font-serif font-bold text-xl mb-6">Perks & Rewards</h3>
        <div className="bg-white/60 border border-brand-warmGray rounded-[2rem] p-8">
          <div className="flex justify-between items-center mb-4 text-[10px] font-bold uppercase tracking-widest">
            <span>Rising Star</span>
            <span className="text-brand-stone">Pro Creator</span>
          </div>
          <div className="h-2 bg-brand-warmGray/30 rounded-full overflow-hidden mb-8">
            <div className="h-full bg-brand-terracotta w-3/4 rounded-full"></div>
          </div>
          <div className="bg-brand-warmIvory p-6 rounded-2xl border border-brand-warmGray">
            <h4 className="font-serif font-bold text-lg mb-1">Next Reward</h4>
            <p className="text-sm text-brand-stone">Unlock $50 bonus at Pro Creator level</p>
          </div>
        </div>
      </section>

      <button className="w-full bg-brand-terracotta text-white py-5 rounded-3xl font-bold uppercase tracking-widest shadow-xl shadow-brand-terracotta/40 active:scale-95 transition-all">
        Withdraw Funds
      </button>
    </div>
  )
}

const Navbar = () => {
  return (
    <nav className="px-4 py-4 bg-brand-warmIvory sticky top-0 z-20">
      <div className="max-w-md mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="w-8"></div>
            <h1 className="text-3xl font-serif font-bold text-brand-navy text-center">Bright Abodes</h1>
            <div className="w-8 flex justify-end">
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-brand-navy hover:text-brand-terracotta transition-colors">
                    <UserIcon size={24} />
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-brand-stone group-focus-within:text-brand-terracotta transition-colors">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search neighborhoods..." 
              className="w-full bg-white border border-brand-warmGray rounded-full py-3 pl-10 pr-4 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-terracotta/20 focus:border-brand-terracotta transition-all shadow-sm"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}

const BottomNav = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const navItems = [
    { icon: Compass, label: 'Discover', path: '/discover' },
    { icon: LayoutGrid, label: 'Feed', path: '/feed' },
    { icon: Bookmark, label: 'Saved', path: '/saved' },
    { icon: ClipboardCheck, label: 'Essentials', path: '/move-in-checklist' },
    { icon: UserIcon, label: 'Profile', path: '/profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-warmGray px-2 py-2 flex justify-around items-center z-50 pb-safe-area shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      {navItems.slice(0, 2).map((item) => {
        const isActive = location.pathname === item.path
        return (
          <Link 
            key={item.label} 
            to={item.path}
            className={`flex flex-col items-center gap-1 min-w-[64px] transition-all ${isActive ? 'text-brand-terracotta' : 'text-brand-stone'}`}
          >
            <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-brand-terracotta/10' : 'hover:bg-brand-warmGray/10'}`}>
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </Link>
        )
      })}

      {/* Prominent Plus Button */}
      <button 
        onClick={() => navigate('/profile')}
        className="relative -top-4 bg-brand-terracotta text-white p-4 rounded-2xl shadow-xl shadow-brand-terracotta/40 active:scale-95 transition-all group"
      >
        <Plus size={28} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {navItems.slice(2).map((item) => {
        const isActive = location.pathname === item.path
        return (
          <Link 
            key={item.label} 
            to={item.path}
            className={`flex flex-col items-center gap-1 min-w-[64px] transition-all ${isActive ? 'text-brand-terracotta' : 'text-brand-stone'}`}
          >
            <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-brand-terracotta/10' : 'hover:bg-brand-warmGray/10'}`}>
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

const BuildingCard = ({ building }) => {
  const { getToken } = useAuth()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const mockImage = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80"
  const mockPrice = building.price || "$2,100/month"
  const mockRating = building.rating || 4.5
  
  // Use real trustScore if available, otherwise mock
  const trustScore = building.trustScore || Math.floor(Math.random() * (98 - 40) + 40)
  
  // Dynamic data for "Gig-Ready" and "Moving" features
  const internetPartners = (building.affiliateLinks || []).filter(a => a.category === 'internet' || a.serviceType === 'internet')
  const movingPartners = (building.affiliateLinks || []).filter(a => a.category === 'moving' || a.serviceType === 'moving')
  
  const isGigReady = internetPartners.length > 0
  const primaryInternet = internetPartners[0]
  const primaryMoving = movingPartners[0]

  const handleSave = async (e) => {
    e.stopPropagation()
    const token = await getToken()
    if (!token) return // Should probably redirect to login
    setSaved(!saved)
    try {
      await fetch(`${API_BASE_URL}/api/saved/toggle`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ itemType: 'building', itemId: building.id })
      })
    } catch (err) {
      console.error('Failed to toggle save:', err)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-brand-warmGray overflow-hidden min-w-[280px] group transition-all hover:shadow-md">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={mockImage} 
          alt={building.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute top-3 right-3 flex flex-col gap-3 items-end">
          <TrustBadge score={trustScore} size="sm" />
          <button 
            onClick={handleSave}
            className={`p-2 rounded-full backdrop-blur-sm transition-all shadow-sm ${saved ? 'bg-brand-terracotta text-white' : 'bg-white/90 text-brand-stone hover:text-brand-terracotta'}`}
          >
            <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        
        {isGigReady && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-brand-navy p-3 rounded-2xl flex items-center gap-3 border border-brand-warmGray shadow-lg animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="bg-brand-champagne/20 p-2 rounded-xl text-brand-champagne">
              <Wifi size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider">Gig-Ready</p>
              <p className="text-[8px] text-brand-stone font-medium uppercase tracking-widest">{primaryInternet?.name || 'Fiber Connected'}</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-serif font-bold text-brand-navy mb-1 line-clamp-1">{building.name}</h3>
        <p className="text-sm text-brand-stone flex items-center gap-1 mb-3">
          <MapPin size={14} /> {building.city}, {building.state}
        </p>
        
        {saved && primaryMoving && (
          <div className="mb-4 p-4 bg-brand-warmIvory rounded-[1.5rem] border border-brand-warmGray flex flex-col gap-4 animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-brand-terracotta/10 p-2 rounded-xl text-brand-terracotta">
                <Truck size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-bold text-brand-navy uppercase tracking-wider">Planning your move?</p>
                <p className="text-[9px] text-brand-stone font-medium">{primaryMoving.name}: {primaryMoving.description || 'Get an instant quote'}</p>
              </div>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/move-in-checklist?buildingId=${building.id}&building=${encodeURIComponent(building.name)}`)
              }}
              className="w-full bg-brand-terracotta text-white py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-brand-terracotta/20 hover:scale-[1.02] transition-all"
            >
              Book Your Move
            </button>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-brand-navy font-bold">{mockPrice}</span>
          <button 
            onClick={() => navigate(`/feed?buildingId=${building.id}`)}
            className="text-brand-terracotta font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
          >
            See Tours <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

const MapPlaceholder = ({ buildings }) => {
  return (
    <div className="relative w-full h-64 bg-brand-warmIvory/50 rounded-3xl border border-brand-warmGray overflow-hidden my-6">
      <div className="absolute inset-0 opacity-20" style={{ 
        backgroundImage: 'radial-gradient(circle, #D6D0CA 1px, transparent 1px)', 
        backgroundSize: '24px 24px' 
      }}></div>
      
      {buildings.map((b, i) => (
        <div 
          key={b.id} 
          className="absolute transition-all hover:scale-110 cursor-pointer"
          style={{ 
            top: `${20 + (i * 25) % 60}%`, 
            left: `${15 + (i * 35) % 75}%` 
          }}
        >
          <div className="relative group">
            <div className="bg-brand-terracotta text-white p-2 rounded-xl rounded-bl-none shadow-lg shadow-brand-terracotta/30">
              <MapPin size={18} fill="white" />
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-brand-navy text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {b.name}
            </div>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full text-[10px] font-bold text-brand-navy border border-brand-warmGray uppercase tracking-widest">
        Tennessee Region
      </div>
    </div>
  )
}

const CinematicPlayer = ({ review, isActive }) => {
  const { getToken } = useAuth()
  const [liked, setLike] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showToast, setShowToast] = useState(false)
  
  const handleSave = async () => {
    const token = await getToken()
    if (!token) return
    setSaved(!saved)
    try {
      await fetch(`${API_BASE_URL}/api/saved/toggle`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ itemType: 'review', itemId: review.id })
      })
    } catch (err) {
      console.error('Failed to toggle save:', err)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: review.title,
      text: `Check out this tour of ${review.building?.name} on Bright Abodes!`,
      url: `${window.location.origin}/feed?buildingId=${review.buildingId}&reviewId=${review.id}`,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Share cancelled or failed:', err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  return (
    <div className="relative h-screen w-full bg-black snap-start overflow-hidden flex flex-col justify-center">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[100] bg-brand-navy/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl border border-white/20 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <p className="text-sm font-bold flex items-center gap-2">
            <ClipboardCheck size={16} className="text-brand-champagne" /> Link copied to clipboard
          </p>
        </div>
      )}

      <MuxPlayer
        playbackId={review.videoPlaybackId}
        metadataVideoTitle={review.title}
        metadataVideoId={review.id}
        streamType="on-demand"
        autoPlay={isActive}
        muted={true}
        loop
        className="w-full h-full object-cover"
      />
      
      {/* --- Overlay UI --- */}
      
      {/* Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none"></div>
      
      {/* Branding Logo */}
      <div className="absolute top-6 left-6 z-20">
        <h2 className="text-white font-serif font-bold text-xl tracking-tight">Bright Abodes</h2>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-24 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full border-2 border-white/30 overflow-hidden bg-brand-stone">
                {review.user?.avatarUrl && <img src={review.user?.avatarUrl} alt={review.user?.username} className="w-full h-full object-cover" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm">@{review.user?.username}</span>
                  {review.isVerifiedResident && (
                    <div className="bg-brand-sage text-white text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider">
                      <CheckCircle2 size={10} strokeWidth={3} /> Verified Resident
                    </div>
                  )}
                  {review.user?.role === 'creator' && (
                    <div className="bg-brand-sage/40 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider border border-white/20">
                      <Crown size={10} fill="currentColor" /> Founding Creator
                    </div>
                  )}
                </div>
                <p className="text-white/80 text-xs mt-0.5 line-clamp-1">{review.building?.name}</p>
              </div>
            </div>

            <h3 className="text-white font-bold text-lg mb-2">{review.title}</h3>
            <p className="text-white/90 text-sm line-clamp-2 leading-relaxed mb-4">
              {review.comment}
            </p>

            {/* Pro/Con Badges */}
            <div className="flex flex-wrap gap-2">
              <div className="bg-brand-sage/20 backdrop-blur-md border border-brand-sage/30 px-3 py-1 rounded-full text-brand-sage text-[10px] font-bold uppercase tracking-wider">
                Pro: Location
              </div>
              <div className="bg-brand-terracotta/20 backdrop-blur-md border border-brand-terracotta/30 px-3 py-1 rounded-full text-brand-terracotta text-[10px] font-bold uppercase tracking-wider">
                Con: Noise
              </div>
            </div>
          </div>

          {/* Interaction Column */}
          <div className="flex flex-col gap-6 items-center">
            <button 
              onClick={() => setLike(!liked)}
              className="flex flex-col items-center gap-1 group"
            >
              <div className={`p-3 rounded-full backdrop-blur-md transition-all ${liked ? 'bg-brand-terracotta text-white' : 'bg-white/10 text-white group-hover:bg-white/20'}`}>
                <Heart size={24} fill={liked ? "currentColor" : "none"} />
              </div>
              <span className="text-white text-[10px] font-bold">{liked ? '1.3k' : '1.2k'}</span>
            </button>

            <button 
              onClick={handleSave}
              className="flex flex-col items-center gap-1 group"
            >
              <div className={`p-3 rounded-full backdrop-blur-md transition-all ${saved ? 'bg-brand-warmGold text-white' : 'bg-white/10 text-white group-hover:bg-white/20'}`}>
                <Bookmark size={24} fill={saved ? "currentColor" : "none"} />
              </div>
              <span className="text-white text-[10px] font-bold">{saved ? 'Saved' : 'Save'}</span>
            </button>

            <button 
              onClick={handleShare}
              className="flex flex-col items-center gap-1 group text-white"
            >
              <div className="p-3 rounded-full bg-white/10 backdrop-blur-md group-hover:bg-white/20 transition-all">
                <Share2 size={24} />
              </div>
              <span className="text-[10px] font-bold">Share</span>
            </button>

            <Link 
              to="/" 
              className="flex flex-col items-center gap-1 group text-white"
            >
              <div className="p-3 rounded-full bg-brand-terracotta/80 backdrop-blur-md hover:bg-brand-terracotta transition-all shadow-lg shadow-brand-terracotta/20 border border-white/20">
                <Building size={24} />
              </div>
              <span className="text-[10px] font-bold text-center leading-tight">View<br/>Prop</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Pages ---

function LandingPage() {
  const navigate = useNavigate()
  
  const featuredBuildings = [
    { id: 'b1', name: 'The Gibson', city: 'Nashville', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80' },
    { id: 'b2', name: 'Gulch Crossing', city: 'Nashville', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80' },
    { id: 'b3', name: 'Station 40', city: 'Nashville', image: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=400&q=80' },
  ]

  return (
    <div className="min-h-screen bg-brand-warmIvory text-brand-navy font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=1200&q=80" 
            alt="Golden Hour Apartment" 
            className="w-full h-full object-cover brightness-[0.55]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-transparent to-transparent"></div>
        </div>

        <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
          <div className="bg-brand-terracotta p-2.5 rounded-2xl shadow-lg">
            <Building className="text-white" size={28} />
          </div>
          <h2 className="text-white font-serif font-bold text-2xl tracking-tight uppercase">Bright Abodes</h2>
        </div>

        <div className="relative z-10 text-center px-6 max-w-2xl">
          <h1 className="text-5xl md:text-8xl font-serif font-bold text-white mb-8 leading-[1] drop-shadow-2xl">
            Your next home, <br /> <span className="text-brand-terracotta italic underline decoration-brand-champagne/30">revealed.</span>
          </h1>
          <p className="text-white text-lg md:text-xl mb-12 font-medium opacity-95 drop-shadow-lg leading-relaxed max-w-xl mx-auto">
            See the real story with resident-led video tours, hyper-local guides, and honest community insights. No filters, no fluff—just the truth about your next move.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/discover')}
              className="bg-brand-terracotta text-white py-5 px-10 rounded-2xl font-bold text-sm uppercase tracking-[0.2em] shadow-2xl shadow-brand-terracotta/40 hover:scale-105 transition-all active:scale-95"
            >
              Explore Buildings
            </button>
            <button 
              onClick={() => navigate('/creator/onboarding')}
              className="bg-brand-champagne text-brand-navy py-5 px-10 rounded-2xl font-bold text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all active:scale-95"
            >
              Become a Creator
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">How It Works</h2>
          <div className="w-24 h-1 bg-brand-terracotta mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="flex flex-col items-center text-center gap-6 group">
            <div className="bg-white w-24 h-24 flex items-center justify-center rounded-[2.5rem] shadow-2xl shadow-brand-navy/5 border border-brand-warmGray group-hover:bg-brand-terracotta group-hover:border-brand-terracotta transition-all duration-500">
              <MapPin className="text-brand-terracotta group-hover:text-white transition-colors" size={40} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-2xl mb-3">Discover with Local Context</h3>
              <p className="text-brand-stone leading-relaxed text-sm">
                Map out your search with neighborhood guides that go beyond the commute. Find the best coffee, the quietest blocks, and the hidden gems.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center gap-6 group">
            <div className="bg-white w-24 h-24 flex items-center justify-center rounded-[2.5rem] shadow-2xl shadow-brand-navy/5 border border-brand-warmGray group-hover:bg-brand-terracotta group-hover:border-brand-terracotta transition-all duration-500">
              <LayoutGrid className="text-brand-terracotta group-hover:text-white transition-colors" size={40} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-2xl mb-3">Watch Real Stories</h3>
              <p className="text-brand-stone leading-relaxed text-sm">
                Skip the static photos. Watch vertical video tours filmed by verified residents who show you what it’s <span className="italic font-bold text-brand-navy">actually</span> like to live there.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center gap-6 group">
            <div className="bg-white w-24 h-24 flex items-center justify-center rounded-[2.5rem] shadow-2xl shadow-brand-navy/5 border border-brand-warmGray group-hover:bg-brand-terracotta group-hover:border-brand-terracotta transition-all duration-500">
              <MessageCircle className="text-brand-terracotta group-hover:text-white transition-colors" size={40} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-2xl mb-3">Ask the Community</h3>
              <p className="text-brand-stone leading-relaxed text-sm">
                Have a specific question about the water pressure or the management? Ask a verified resident and get an honest answer before you book a tour.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Bright Abodes (Authenticity Section) */}
      <section className="py-24 bg-brand-navy text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-terracotta/10 blur-[120px] rounded-full"></div>
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1">
            <div className="inline-block bg-brand-terracotta px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-6">Authenticity First</div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8 leading-tight">The Anti-Zillow <br /> with <span className="italic text-brand-champagne">Class.</span></h2>
            <p className="text-brand-warmGray text-lg md:text-xl leading-relaxed mb-10 opacity-90">
              We’re tired of highly-polished marketing masking the reality of rental living. Bright Abodes combines the sophistication of a premium lifestyle guide with the unfiltered honesty of your best friend’s advice.
            </p>
            <p className="text-brand-warmGray text-lg md:text-xl leading-relaxed opacity-90 italic">
              We document the good, the bad, and the elevator-is-slow.
            </p>
          </div>
          <div className="w-full md:w-80 h-96 bg-brand-warmGray rounded-[3rem] overflow-hidden rotate-3 shadow-2xl border-4 border-white/10">
             <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Featured Buildings */}
      <section className="py-24 bg-white/40 border-y border-brand-warmGray">
        <div className="max-w-4xl mx-auto px-6 mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2">Featured Buildings</h2>
            <p className="text-brand-stone text-sm">Our top-rated residential hubs in Tennessee.</p>
          </div>
          <button onClick={() => navigate('/discover')} className="text-brand-terracotta font-bold text-xs uppercase tracking-widest hidden md:block">View All</button>
        </div>
        <div className="flex gap-6 overflow-x-auto px-6 pb-8 snap-x snap-mandatory scrollbar-hide max-w-6xl mx-auto">
          {featuredBuildings.map(building => (
            <div key={building.id} className="min-w-[300px] md:min-w-[350px] snap-start">
              <div className="bg-white rounded-[2rem] shadow-lg shadow-brand-navy/5 border border-brand-warmGray overflow-hidden h-full group cursor-pointer hover:shadow-xl transition-all">
                <div className="h-56 overflow-hidden relative">
                  <img src={building.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-brand-navy/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/10 shadow-lg">
                    <Wifi size={14} className="text-brand-champagne" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Gig-Ready</span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-serif font-bold text-2xl">{building.name}</h3>
                    <div className="flex items-center gap-1 bg-brand-warmGold/10 px-2 py-1 rounded-lg">
                      <Star size={14} className="text-brand-warmGold fill-brand-warmGold" />
                      <span className="text-xs font-bold">4.9</span>
                    </div>
                  </div>
                  <p className="text-sm text-brand-stone mb-6 flex items-center gap-1"><MapPin size={14} /> {building.city}, TN</p>
                  <button onClick={() => navigate('/discover')} className="w-full border-2 border-brand-navy text-brand-navy py-3 rounded-xl font-bold text-xs uppercase tracking-widest group-hover:bg-brand-navy group-hover:text-white transition-all">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <div className="bg-brand-navy rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-terracotta/20 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-champagne/10 rounded-full blur-[100px]"></div>
          
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 relative z-10">Join the Circle.</h2>
          <p className="text-brand-warmGray text-lg md:text-xl mb-12 max-w-xl mx-auto relative z-10 leading-relaxed font-medium">
            Be part of the most informed renter community in the South. Share your story, earn rewards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button 
              onClick={() => navigate('/discover')}
              className="bg-brand-terracotta text-white py-5 px-12 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-brand-terracotta/20 hover:scale-105 transition-all"
            >
              Get Started
            </button>
            <button 
              onClick={() => navigate('/partner-inquiry')}
              className="bg-white/10 backdrop-blur-md text-white py-5 px-12 rounded-2xl font-bold text-sm uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all"
            >
              Partner with Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 text-center bg-brand-navy/5 border-t border-brand-warmGray">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-brand-navy p-1.5 rounded-lg">
            <Building className="text-white" size={20} />
          </div>
          <h2 className="text-brand-navy font-serif font-bold text-xl tracking-tight uppercase">Bright Abodes</h2>
        </div>
        <p className="text-brand-stone text-sm mb-12 max-w-xs mx-auto leading-relaxed italic">"See the real story. Live the good life."</p>
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <Link to="/" className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-navy hover:text-brand-terracotta transition-colors">Privacy</Link>
          <Link to="/" className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-navy hover:text-brand-terracotta transition-colors">Terms</Link>
          <Link to="/partner-inquiry" className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-navy hover:text-brand-terracotta transition-colors">Partners</Link>
          <Link to="/creator" className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-navy hover:text-brand-terracotta transition-colors">Creators</Link>
        </div>
        <p className="text-[10px] text-brand-stone uppercase tracking-widest font-medium">© 2026 Bright Abodes. Nashville, TN.</p>
      </footer>
    </div>
  )
}

function Saved() {
  const { getToken } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const token = await getToken()
        const res = await fetch(`${API_BASE_URL}/api/saved`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await res.json()
        setItems(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to fetch saved items:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSaved()
  }, [getToken])

  if (loading) return (
    <div className="p-8 text-center pt-24">
      <div className="w-8 h-8 border-4 border-brand-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-brand-stone font-serif italic">Loading your collection...</p>
    </div>
  )

  return (
    <div className="p-4 pb-24 max-w-md mx-auto min-h-screen">
      <header className="mb-8 pt-4">
        <h1 className="text-3xl font-serif font-bold text-brand-navy mb-2">Saved</h1>
        <p className="text-brand-stone text-sm">Your handpicked selection of Nashville's best.</p>
      </header>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-brand-warmGray border-dashed">
          <Bookmark size={48} className="text-brand-warmGray mx-auto mb-4 opacity-50" />
          <p className="text-brand-stone italic mb-6">Nothing saved yet</p>
          <Link to="/" className="text-brand-terracotta font-bold text-sm uppercase tracking-widest">Start Exploring</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {items.map(item => (
            <div key={item.id} className="relative group">
              {item.itemType === 'building' ? (
                <div className="bg-white rounded-2xl p-4 border border-brand-warmGray shadow-sm hover:shadow-md transition-all">
                  <div className="flex gap-4 mb-4">
                    <div className="w-20 h-20 bg-brand-warmGray rounded-xl overflow-hidden flex-shrink-0">
                      <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif font-bold text-brand-navy">{item.building?.name}</h3>
                      <p className="text-xs text-brand-stone mb-2">{item.building?.city}, {item.building?.state}</p>
                      <Link to={`/feed?buildingId=${item.itemId}`} className="text-brand-terracotta text-xs font-bold uppercase tracking-wider">View Tours</Link>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-brand-warmGray/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-brand-terracotta" />
                      <span className="text-[10px] font-bold text-brand-navy uppercase tracking-widest">Move Essentials</span>
                    </div>
                    <Link 
                      to={`/move-in-checklist?building=${encodeURIComponent(item.building?.name || "")}`}
                      className="bg-brand-terracotta text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-md shadow-brand-terracotta/10"
                    >
                      Checklist
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-brand-navy rounded-2xl p-4 text-white shadow-lg overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-2 opacity-20"><LayoutGrid size={40} /></div>
                  <h3 className="font-serif font-bold text-white mb-1 line-clamp-1">{item.review?.title}</h3>
                  <p className="text-[10px] text-brand-warmGray mb-3">Review for {item.review?.building?.name}</p>
                  <Link to={`/feed?buildingId=${item.review?.buildingId}`} className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all inline-block">Watch Now</Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Ask() {
  const { getToken } = useAuth()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newQuestion, setNewQuestion] = useState('')

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/questions`)
      .then(res => res.json())
      .then(data => {
        setQuestions(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch questions:', err)
        setLoading(false)
      })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = await getToken()
      const res = await fetch(`${API_BASE_URL}/api/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newQuestion })
      })
      if (res.ok) {
        const { id } = await res.json()
        const question = {
          id,
          content: newQuestion,
          user: { username: 'you' },
          createdAt: new Date().toISOString(),
          answers: []
        }
        setQuestions([question, ...questions])
        setNewQuestion('')
        setShowForm(false)
      }
    } catch (err) {
      console.error('Failed to post question:', err)
    }
  }

  if (loading) return (
    <div className="p-8 text-center pt-24">
      <div className="w-8 h-8 border-4 border-brand-sage border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-brand-stone font-serif italic">Loading community wisdom...</p>
    </div>
  )

  return (
    <div className="p-4 pb-24 max-w-md mx-auto min-h-screen">
      <header className="mb-8 pt-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-navy mb-2">Ask</h1>
          <p className="text-brand-stone text-sm">Real answers from real residents.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-brand-sage text-white p-3 rounded-full shadow-lg shadow-brand-sage/20 hover:scale-105 transition-all"
        >
          <MessageCircle size={24} />
        </button>
      </header>

      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-3xl border border-brand-sage/30 shadow-sm animate-in fade-in slide-in-from-top-4">
          <h3 className="font-serif font-bold text-brand-navy mb-4">What's on your mind?</h3>
          <form onSubmit={handleSubmit}>
            <textarea 
              className="w-full border border-brand-warmGray rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-sage/20 focus:border-brand-sage transition-all mb-4"
              placeholder="e.g., How is the soundproofing at The Gibson?"
              rows="3"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              required
            ></textarea>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-brand-sage text-white font-bold py-3 rounded-xl text-sm uppercase tracking-widest">Post Question</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 text-brand-stone text-sm font-medium">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {questions.map(q => (
          <div key={q.id} className="bg-white rounded-3xl p-6 border border-brand-warmGray shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-brand-warmGray rounded-full"></div>
              <span className="text-[10px] font-bold text-brand-stone uppercase tracking-tighter">@{q.user?.username} asked about {q.building?.name || 'General'}</span>
            </div>
            <h3 className="text-lg font-serif font-bold text-brand-navy mb-4 leading-snug">{q.content}</h3>
            
            {q.answers && q.answers.length > 0 ? (
              <div className="bg-brand-warmIvory/50 rounded-2xl p-4">
                {q.answers.map(a => (
                  <div key={a.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-sage/20 flex items-center justify-center text-brand-sage flex-shrink-0">
                      <UserIcon size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-brand-navy">@{a.user?.username}</span>
                        {a.isResident && <span className="bg-brand-sage text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase">Resident</span>}
                      </div>
                      <p className="text-sm text-brand-stone leading-relaxed">{a.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-brand-stone italic">No answers yet. Be the first to help!</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function Home() {
  const [buildings, setBuildings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/buildings`)
      .then(res => res.json())
      .then(data => {
        setBuildings(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch buildings:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="p-4 pb-24 max-w-md mx-auto min-h-screen">
      <section className="mb-8">
        <MapPlaceholder buildings={buildings} />
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-bold text-brand-navy leading-tight">
            See the <span className="text-brand-terracotta">real</span> story.
          </h2>
          <button className="text-xs font-bold uppercase tracking-widest text-brand-stone hover:text-brand-terracotta transition-colors">
            View All
          </button>
        </div>
        
        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2].map(i => (
              <div key={i} className="min-w-[280px] h-72 bg-brand-warmGray/30 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {buildings.map(building => (
              <div key={building.id} className="snap-start">
                <BuildingCard building={building} />
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="bg-brand-navy p-8 rounded-3xl text-center text-white mb-8 shadow-xl shadow-brand-navy/20 overflow-hidden relative">
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-brand-terracotta/20 rounded-full blur-3xl"></div>
        <h3 className="text-2xl font-serif font-bold mb-3 relative z-10">Join the Community</h3>
        <p className="text-brand-warmGray text-sm mb-6 relative z-10 leading-relaxed">
          Get the real story on your next apartment from people who actually live there.
        </p>
        <button className="w-full bg-brand-terracotta text-white py-4 rounded-2xl font-bold hover:bg-brand-terracotta/90 transition-all shadow-lg shadow-brand-terracotta/20 relative z-10 uppercase tracking-widest text-xs">
          Create Free Account
        </button>
      </div>
    </div>
  )
}

function Feed() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const buildingId = searchParams.get('buildingId')
  const feedRef = useRef(null)

  useEffect(() => {
    const url = buildingId 
      ? `${API_BASE_URL}/api/buildings/${buildingId}/reviews`
      : `${API_BASE_URL}/api/reviews`

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const reviewsData = Array.isArray(data) ? data : []
        setReviews(reviewsData)
        
        // Handle deep-linking to a specific review
        const reviewId = searchParams.get('reviewId')
        if (reviewId && reviewsData.length > 0) {
          const index = reviewsData.findIndex(r => r.id === reviewId)
          if (index !== -1) {
            setActiveIndex(index)
            // Scroll to that index after a short delay to let rendering finish
            setTimeout(() => {
              if (feedRef.current) {
                feedRef.current.scrollTo({
                  top: index * feedRef.current.clientHeight,
                  behavior: 'smooth'
                })
              }
            }, 100)
          }
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('FETCH ERROR:', err)
        setLoading(false)
      })
  }, [buildingId])

  useEffect(() => {
    const handleScroll = () => {
      if (!feedRef.current) return
      const scrollPos = feedRef.current.scrollTop
      const height = feedRef.current.clientHeight
      const newIndex = Math.round(scrollPos / height)
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex)
      }
    }

    const currentRef = feedRef.current
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll)
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll)
      }
    }
  }, [activeIndex])

  if (loading) return (
    <div className="h-screen w-full bg-brand-navy flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-white">
        <div className="w-12 h-12 border-4 border-brand-terracotta border-t-transparent rounded-full animate-spin"></div>
        <p className="font-serif italic">Loading tours...</p>
      </div>
    </div>
  )

  if (reviews.length === 0) return (
    <div className="h-screen w-full bg-brand-warmIvory flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-brand-warmGray/20 p-8 rounded-full mb-6">
        <Building size={64} className="text-brand-stone" />
      </div>
      <h2 className="text-2xl font-serif font-bold text-brand-navy mb-2">No tours found ({reviews.length})</h2>
      <p className="text-brand-stone text-sm mb-8">Be the first to share a review for this building!</p>
      <Link to="/" className="bg-brand-terracotta text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs">
        Discover Buildings
      </Link>
    </div>
  )

  return (
    <div 
      ref={feedRef}
      className="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory scrollbar-hide pb-20"
    >
      {buildingId && (
        <Link 
          to="/" 
          className="absolute top-6 right-6 z-50 bg-black/20 backdrop-blur-md text-white p-2 rounded-full border border-white/20"
        >
          <X size={24} />
        </Link>
      )}

      {reviews.map((review, index) => (
        <CinematicPlayer 
          key={review.id} 
          review={review} 
          isActive={index === activeIndex} 
        />
      ))}
    </div>
  )
}

import VideoUpload from './components/VideoUpload'

function Profile() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser()
  const { getToken, signOut } = useAuth()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken()
        if (!token) {
          setLoading(false)
          return
        }
        const res = await fetch(`${API_BASE_URL}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await res.json()
        setUser(data)
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      } finally {
        setLoading(false)
      }
    }

    if (isClerkLoaded) {
      fetchProfile()
    }
  }, [isClerkLoaded, getToken])

  if (loading) return <div className="p-8 text-center pt-24 font-serif italic text-brand-stone">Loading profile...</div>

  const isVerified = user?.role === 'creator' || user?.role === 'manager' || user?.role === 'admin'

  return (
    <div className="p-4 pb-24 max-w-md mx-auto min-h-screen">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-brand-warmGray text-center relative overflow-hidden mb-8">
        <div className="absolute top-0 left-0 right-0 h-2 bg-brand-terracotta"></div>
        <div className="mb-6 flex justify-center">
          <SignedOut>
            <div className="w-24 h-24 bg-brand-warmIvory rounded-full flex items-center justify-center text-brand-stone border-2 border-brand-warmGray overflow-hidden">
              <UserIcon size={48} />
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-24 h-24' } }} />
          </SignedIn>
        </div>
        <h1 className="text-2xl font-serif font-bold text-brand-navy">
          <SignedIn>@{user?.username || clerkUser?.username}</SignedIn>
          <SignedOut>Guest</SignedOut>
        </h1>
        <p className="text-brand-stone text-sm mb-4">
          <SignedIn>{user?.fullName || clerkUser?.fullName}</SignedIn>
          <SignedOut>Sign in to see your profile</SignedOut>
        </p>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-brand-navy text-white px-6 py-2 rounded-xl text-sm font-bold">Sign In</button>
          </SignInButton>
        </SignedOut>
      </div>

      <SignedIn>
        <div className="space-y-6">
          {showUpload ? (
            <div className="bg-white p-6 rounded-3xl border border-brand-terracotta/20 shadow-xl animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif font-bold text-xl">Share Your Story</h3>
                <button onClick={() => setShowUpload(false)} className="p-2 hover:bg-brand-warmIvory rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>
              <VideoUpload onUploadSuccess={() => setShowUpload(false)} />
            </div>
          ) : (
            <section className="bg-brand-navy text-white p-6 rounded-3xl shadow-xl shadow-brand-navy/20 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-terracotta/20 rounded-full blur-3xl"></div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif font-bold text-lg flex items-center gap-2">
                  <LayoutGrid size={20} className="text-brand-terracotta" /> Creator Dashboard
                </h3>
                <button 
                  onClick={() => navigate('/creator/wallet')}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                >
                  <Wallet size={20} className="text-brand-champagne" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-[10px] uppercase tracking-widest text-brand-warmGray">Tours</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">1.2k</p>
                  <p className="text-[10px] uppercase tracking-widest text-brand-warmGray">Views</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">480</p>
                  <p className="text-[10px] uppercase tracking-widest text-brand-warmGray">Likes</p>
                </div>
              </div>
              {isVerified && (
                <button 
                  onClick={() => setShowUpload(true)}
                  className="w-full mt-6 bg-brand-terracotta text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-brand-terracotta/20"
                >
                  Upload New Tour
                </button>
              )}
            </section>
          )}

          <section>
            <h3 className="font-serif font-bold text-brand-navy mb-4">Account Settings</h3>
            <div className="bg-white rounded-2xl border border-brand-warmGray divide-y divide-brand-warmGray overflow-hidden">
              <button className="w-full p-4 text-left text-sm flex justify-between items-center hover:bg-brand-warmIvory/50 transition-all">
                <span>Personal Information</span>
                <ChevronRight size={16} className="text-brand-stone" />
              </button>
              <button className="w-full p-4 text-left text-sm flex justify-between items-center hover:bg-brand-warmIvory/50 transition-all">
                <span>Verification Status</span>
                <span className="bg-brand-sage/10 text-brand-sage text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Verified Resident</span>
              </button>
              <button 
                onClick={() => signOut()}
                className="w-full p-4 text-left text-sm flex justify-between items-center hover:bg-brand-warmIvory/50 transition-all text-brand-terracotta font-bold"
              >
                <span>Sign Out</span>
              </button>
            </div>
          </section>

          <section>
            <h3 className="font-serif font-bold text-brand-navy mb-4">Relocation Essentials</h3>
            <Link 
              to="/move-in-checklist" 
              className="w-full bg-white border border-brand-warmGray p-4 rounded-2xl flex items-center justify-between group hover:border-brand-terracotta transition-all shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-terracotta/10 text-brand-terracotta rounded-xl group-hover:bg-brand-terracotta group-hover:text-white transition-all">
                  <ClipboardCheck size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-brand-navy">Move-In Checklist</p>
                  <p className="text-[10px] text-brand-stone uppercase tracking-widest">4 of 6 Completed</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-brand-stone group-hover:text-brand-terracotta transition-all" />
            </Link>
          </section>

          {user?.role === 'manager' && (
            <section>
              <h3 className="font-serif font-bold text-brand-navy mb-4">Management</h3>
              <Link 
                to="/pm/dashboard" 
                className="w-full bg-brand-terracotta text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-terracotta/20 transition-all active:scale-95"
              >
                <Building size={20} /> Property Manager Dashboard
              </Link>
            </section>
          )}
        </div>
      </SignedIn>
    </div>
  )
}

import PartnerInquiry from './pages/PartnerInquiry'

function App() {
  const location = useLocation()
  const isFeed = location.pathname === '/feed'
  const isLanding = location.pathname === '/'
  const isCreatorFullPage = location.pathname.startsWith('/creator')
  const isSharedChecklist = location.pathname.startsWith('/checklist/share')
  const isPartnerPortal = location.pathname === '/partner-inquiry'

  return (
    <div className="min-h-screen bg-brand-warmIvory text-brand-navy font-sans overflow-x-hidden">
      {!isFeed && !isLanding && !isCreatorFullPage && !isSharedChecklist && !isPartnerPortal && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/discover" element={<Home />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/ask" element={<Ask />} />
          <Route path="/move-in-checklist" element={<MoveInChecklist />} />
          <Route path="/checklist/share/:shareId" element={<MoveInChecklist isReadOnly={true} />} />
          <Route path="/creator" element={<CreatorLanding />} />
          <Route path="/creator/onboarding" element={<CreatorOnboarding />} />
          <Route path="/creator/dashboard" element={<CreatorDashboard />} />
          <Route path="/creator/campaigns" element={<CampaignHub />} />
          <Route path="/creator/wallet" element={<WalletDashboard />} />
          <Route path="/pm/dashboard" element={<PMDashboard />} />
          <Route path="/partner-inquiry" element={<PartnerInquiry />} />
        </Routes>
      </main>
      {!isLanding && !isCreatorFullPage && !isSharedChecklist && !isPartnerPortal && <BottomNav />}
    </div>
  )
}

export default App
// Production Launch trigger v3: diagnostics
// Production Launch Trigger: Wed Jun 17 19:35:13 UTC 2026
// Final Production Launch: Wed Jun 17 21:08:29 UTC 2026
