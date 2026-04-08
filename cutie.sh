#!/bin/sh

# 1. FIX USER (User 999 fix)
# Ensures the 'container' user exists for permission consistency
grep -q "999" /etc/passwd || echo "container:x:999:999:container:/home/container:/bin/sh" | sudo tee -a /etc/passwd

# 2. CLEANUP 
# Kill hanging processes and clear lock files to prevent "Profile in use" errors
sudo killall -9 dbus-daemon pulseaudio chromium-browser 2>/dev/null
sudo rm -rf /run/dbus/dbus.pid /tmp/pulse-* /tmp/dbus-*
rm -rf /home/container/.config/chromium/Singleton*

# 3. START SYSTEM BUS
sudo mkdir -p /run/dbus && sudo chown dbus:dbus /run/dbus
sudo dbus-daemon --system --fork

# 4. START SESSION BUS
export DBUS_SESSION_BUS_ADDRESS="unix:path=/tmp/dbus-session-$(id -u)"
dbus-daemon --session --fork --address=$DBUS_SESSION_BUS_ADDRESS

# 5. START PULSEAUDIO & BACKGROUND
unset PULSE_SERVER
pulseaudio --start --exit-idle-time=-1

# Set the background image (Wait a split second for IceWM if needed)
icewmbg --replace --image /home/container/.cache/JNA/temp/75f67eea08d8616402bc29a3809f4916/home/container/Downloads/kje907.png &

# Create a speaker bridge for audio routing
pactl load-module module-null-sink sink_name=speaker 2>/dev/null
pactl set-default-sink speaker

# 6. LAUNCH CHROMIUM (Optimized for Alpine/Docker Stability)
# We add a 2-second sleep to ensure D-Bus and PulseAudio are fully initialized
echo "Stabilizing environment (old version)..."
sleep 2

echo "Launching Chromium... Logs saved to /home/container/chromium.log"

chromium-browser --no-sandbox \
    --disable-gpu \
    --disable-software-rasterizer \
    --disable-dev-shm-usage \
    --disable-features=VizDisplayCompositor \
    --disable-gpu-sandbox \
    --password-store=basic \
    --alsa-output-device=default \
    --autoplay-policy=no-user-gesture-required \
    --user-data-dir=/home/container/.chromium-profile \
    "https://www.youtube.com" > /home/container/chromium.log 2>&1 &

echo "Script execution finished. Chromium is running in the background."
