# Women Safety Guardian - Complete Full-Stack Application

## Overview
A comprehensive women safety emergency response system with real-time SOS alerts, voice-triggered emergency detection, media recording, and police dashboard for case management.

## Features

### User (Victim) Dashboard
- 🚨 **Voice Auto-Start** - Voice recognition automatically starts when user logs in
- 🚨 **Voice Trigger Detection** - Continuously listens for "Help Me", "Emergency", or "Save Me"
- 🎥 **Automatic Video Recording** - 30-second emergency recording using MediaRecorder API
- 📍 **Fresh Location Capture** - GPS location captured at time of SOS trigger
- 🔊 **Alert Sound** - Audio notification when emergency is triggered
- ⏱️ **Countdown Timer** - 3-2-1 countdown before recording starts
- 💾 **Local Backup** - Save recordings to your device
- 📱 **Media Preview** - Watch and listen to your recordings immediately

### Police Dashboard
- 📊 **Real-time Case List** - Live updates every 10 seconds
- 🚨 **New Alert Animation** - Visual and audio notification for new emergencies
- 🎬 **Media Playback** - Video and audio evidence viewer
- 📍 **Location Links** - Direct Google Maps integration
- 📝 **Case Notes** - Add and update case notes
- ✅ **Status Management** - Mark cases as Pending/Resolved

## Tech Stack

### Frontend
- React.js 18
- Tailwind CSS
- Vite (build tool)
- React Router v6
- Axios (API client)

### Backend
- Node.js
- Express.js
- JWT Authentication
- Multer (file uploads)
- bcryptjs (password hashing)

### Storage
- Local JSON files for data persistence
- Local file system for media uploads

## Quick Start

### 1. Start Backend Server
```bash
cd server
npm install
npm run dev
```
Server runs on: http://localhost:5000

### 2. Start Frontend Dev Server
```bash
cd client
npm install
npm run dev
```
Client runs on: http://localhost:3000

### 3. Access the Application
Open browser: http://localhost:3000

## Demo Accounts

### Police Account
- Email: police@guardian.com
- Password: police123
- Role: Police Dashboard access

### User Account
- Email: user@guardian.com
- Password: user123
- Role: User Dashboard with SOS features

## How to Use

### For Users (Victims)
1. Register or login with your credentials
2. Voice recognition automatically starts when you log in - no manual activation needed
3. Say "Help Me", "Emergency", or "Save Me" to trigger SOS
4. Alternatively, click the large "SEND SOS ALERT" button anytime
5. Your current location will be captured at time of alert
6. Recording will start after 3-second countdown
7. Your location, video, and audio will be sent to police
8. **Save to Device**: After recording, download your video and audio files directly to your device
   - Preview recordings in the app
   - Click "Download Video" or "Download Audio" buttons
   - Click "Download All Files" to save both at once

### For Police
1. Login with police credentials
2. View all emergency cases in real-time
3. Click on a case to view details
4. Watch video and listen to audio
5. Click location to open Google Maps
6. Add notes and mark cases as resolved

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login and get JWT token

### SOS Cases
- `POST /api/sos` - Create new SOS alert (with video/audio upload)
- `GET /api/sos` - Get all cases (police: all, user: own cases)
- `GET /api/sos/:id` - Get single case details
- `PUT /api/sos/:id` - Update case status/notes

## Project Structure

```
Root/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React contexts
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Node.js Backend
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── data/              # JSON data files
│   ├── uploads/           # Uploaded media files
│   ├── index.js          # Express server
│   └── package.json
│
└── README.md
```

## Key Features Implementation

### Voice Recognition
Uses Web Speech API for continuous voice recognition:
- Supports Chrome browser
- Detects keywords: "HELP ME", "EMERGENCY", "SAVE ME"
- Works in background while page is active

### Media Recording
Uses MediaRecorder API:
- Captures both video and audio
- 30-second maximum duration
- Stores as WebM format
- Auto-stops and sends when complete

### Geolocation
Uses browser Geolocation API:
- High accuracy mode
- Falls back gracefully if denied
- Generates Google Maps link

### Real-time Updates
- Police dashboard polls every 10 seconds
- New alert detection and notification
- Optimistic UI updates

## Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control
- CORS configuration

## Browser Compatibility
- Chrome (recommended for voice features)
- Firefox
- Edge
- Safari (limited voice support)

## Future Enhancements
- [ ] WebSocket for real-time updates
- [ ] Push notifications
- [ ] SMS integration
- [ ] Email alerts
- [ ] Mobile app version
- [ ] MongoDB database
- [ ] Cloud storage for media
- [ ] Multi-language support

## License
MIT License - Built for safety and protection

## Support
For emergency services, always call local authorities first.
This app is a tool to assist, not replace emergency services.
