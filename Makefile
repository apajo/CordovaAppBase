.PHONY: vars start webr install setup public

help:
	@echo "Please use \`make <target>' where <target> is one of"
	@echo "  device	Connect the device"

install:
#	npm cache clean
	npm install
	make webr

update:
	npm update

webr:
	php -q ./src/cmd/webr.php
#	node --use_strict ./node_modules/cordova-icon-generator/index.js --source "res/icon.png" --output "res/icon" -r
#	node /home/andres/Desktop/cordova/YTRC/ytrc/src/cmd/webr.js

start:
	make vars
	make setup-device
	make test

vars:
	export ANDROID_HOME=/Development/android-sdk/
	export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin:/usr/lib/jvm/java-8-openjdk-amd64/bin:/usr/lib/jvm/java-8-openjdk-amd64/db/bin
	export PATH=${PATH}:/home/andres/Android/Sdk/platform-tools:/home/andres/Android/Sdk/tools
	export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
	export J2SDKDIR=/usr/lib/jvm/java-8-openjdk-amd64
	export J2REDIR=/usr/lib/jvm/java-8-openjdk-amd64
	export DERBY_HOME=/usr/lib/jvm/java-8-openjdk-amd64/db
	export ORG_GRADLE_PROJECT_cdvMinSdkVersion=16


public:
	cordova serve 8888

device:
	adb devices
	adb connect 192.168.0.15\:5555

setup-device:
	adb tcpip 5555
	make device

test:
	cordova requirements --verbose

build:
	cordova build --verbose

run:
	cordova run --device

deploy:
	cordova run --device

# --buildConfig
#cordova run android --release -- --keystore=../my-release-key.keystore --storePassword=password --alias=alias_name --password=password