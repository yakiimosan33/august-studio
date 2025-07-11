export interface VotingOption {
  id: string;
  option: string;
  votes: number;
  voterIds: string[];
}

export interface NotionPageProperty {
  id: string;
  properties: {
    Option: {
      title: Array<{
        text: {
          content: string;
        };
      }>;
    };
    Votes: {
      number: number;
    };
    VoterIDs: {
      rich_text: Array<{
        text: {
          content: string;
        };
      }>;
    };
  };
}

export interface VoteRequest {
  optionId: string;
  voterId?: string;
}

export interface VoteResponse {
  success: boolean;
  message: string;
  voterId?: string;
}

export interface ResultsResponse {
  options: VotingOption[];
  totalVotes: number;
  lastUpdated: string;
}