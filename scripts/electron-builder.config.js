const now = new Date;
const buildVersion = `${now.getFullYear() - 2000}.${now.getMonth() + 1}.${now.getDate()}`;

// https://www.electron.build/configuration/configuration
const config = {
	productName: 'Typeright',
	directories: {
		output: 'dist',
		buildResources: 'icon',
	},
	files: [
		'packages/**/dist/**',
	],
	extraMetadata: {
		version: buildVersion,
	},
};

module.exports = config;
