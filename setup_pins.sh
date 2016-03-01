#!/bin/bash

#ssr relays
if [ ! -d /sys/class/gpio/gpio45 ]; then echo 45 > /sys/class/gpio/export; fi
if [ ! -d /sys/class/gpio/gpio44 ]; then echo 44 > /sys/class/gpio/export; fi
if [ ! -d /sys/class/gpio/gpio26 ]; then echo 26 > /sys/class/gpio/export; fi
if [ ! -d /sys/class/gpio/gpio47 ]; then echo 47 > /sys/class/gpio/export; fi
if [ ! -d /sys/class/gpio/gpio46 ]; then echo 46 > /sys/class/gpio/export; fi
if [ ! -d /sys/class/gpio/gpio27 ]; then echo 27 > /sys/class/gpio/export; fi
# coil relays
if [ ! -d /sys/class/gpio/gpio117 ]; then echo 117 > /sys/class/gpio/export; fi
if [ ! -d /sys/class/gpio/gpio115 ]; then echo 115 > /sys/class/gpio/export; fi
#if [ ! -d /sys/class/gpio/gpio33 ]; then echo 117 > /sys/class/gpio/export; fi
#if [ ! -d /sys/class/gpio/gpio36 ]; then echo 125 > /sys/class/gpio/export; fi
#if [ ! -d /sys/class/gpio/gpio62 ]; then echo 62 > /sys/class/gpio/export; fi
#if [ ! -d /sys/class/gpio/gpio63 ]; then echo 63 > /sys/class/gpio/export; fi

# sets pin direction to output and low
echo low > /sys/class/gpio/gpio45/direction
echo low > /sys/class/gpio/gpio44/direction
echo low > /sys/class/gpio/gpio26/direction
echo low > /sys/class/gpio/gpio47/direction
echo low > /sys/class/gpio/gpio46/direction
echo low > /sys/class/gpio/gpio27/direction

echo 1 > /sys/class/gpio/gpio117/active_low
echo 1 > /sys/class/gpio/gpio115/active_low
echo high > /sys/class/gpio/gpio117/direction
echo high > /sys/class/gpio/gpio115/direction

#echo high > /sys/class/gpio/gpio62/direction
#echo high > /sys/class/gpio/gpio63/direction

# pin for one wire bus
slot=`cat /sys/devices/platform/bone_capemgr/slots | grep BB-W1-P8.19 | awk -F "Manuf," '{ print $2 }'`
if [ -z "$slot" ]; then echo BB-W1-P8.19 > /sys/devices/platform/bone_capemgr/slots; fi
