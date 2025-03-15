export interface Device {
  id: string;
  name: string;
  ip: string;
  mac: string;
  status: string;
  lastActive: string;
  type: string;
  manufacturer: string;
  risk: string;
  interface?: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
} 