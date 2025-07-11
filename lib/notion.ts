import { Client } from '@notionhq/client';
import type { NotionPageProperty, VotingOption } from '@/types/notion';
import { mockVotingData } from './mockData';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.DATABASE_ID;
const IS_MOCK_MODE = !NOTION_TOKEN || NOTION_TOKEN === 'build-time-token';

if (process.env.NODE_ENV === 'production' && IS_MOCK_MODE) {
  throw new Error('Missing required environment variables: NOTION_TOKEN and DATABASE_ID');
}

const notion = IS_MOCK_MODE ? null : new Client({
  auth: NOTION_TOKEN,
});

export async function getVotingOptions(): Promise<VotingOption[]> {
  if (IS_MOCK_MODE) {
    console.log('🎭 Using mock data for voting options');
    return mockVotingData;
  }

  try {
    const response = await notion!.databases.query({
      database_id: DATABASE_ID!,
      sorts: [
        {
          property: 'Option',
          direction: 'ascending',
        },
      ],
    });

    const options: VotingOption[] = response.results.map((page) => {
      const p = page as unknown as NotionPageProperty;
      const option = p.properties.Option.title[0]?.text.content || '';
      const votes = p.properties.Votes.number || 0;
      const voterIdsText = p.properties.VoterIDs.rich_text[0]?.text.content || '';
      const voterIds = voterIdsText ? voterIdsText.split(',').filter(id => id.trim()) : [];

      return {
        id: p.id,
        option,
        votes,
        voterIds,
      };
    });

    return options;
  } catch (error) {
    console.error('Error fetching voting options:', error);
    throw new Error('Failed to fetch voting options');
  }
}

export async function castVote(optionId: string, voterId: string): Promise<boolean> {
  if (IS_MOCK_MODE) {
    console.log(`🎭 Mock voting: ${optionId} by ${voterId}`);
    
    const option = mockVotingData.find(opt => opt.id === optionId);
    if (!option) return false;
    
    // Check if user has already voted
    if (option.voterIds.includes(voterId)) {
      return false;
    }
    
    // Update vote count and voter list
    option.votes += 1;
    option.voterIds.push(voterId);
    
    return true;
  }

  try {
    // First, get the current page data
    const page = await notion!.pages.retrieve({ page_id: optionId }) as unknown as NotionPageProperty;
    
    const currentVotes = page.properties.Votes.number || 0;
    const currentVoterIds = page.properties.VoterIDs.rich_text[0]?.text.content || '';
    const voterIdsList = currentVoterIds ? currentVoterIds.split(',').filter(id => id.trim()) : [];

    // Check if user has already voted
    if (voterIdsList.includes(voterId)) {
      return false;
    }

    // Update the vote count and voter IDs
    const updatedVoterIds = [...voterIdsList, voterId].join(',');

    await notion!.pages.update({
      page_id: optionId,
      properties: {
        Votes: {
          number: currentVotes + 1,
        },
        VoterIDs: {
          rich_text: [
            {
              text: {
                content: updatedVoterIds,
              },
            },
          ],
        },
      },
    });

    return true;
  } catch (error) {
    console.error('Error casting vote:', error);
    throw new Error('Failed to cast vote');
  }
}

export async function checkIfVoted(voterId: string): Promise<boolean> {
  if (IS_MOCK_MODE) {
    return mockVotingData.some(option => option.voterIds.includes(voterId));
  }

  try {
    const options = await getVotingOptions();
    return options.some(option => option.voterIds.includes(voterId));
  } catch (error) {
    console.error('Error checking vote status:', error);
    return false;
  }
}