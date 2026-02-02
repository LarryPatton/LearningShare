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
    return <div className="text-center py-4">加载中...</div>;
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
    <div className="my-8">
      <h3 className="text-lg font-semibold mb-4">📝 问答卡片</h3>
      
      <div className="bg-white border-2 border-blue-200 rounded-lg shadow-lg p-6 md:p-8">
        {/* 进度指示 */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-gray-600">
            卡片 {current + 1} / {cards.length}
          </span>
          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((current + 1) / cards.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 问题 */}
        <div className="mb-6">
          <p className="text-sm text-blue-600 font-semibold mb-2">问题：</p>
          <p className="text-lg md:text-xl font-medium text-gray-800">
            {cards[current].question}
          </p>
        </div>

        {/* 答案（可展开） */}
        {showAnswer && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
            <p className="text-sm text-green-700 font-semibold mb-2">答案：</p>
            <p className="text-gray-800 leading-relaxed">{cards[current].answer}</p>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {showAnswer ? '隐藏答案' : '显示答案'}
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={prevCard}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              ← 上一题
            </button>
            <button
              onClick={nextCard}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              下一题 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
