import { VotingOption } from '@/types/notion';

export const mockOptions: VotingOption[] = [
  {
    id: 'mock-1',
    option: '続！バイブコーディング！',
    votes: 12,
    voterIds: ['voter1', 'voter2', 'voter3'],
  },
  {
    id: 'mock-2',
    option: 'AIショート動画制作チーム',
    votes: 8,
    voterIds: ['voter4', 'voter5'],
  },
  {
    id: 'mock-3',
    option: 'メルマガ制作AIチーム',
    votes: 15,
    voterIds: ['voter6', 'voter7', 'voter8'],
  },
  {
    id: 'mock-4',
    option: 'Difyでアプリ開発',
    votes: 5,
    voterIds: ['voter9'],
  },
];

// In-memory storage for mock votes
export let mockVotingData = [...mockOptions];

export function resetMockData() {
  mockVotingData = [...mockOptions];
}