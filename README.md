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

This plugin automatically generates variant-specific icons so you can differentiate between the app variants on your device.

## Installation

### Dependencies
To generate the variant-specific icons the plugin requires GraphicsMagick. You can install this by performing:
```bash
brew install graphicsmagick
```
### Plugin
To install the stable release of the plugin you can run:
```bash
cordova plugin add cordova-plugin-lifecycle
```
For the cutting edge release you can run:
```bash
cordova plugin add https://github.com/CookieCookson/cordova-plugin-lifecycle
```

## Usage

### Setting up
If you wish to provide a custom overlay for the variants, you must use the `<icon-alpha-overlay>` and `<icon-beta-overlay>` tags in config.xml. 
```xml
<icon-alpha-overlay src="path/to/alpha-overlay.png" />
<icon-beta-overlay src="path/to/beta-overlay.png" />
```
If no custom overlay is specified, the plugin will add the default overlay to the icons.

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

## Notes

* Due to how Cordova CLI works, when using this in conjunction with the `cordova run` command, it will always try and launch the default app id (in this case com.test.app). For now you have to go back to your home screen and then select the correct app. I have been working on a fix and have submitted it to the cordova development team for review: https://issues.apache.org/jira/browse/CB-10140

* This will not work nicely with the Google Play Beta and Alpha variants as you cannot have multiple IDs on an app. It is suggested when uploading any builds with Google Play you use the `store` variant.