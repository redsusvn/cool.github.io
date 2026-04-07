#!/bin/sh

# 1. FIX USER IDENTITY (Required for D-Bus)
# This stops the "User ID 999 not found" error
if ! grep -q "container" /etc/passwd; then
    echo "container:x:999:999:container:/home/container:/bin/sh" | sudo tee -a /etc/passwd
    echo "container:x:999:" | sudo tee -a /etc/group
fi

# 2. CLEANUP
sudo killall -9 dbus-daemon pulseaudio chromium-browser 2>/dev/null
sudo rm /run/dbus/dbus.pid 2>/dev/null
sudo mkdir -p /run/dbus && sudo chown dbus:dbus /run/dbus

# 3. START SYSTEM BUS
sudo dbus-daemon --system --fork

# 4. START SESSION BUS (The Fix for your Error)
# We use dbus-launch to create a valid address that Chromium understands
if [ -z "$DBUS_SESSION_BUS_ADDRESS" ]; then
    eval $(dbus-launch --sh-syntax)
    export DBUS_SESSION_BUS_ADDRESS
fi

# 5. START PULSEAUDIO
pulseaudio --start --exit-idle-time=-1
pactl load-module module-null-sink sink_name=speaker 2>/dev/null
pactl set-default-sink speaker

# 6. LAUNCH CHROMIUM
# We force the Pulse server to the native socket
export PULSE_SERVER=unix:/tmp/pulse-$(dbus-uuidgen)/native

chromium-browser --no-sandbox \
                 --disable-gpu \
                 --disable-dev-shm-usage \
                 --remoting-force-ignore-dbus-errors \
                 --alsa-output-device=default \
                 "https://www.youtube.com" &

# new
