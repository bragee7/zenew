#!/bin/bash

echo "========================================"
echo "Women Safety Guardian - Quick Start"
echo "========================================"
echo ""

echo "[1/3] Starting Backend Server..."
gnome-terminal -- bash -c "cd server && npm run dev; exec bash" 2>/dev/null || xterm -e "cd server && npm run dev" 2>/dev/null || open -a Terminal

echo "[2/3] Waiting for backend to start..."
sleep 5

echo "[3/3] Starting Frontend Development Server..."
gnome-terminal -- bash -c "cd client && npm run dev; exec bash" 2>/dev/null || xterm -e "cd client && npm run dev" 2>/dev/null || open -a Terminal

echo ""
echo "========================================"
echo "Application is starting..."
echo "========================================"
echo ""
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Demo Accounts:"
echo "Police: police@guardian.com / police123"
echo "User: user@guardian.com / user123"
echo ""
echo "Opening application in browser..."
sleep 2

xdg-open http://localhost:3000 2>/dev/null || open http://localhost:3000 2>/dev/null || echo "Please open http://localhost:3000 in your browser"

echo ""
echo "Done! The application should now be open in your browser."
