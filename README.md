## cordova-plugin-lifecycle

This plugin allows you to create an app lifecycle with alpha, beta and store/production states.

For example, if you have an app with an id of `com.test.app`, this app will create revisions of `com.test.app.alpha`, `com.test.app.beta` and `com.test.app` respectively.

## Features

Platforms supported:
* Android
* iOS (Coming soon)

Build types:
* Alpha
* Beta
* Store / Production

## Installation

```bash
cordova plugin add cordova-plugin-lifecycle
```

## Usage

If you perform the standard build or run command on the CLI, it will default to using the alpha state. Alternatively, you can specify which state you wish to use by passing through a gradle argument:
```bash
cordova run android
```
or 
```bash
cordova run android -- --gradleArg="-PactiveFlavor=alpha"
```
This will install an app on your phone with the identifier of `com.test.app.alpha`.

You can then swap out this `activeFlavor` variable to choose which state of build you would like. If performing the store or beta state, it is recommended you also pass through the `--release` flag.
```bash
cordova run android -- --gradleArg="-PactiveFlavor=beta" --release
```
```bash
cordova run android -- --gradleArg="-PactiveFlavor=store" --release
```
It is recommended you use the alpha state for debug installations over USB where you may need to remotely inspect or debug your app. The beta state is intended for when distributing your app over-the-air through services such as HockeyApp. Because of this it is recommended to pass through the release flag so the app is signed and runs with the release configuration.

## Future Development

* iOS support
* Configure app icon assets in config.xml
* Provide template PSD or generator for creating these assets on the fly
* Provide fix to launch correct app bundle when using `cordova run`

## Notes

* Due to how Cordova CLI works, when using this in conjunction with the `cordova run` command, it will always try and launch the default app id (in this case com.test.app). For now you have to go back to your home screen and then select the correct app.

* This will not work nicely with the Google Play Beta and Alpha variants as you cannot have multiple IDs on an app. It is suggested when uploading any builds with Google Play you use the `store` state.