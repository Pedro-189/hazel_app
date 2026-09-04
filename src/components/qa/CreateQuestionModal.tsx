import React, { useState } from 'react';
import { useCouple } from '../../context/CoupleContext';
import { X, Sparkles, Send } from 'lucide-react';

interface CreateQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateQuestionModal: React.FC<CreateQuestionModalProps> = ({ isOpen, onClose }) => {
  const { createCustomQuestion } = useCouple();
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !prompt.trim()) return;

    createCustomQuestion(title.trim(), prompt.trim(), 'custom');
    setTitle('');
    setPrompt('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-rose-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-pink-100 text-pink-600 text-lg">💌</span>
            <div>
              <h3 className="text-sm font-bold text-stone-800">Crear Pregunta Íntima</h3>
              <p className="text-[11px] text-stone-500">Para conocer aún más a tu amor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="text-[11px] font-bold text-stone-600 block mb-1">
              Título corto de la pregunta:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Nuestra próxima escapada, Una fantasía..."
              className="w-full px-3.5 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 font-bold"
              maxLength={40}
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-stone-600 block mb-1">
              La pregunta para tu pareja:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="¿Qué te gustaría preguntarle en privado? Ambos responderán a ciegas."
              rows={3}
              className="w-full p-3 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none leading-relaxed"
              maxLength={180}
              required
            />
          </div>

          <div className="p-2.5 bg-rose-50 rounded-xl flex items-center space-x-2 text-[11px] text-rose-700 font-medium">
            <Sparkles className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>Ganarán +35 ❤️ cuando ambos la hayan respondido.</span>
          </div>

          <div className="pt-2 flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !prompt.trim()}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 shadow-md shadow-rose-200 transition-all flex items-center justify-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Lanzar Pregunta</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
