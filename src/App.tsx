import React, { useState } from 'react';
import { CoupleProvider, useCouple } from './context/CoupleContext';
import { MobileFrame } from './components/layout/MobileFrame';
import { TabType } from './components/layout/BottomNav';
import { RoomCanvas } from './components/house/RoomCanvas';
import { FurnitureStoreModal } from './components/house/FurnitureStoreModal';
import { PhotoUploadModal } from './components/house/PhotoUploadModal';
import { HouseActivityDrawer } from './components/house/HouseActivityDrawer';
import { QAScreen } from './components/qa/QAScreen';
import { MoodScreen } from './components/mood/MoodScreen';
import { MemoryScreen } from './components/memory/MemoryScreen';
import { AuthScreen } from './components/auth/AuthScreen';

import { RoomThemeModal } from './components/house/RoomThemeModal';

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

      {activeTab === 'qa' && <QAScreen />}

      {activeTab === 'mood' && <MoodScreen />}

      {activeTab === 'memories' && <MemoryScreen />}

      {/* House Modals */}
      <FurnitureStoreModal
        isOpen={isStoreOpen}
        onClose={() => setIsStoreOpen(false)}
      />

      <RoomThemeModal
        isOpen={isThemeOpen}
        onClose={() => setIsThemeOpen(false)}
      />

      <PhotoUploadModal
        placedId={photoFramePlacedId}
        onClose={() => setPhotoFramePlacedId(null)}
      />

      <HouseActivityDrawer
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
      />
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
