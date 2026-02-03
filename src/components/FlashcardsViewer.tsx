'use client';
import { useState, useEffect } from 'react';
import Papa from 'papaparse';

interface Flashcard {
  question: string;
  answer: string;
}

export function FlashcardsViewer({ src }: { src: string }) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(src)
      .then((res) => res.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            setCards(results.data as Flashcard[]);
            setLoading(false);
          },
        });
      });
  }, [src]);

  if (loading) {
    return (
      <div 
        className="text-center py-8 text-sm"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        加载中...
      </div>
    );
  }

  if (cards.length === 0) {
    return null;
  }

  const nextCard = () => {
    setCurrent((c) => (c + 1) % cards.length);
    setShowAnswer(false);
  };

  const prevCard = () => {
    setCurrent((c) => (c - 1 + cards.length) % cards.length);
    setShowAnswer(false);
  };

  return (
    <div className="my-12">
      <h3 
        className="text-sm font-medium uppercase tracking-wider mb-4"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        ☐ 问答卡片
      </h3>
      
      <div 
        className="border p-6 md:p-8"
        style={{ 
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-card-bg)'
        }}
      >
        {/* 进度指示 */}
        <div className="flex justify-between items-center mb-8">
          <span 
            className="text-xs"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            {current + 1} / {cards.length}
          </span>
          <div 
            className="w-48 h-1 overflow-hidden"
            style={{ backgroundColor: 'var(--color-border)' }}
          >
            <div 
              className="h-full transition-all duration-300"
              style={{ 
                width: `${((current + 1) / cards.length) * 100}%`,
                backgroundColor: 'var(--color-text-primary)'
              }}
            />
          </div>
        </div>

        {/* 问题 */}
        <div className="mb-8">
          <p 
            className="text-xs uppercase tracking-wider mb-2"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            问题
          </p>
          <p 
            className="text-lg md:text-xl font-medium"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {cards[current].question}
          </p>
        </div>

        {/* 答案（可展开） */}
        {showAnswer && (
          <div 
            className="mb-8 p-4 border-l-2"
            style={{ 
              borderColor: 'var(--color-text-primary)',
              backgroundColor: 'var(--color-bg-secondary)'
            }}
          >
            <p 
              className="text-xs uppercase tracking-wider mb-2"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              答案
            </p>
            <p 
              className="leading-relaxed"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {cards[current].answer}
            </p>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="btn-primary flex-1"
          >
            {showAnswer ? '隐藏答案' : '显示答案'}
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={prevCard}
              className="btn-outline px-4"
            >
              ←
            </button>
            <button
              onClick={nextCard}
              className="btn-outline px-4"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}