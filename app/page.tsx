'use client';

import { useState, useEffect } from 'react';
import VotingForm from '@/components/VotingForm';
import ResultsChart from '@/components/ResultsChart';
import ResultsTable from '@/components/ResultsTable';
import { VotingOption } from '@/types/notion';

export default function Home() {
  const [view, setView] = useState<'vote' | 'results'>('vote');
  const [options, setOptions] = useState<VotingOption[]>([]);
  const [results, setResults] = useState<{
    options: Array<{
      id: string;
      option: string;
      votes: number;
      percentage: number;
    }>;
    totalVotes: number;
    lastUpdated: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'bar' | 'doughnut'>('bar');
  const [refreshing, setRefreshing] = useState(false);

  const fetchOptions = async () => {
    try {
      const response = await fetch('/api/options');
      const data = await response.json();
      if (data.success) {
        setOptions(data.options);
      }
    } catch (error) {
      console.error('Failed to fetch options:', error);
    }
  };

  const fetchResults = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/results');
      const data = await response.json();
      if (data.success) {
        setResults(data);
      }
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchOptions();
      await fetchResults();
      setLoading(false);
    };
    initialize();
  }, []);

  const handleVoteSuccess = () => {
    setView('results');
    fetchResults();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            AIクリエイターズ・スタジオ 8月テーマ
          </h1>
          <p className="text-gray-600">
            興味のあるテーマに投票してね！あなたの1票で僕の8月が決まります！
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {view === 'vote' ? (
            <>
              <VotingForm options={options} onVoteSuccess={handleVoteSuccess} />
              <div className="mt-6 text-center">
                <button
                  onClick={() => setView('results')}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  現在の投票結果を見る
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">投票結果</h2>
                <div className="flex gap-2">
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value as 'bar' | 'doughnut')}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="bar">棒グラフ</option>
                    <option value="doughnut">円グラフ</option>
                  </select>
                  <button
                    onClick={fetchResults}
                    disabled={refreshing}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {refreshing ? '更新中...' : '更新'}
                  </button>
                </div>
              </div>

              {results && (
                <>
                  <div className="mb-8">
                    <ResultsChart
                      options={results.options}
                      totalVotes={results.totalVotes}
                      chartType={chartType}
                    />
                  </div>

                  <div className="mb-6">
                    <ResultsTable
                      options={results.options}
                      totalVotes={results.totalVotes}
                    />
                  </div>

                  <div className="text-sm text-gray-500 text-center">
                    最終更新: {new Date(results.lastUpdated).toLocaleString('ja-JP')}
                  </div>
                </>
              )}

              <div className="mt-6 text-center">
                <button
                  onClick={() => setView('vote')}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  投票画面に戻る
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}