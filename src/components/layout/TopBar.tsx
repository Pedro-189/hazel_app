import React, { useState } from 'react';
import { useCouple } from '../../context/CoupleContext';
import { Heart, Flame, Volume2, VolumeX, ArrowLeftRight, User } from 'lucide-react';
import { AccountModal } from '../account/AccountModal';
import { isSupabaseConfigured } from '../../utils/supabaseClient';

export const TopBar: React.FC = () => {
  const {
    couple,
    activePartner,
    switchActivePartner,
    isMuted,
    toggleMute,
  } = useCouple();

  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const handleTogglePartner = () => {
    const nextId = couple.activePartnerId === 'partner1' ? 'partner2' : 'partner1';
    switchActivePartner(nextId);
  };

  return (
    <>
      <header className="bg-white border-b border-stone-200/80 px-3 py-2 flex items-center justify-between z-20 select-none">
        {/* Active Partner Switcher Mode */}
        <button
          onClick={handleTogglePartner}
          className="flex items-center space-x-1.5 px-2.5 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200/70 rounded-full transition-all active:scale-95 text-stone-800 shadow-xs"
          title="Alternar entre tu perspectiva y la de tu pareja"
        >
          <span className="text-base">{activePartner.avatar}</span>
          <div className="text-left">
            <span className="text-[8px] text-stone-400 block leading-tight font-medium">Jugando como</span>
            <span className="text-[11px] font-bold text-rose-700 leading-tight block truncate max-w-[65px]">
              {activePartner.name}
            </span>
          </div>
          <ArrowLeftRight className="w-3 h-3 text-rose-500 ml-0.5" />
        </button>

        {/* Right Stats & Menu */}
        <div className="flex items-center space-x-1.5">
          {/* Streak Badge */}
          <div
            className="flex items-center space-x-1 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-full text-amber-700 font-extrabold text-[10px] shadow-xs"
            title={`${couple.streakDays} días de racha juntos`}
          >
            <Flame className="w-3 h-3 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{couple.streakDays}d</span>
          </div>

          {/* Love Coins (Hearts) */}
          <div
            className="flex items-center space-x-1 px-2 py-0.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-extrabold text-[11px] shadow-xs shadow-rose-200"
            title="Monedas de Amor (Corazones)"
          >
            <Heart className="w-3 h-3 fill-white text-white" />
            <span>{couple.loveCoins}</span>
          </div>

          {/* Audio Mute Button */}
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
            title={isMuted ? 'Activar Sonidos' : 'Silenciar Sonidos'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-stone-400" /> : <Volume2 className="w-3.5 h-3.5 text-rose-500" />}
          </button>

          {/* Account / Profile Button */}
          <button
            onClick={() => setIsAccountOpen(true)}
            className="relative p-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all active:scale-95 shadow-xs"
            title="Mi Cuenta y Casita"
          >
            <User className="w-3.5 h-3.5" />
            <span
              className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${
                isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
            />
          </button>
        </div>
      </header>

      {/* Account & Profile Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />
    </>
  );
};
