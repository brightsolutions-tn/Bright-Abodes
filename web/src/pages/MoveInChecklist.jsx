import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Wifi, 
  Armchair, 
  ChevronRight,
  ArrowLeft,
  Info
} from 'lucide-react'

const MoveInChecklist = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const buildingName = searchParams.get('building') || 'The Metro Lofts'

  const essentials = [
    {
      id: 'moving',
      partner: 'Bellhop Moving',
      title: 'Book Your Move',
      description: 'Get an instant quote for your move to this building',
      icon: Truck,
      actionLabel: 'Get Quote',
      color: 'bg-brand-terracotta',
      completed: true
    },
    {
      id: 'insurance',
      partner: 'Lemonade Renters Insurance',
      title: 'Get Covered in 90 Seconds',
      description: 'Standard renters insurance required by management',
      icon: ShieldCheck,
      actionLabel: 'Learn More',
      color: 'bg-brand-sage',
      completed: true
    },
    {
      id: 'internet',
      partner: 'Xfinity Internet',
      title: 'Gig-Ready Certification',
      description: 'Pre-installed fiber connected and ready for activation',
      icon: Wifi,
      actionLabel: 'Check Availability',
      color: 'bg-brand-warmGold',
      completed: true
    },
    {
      id: 'furniture',
      partner: 'CORT Furniture Rental',
      title: 'Shop the Tour',
      description: 'Love the look of the resident tours? Rent the furniture.',
      icon: Armchair,
      actionLabel: 'Learn More',
      color: 'bg-brand-navy',
      completed: true
    },
    {
      id: 'utilities',
      partner: 'Nashville Electric',
      title: 'Setup Utilities',
      description: 'Transfer your electricity account before move-in day',
      icon: Info,
      actionLabel: 'Setup Now',
      color: 'bg-brand-stone',
      completed: false
    },
    {
      id: 'parking',
      partner: 'Resident Parking',
      title: 'Register Vehicle',
      description: 'Secure your spot in the controlled access garage',
      icon: Info,
      actionLabel: 'Register',
      color: 'bg-brand-stone',
      completed: false
    }
  ]

  const completedCount = essentials.filter(e => e.completed).length
  const progressPercent = (completedCount / essentials.length) * 100

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
            <p className="text-[10px] font-bold text-brand-navy uppercase tracking-widest mb-2">{completedCount} of {essentials.length} essentials completed</p>
            <div className="h-1 bg-brand-warmGray/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-sage transition-all duration-1000 ease-out" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {essentials.map((item) => (
            <div key={item.id} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-brand-warmGray relative group hover:shadow-md transition-all">
              <div className="flex gap-6 items-start mb-6">
                <div className="text-brand-navy pt-1">
                  <item.icon size={32} strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-brand-stone uppercase tracking-widest mb-1">{item.partner}</p>
                  <h3 className="font-serif font-bold text-2xl text-brand-navy leading-tight">{item.title}</h3>
                </div>
              </div>
              <p className="text-sm text-brand-stone leading-relaxed mb-6">{item.description}</p>
              
              <button className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all active:scale-95 flex items-center justify-center gap-2 ${
                item.id === 'internet' ? 'bg-brand-champagne text-brand-navy' :
                item.id === 'insurance' ? 'bg-brand-sage text-white' :
                'bg-brand-terracotta text-white shadow-lg shadow-brand-terracotta/20'
              }`}>
                {item.actionLabel}
              </button>
            </div>
          ))}
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
