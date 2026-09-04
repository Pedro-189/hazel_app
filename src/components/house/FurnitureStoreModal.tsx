import React, { useState } from 'react';
import { useCouple } from '../../context/CoupleContext';
import { FurnitureCategory, FurnitureItem, RoomId } from '../../types/house';
import { X, Heart, Sparkles, Check, Plus, Lock, ShoppingBag, Box, Home } from 'lucide-react';
import { FurnitureVector } from './FurnitureVector';

interface FurnitureStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FurnitureStoreModal: React.FC<FurnitureStoreModalProps> = ({ isOpen, onClose }) => {
  const {
    house,
    couple,
    furnitureCatalog,
    buyFurniture,
    placeFurniture,
    unlockRoom,
    changeRoom,
  } = useCouple();

  const [activeTab, setActiveTab] = useState<'inventory' | 'shop' | 'rooms'>('shop');
  const [selectedCategory, setSelectedCategory] = useState<FurnitureCategory | 'all'>('all');

  if (!isOpen) return null;

  const categories: Array<{ id: FurnitureCategory | 'all'; label: string; icon: string }> = [
    { id: 'all', label: 'Todo', icon: '✨' },
    { id: 'walls', label: 'Paredes', icon: '🧱' },
    { id: 'seating', label: 'Asientos', icon: '🛋️' },
    { id: 'beds', label: 'Camas', icon: '🛏️' },
    { id: 'tables', label: 'Mesas', icon: '☕' },
    { id: 'plants', label: 'Plantas', icon: '🪴' },
    { id: 'lighting', label: 'Luces', icon: '💡' },
    { id: 'frames', label: 'Fotos', icon: '🖼️' },
    { id: 'pets', label: 'Mascotas', icon: '🐾' },
    { id: 'decor', label: 'Música & Relax', icon: '🎵' },
    { id: 'kitchenware', label: 'Cocina Dulce', icon: '🥞' },
  ];

  const inventoryItems = furnitureCatalog.filter((item) => house.inventory.includes(item.id));
  const shopItems = furnitureCatalog.filter((item) =>
    selectedCategory === 'all' ? true : item.category === selectedCategory
  );

  const handlePlaceFromInventory = (item: FurnitureItem) => {
    const defaultY = item.placementType === 'wall' ? 0 : 3;
    placeFurniture(item.id, 3, defaultY);
    onClose();
  };

  const handleBuyAndPlace = (item: FurnitureItem) => {
    const success = buyFurniture(item.id);
    if (success) {
      const defaultY = item.placementType === 'wall' ? 0 : 3;
      placeFurniture(item.id, 3, defaultY);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-stone-50 rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-rose-100 animate-in slide-in-from-bottom-5 duration-300">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-2xl bg-rose-500 text-white shadow-md shadow-rose-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-800">Decoración & Tienda</h3>
              <p className="text-xs text-stone-500">Construyan su nido de amor juntos</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Heart balance badge */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-white rounded-full border border-rose-200 shadow-sm text-rose-600 font-bold text-sm">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
              <span>{couple.loveCoins}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-stone-200/60 hover:bg-stone-300 text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex p-2 bg-stone-100/70 border-b border-stone-200 gap-1">
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'shop'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tienda de Muebles</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'inventory'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Mis Muebles ({inventoryItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'rooms'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Habitaciones</span>
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: SHOP */}
          {activeTab === 'shop' && (
            <>
              {/* Categories horizontal list */}
              <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1 transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-rose-50'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Grid of Furniture Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {shopItems.map((item) => {
                  const isOwned = house.inventory.includes(item.id);
                  const canAfford = couple.loveCoins >= item.price;

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      {/* Item Preview Illustration */}
                      <div className="h-24 w-full bg-stone-50 rounded-xl p-2 flex items-center justify-center mb-2 relative overflow-hidden border border-stone-100">
                        <FurnitureVector item={item} />
                        {isOwned && (
                          <span className="absolute top-1 right-1 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> Adquirido
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-stone-800 line-clamp-1">{item.name}</h4>
                        <p className="text-[10px] text-stone-500 line-clamp-2 mt-0.5 min-h-[26px]">
                          {item.description}
                        </p>
                      </div>

                      {/* Buy / Place Action Button */}
                      <div className="mt-3">
                        {isOwned ? (
                          <button
                            onClick={() => handlePlaceFromInventory(item)}
                            className="w-full py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-xs flex items-center justify-center space-x-1 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Colocar en Sala</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBuyAndPlace(item)}
                            disabled={!canAfford}
                            className={`w-full py-1.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-all ${
                              canAfford
                                ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-rose-200'
                                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            }`}
                          >
                            <Heart className="w-3.5 h-3.5 fill-current" />
                            <span>{item.price} ❤️ Comprar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* TAB 2: INVENTORY */}
          {activeTab === 'inventory' && (
            <div>
              {inventoryItems.length === 0 ? (
                <div className="text-center py-10">
                  <span className="text-4xl">📦</span>
                  <p className="text-sm font-bold text-stone-700 mt-2">Tu baúl está vacío</p>
                  <p className="text-xs text-stone-500 mt-1">
                    Gana corazones respondiendo preguntas y compra tus primeros muebles.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {inventoryItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-sm flex flex-col justify-between"
                    >
                      <div className="h-24 w-full bg-stone-50 rounded-xl p-2 flex items-center justify-center mb-2 border border-stone-100">
                        <FurnitureVector item={item} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-800 truncate">{item.name}</h4>
                        <p className="text-[10px] text-stone-500 truncate">{item.description}</p>
                      </div>
                      <button
                        onClick={() => handlePlaceFromInventory(item)}
                        className="mt-3 w-full py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1 shadow-sm transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Colocar en {house.rooms[house.currentRoomId]?.name.split(' ')[0]}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ROOMS EXPANSIONS */}
          {activeTab === 'rooms' && (
            <div className="space-y-3">
              {(Object.keys(house.rooms) as RoomId[]).map((rKey) => {
                const room = house.rooms[rKey];
                const canUnlock = couple.loveCoins >= room.unlockCost && couple.level >= room.levelRequired;

                return (
                  <div
                    key={room.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      room.unlocked
                        ? 'bg-white border-stone-200 shadow-sm'
                        : 'bg-stone-100/80 border-dashed border-stone-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl p-2 bg-stone-50 rounded-2xl border border-stone-100 shadow-inner">
                        {room.icon}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                          {room.name}
                          {room.unlocked && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                              Desbloqueada
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-stone-500 mt-0.5">{room.subtitle}</p>
                        {!room.unlocked && (
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-600 font-medium">
                            <span>Requiere Nivel {room.levelRequired}</span>
                            <span>•</span>
                            <span className="text-rose-600 font-bold">{room.unlockCost} ❤️</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      {room.unlocked ? (
                        <button
                          onClick={() => {
                            changeRoom(room.id);
                            onClose();
                          }}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-600 rounded-xl font-bold text-xs transition-colors"
                        >
                          Ir a la Sala
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (canUnlock) {
                              unlockRoom(room.id);
                            }
                          }}
                          disabled={!canUnlock}
                          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all ${
                            canUnlock
                              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200 active:scale-95'
                              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                          }`}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Desbloquear</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
