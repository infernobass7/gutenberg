exports.ios12 = {
	browserName: '',
	platformName: 'iOS',
	platformVersion: '12.0',
	deviceName: 'iPhone XR',
	os: 'iOS',
	deviceOrientation: 'portrait',
	automationName: 'XCUITest',
	appiumVersion: '1.9.1',
	app: undefined, // will be set later
};

exports.android8 = {
	browserName: '',
	platformName: 'Android',
	platformVersion: '8.0',
	deviceName: 'Android Emulator',
	automationName: 'UiAutomator2',
	os: 'Android',
	appPackage: 'com.gutenberg',
	appActivity: 'com.gutenberg.MainActivity',
	deviceOrientation: 'portrait',
	appiumVersion: '1.9.1',
	app: undefined, // relative to root of project
};
