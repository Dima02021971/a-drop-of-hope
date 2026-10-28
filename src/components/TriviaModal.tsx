import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import { TriviaQuestion } from '../types/game';
import { sound } from '../audio/soundEngine';

interface TriviaModalProps {
  question: TriviaQuestion;
  onClose: () => void;
  onAnswerCorrect: () => void;
}

export const TriviaModal: React.FC<TriviaModalProps> = ({
  question,
  onClose,
  onAnswerCorrect
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const isCorrect = selectedIndex === question.correctIndex;

  const handleSubmit = (index: number) => {
    if (isSubmitted) return;
    setSelectedIndex(index);
    setIsSubmitted(true);

    if (index === question.correctIndex) {
      sound.playTriviaSuccess();
      setTimeout(() => {
        onAnswerCorrect();
      }, 1800);
    } else {
      sound.playTriviaIncorrect();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-sky-400/30 p-6 shadow-2xl flex flex-col text-left">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playButtonClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/15 flex items-center justify-center text-slate-300 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-400/20 text-amber-300 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            Clean Water Trivia Checkpoint
          </span>
        </div>

        {/* Question Text */}
        <h3 className="text-xl font-bold text-white mb-6 leading-snug">
          {question.question}
        </h3>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, idx) => {
            const isThisSelected = selectedIndex === idx;
            const isThisCorrect = idx === question.correctIndex;

            let buttonStyle = 'bg-white/5 border-white/15 hover:bg-white/10 text-white';

            if (isSubmitted) {
              if (isThisCorrect) {
                buttonStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/40';
              } else if (isThisSelected && !isThisCorrect) {
                buttonStyle = 'bg-rose-500/20 border-rose-400 text-rose-200';
              } else {
                buttonStyle = 'bg-white/5 border-white/10 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleSubmit(idx)}
                className={`w-full p-3.5 rounded-xl border text-sm font-medium transition-all text-left flex items-start gap-3 cursor-pointer ${buttonStyle}`}
              >
                <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1">{option}</span>
                {isSubmitted && isThisCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isSubmitted && isThisSelected && !isThisCorrect && (
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Result Explanation */}
        {isSubmitted && (
          <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
            isCorrect 
              ? 'bg-emerald-950/60 border-emerald-400/40 text-emerald-200' 
              : 'bg-amber-950/60 border-amber-400/40 text-amber-200'
          }`}>
            <div className="flex items-center gap-1.5 font-bold mb-1">
              {isCorrect ? (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Correct! Star Bonus Earned!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Good try! Here is how it works:</span>
                </>
              )}
            </div>
            <p className="mb-2">{question.explanation}</p>
            <div className="pt-2 border-t border-white/10 text-slate-300">
              <strong className="text-sky-300">Fun Fact:</strong> {question.funFact}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
