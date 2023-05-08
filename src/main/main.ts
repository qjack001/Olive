import { app, BrowserWindow, session, dialog, MenuItemConstructorOptions, shell, MenuItem } from 'electron'
import isFirstLaunch from 'electron-first-run'
import { Color, ColorName } from '../renderer/util/paper-color'
import { OliFile, OliFileVersion1, FILE_EXTENSION } from '../renderer/util/oli-file'
import { newWindow, setMenu } from './window'
import { Channel } from '../renderer/util/electron/ipc-main-channel'
import * as fs from 'fs'

type PageData = {
	filepath?: string
	saveWithoutDialog?: boolean
	isFirstLaunch?: boolean
}

let openingFile = false // flag used to differentiate `ready` events from `open-file` events

function createWindow (pageData: PageData = {filepath: undefined}) {
	const page: Record<string, BrowserWindow> = {}

	page.MAIN = newWindow(undefined, {
		width: 1200,
		height: 800,
		minWidth: 480,
		minHeight: 160,
	})

	if (pageData.filepath) {
		openFile(page.MAIN, pageData.filepath)
	}

	const template: MenuItemConstructorOptions[] =
	[
		{
			label: 'Olive',
			submenu:
			[
				{ role: 'about' },
				{ type: 'separator' },
				{
					label: 'Preferences',
					accelerator: 'CommandOrControl+,',
					click: () => newWindow('settings', {
						width: 620,
						height: 600,
						minWidth: 480,
						minHeight: 600,
						singleton: true,
					})
				},
				{ type: 'separator' },
				{ role: 'services' },
				{ type: 'separator' },
				{ role: 'hide' },
				{ role: 'hideOthers' },
				{ role: 'unhide' },
				{ type: 'separator' },
				{ role: 'quit' },
			]
		},
		{
			label: 'File',
			submenu:
			[
				{
					label: 'New Document',
					accelerator: 'CommandOrControl+N',
					click: () => createWindow()
				},
				{
					label: 'Reset Document',
					accelerator: 'CommandOrControl+R',
					click: () => {
						if (pageData.filepath) {
							openFile(page.MAIN, pageData.filepath)
						}
						page.MAIN.reload()
					}
				},
				{
					label: 'Open',
					accelerator: 'CommandOrControl+O',
					click: () => {
						dialog.showOpenDialog(page.MAIN, {
							properties: ['openFile'],
							filters: [
								{
									name: 'Olive Files',
									extensions: ['oli']
								}
							],
						})
						.then((result) => {
							if (result.canceled || result.filePaths[0] === undefined) return
							
							const filepath = (result.filePaths[0].endsWith(FILE_EXTENSION))
								? result.filePaths[0].slice(0, -FILE_EXTENSION.length)
								: result.filePaths[0]

							createWindow({filepath})
							page.MAIN.close()
						})
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Save',
					accelerator: 'CommandOrControl+S',
					click: () => {
						pageData.saveWithoutDialog = true
						Channel.SAVE_REQUEST.send(page.MAIN, true)
					}
				},
				{
					label: 'Save As',
					accelerator: 'CommandOrControl+Shift+S',
					click: () => Channel.SAVE_REQUEST.send(page.MAIN, true)
				},
				{
					label: 'Print To PDF',
					accelerator: 'CommandOrControl+P',
					click: () =>
					{
						const dateOptions: Intl.DateTimeFormatOptions = {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							hour: 'numeric',
							minute: '2-digit',
						}
						
						const now = new Date().toLocaleString('us', dateOptions).replaceAll('.', '').replace(':', '.')
						const defaultName = `${now}.pdf`

						dialog.showSaveDialog(page.MAIN, { defaultPath: defaultName, properties: ['createDirectory'], }).then(selection =>
						{
							if (selection.canceled) return;

							page.MAIN.webContents.printToPDF({ printBackground: true, preferCSSPageSize: true }).then(data =>
							{
								fs.writeFile(selection.filePath as fs.PathOrFileDescriptor, data, (error) =>
								{
									if (error) dialog.showErrorBox('Unable to save PDF', 
										'An unexpected error occurred and your document was not saved. ' +
										'Please try again, and if the issue persists, file a bug report.')
								})
							})
						})
					}
				},
				{
					type: 'separator'
				},
				{ 
					label: 'Paper Color',
					id: 'paper-color',
					type: 'submenu',
					submenu: getColorOptions(page.MAIN),
				},
				{ type: 'separator' },
				{
					label: 'Erase Mode',
					accelerator: 'CommandOrControl+Backspace',
					id: 'erase-mode',
					type: 'checkbox',
					click: (eraseMode) => Channel.ERASE_MODE.send(page.MAIN, eraseMode.checked),
				},
				{
					label: 'Disappearing Ink',
					type: 'checkbox',
					click: (disappearingMode) => Channel.DISAPPEARING_MODE.send(page.MAIN, disappearingMode.checked),
				},
				{ type: 'separator' },
				{ role: 'close' },
			]
		},
		{
			label: 'Window',
			submenu: [
				{ role: 'resetZoom' },
				{ role: 'zoomIn' },
				{ role: 'zoomOut' },
				{ type: 'separator' },
				{ role: 'minimize' },
				{ role: 'zoom' },
				{ role: 'togglefullscreen' },
				{ type: 'separator' },
				{ role: 'front' },
				{ type: 'separator' },
				{ role: 'window' },
			]
		},
		{
			role: 'help',
			submenu: 
			[
				{
					label: 'How To Use Olive',
					accelerator: 'CommandOrControl+Shift+H',
					click: () => 
					{
						if (page.HELP && !page.HELP.isDestroyed()) {
							page.HELP.close()
						}
						else {
							page.HELP = newWindow('help', {
								parent: page.MAIN,
								minWidth: 800,
								minHeight: 600,
							})
						}
					}
				},
				{
					label: 'Learn More...',
					click: async () => await shell.openExternal('https://github.com/qjack001/Olive')
				},
				{ type: 'separator' },
				{ role: 'toggleDevTools' },
				{
					label: 'Report Issue',
					click: async () => await shell.openExternal('https://github.com/qjack001/Olive/issues')
				},
			]
		}
	]

	const menu = setMenu(page.MAIN, template)

	if (pageData.isFirstLaunch) {
		page.HELP = newWindow('help', { parent: page.MAIN })
	}

	Channel.SET_COLOR.onUpdate(page.MAIN, (color) => {
		if (color) {
			const colorOption = menu.getMenuItemById(color)
			if (colorOption) {
				colorOption.checked = true
			}
		}
	})

	Channel.ERASE_MODE.onUpdate(page.MAIN, (_value) => {
		const eraseModeOption = menu.getMenuItemById('erase-mode')
		if (eraseModeOption) {
			eraseModeOption.checked = !eraseModeOption.checked
			Channel.ERASE_MODE.send(page.MAIN, eraseModeOption.checked)
		}
	})

	Channel.CLOSE_MODEL.onUpdateFromChildWindow(page.MAIN, (pageId) => {
		if (!page[pageId].isDestroyed()) {
			page[pageId].close()
		}
	})

	Channel.FILE_CONTENT.onUpdate(page.MAIN, (fileFromRenderer) => {
		const file: OliFile = {
			version: 1.0,
			content: fileFromRenderer.content,
			penMarkings: fileFromRenderer.penMarkings,
			paperColor: getSelectedColorOption(menu.getMenuItemById('paper-color')),
		}
		
		if (pageData.saveWithoutDialog && pageData.filepath) {
			saveFile(page.MAIN, pageData, pageData.filepath, file)
			pageData.saveWithoutDialog = false // reset
			return
		}
		
		dialog.showSaveDialog(page.MAIN, {
			title: 'Save As',
			defaultPath: pageData.filepath,
			properties: ['createDirectory', 'showOverwriteConfirmation']
		})
		.then((result: Electron.SaveDialogReturnValue) => {
			if (result.canceled || result.filePath === undefined) {
				return
			}
			saveFile(page.MAIN, pageData, result.filePath, file)
		})
	})
}

app.whenReady().then(() => {
	
	if (!openingFile) {
		createWindow({isFirstLaunch: isFirstLaunch()})
	}

	session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
		callback({
			responseHeaders: {
				...details.responseHeaders,
				'Content-Security-Policy': ['script-src \'self\'']
			}
		})
	})
})

