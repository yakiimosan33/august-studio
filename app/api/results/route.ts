import { NextResponse } from 'next/server';
import { getVotingOptions } from '@/lib/notion';
import { calculatePercentage } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const options = await getVotingOptions();
    
    // Filter only the 4 specified options
    const allowedOptions = [
      '続！バイブコーディング！',
      'AIショート動画制作チーム',
      'メルマガ制作AIチーム',
      'Difyでアプリ開発'
    ];
    
    const filteredOptions = options.filter(option => 
      allowedOptions.includes(option.option)
    );
    
    // Calculate total votes
    const totalVotes = filteredOptions.reduce((sum, option) => sum + option.votes, 0);
    
    // Add percentage to each option
    const optionsWithPercentage = filteredOptions.map(option => ({
      ...option,
      percentage: calculatePercentage(option.votes, totalVotes),
    }));
    
    return NextResponse.json({
      success: true,
      options: optionsWithPercentage,
      totalVotes,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Results API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}