import { NextResponse } from 'next/server';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Generate a secret key
    const secret = speakeasy.generateSecret({
      name: `Sidemen Security (${email})`,
      issuer: 'Sidemen Security'
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || '');

    // In a real application, you would save the secret.base32 to your database
    // associated with the user's account
    
    return NextResponse.json({
      success: true,
      secret: secret.base32,
      qrCode: qrCodeUrl
    });
  } catch (error) {
    console.error('Error setting up 2FA:', error);
    return NextResponse.json(
      { 
        error: 'Failed to setup 2FA',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 