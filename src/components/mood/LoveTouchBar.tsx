import React from 'react';
import { useCouple } from '../../context/CoupleContext';
import { Heart } from 'lucide-react';

export const LoveTouchBar: React.FC = () => {
  const { otherPartner, sendInteraction } = useCouple();

  const touches = [
    {
      type: 'hug' as const,
      label: 'Abrazo',
      icon: '🫂',
      bg: 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-800',
    },
    {
      type: 'kiss' as const,
      label: 'Beso',
      icon: '💋',
      bg: 'bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-800',
    },
    {
      type: 'poke' as const,
      label: 'Toquecito',
      icon: '✨',
      bg: 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800',
    },
    {
      type: 'miss_you' as const,
      label: 'Te Extraño',
      icon: '🥺',
      bg: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-800',
    },
    {
      type: 'heart_bomb' as const,
      label: 'Lluvia Amor',
      icon: '💖',
      bg: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-800',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-xs space-y-2.5">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>Enviar Caricias a {otherPartner.name} {otherPartner.avatar}</span>
        </h4>
        <span className="text-[10px] text-stone-400">En tiempo real</span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {touches.map((t) => (
          <button
            key={t.type}
            onClick={() => sendInteraction(t.type)}
            className={`p-2 rounded-2xl border flex flex-col items-center justify-center transition-transform active:scale-90 ${t.bg}`}
          >
            <span className="text-2xl animate-wiggle">{t.icon}</span>
            <span className="text-[9px] font-bold mt-1 text-center truncate max-w-full">
              {t.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
