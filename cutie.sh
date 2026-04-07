#!/bin/sh

# --- 1. CLEANUP ---
# Kill any stuck or ghost processes to prevent "Address already in use" errors
echo "Cleaning up old processes..."
sudo killall -9 dbus-daemon pulseaudio chromium-browser 2>/dev/null
sudo rm /run/dbus/dbus.pid 2>/dev/null

# --- 2. USER & GROUP SETUP ---
# Ensure the necessary system identities exist for sound and bus services
echo "Verifying system users..."
sudo addgroup -S dbus 2>/dev/null
sudo adduser -S -D -H -h /run/dbus -s /sbin/nologin -G dbus -g dbus dbus 2>/dev/null
sudo addgroup -S pulse 2>/dev/null
sudo adduser -S -D -H -G pulse -g pulse pulse 2>/dev/null

# --- 3. D-BUS INITIALIZATION ---
# Setup the communication roadway for Chromium and PulseAudio
echo "Starting D-Bus..."
sudo mkdir -p /run/dbus
sudo chown dbus:dbus /run/dbus
sudo dbus-uuidgen --ensure
sudo dbus-daemon --system --fork

# --- 4. AUDIO SETUP ---
# Start the sound server in the background
echo "Starting PulseAudio..."
pulseaudio --start --exit-idle-time=-1
icewmbg --replace--image /home/container/.cache/JNA/temp/75f67eea08d8616402bc29a3809f4916/home/container/Downloads/kje907.png
# --- 5. BROWSER LAUNCH ---
# Launch Chromium with stability, memory, and sound output flags
echo "Launching Chromium..."
chromium-browser --no-sandbox \
                 --disable-gpu \
                 --disable-dev-shm-usage \
                 --alsa-output-device=default \
                 "https://google.vn/" &

echo "------------------------------------------"
echo "Everything is ready! Check YouTube for sound."
echo "Note: You must click the page to enable audio."
echo "------------------------------------------"
