import { NextResponse } from 'next/server';

interface Device {
  id: string;
  name: string;
  ip: string;
  mac: string;
  status: string;
  lastActive: string;
  type: string;
  manufacturer: string;
  risk: string;
}

export async function POST(request: Request) {
  try {
    console.log('Received update request');
    const { deviceId, status, risk, device: inputDevice } = await request.json();
    console.log('Update params:', { deviceId, status, risk, inputDevice });

    if (!inputDevice) {
      console.error('No device data provided:', deviceId);
      return NextResponse.json(
        { error: 'Device not found' },
        { status: 404 }
      );
    }

    // Create updated device
    const updatedDevice: Device = {
      ...inputDevice,
      status,
      risk,
      lastActive: new Date().toISOString()
    };

    console.log('Updated device:', updatedDevice);

    return NextResponse.json({ 
      success: true,
      device: updatedDevice
    });
  } catch (error) {
    console.error('Detailed error updating device:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update device status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 