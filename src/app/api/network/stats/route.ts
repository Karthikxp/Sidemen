import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

// Keep track of last measurement for rate calculation
let lastMeasurement = {
    time: Date.now(),
    bytesIn: 0,
    bytesOut: 0
};

function calculateRate(current: number, previous: number, timeDiff: number): number {
    // Handle counter rollover and invalid values
    if (current < previous || timeDiff <= 0 || previous < 0 || current < 0) {
        return 0;
    }
    
    // Calculate bytes per second and convert to Mbps
    const bytesPerSecond = (current - previous) / timeDiff;
    const mbps = (bytesPerSecond * 8) / 1000000;
    
    // Cap at realistic values (1 Gbps max)
    return Math.min(mbps, 1000);
}

export async function GET() {
    try {
        // Get current bandwidth usage (only works on macOS)
        const { stdout: bandwidth } = await execPromise('netstat -I en0 -b | tail -n 1');
        
        // Get system uptime
        const { stdout: uptime } = await execPromise('uptime');
        
        // Get connected devices count using arp
        const { stdout: arpOutput } = await execPromise('arp -a | wc -l');
        
        // Parse the outputs
        const connectedDevices = parseInt(arpOutput.trim());
        
        // Parse bandwidth with rate calculation
        const bandwidthParts = bandwidth.trim().split(/\s+/);
        const currentBytesIn = parseInt(bandwidthParts[6]);
        const currentBytesOut = parseInt(bandwidthParts[9]);
        const currentTime = Date.now();
        const timeDiff = (currentTime - lastMeasurement.time) / 1000;

        // Calculate rates using the helper function
        const inRate = calculateRate(currentBytesIn, lastMeasurement.bytesIn, timeDiff);
        const outRate = calculateRate(currentBytesOut, lastMeasurement.bytesOut, timeDiff);
        
        // Update last measurement only if values are valid
        if (currentBytesIn >= 0 && currentBytesOut >= 0) {
            lastMeasurement = {
                time: currentTime,
                bytesIn: currentBytesIn,
                bytesOut: currentBytesOut
            };
        }
        
        // Parse uptime
        const uptimeMatch = uptime.match(/up\s+(.*?),\s+\d+\s+user/);
        const uptimeStr = uptimeMatch ? uptimeMatch[1] : "unknown";
        
        return NextResponse.json({
            connectedDevices,
            activeThreats: 0,
            bandwidth: `${(inRate + outRate).toFixed(2)}`,
            bandwidthIn: `${inRate.toFixed(2)}\nMbps download`,
            bandwidthOut: `${outRate.toFixed(2)}\nMbps upload`,
            uptime: `${99.9}%`,
            uptimeRaw: uptimeStr,
            status: "Secure",
            securityScore: 92
        });
    } catch (error) {
        console.error('Network stats error:', error);
        return NextResponse.json(
            { error: 'Failed to get network statistics' },
            { status: 500 }
        );
    }
} 