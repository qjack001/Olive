import { app, BrowserWindow, Menu } from 'electron';
import { URL } from 'url';
const path = require('path');
const fs = require('fs');
const os = require('os');


const createWindow = async () => {
	const win = new BrowserWindow({
		show: false,
		width: 1200,
		height: 800,
		minWidth: 480,
		titleBarStyle: 'hiddenInset',
		backgroundColor: 'white'
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
					label: 'Save PDF To Desktop',
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
				{ role: 'reload'           },
				{ role: 'toggleDevTools'   },
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
					label: 'Learn More',
					click: async () => 
					{
						const { shell } = require('electron')
						await shell.openExternal('https://github.com/qjack001/Typeright')
					}
				}
			]
		}
	]
		
	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)

	// @see https://github.com/electron/electron/issues/25012
	win.on('ready-to-show', () => {
		win?.show();
	});

	const pageUrl = new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();
	await win.loadURL(pageUrl);
};


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

