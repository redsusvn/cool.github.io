#!/bin/sh

# 1. FIX USER (User 999 fix)
grep -q "999" /etc/passwd || echo "container:x:999:999:container:/home/container:/bin/sh" | sudo tee -a /etc/passwd

# 2. CLEANUP 
sudo killall -9 dbus-daemon pulseaudio chromium-browser 2>/dev/null
sudo rm -rf /run/dbus/dbus.pid /tmp/pulse-* /tmp/dbus-*

# 3. START SYSTEM BUS
sudo mkdir -p /run/dbus && sudo chown dbus:dbus /run/dbus
sudo dbus-daemon --system --fork

# 4. START SESSION BUS (The "Colon" Fix)
# We manually define the path so it's guaranteed to be correct
export DBUS_SESSION_BUS_ADDRESS="unix:path=/tmp/dbus-session-$(id -u)"
dbus-daemon --session --fork --address=$DBUS_SESSION_BUS_ADDRESS

# 5. START PULSEAUDIO (The "Refusing to Start" Fix)
# We unset the server variable first so it starts locally
unset PULSE_SERVER
pulseaudio --start --exit-idle-time=-1
icewmbg --replace --image /home/container/.cache/JNA/temp/75f67eea08d8616402bc29a3809f4916/home/container/Downloads/kje907.png
# Now create a speaker bridge
pactl load-module module-null-sink sink_name=speaker 2>/dev/null
pactl set-default-sink speaker

# 6. LAUNCH CHROMIUM
# We use the '--dbus-stub' flag to tell Chrome to ignore minor D-Bus warnings
chromium-browser --no-sandbox \
                 --disable-gpu \
                 --disable-dev-shm-usage \
                 --alsa-output-device=default \
                 --autoplay-policy=no-user-gesture-required \
                 "https://www.youtube.com" &
# 112
