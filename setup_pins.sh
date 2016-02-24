#!/bin/bash

echo 45 > /sys/class/gpio/export
echo 44 > /sys/class/gpio/export
echo 26 > /sys/class/gpio/export
echo 47 > /sys/class/gpio/export
echo 46 > /sys/class/gpio/export
echo 27 > /sys/class/gpio/export

echo low > /sys/class/gpio/gpio45/direction
echo low > /sys/class/gpio/gpio44/direction
echo low > /sys/class/gpio/gpio26/direction
echo low > /sys/class/gpio/gpio47/direction
echo low > /sys/class/gpio/gpio46/direction
echo low > /sys/class/gpio/gpio27/direction
