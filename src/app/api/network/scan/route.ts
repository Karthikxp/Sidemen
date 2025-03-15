import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

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
    interface: string;
}

async function getNetworkDevices(): Promise<Device[]> {
    const devices = new Map<string, Device>();

    try {
        // 1. Get ARP table entries
        const { stdout: arpOutput } = await execPromise('arp -a');
        console.log('ARP Output:', arpOutput);
        const arpLines = arpOutput.split('\n');
        
        for (const line of arpLines) {
            if (!line.trim()) continue;
            
            const match = line.match(/\(([^)]+)\) at ([^ ]+) on ([^ ]+)/);
            if (match) {
                const [, ip, mac, interface_name] = match;
                if (mac && mac.toLowerCase() !== '(incomplete)') {
                    devices.set(mac, {
                        id: `dev-${mac.replace(/:/g, '')}`,
                        name: `Device (${ip})`,
                        ip,
                        mac,
                        status: 'active',
                        lastActive: new Date().toISOString(),
                        type: 'unknown',
                        manufacturer: 'Unknown',
                        risk: 'unknown',
                        interface: interface_name
                    });
                }
            }
        }

        // 2. Get active connections
        const { stdout: netstatOutput } = await execPromise('netstat -n -p tcp | grep ESTABLISHED');
        const netstatLines = netstatOutput.split('\n');
        
        for (const line of netstatLines) {
            if (!line.trim()) continue;
            
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 5) {
                const remoteAddr = parts[4].split('.').slice(0, -1).join('.');
                
                // Look up the MAC address for this IP
                try {
                    const { stdout: arpLookup } = await execPromise(`arp -n ${remoteAddr} 2>/dev/null || true`);
                    const macMatch = arpLookup.match(/at ([0-9A-Fa-f:]{17})/);
                    if (macMatch && !devices.has(macMatch[1])) {
                        devices.set(macMatch[1], {
                            id: `dev-${macMatch[1].replace(/:/g, '')}`,
                            name: `Device (${remoteAddr})`,
                            ip: remoteAddr,
                            mac: macMatch[1],
                            status: 'active',
                            lastActive: new Date().toISOString(),
                            type: 'unknown',
                            manufacturer: 'Unknown',
                            risk: 'unknown',
                            interface: 'unknown'
                        });
                    }
                } catch (error) {
                    console.error('Error looking up MAC:', error);
                }
            }
        }

        // 3. Get local network interfaces
        const { stdout: ifconfigOutput } = await execPromise('ifconfig');
        const interfaces = ifconfigOutput.split('\n\n');
        
        for (const iface of interfaces) {
            if (iface.includes('inet ') && !iface.includes('127.0.0.1')) {
                const macMatch = iface.match(/ether ([0-9a-fA-F:]{17})/);
                const inetMatch = iface.match(/inet ([0-9.]+)/);
                const nameMatch = iface.match(/^([^:]+):/);
                
                if (macMatch && inetMatch && nameMatch && !devices.has(macMatch[1])) {
                    devices.set(macMatch[1], {
                        id: `dev-${macMatch[1].replace(/:/g, '')}`,
                        name: `Local Interface (${nameMatch[1]})`,
                        ip: inetMatch[1],
                        mac: macMatch[1],
                        status: 'active',
                        lastActive: new Date().toISOString(),
                        type: 'interface',
                        manufacturer: 'Local',
                        risk: 'low',
                        
                        interface: nameMatch[1]
                    });
                }
            }
        }

        return Array.from(devices.values());
    } catch (error) {
        console.error('Error scanning network:', error);
        return [];
    }
}

export async function GET() {
    try {
        const devices = await getNetworkDevices();
        return NextResponse.json({ devices });
    } catch (error) {
        console.error('Network scan error:', error);
        return NextResponse.json(
            { error: 'Failed to scan network' },
            { status: 500 }
        );
    }
} 