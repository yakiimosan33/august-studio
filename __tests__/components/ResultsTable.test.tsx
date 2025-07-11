import { render, screen } from '@testing-library/react';
import ResultsTable from '@/components/ResultsTable';

describe('ResultsTable', () => {
  const mockOptions = [
    { id: '1', option: '続！バイブコーディング！', votes: 10, percentage: 40 },
    { id: '2', option: 'AIショート動画制作チーム', votes: 5, percentage: 20 },
    { id: '3', option: 'メルマガ制作AIチーム', votes: 8, percentage: 32 },
    { id: '4', option: 'Difyでアプリ開発', votes: 2, percentage: 8 },
  ];

  const totalVotes = 25;

  it('renders all options with correct data', () => {
    render(<ResultsTable options={mockOptions} totalVotes={totalVotes} />);

    // Check headers
    expect(screen.getByText('選択肢')).toBeInTheDocument();
    expect(screen.getByText('投票数')).toBeInTheDocument();
    expect(screen.getByText('割合')).toBeInTheDocument();

    // Check each option
    mockOptions.forEach(option => {
      expect(screen.getByText(option.option)).toBeInTheDocument();
      expect(screen.getByText(`${option.votes}票`)).toBeInTheDocument();
      expect(screen.getByText(`${option.percentage}%`)).toBeInTheDocument();
    });

    // Check total
    expect(screen.getByText('合計')).toBeInTheDocument();
    expect(screen.getByText(`${totalVotes}票`)).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('renders correctly with zero votes', () => {
    const emptyOptions = mockOptions.map(opt => ({ ...opt, votes: 0, percentage: 0 }));
    
    render(<ResultsTable options={emptyOptions} totalVotes={0} />);

    // Check that all zero vote cells are present
    const zeroVoteCells = screen.getAllByText('0票');
    expect(zeroVoteCells).toHaveLength(5); // 4 options + 1 total
    
    const zeroPercentCells = screen.getAllByText('0%');
    expect(zeroPercentCells).toHaveLength(4); // 4 options (total shows 100%)
  });
});