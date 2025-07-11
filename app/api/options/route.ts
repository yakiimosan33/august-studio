import { NextResponse } from 'next/server';
import { getVotingOptions } from '@/lib/notion';

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
    
    return NextResponse.json({
      success: true,
      options: filteredOptions,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch options' },
      { status: 500 }
    );
  }
}