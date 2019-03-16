import childProcess from 'child_process';
import wd from 'wd';
import fs from 'fs';
import serverCofigs from './serverConfigs';
import { ios12, android8 } from './caps';
import _ from 'underscore';

const spawn = childProcess.spawn;

// Platform setup
const defaultPlatform = 'android';
const rnPlatform = process.env.TEST_RN_PLATFORM || defaultPlatform;

// Environment setup, local environment or Sauce Labs
const defaultEnvironment = 'local';
const testEnvironment = process.env.TEST_ENV || defaultEnvironment;

// Local App Paths
const defaultAndroidAppPath = './android/app/build/outputs/apk/debug/app-debug.apk';
const defaultIOSAppPath = './ios/build/Build/Products/Debug-iphonesimulator/gutenberg.app';

const localAndroidAppPath = process.env.ANDROID_APP_PATH || defaultAndroidAppPath;
const localIOSAppPath = process.env.IOS_APP_PATH || defaultIOSAppPath;

const localAppiumPort = 4728; // Port to spawn appium process for local runs

const timer = ( ms ) => new Promise( ( res ) => setTimeout( res, ms ) );

const rename = async ( path, newPath ) => {
	await fs.rename( path, newPath, ( error ) => {
		if ( error ) {
			throw error;
		}
	} );
};

const isAndroid = () => {
	return rnPlatform.toLowerCase() === 'android';
};

const isLocalEnvironment = () => {
	return testEnvironment.toLowerCase() === 'local';
};

const setupDriver = async () => {
	const serverConfig = isLocalEnvironment() ? serverCofigs.local : serverCofigs.sauce;
	const driver = wd.promiseChainRemote( serverConfig );

	let desiredCaps;
	if ( isAndroid() ) {
		desiredCaps = _.clone( android8 );
		if ( isLocalEnvironment() ) {
			desiredCaps.app = localAndroidAppPath;
		} else {
			desiredCaps.app = 'sauce-storage:Gutenberg.apk'; // App should be preloaded to sauce storage, this can also be a URL
		}
	} else {
		desiredCaps = _.clone( ios12 );
		if ( isLocalEnvironment() ) {
			desiredCaps.app = localIOSAppPath;
		} else {
			desiredCaps.app = 'sauce-storage:Gutenberg.app.zip'; // App should be preloaded to sauce storage, this can also be a URL
		}
	}

	if ( ! isLocalEnvironment() ) {
		desiredCaps.name = `Gutenberg Editor Tests[${ rnPlatform }]`;
		desiredCaps.tags = [ 'Gutenberg' ];
	}

	await driver.init( desiredCaps );
	await timer( 10000 );
	await driver.sleep( 10000 ); // wait for app to load
	const status = await driver.status();
	// Display the driver status
	// eslint-disable-next-line no-console
	console.log( status );

	await driver.setImplicitWaitTimeout( 2000 );
	await timer( 3000 );
	return driver;
};

const setupAppium = async () => {
	const out = fs.openSync( './appium-out.log', 'a' );
	const err = fs.openSync( './appium-out.log', 'a' );

	const appium = await spawn( 'appium', [ '-p', '' + localAppiumPort ], {
		detached: true, stdio: [ 'ignore', out, err ],

	} );
	await timer( 5000 );
	return appium;
};

module.exports = {
	timer,
	setupAppium,
	setupDriver,
	rename,
	isLocalEnvironment,
	isAndroid,
};
