import { NextRequest, NextResponse } from 'next/server';
import { castVote, checkIfVoted } from '@/lib/notion';
import { getClientIp, generateVoterId } from '@/lib/utils';
import { VoteRequest } from '@/types/notion';

export async function POST(request: NextRequest) {
  try {
    const body: VoteRequest = await request.json();
    const { optionId } = body;
    
    if (!optionId) {
      return NextResponse.json(
        { success: false, message: 'Option ID is required' },
        { status: 400 }
      );
    }
    
    // Get voter ID from cookie or generate new one
    const cookieVoterId = request.cookies.get('voterId')?.value;
    const ip = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const generatedVoterId = generateVoterId(ip, userAgent);
    
    // Use cookie voter ID if exists, otherwise use generated one
    const voterId = cookieVoterId || generatedVoterId;
    
    // Check if already voted
    const hasVoted = await checkIfVoted(voterId);
    if (hasVoted) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'すでに投票済みです。投票は1回のみ可能です。',
          voterId 
        },
        { status: 403 }
      );
    }
    
    // Cast vote
    const voteSuccess = await castVote(optionId, voterId);
    
    if (!voteSuccess) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'すでに投票済みです。投票は1回のみ可能です。',
          voterId 
        },
        { status: 403 }
      );
    }
    
    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      message: '投票ありがとうございました！',
      voterId,
    });
    
    // Set cookie if not already set
    if (!cookieVoterId) {
      response.cookies.set('voterId', voterId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }
    
    return response;
  } catch (error) {
    console.error('Vote API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process vote' },
      { status: 500 }
    );
  }
}