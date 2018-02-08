
sudo apt update
sudo apt install android-tools-adb 
sudo apt install android-tools-fastboot

sudo apt-get install nodejs
sudo apt-get install npm

sudo apt-add-repository ppa:cordova-ubuntu/ppa
sudo apt-get update
sudo apt-get install cordova-cli

sudo apt-add-repository ppa:ubuntu-sdk-team/ppa
sudo apt-get update
sudo apt-get install click-dev
sudo apt-get install phablet-tools
sudo apt-get install ubuntu-sdk-api-15.04

sudo click chroot -a armhf create
sudo click chroot -a armhf -f ubuntu-sdk-15.04 install cmake libicu-dev:armhf pkg-config qtbase5-dev:armhf qtchooser qtdeclarative5-dev:armhf qtfeedback5-dev:armhf qtlocation5-dev:armhf qtmultimedia5-dev:armhf qtpim5-dev:armhf libqt5sensors5-dev:armhf qtsystems5-dev:armhf