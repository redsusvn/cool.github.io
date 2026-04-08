#!/bin/sh

# 1. FIX USER
grep -q "999" /etc/passwd || echo "container:x:999:999:container:/home/container:/bin/sh" | sudo tee -a /etc/passwd

# 2. CLEANUP (Aggressive)
sudo killall -9 dbus-daemon pulseaudio chromium-browser 2>/dev/null
sudo rm -rf /run/dbus/dbus.pid /tmp/pulse-* /tmp/dbus-*
# Wipe the profile every time to ensure no corrupted 'Singleton' locks exist
rm -rf /home/container/.chromium-profile

# 3. START SYSTEM BUS
sudo mkdir -p /run/dbus && sudo chown dbus:dbus /run/dbus
sudo dbus-daemon --system --fork

# 4. START SESSION BUS
export DBUS_SESSION_BUS_ADDRESS="unix:path=/tmp/dbus-session-$(id -u)"
dbus-daemon --session --fork --address=$DBUS_SESSION_BUS_ADDRESS

# 5. START PULSEAUDIO
unset PULSE_SERVER
pulseaudio --start --exit-idle-time=-1
icewmbg --replace --image /home/container/.cache/JNA/temp/75f67eea08d8616402bc29a3809f4916/home/container/Downloads/kje907.png &

pactl load-module module-null-sink sink_name=speaker 2>/dev/null
pactl set-default-sink speaker

# 6. THE "ULTIMATE STABILITY" LAUNCH
# We use --single-process to stop Chromium from spawning thread managers 
# that trigger the 'sched_getscheduler' error.
echo "Launching in Single Process mode..."
sleep 2

# Extra environment tweak for Alpine/musl memory handling
export MALLOC_CACHE_MAX=0

chromium-browser --no-sandbox \
    --single-process \
    --disable-setuid-sandbox \
    --disable-seccomp-filter-sandbox \
    --no-zygote \
    --disable-gpu \
    --disable-software-rasterizer \
    --disable-dev-shm-usage \
    --disable-vulkan \
    --disable-3d-apis \
    --disable-extensions \
    --use-gl=swiftshader \
    --password-store=basic \
    --alsa-output-device=default \
    --autoplay-policy=no-user-gesture-required \
    --user-data-dir=/home/container/.chromium-profile \
    "https://www.youtube.com" > /home/container/chromium.log 2>&1 &

echo "Browser started. Check /home/container/chromium.log if it closes."
