import React from 'react';
import { TopBar } from './TopBar';
import { BottomNav, TabType } from './BottomNav';
import { FloatingEffectsOverlay } from './FloatingEffectsOverlay';

interface MobileFrameProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  activeTab,
  onChangeTab,
  children,
}) => {
  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center sm:p-4 md:p-6 select-none">
      {/* Mobile Shell Frame */}
      <div className="w-full max-w-md h-[100dvh] sm:h-[880px] sm:max-h-[95vh] bg-stone-50 sm:rounded-[42px] sm:border-[10px] sm:border-stone-800 shadow-2xl flex flex-col overflow-hidden relative sm:ring-1 sm:ring-stone-700">
        {/* Simulated iOS Dynamic Island / Notch on Desktop */}
        <div className="hidden sm:flex justify-center pt-2 bg-white relative z-30">
          <div className="w-24 h-4 bg-stone-900 rounded-full" />
        </div>

        {/* Top Header */}
        <TopBar />

        {/* Dynamic Content View */}
        <main className="flex-1 overflow-hidden relative flex flex-col">
          {children}
        </main>

        {/* Bottom Tab Bar */}
        <BottomNav activeTab={activeTab} onChangeTab={onChangeTab} />

        {/* Floating Effects & Notifications */}
        <FloatingEffectsOverlay />
      </div>
    </div>
  );
};