app.on('activate', () => {
	app.whenReady().then(() => {
		// create new window if none currently open
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})
})

app.on('open-file', (event, path) => {
    event.preventDefault()
	openingFile = true // blocks standard whenReady task of creating new blank window
	app.whenReady().then(() => {
		// remove extension, if oli file (it is forced back on the filepath later)
		const filepath = (path.endsWith(FILE_EXTENSION))
			? path.slice(0, -FILE_EXTENSION.length)
			: path

		createWindow({filepath})
		openingFile = false // reset
	})
})

app.on('window-all-closed', () => {
	app.quit()
})

function getColorOptions(window: BrowserWindow): Electron.MenuItemConstructorOptions[] {
	return Object.keys(Color).map((color) => {
		return {
			id: color,
			label: color,
			type: 'radio',
			click: () => {
				Channel.SET_COLOR.send(window, color as ColorName)
			}
		}
	})
}

function getSelectedColorOption(paperColorSubmenu: MenuItem | null): ColorName | undefined {
	if (paperColorSubmenu == null || paperColorSubmenu.submenu == undefined) {
		return undefined
	}

	for (const colorOption of paperColorSubmenu.submenu.items) {
		if (colorOption.checked) {
			return colorOption.id as ColorName
		}
	}
}

function saveFile(window: BrowserWindow, windowData: PageData, filePath: string, file: OliFile): void {
	fs.writeFile(filePath + FILE_EXTENSION, JSON.stringify(file), (error) => {

		if (error) {
			return dialog.showErrorBox('Unable to save document', 
				'An unexpected error occurred and your document was not saved. ' +
				'Please try again, and if the issue persists, file a bug report.')
		}

		windowData.filepath = filePath // save the filepath used for future saves
	})
}

function openFile(window: BrowserWindow, filepath: string): void {
	fs.readFile(filepath + FILE_EXTENSION, {encoding: 'utf-8'}, (error, data) => {
		
		// we can assume the file is an Oli file, but not necessarily any single version of an Oli file
		const file: OliFile = JSON.parse(data)

		if (error) {
			return dialog.showErrorBox('Unable to open document', 
				'An unexpected error occurred trying to open that file. ' +
				'Please try again, and if the issue persists, file a bug report.')
		}

		window.on('ready-to-show', () => {
			Channel.FILE_CONTENT.send(window, file)
			Channel.SET_COLOR.send(window, file.paperColor)
		})
	})
}
