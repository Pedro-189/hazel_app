import React from 'react';
import { Home, MessageCircleHeart, HeartPulse, BookHeart } from 'lucide-react';
import { useCouple } from '../../context/CoupleContext';

export type TabType = 'house' | 'qa' | 'mood' | 'memories';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const { qa, allQuestions, couple } = useCouple();

  // Count unrevealed or waiting questions
  const unrevealedCount = allQuestions.filter((q) => {
    const rec = qa.records[q.id];
    return !rec?.isRevealed;
  }).length;

  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode; badge?: number }> = [
    {
      id: 'house',
      label: 'Casita',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'qa',
      label: 'Preguntas',
      icon: <MessageCircleHeart className="w-5 h-5" />,
      badge: unrevealedCount > 0 ? unrevealedCount : undefined,
    },
    {
      id: 'mood',
      label: 'Ánimo',
      icon: <HeartPulse className="w-5 h-5" />,
    },
    {
      id: 'memories',
      label: 'Recuerdos',
      icon: <BookHeart className="w-5 h-5" />,
      badge: couple.loveNotes.filter((n) => !n.isRead).length || undefined,
    },
  ];

  return (
    <nav className="bg-white border-t border-stone-200/80 px-2 py-1.5 flex items-center justify-around z-30 select-none shadow-lg">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all relative ${
              isActive
                ? 'text-rose-600 font-bold scale-105'
                : 'text-stone-400 hover:text-stone-600 font-medium'
            }`}
          >
            <div className="relative">
              {tab.icon}
              {tab.badge && tab.badge > 0 ? (
                <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
