'use client';

import { useState } from 'react';
import { VotingOption } from '@/types/notion';

interface VotingFormProps {
  options: VotingOption[];
  onVoteSuccess: () => void;
}

export default function VotingForm({ options, onVoteSuccess }: VotingFormProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOption) {
      setError('選択肢を選んでください');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ optionId: selectedOption }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || '投票に失敗しました');
        return;
      }

      onVoteSuccess();
    } catch {
      setError('ネットワークエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all"
          >
            <input
              type="radio"
              name="voting-option"
              value={option.id}
              checked={selectedOption === option.id}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <span className="ml-3 text-lg text-gray-900 font-medium">{option.option}</span>
          </label>
        ))}
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!selectedOption || isSubmitting}
        className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? '投票中...' : '投票する'}
      </button>

      <p className="text-sm text-gray-500 text-center">
        ※ 投票は1回のみ有効です
      </p>
    </form>
  );
}