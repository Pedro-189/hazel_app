import React, { useState } from 'react';
import { useCouple } from '../../context/CoupleContext';
import { PartnerMoodCard } from './PartnerMoodCard';
import { LoveTouchBar } from './LoveTouchBar';
import { UpdateMoodModal } from './UpdateMoodModal';
import { 
  Sparkles, 
  Plane 
} from 'lucide-react';

export const MoodScreen: React.FC = () => {
  const { couple, activePartner, otherPartner } = useCouple();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const partner1 = couple.partner1;
  const partner2 = couple.partner2;

  return (
    <div className="flex flex-col h-full bg-stone-50 overflow-y-auto pb-20">
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-stone-200/80 sticky top-0 z-10 backdrop-blur-md bg-white/90">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Conexión Emocional</span>
            <h2 className="text-base font-extrabold text-stone-800 flex items-center gap-1.5">
              Estado de Ánimo & Radar 💖
            </h2>
          </div>

          <button
            onClick={() => setIsUpdateModalOpen(true)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-xs shadow-md shadow-rose-200 transition-transform active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mi Estado</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* LDR Connection Bridge */}
        <div className="bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400 rounded-3xl p-4 text-white shadow-lg shadow-rose-200/60 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{partner1.avatar}</span>
              <div>
                <span className="text-xs font-bold block">{partner1.name}</span>
                <span className="text-[10px] text-rose-100">{partner1.location.split(',')[0]}</span>
              </div>
            </div>

            <div className="flex flex-col items-center px-3">
              <div className="flex items-center space-x-1 text-xs font-bold text-amber-200">
                <Plane className="w-3.5 h-3.5" />
                <span>Distancia</span>
              </div>
              <div className="w-20 h-0.5 bg-white/40 my-1 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-ping" />
              </div>
              <span className="text-[9px] text-rose-100">Unidos por amor</span>
            </div>

            <div className="flex items-center space-x-2 text-right">
              <div>
                <span className="text-xs font-bold block">{partner2.name}</span>
                <span className="text-[10px] text-rose-100">{partner2.location.split(',')[0]}</span>
              </div>
              <span className="text-2xl">{partner2.avatar}</span>
            </div>
          </div>
        </div>

        {/* Both Partner Mood Cards */}
        <div className="space-y-3">
          <PartnerMoodCard
            partner={activePartner}
            isMe={true}
            onUpdateClick={() => setIsUpdateModalOpen(true)}
          />

          <PartnerMoodCard
            partner={otherPartner}
            isMe={false}
          />
        </div>

        {/* Quick Love Touch Buttons */}
        <LoveTouchBar />

        {/* Recent Affection History Feed */}
        <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Interacciones Recientes</span>
            </h4>
            <span className="text-[10px] text-stone-400">
              {couple.recentInteractions.length} mimos
            </span>
          </div>

          <div className="space-y-2">
            {couple.recentInteractions.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-4">
                Aún no se han enviado caricias hoy. ¡Manda un abrazo con los botones de arriba!
              </p>
            ) : (
              couple.recentInteractions.slice(0, 5).map((item) => {
                const timeStr = new Date(item.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={item.id}
                    className="p-2.5 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">
                        {item.type === 'hug' && '🫂'}
                        {item.type === 'kiss' && '💋'}
                        {item.type === 'poke' && '✨'}
                        {item.type === 'miss_you' && '🥺'}
                        {item.type === 'heart_bomb' && '💖'}
                      </span>
                      <span className="text-stone-700 font-medium">{item.message}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 flex-shrink-0 ml-2">{timeStr}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Update Mood Modal */}
      <UpdateMoodModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      />
    </div>
  );
};
