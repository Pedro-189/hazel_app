import React, { useEffect } from 'react';
import { useCouple } from '../../context/CoupleContext';

export const FloatingEffectsOverlay: React.FC = () => {
  const { floatingEffects, dismissEffect } = useCouple();

  useEffect(() => {
    if (floatingEffects.length > 0) {
      const timer = setTimeout(() => {
        dismissEffect(floatingEffects[0].id);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [floatingEffects, dismissEffect]);

  if (floatingEffects.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex flex-col items-center justify-center p-4 space-y-2">
      {floatingEffects.map((effect) => (
        <div
          key={effect.id}
          className="bg-stone-900/90 backdrop-blur-md text-white px-5 py-3 rounded-3xl shadow-2xl border border-rose-400/40 flex items-center space-x-3 pointer-events-auto animate-in zoom-in-90 slide-in-from-bottom-6 fade-in duration-300"
        >
          <span className="text-3xl animate-bounce">
            {effect.type === 'hug' && '🫂'}
            {effect.type === 'kiss' && '💋'}
            {effect.type === 'poke' && '✨'}
            {effect.type === 'miss_you' && '🥺'}
            {effect.type === 'heart_coin' && '💖'}
            {effect.type === 'heart_bomb' && '💘'}
          </span>
          <div>
            <p className="text-xs font-extrabold text-rose-200">Hazel Love</p>
            <p className="text-xs font-semibold text-stone-100">{effect.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
