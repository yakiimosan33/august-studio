// Mock environment variables first
const mockEnv = {
  NOTION_TOKEN: 'test-token',
  DATABASE_ID: 'test-db-id',
};

Object.assign(process.env, mockEnv);

// Mock the notion module
jest.mock('@/lib/notion', () => ({
  getVotingOptions: jest.fn(),
}));

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((data, init) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
    })),
  },
}));

import { GET } from '@/app/api/options/route';
import { getVotingOptions } from '@/lib/notion';

describe('/api/options', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns filtered options successfully', async () => {
    const mockOptions = [
      { id: '1', option: '続！バイブコーディング！', votes: 10, voterIds: [] },
      { id: '2', option: 'AIショート動画制作チーム', votes: 5, voterIds: [] },
      { id: '3', option: 'メルマガ制作AIチーム', votes: 8, voterIds: [] },
      { id: '4', option: 'Difyでアプリ開発', votes: 3, voterIds: [] },
      { id: '5', option: 'その他のオプション', votes: 2, voterIds: [] }, // Should be filtered out
    ];

    (getVotingOptions as jest.Mock).mockResolvedValue(mockOptions);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.options).toHaveLength(4);
    expect(data.options.find((opt: any) => opt.option === 'その他のオプション')).toBeUndefined();
  });

  it('handles errors gracefully', async () => {
    (getVotingOptions as jest.Mock).mockRejectedValue(new Error('Notion API error'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Failed to fetch options');
  });
});