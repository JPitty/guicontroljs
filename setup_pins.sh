#!/bin/bash

#ssr relays
if [ ! -d /sys/class/gpio/gpio45 ]; then echo 45 > /sys/class/gpio/export; fi
if [ ! -d /sys/class/gpio/gpio44 ]; then echo 44 > /sys/class/gpio/export; fi
if [ ! -d /sys/class/gpio/gpio26 ]; then echo 26 > /sys/class/gpio/export; fi
if [ ! -d /sys/class/gpio/gpio47 ]; then echo 47 > /sys/class/gpio/export; fi
if [ ! -d /sys/class/gpio/gpio46 ]; then echo 46 > /sys/class/gpio/export; fi
if [ ! -d /sys/class/gpio/gpio27 ]; then echo 27 > /sys/class/gpio/export; fi
# coil relays
if [ ! -d /sys/class/gpio/gpio33 ]; then echo 33 > /sys/class/gpio/export; fi
if [ ! -d /sys/class/gpio/gpio36 ]; then echo 36 > /sys/class/gpio/export; fi
if [ ! -d /sys/class/gpio/gpio62 ]; then echo 62 > /sys/class/gpio/export; fi
if [ ! -d /sys/class/gpio/gpio63 ]; then echo 63 > /sys/class/gpio/export; fi

# sets pin direction to output and low
echo low > /sys/class/gpio/gpio45/direction
echo low > /sys/class/gpio/gpio44/direction
echo low > /sys/class/gpio/gpio26/direction
echo low > /sys/class/gpio/gpio47/direction
echo low > /sys/class/gpio/gpio46/direction
echo low > /sys/class/gpio/gpio27/direction

echo low > /sys/class/gpio/gpio33/direction
echo low > /sys/class/gpio/gpio36/direction
echo low > /sys/class/gpio/gpio62/direction
echo low > /sys/class/gpio/gpio63/direction
