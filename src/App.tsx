import React, { useState, Suspense, lazy } from 'react';
import { CoupleProvider, useCouple } from './context/CoupleContext';
import { MobileFrame } from './components/layout/MobileFrame';
import { TabType } from './components/layout/BottomNav';
import { RoomCanvas } from './components/house/RoomCanvas';
import { AuthScreen } from './components/auth/AuthScreen';

// Lazy-loaded secondary screens & modals to minimize initial bundle size and boost mobile load speed
const QAScreen = lazy(() => import('./components/qa/QAScreen').then(m => ({ default: m.QAScreen })));
const MoodScreen = lazy(() => import('./components/mood/MoodScreen').then(m => ({ default: m.MoodScreen })));
const MemoryScreen = lazy(() => import('./components/memory/MemoryScreen').then(m => ({ default: m.MemoryScreen })));
const FurnitureStoreModal = lazy(() => import('./components/house/FurnitureStoreModal').then(m => ({ default: m.FurnitureStoreModal })));
const RoomThemeModal = lazy(() => import('./components/house/RoomThemeModal').then(m => ({ default: m.RoomThemeModal })));
const PhotoUploadModal = lazy(() => import('./components/house/PhotoUploadModal').then(m => ({ default: m.PhotoUploadModal })));
const HouseActivityDrawer = lazy(() => import('./components/house/HouseActivityDrawer').then(m => ({ default: m.HouseActivityDrawer })));

const ScreenLoadingFallback: React.FC = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-3">
    <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-xl animate-pulse">
      ✨
    </div>
    <span className="text-xs font-bold text-stone-400">Cargando con amor...</span>
  </div>
);

const MainContent: React.FC = () => {
  const { currentUser, pairing } = useCouple();
  const [activeTab, setActiveTab] = useState<TabType>('house');
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [photoFramePlacedId, setPhotoFramePlacedId] = useState<string | null>(null);
  const [isActivityOpen, setIsActivityOpen] = useState(false);

  // If user is not logged in or not linked, show Auth Screen
  if (!currentUser || !pairing.isLinked) {
    return <AuthScreen />;
  }

  return (
    <MobileFrame activeTab={activeTab} onChangeTab={setActiveTab}>
      {activeTab === 'house' && (
        <RoomCanvas
          onOpenStore={() => setIsStoreOpen(true)}
          onOpenPhotoModal={(placedId) => setPhotoFramePlacedId(placedId)}
          onOpenActivity={() => setIsActivityOpen(true)}
          onOpenThemeModal={() => setIsThemeOpen(true)}
        />
      )}

      <Suspense fallback={<ScreenLoadingFallback />}>
        {activeTab === 'qa' && <QAScreen />}
        {activeTab === 'mood' && <MoodScreen />}
        {activeTab === 'memories' && <MemoryScreen />}

        {/* House Modals (only loaded into memory when opened) */}
        {isStoreOpen && (
          <FurnitureStoreModal
            isOpen={isStoreOpen}
            onClose={() => setIsStoreOpen(false)}
          />
        )}

        {isThemeOpen && (
          <RoomThemeModal
            isOpen={isThemeOpen}
            onClose={() => setIsThemeOpen(false)}
          />
        )}

        {photoFramePlacedId && (
          <PhotoUploadModal
            placedId={photoFramePlacedId}
            onClose={() => setPhotoFramePlacedId(null)}
          />
        )}

        {isActivityOpen && (
          <HouseActivityDrawer
            isOpen={isActivityOpen}
            onClose={() => setIsActivityOpen(false)}
          />
        )}
      </Suspense>
    </MobileFrame>
  );
};

export default function App() {
  return (
    <CoupleProvider>
      <MainContent />
    </CoupleProvider>
  );
}
