
import React from 'react';
import { useApp } from '../context/Store';
import { Button } from '../components/Shared';
import { Check, Star, X, Crown } from 'lucide-react';

export const SubscriptionView: React.FC = () => {
  const { subscriptionPlans, navigate, t } = useApp();

  const handlePlanClick = (link: string) => {
    window.location.href = link;
  };

  const PlanCard: React.FC<{ plan: any }> = ({ plan }) => {
      const isGold = plan.id === 'gold';
      const isPremium = plan.id === 'premium';
      
      const borderColor = isGold ? 'border-amber-400 ring-4 ring-amber-500/10' : isPremium ? 'border-blue-500' : 'border-slate-700';
      const bgGradient = isGold ? 'bg-gradient-to-b from-slate-800 to-slate-900' : 'bg-white/5';
      const btnVariant = isGold ? 'gold' : isPremium ? 'premium' : 'outline';

      // Use translated strings if available, fallback to object property
      const displayName = t.plans?.[plan.id]?.name || plan.name;
      const displayPeriod = t.plans?.[plan.id]?.period || plan.period;
      const displayFeatures = t.plans?.[plan.id]?.features || plan.features;

      return (
        <div className={`relative rounded-2xl p-6 mb-6 border ${borderColor} ${bgGradient} backdrop-blur-md`}>
             {isGold && (
                 <div className="absolute top-0 right-0 bg-amber-400 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">Best Value</div>
             )}
             
             <div className="flex items-center gap-3 mb-4">
                 <div className={`p-2 rounded-xl ${isGold ? 'bg-amber-400/20 text-amber-400' : isPremium ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'}`}>
                     {isGold ? <Crown size={24} /> : isPremium ? <Star size={24} /> : <div className="w-6 h-6 rounded-full border-2 border-current opacity-50"></div>}
                 </div>
                 <div>
                     <h3 className="text-xl font-bold font-serif">{displayName}</h3>
                     <p className="text-sm text-slate-400">{plan.price} <span className="text-xs opacity-70">{displayPeriod}</span></p>
                 </div>
             </div>

             <ul className="flex flex-col gap-3 mb-6">
                 {displayFeatures.map((feat: string, i: number) => (
                     <li key={i} className="flex items-start gap-3 text-sm text-slate-200">
                         <div className={`mt-0.5 rounded-full p-0.5 ${isGold ? 'bg-amber-500' : isPremium ? 'bg-blue-500' : 'bg-slate-600'}`}>
                             <Check size={10} strokeWidth={4} className="text-white" />
                         </div>
                         {feat}
                     </li>
                 ))}
             </ul>

             <Button 
                variant={btnVariant as any} 
                fullWidth 
                onClick={() => handlePlanClick(plan.paymentLink)}
             >
                Choose {displayName}
             </Button>
        </div>
      );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white animate-fade-in relative flex flex-col">
      <button 
        onClick={() => navigate('HOME')} 
        className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-20"
      >
        <X size={24} />
      </button>

      {/* Hero Image / Background */}
      <div className="absolute top-0 left-0 right-0 h-[40vh] bg-gradient-to-b from-brand-900 to-slate-900 opacity-50 z-0"></div>

      <div className="relative z-10 flex-1 flex flex-col px-6 pt-12 pb-8 max-w-4xl mx-auto w-full">
        
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-serif mb-2">Unlock Knowledge</h1>
            <p className="text-slate-300">Choose the plan that fits your learning journey.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptionPlans.filter(p => p.id !== 'free').map(plan => (
                <PlanCard key={plan.id} plan={plan} />
            ))}
        </div>

        <p className="text-center text-xs text-slate-500 mt-10">
             Plans auto-renew. Cancel anytime in your account settings.
        </p>
      </div>
    </div>
  );
};
