import { app, BrowserWindow, Menu, dialog } from 'electron';
import { URL } from 'url';
const path = require('path');
const fs = require('fs');


const createWindow = async () => {
	const win = new BrowserWindow({
		show: false,
		width: 1200,
		height: 800,
		minWidth: 480,
		titleBarStyle: 'hiddenInset',
		backgroundColor: 'white',
		
		webPreferences: {
			preload: path.join(__dirname, '../../preload/dist/index.cjs')
		}
	});

	const template =
	[
		{
			label: 'Typeright',
			submenu:
			[
				{ role: 'about'            },
				{ type: 'separator'        },
				{ role: 'services'         },
				{ type: 'separator'        },
				{ role: 'hide'             },
				{ role: 'hideothers'       },
				{ role: 'unhide'           },
				{ type: 'separator'        },
				{ role: 'quit'             },
			]
		},
		{
			label: 'File',
			submenu:
			[
				{
					label: 'New Window',
					accelerator: 'CommandOrControl+N',
					click: () =>
					{
						createWindow()
					}
				},
				{
					label: 'Reset Document',
					role: 'reload'
				},
				{
					type: 'separator'
				},
				{
					label: 'Print To PDF',
					accelerator: 'CommandOrControl+P',
					click: () =>
					{ 
						win.webContents.printToPDF({}).then(data =>
						{
							var dateOptions = {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric',
								hour: 'numeric',
								minute: '2-digit',
								second: '2-digit'
							};

							const pdfPath = path.join(os.homedir(), 'Desktop',
								`Typeright - ${new Date().toLocaleString("en-US", dateOptions)}.pdf`)

							fs.writeFile(pdfPath, data, (error) =>
							{
								if (error) throw error
								console.log(`Wrote PDF successfully to ${pdfPath}`)
							})
						})
					}
				},
				{ type: 'separator'        },
				{ role: 'close'            },
			]
		},
		{
			label: 'Window',
			submenu: [
				{ role: 'resetZoom'        },
				{ role: 'zoomIn'           },
				{ role: 'zoomOut'          },
				{ type: 'separator'        },
				{ role: 'minimize'         },
				{ role: 'zoom'             },
				{ role: 'togglefullscreen' },
				{ type: 'separator'        },
				{ role: 'front'            },
				{ type: 'separator'        },
				{ role: 'window'           },
			]
		},
		{
			role: 'help',
			submenu: 
			[
				{
					label: 'How To Use Typeright',
					click: () => 
					{
						// TODO: rplace with custom help dialog
						// const child = new BrowserWindow({ parent: win, modal: true, show: false })
						// child.loadURL('https://github.com')
						// child.once('ready-to-show', () => {
						// 	child.show()
						// })
						dialog.showMessageBoxSync(win, {
							title: 'How To Use Typeright',
							message: 'Use the arrow keys to navigate the cursor. [SHIFT] + arrow keys moves in large steps, ' +
							'[ALT] + arrow keys moves in micro steps. Erase a letter by holding the [DELETE] key and typing ' +
							'the characters you want to remove.',
							type: 'info',
							buttons: ['OK']
						})
					}
				},
				{
					label: 'Learn More...',
					click: async () => 
					{
						const { shell } = require('electron')
						await shell.openExternal('https://github.com/qjack001/Typeright')
					}
				},
				{ type: 'separator'        },
				{ role: 'toggleDevTools'   },
				{
					label: 'Report An Issue',
					click: async () => 
					{
						const { shell } = require('electron')
						await shell.openExternal('https://github.com/qjack001/Typeright/issues')
					}
				},
			]
		}
	]
		
	setWindowMenu(win, Menu.buildFromTemplate(template));

	// @see https://github.com/electron/electron/issues/25012
	win.on('ready-to-show', () => {
		win?.show();
	});

	const pageUrl = new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();
	await win.loadURL(pageUrl);
};

function setWindowMenu(win, menu) {
	// On Mac we have to use Menu.setApplicationMenu whenever
	// the focus changes. On Linux/Windows we can just give
	// each window a unique menu.
	if (process.platform === "darwin") {
		Menu.setApplicationMenu(menu);

		win.on("focus", () => {
			Menu.setApplicationMenu(menu);
		});
	}
	else {
		win.setMenu(menu);
	}
}

app.on('window-all-closed', () => {
	app.quit();
});

app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})
}).catch((e) => console.error('Failed create window:', e));


// Auto-updates
app.whenReady()
	.then(() => import('electron-updater'))
	.then(({autoUpdater}) => autoUpdater.checkForUpdatesAndNotify())
	.catch((e) => console.error('Failed check updates:', e));

