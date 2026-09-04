import React, { useState } from 'react';
import { useCouple } from '../../context/CoupleContext';
import { Question } from '../../types/qa';
import { generateInfiniteQuestion } from '../../utils/questionGenerator';
import { X, Sparkles, RefreshCw, Heart, Send, Check } from 'lucide-react';
import { sound } from '../../utils/audio';

interface InfiniteQuestionGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAnswer: (question: Question) => void;
}

const GENERATOR_THEMES: Array<{
  key: 'romance' | 'spicy' | 'future' | 'deep' | 'fun';
  label: string;
  emoji: string;
  color: string;
}> = [
  { key: 'romance', label: 'Amor & Ternura', emoji: '💖', color: '#FF6B8B' },
  { key: 'spicy', label: 'Química Picante', emoji: '🌶️', color: '#E63946' },
  { key: 'future', label: 'Sueños & Casa', emoji: '🌌', color: '#8AADF4' },
  { key: 'deep', label: 'Reflexión Profunda', emoji: '🧠', color: '#C6A0F6' },
  { key: 'fun', label: 'Risas & Locuras', emoji: '🎭', color: '#A6DA95' },
];

export const InfiniteQuestionGeneratorModal: React.FC<InfiniteQuestionGeneratorModalProps> = ({
  isOpen,
  onClose,
  onOpenAnswer,
}) => {
  const { createCustomQuestion } = useCouple();
  const [selectedTheme, setSelectedTheme] = useState<'romance' | 'spicy' | 'future' | 'deep' | 'fun'>('romance');
  const [generatedQuestion, setGeneratedQuestion] = useState<Question>(() =>
    generateInfiniteQuestion('romance')
  );
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerateNew = (theme = selectedTheme) => {
    sound.playPop();
    setIsGenerating(true);
    setTimeout(() => {
      sound.playReveal();
      const newQ = generateInfiniteQuestion(theme);
      setGeneratedQuestion(newQ);
      setIsGenerating(false);
    }, 300);
  };

  const handleSelectTheme = (theme: 'romance' | 'spicy' | 'future' | 'deep' | 'fun') => {
    setSelectedTheme(theme);
    handleGenerateNew(theme);
  };

  const handleAcceptAndAnswer = () => {
    sound.playHeartCollect();
    // Add to custom questions deck
    createCustomQuestion(generatedQuestion.title, generatedQuestion.prompt, generatedQuestion.category);
    onClose();
    onOpenAnswer(generatedQuestion);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-rose-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-600 text-lg">✨</span>
            <div>
              <h3 className="text-sm font-bold text-stone-800">Generador Infinito de Preguntas</h3>
              <p className="text-[11px] text-stone-500">Crea preguntas ilimitadas con chispa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Pills */}
        <div className="mt-3">
          <span className="text-[11px] font-bold text-stone-600 block mb-1.5">Elige el tono:</span>
          <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-1">
            {GENERATOR_THEMES.map((theme) => (
              <button
                key={theme.key}
                type="button"
                onClick={() => handleSelectTheme(theme.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1 flex-shrink-0 transition-all ${
                  selectedTheme === theme.key
                    ? 'bg-purple-600 text-white shadow-sm scale-105'
                    : 'bg-stone-100 text-stone-600 hover:bg-purple-50'
                }`}
              >
                <span>{theme.emoji}</span>
                <span>{theme.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Generated Question Card */}
        <div className="my-4 bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 rounded-2xl p-4 border border-purple-100 shadow-inner relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1">
              <span>{generatedQuestion.categoryEmoji}</span>
              <span>{generatedQuestion.categoryLabel}</span>
            </span>
            <span className="text-xs font-bold text-rose-600 bg-white px-2 py-0.5 rounded-full shadow-xs">
              +35 ❤️
            </span>
          </div>

          <h4 className="text-xs font-bold text-stone-800 mb-1">{generatedQuestion.title}</h4>
          <p
            className={`text-xs text-stone-700 leading-relaxed italic font-serif transition-opacity duration-200 ${
              isGenerating ? 'opacity-30' : 'opacity-100'
            }`}
          >
            "{generatedQuestion.prompt}"
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleGenerateNew()}
            disabled={isGenerating}
            className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Generar Otra Pregunta Diferente</span>
          </button>

          <button
            type="button"
            onClick={handleAcceptAndAnswer}
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-xs shadow-md shadow-purple-200 flex items-center justify-center space-x-1.5 transition-transform active:scale-98"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Usar Esta Pregunta y Responder</span>
          </button>
        </div>
      </div>
    </div>
  );
};
