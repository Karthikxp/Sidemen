import { NextResponse } from 'next/server';
import speakeasy from 'speakeasy';

export async function POST(request: Request) {
  try {
    const { token, secret } = await request.json();

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 1 // Allow 30 seconds clock skew
    });

    if (!verified) {
      return NextResponse.json(
        { error: 'Invalid 2FA token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '2FA verification successful'
    });
  } catch (error) {
    console.error('Error verifying 2FA:', error);
    return NextResponse.json(
      { 
        error: 'Failed to verify 2FA',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 