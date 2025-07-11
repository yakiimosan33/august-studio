import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VotingForm from '@/components/VotingForm';
import { VotingOption } from '@/types/notion';

// Mock fetch
global.fetch = jest.fn();

describe('VotingForm', () => {
  const mockOptions: VotingOption[] = [
    { id: '1', option: '続！バイブコーディング！', votes: 10, voterIds: [] },
    { id: '2', option: 'AIショート動画制作チーム', votes: 5, voterIds: [] },
    { id: '3', option: 'メルマガ制作AIチーム', votes: 8, voterIds: [] },
    { id: '4', option: 'Difyでアプリ開発', votes: 3, voterIds: [] },
  ];

  const mockOnVoteSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all voting options', () => {
    render(<VotingForm options={mockOptions} onVoteSuccess={mockOnVoteSuccess} />);
    
    mockOptions.forEach(option => {
      expect(screen.getByText(option.option)).toBeInTheDocument();
    });
  });

  it('submits vote successfully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: '投票ありがとうございました！' }),
    });

    render(<VotingForm options={mockOptions} onVoteSuccess={mockOnVoteSuccess} />);
    
    const firstOption = screen.getByLabelText('続！バイブコーディング！');
    fireEvent.click(firstOption);
    
    const submitButton = screen.getByText('投票する');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId: '1' }),
      });
      expect(mockOnVoteSuccess).toHaveBeenCalled();
    });
  });

  it('shows error message on duplicate vote', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ 
        success: false, 
        message: 'すでに投票済みです。投票は1回のみ可能です。' 
      }),
    });

    render(<VotingForm options={mockOptions} onVoteSuccess={mockOnVoteSuccess} />);
    
    const firstOption = screen.getByLabelText('続！バイブコーディング！');
    fireEvent.click(firstOption);
    
    const submitButton = screen.getByText('投票する');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('すでに投票済みです。投票は1回のみ可能です。')).toBeInTheDocument();
      expect(mockOnVoteSuccess).not.toHaveBeenCalled();
    });
  });
});