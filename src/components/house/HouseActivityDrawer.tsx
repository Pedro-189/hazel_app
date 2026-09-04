import React from 'react';
import { useCouple } from '../../context/CoupleContext';
import { X, Sparkles, Clock } from 'lucide-react';

interface HouseActivityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HouseActivityDrawer: React.FC<HouseActivityDrawerProps> = ({ isOpen, onClose }) => {
  const { house, couple } = useCouple();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col border-l border-rose-100 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-800">Diario de la Casita</h3>
              <p className="text-[11px] text-stone-500">¿Qué ha construido cada uno?</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Activity Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {house.activityLogs.length === 0 ? (
            <div className="text-center py-10 text-stone-400 text-xs">
              Aún no hay actividad. ¡Comiencen a decorar su hogar!
            </div>
          ) : (
            house.activityLogs.map((log) => {
              const author = log.partnerId === 'partner1' ? couple.partner1 : couple.partner2;
              const dateStr = new Date(log.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={log.id}
                  className="p-3 bg-stone-50 rounded-2xl border border-stone-100 flex items-start space-x-3 hover:bg-rose-50/50 transition-colors"
                >
                  <span className="text-2xl p-1 bg-white rounded-xl shadow-xs border border-stone-100">
                    {log.icon || author.avatar}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
                        {author.name} {author.avatar}
                      </span>
                      <span className="text-[10px] text-stone-400 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {dateStr}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 mt-0.5">
                      {log.action === 'placed' && `Añadió ${log.itemName} en ${log.roomName}`}
                      {log.action === 'room_unlocked' && `¡Desbloqueó una nueva habitación: ${log.roomName}!`}
                      {log.action === 'photo_added' && `Colgó una foto especial en la pared`}
                      {log.action === 'moved' && `Reorganizó ${log.itemName}`}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
