
module.exports = {
	settings: {
		'vetur.useWorkspaceDependencies': true,
		'vetur.experimental.templateInterpolationService': true,
	},
	projects: [
		{
			root: './packages/renderer',
			snippetFolder: './.vscode/vetur/snippets',
			globalComponents: [
				'./src/components/**/*.vue',
			],
		},
		{
			root: './packages/main',
		}
	],
};