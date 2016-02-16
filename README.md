## cordova-plugin-lifecycle

This plugin allows you to create an app lifecycle with alpha, beta and store variants.

For example if you have an app with an id of `com.test.app`, this app will create revisions of `com.test.app.alpha`, `com.test.app.beta` and `com.test.app` respectively when performing your build command.

## Features

Platforms supported:
* Android
* iOS

Build types:
* Alpha
* Beta
* Store

This plugin automatically generates variant-specific icons so you can differentiate between the app variants on your device. You must have configured your icons using config.xml as per the Cordova spec, see [Configuring Icons in the CLI](https://cordova.apache.org/docs/en/latest/config_ref/images.html).

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
#### Android
If you perform the standard build or run command on the CLI, it will default to using the alpha variant. Alternatively, you can specify which variant you wish to use by passing through a gradle argument:

```bash
cordova run android
```
or 
```bash
cordova run android -- --gradleArg="-PactiveFlavor=alpha"
```
This will install an app on your phone with the identifier of `com.test.app.alpha`.

You can then swap out this `activeFlavor` variable to choose which variant of build you would like.
```bash
cordova run android -- --gradleArg="-PactiveFlavor=beta" --release
```
```bash
cordova run android -- --gradleArg="-PactiveFlavor=store" --release
```

NOTE: When switching between alpha, beta and store builds on Android, you must first run the `clean` command else you may get odd results. You can do this by performing:
```bash
./platforms/android/cordova/clean
```

#### iOS
If you perform the standard build or run command on the CLI, it will default to using the alpha variant. Alternatively, you can specify which variant you wish to use by passing through a variant argument along with a build config:
```bash
cordova run ios
```
or
```bash
cordova run ios --alpha --buildConfig="build.alpha.json"
```
This will install an app on your phone with the identifier of `com.test.app.alpha`.

You can then swap out `--alpha` to choose which variant of build you would like.
```bash
cordova run android --beta --buildConfig="build.beta.json" --release
```
```bash
cordova run android --store --buildConfig="build.store.json" --release
```

For more information on how to write your build configuration file(s), see the [iOS Shell Tool Guide](https://cordova.apache.org/docs/en/dev/guide/platforms/ios/tools.html#signing-the-app).

## Notes
### Android
* Due to how Cordova CLI works, when using this in conjunction with the `cordova run` command, it will always try and launch the default app id (in this case com.test.app). For now you have to go back to your home screen and then select the correct app. I have been working on a fix and have submitted it to the cordova development team for review: https://issues.apache.org/jira/browse/CB-10140

* This will not work nicely with the Google Play Beta and Alpha variants as you cannot have multiple IDs on an app. It is suggested when uploading any builds with Google Play you use the `store` variant.