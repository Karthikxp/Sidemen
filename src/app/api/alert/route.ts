import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { deviceName, deviceIP, deviceMAC, userEmail } = await request.json();
    console.log('Alert request data:', { deviceName, deviceIP, deviceMAC, userEmail });

    // Create test account for demo purposes
    const testAccount = await nodemailer.createTestAccount();
    console.log('Created test account:', testAccount);

    // Create reusable transporter
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
      debug: true, // Enable debug mode
    });

    // Verify transporter
    await transporter.verify();
    console.log('Transporter verified');

    // Send mail
    const info = await transporter.sendMail({
      from: `"Sidemen Security" <${testAccount.user}>`,
      to: userEmail,
      subject: "⚠️ Security Alert: Suspicious Activity Detected",
      text: `Security Alert!\n\nSuspicious activity has been detected on your network.\n\nDevice Details:\nName: ${deviceName}\nIP Address: ${deviceIP}\nMAC Address: ${deviceMAC}\n\nPlease take immediate action to secure your network.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626; margin-bottom: 20px;">⚠️ Security Alert</h1>
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
            Suspicious activity has been detected on your network.
          </p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1f2937; margin-bottom: 15px;">Device Details</h2>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${deviceName}</p>
            <p style="margin: 5px 0;"><strong>IP Address:</strong> ${deviceIP}</p>
            <p style="margin: 5px 0;"><strong>MAC Address:</strong> ${deviceMAC}</p>
          </div>
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
            Please take immediate action to secure your network.
          </p>
          <div style="font-size: 14px; color: #6b7280; margin-top: 30px;">
            <p>This is an automated message from Sidemen Security.</p>
            <p>Do not reply to this email.</p>
          </div>
        </div>
      `
    });

    console.log('Email sent successfully:', info);

    return NextResponse.json({ 
      message: 'Alert sent successfully',
      previewUrl: nodemailer.getTestMessageUrl(info)
    });

  } catch (error) {
    console.error('Detailed error sending alert:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send alert',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 