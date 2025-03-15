The Website is deployed with basic features for the application that are ; 2 Factor Authentication,Email Alert System

website : https://sidemen-psi.vercel.app
Username : 'svceadmin'
Password : 'password'

you are required to scan the qr provided on 2 FA with google Authenticator or any Authentication app
then provide the temporary key to enter


# Sidemen Security - IoT Security Dashboard

A modern, real-time IoT device security monitoring dashboard built with Next.js and TypeScript. This application provides comprehensive security monitoring, threat detection, and device management for your network.

## Features

### 1. Security Authentication
- Secure login system with username/password authentication
- Two-Factor Authentication (2FA) using Google Authenticator
- QR code-based 2FA setup
- Persistent session management

### 2. Device Monitoring
- Real-time device detection and monitoring
- Automatic network scanning
- Device status tracking
- Risk level assessment
- Device details including:
  - IP address
  - MAC address
  - Device type
  - Manufacturer
  - Last active timestamp
  - Current status
  - Risk level

### 3. Security Metrics
- Overall network security score
- Active threat detection
- Device risk distribution
- Network load monitoring
- Connected device statistics

### 4. Threat Detection
- Real-time threat monitoring
- Risk level categorization:
  - Critical
  - Warning
  - Normal
- Security incident tracking
- Automated alert system

### 5. Alert System
- Email notifications for security incidents
- Customizable alert triggers
- Detailed incident reporting
- Real-time status updates

## Technology Stack

- **Frontend:**
  - Next.js 15.2.0
  - React 19
  - TypeScript
  - TailwindCSS
  - React Icons

- **Authentication:**
  - Google Authenticator (TOTP)
  - Speakeasy for 2FA
  - QRCode for 2FA setup

- **Email Services:**
  - Nodemailer
  - SMTP integration

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- A modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sidemen.git
cd sidemen
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
# Add any environment variables here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3005`

### Default Credentials

- Username: `svceadmin`
- Password: `password`
- 2FA: Required on first login

## Usage

1. **Login:**
   - Enter credentials
   - Set up or verify 2FA
   - Access dashboard

2. **Dashboard:**
   - View network security status
   - Monitor connected devices
   - Track security metrics
   - View threat detection

3. **Device Management:**
   - Scan for new devices
   - View device details
   - Set risk levels
   - Send security alerts

4. **Security Alerts:**
   - Set device risk levels
   - Trigger email alerts
   - View alert history
   - Monitor threat responses

## Project Structure

```
src/
├── app/
│   ├── api/            # API routes
│   ├── dashboard/      # Dashboard pages
│   └── page.tsx        # Login page
├── components/
│   └── dashboard/      # Dashboard components
│       ├── DeviceList.tsx
│       ├── Header.tsx
│       ├── NetworkStatus.tsx
│       ├── SecurityMetrics.tsx
│       ├── Sidebar.tsx
│       └── ThreatDetection.tsx
└── middleware.ts       # Authentication middleware
```

## Security Features

1. **Authentication:**
   - Username/password validation
   - Two-factor authentication
   - Session management
   - Secure cookie handling

2. **Network Security:**
   - Real-time device monitoring
   - Risk assessment
   - Threat detection
   - Alert system

3. **Data Protection:**
   - Encrypted communication
   - Secure storage
   - Session management
   - Access control

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
```

### Starting Production Server
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- TailwindCSS for the styling system
- Google Authenticator for 2FA implementation
- All contributors and maintainers

## Support

For support, email support@sidemensecurity.com or create an issue in the repository.
