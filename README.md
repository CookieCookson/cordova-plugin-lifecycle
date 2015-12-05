## cordova-plugin-lifecycle

This plugin allows you to create an app lifecycle with alpha, beta and store variants.

For example if you have an app with an id of `com.test.app`, this app will create revisions of `com.test.app.alpha`, `com.test.app.beta` and `com.test.app` respectively when performing your build command.

## Features

Platforms supported:
* Android
* iOS (Coming soon)

Build types:
* Alpha
* Beta
* Store

It is possible to provide different icon sets for each build type so you can easily identify the variants on your device.

## Installation
For a stable release you can run:
```bash
cordova plugin add cordova-plugin-lifecycle
```
For the cutting edge release you can run:
```bash
cordova plugin add https://github.com/CookieCookson/cordova-plugin-lifecycle
```

## Usage

### Setting up
If you wish to provide different icon sets for the variants, you must edit config.xml. Following the standards of the cordova `<icon>` tag, you can specify `<alpha-icon>` and `<beta-icon>` under your platform specific configuration.
```xml
<platform name="android">

	<!-- Store Icons, standard cordova method -->
	<icon src="res/android/store/ldpi.png" density="ldpi" />
	<icon src="res/android/store/mdpi.png" density="mdpi" />
	<icon src="res/android/store/hdpi.png" density="hdpi" />
	<icon src="res/android/store/xhdpi.png" density="xhdpi" />
	
	<!-- Alpha Icons, copies to platforms/android/src/alpha/ -->
	<alpha-icon src="res/android/alpha/ldpi.png" density="ldpi" />
	<alpha-icon src="res/android/alpha/mdpi.png" density="mdpi" />
	<alpha-icon src="res/android/alpha/hdpi.png" density="hdpi" />
	<alpha-icon src="res/android/alpha/xhdpi.png" density="xhdpi" />
	
	<!-- Beta Icons, copies to platforms/android/src/beta/ -->
	<beta-icon src="res/android/beta/ldpi.png" density="ldpi" />
	<beta-icon src="res/android/beta/mdpi.png" density="mdpi" />
	<beta-icon src="res/android/beta/hdpi.png" density="hdpi" />
	<beta-icon src="res/android/beta/xhdpi.png" density="xhdpi" />
	
</platform>
```

### Building
If you perform the standard build or run command on the CLI, it will default to using the alpha variant. Alternatively, you can specify which variant you wish to use by passing through a gradle argument:
```bash
cordova run android
```
or 
```bash
cordova run android -- --gradleArg="-PactiveFlavor=alpha"
```
This will install an app on your phone with the identifier of `com.test.app.alpha`.

You can then swap out this `activeFlavor` variable to choose which variant of build you would like. If performing the store or beta variant, it is recommended you also pass through the `--release` flag.
```bash
cordova run android -- --gradleArg="-PactiveFlavor=beta" --release
```
```bash
cordova run android -- --gradleArg="-PactiveFlavor=store" --release
```
It is recommended you use the alpha variant for debug installations over USB where you may need to remotely inspect or debug your app. The beta variant is intended for when distributing your app over-the-air through services such as HockeyApp. Because of this it is recommended to pass through the release flag so the app is signed and runs with the release configuration.

NOTE: When switching between alpha, beta and store builds on Android, you must first run the `clean` command else you may get odd results. You can do this by performing:
```bash
./platforms/android/cordova/clean
```

## Future Development

* iOS support
* Provide template PSD or generator for creating the icon assets on the fly

## Notes

* Due to how Cordova CLI works, when using this in conjunction with the `cordova run` command, it will always try and launch the default app id (in this case com.test.app). For now you have to go back to your home screen and then select the correct app. I have been working on a fix and have submitted it to the cordova development team for review: https://issues.apache.org/jira/browse/CB-10140

* This will not work nicely with the Google Play Beta and Alpha variants as you cannot have multiple IDs on an app. It is suggested when uploading any builds with Google Play you use the `store` variant.