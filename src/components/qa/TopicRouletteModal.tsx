import React, { useState } from 'react';
import { useCouple } from '../../context/CoupleContext';
import { Question, QuestionCategory } from '../../types/qa';
import { X, Dices, Sparkles, Heart, Flame, ChevronRight, Lock } from 'lucide-react';
import { sound } from '../../utils/audio';

interface TopicRouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuestion: (question: Question) => void;
}

const TOPICS: Array<{
  id: QuestionCategory;
  label: string;
  emoji: string;
  description: string;
  color: string;
  gradient: string;
}> = [
  {
    id: 'intimacy',
    label: 'Amor & Vínculo',
    emoji: '💖',
    description: 'Gestos, detalles y la magia de lo que sentimos',
    color: '#FF6B8B',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    id: 'spicy',
    label: 'Química & Pasión',
    emoji: '🌶️',
    description: 'Deseos, caricias y secretos atrevidos',
    color: '#E63946',
    gradient: 'from-red-500 to-rose-600',
  },
  {
    id: 'dreams',
    label: 'Sueños & Futuro',
    emoji: '🌌',
    description: 'Nuestra casa, viajes y planes cuando vivamos juntos',
    color: '#8AADF4',
    gradient: 'from-sky-500 to-indigo-500',
  },
  {
    id: 'memories',
    label: 'Recuerdos & Infancia',
    emoji: '🧸',
    description: 'Anécdotas del pasado, primeras citas e infancia',
    color: '#F5A97F',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    id: 'deep',
    label: 'Profundas & Alma',
    emoji: '🧠',
    description: 'Vulnerabilidad, miedos, crecimiento y valores',
    color: '#C6A0F6',
    gradient: 'from-purple-500 to-violet-600',
  },
  {
    id: 'fun',
    label: 'Divertidas & Risas',
    emoji: '🎭',
    description: 'Dilemas locos, bromas y situaciones cómicas',
    color: '#A6DA95',
    gradient: 'from-emerald-500 to-teal-500',
  },
];

export const TopicRouletteModal: React.FC<TopicRouletteModalProps> = ({
  isOpen,
  onClose,
  onSelectQuestion,
}) => {
  const { allQuestions, qa } = useCouple();
  const [spinningTopic, setSpinningTopic] = useState<QuestionCategory | null>(null);

  if (!isOpen) return null;

  const handlePickTopic = (topicId: QuestionCategory) => {
    sound.playPop();
    setSpinningTopic(topicId);

    // Filter questions by selected topic
    const categoryQuestions = allQuestions.filter((q) => q.category === topicId);
    // Prefer questions not yet revealed
    const unrevealed = categoryQuestions.filter((q) => !qa.records[q.id]?.isRevealed);
    const pool = unrevealed.length > 0 ? unrevealed : categoryQuestions;

    setTimeout(() => {
      sound.playReveal();
      const randomQ = pool[Math.floor(Math.random() * pool.length)] || categoryQuestions[0];
      setSpinningTopic(null);
      onClose();
      onSelectQuestion(randomQ);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-stone-50 rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-rose-100 animate-in slide-in-from-bottom-5 duration-300">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-200 animate-bounce">
              <Dices className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-800">Elige un Tema de Juego</h3>
              <p className="text-xs text-stone-500">Saldrá una pregunta al azar para desafiar a tu pareja</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list of topics */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TOPICS.map((topic) => {
              const count = allQuestions.filter((q) => q.category === topic.id).length;
              const isSpinning = spinningTopic === topic.id;

              return (
                <button
                  key={topic.id}
                  onClick={() => handlePickTopic(topic.id)}
                  disabled={spinningTopic !== null}
                  className={`p-4 rounded-3xl border text-left transition-all relative overflow-hidden group shadow-xs hover:shadow-md flex flex-col justify-between ${
                    isSpinning
                      ? 'ring-4 ring-rose-400 scale-98 bg-rose-50'
                      : 'bg-white border-stone-200/80 hover:border-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl p-2 bg-stone-50 rounded-2xl border border-stone-100 group-hover:scale-110 transition-transform">
                      {topic.emoji}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                      {count} preguntas
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-stone-800 flex items-center gap-1">
                      {topic.label}
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-rose-500">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {isSpinning ? 'Girando ruleta...' : 'Girar Pregunta'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
