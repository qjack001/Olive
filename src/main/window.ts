import { app, BrowserWindow, BrowserWindowConstructorOptions, dialog, Menu, MenuItemConstructorOptions } from 'electron'
import { Channel } from '../renderer/util/electron/ipc-main-channel'
import { join } from 'path'
import Store from 'electron-store'

interface WindowOptions {
    width?: number
    height?: number
    minWidth?: number
    minHeight?: number
    maxWidth?: number
    maxHeight?: number
    parent?: BrowserWindow
	singleton?: boolean
}

const singletonPages: Record<string, BrowserWindow> = {}

export function newWindow(page: string | undefined, props: WindowOptions, optionOverrides?: BrowserWindowConstructorOptions): BrowserWindow {
	if (props.singleton && page && singletonPages[page] && !singletonPages[page].isDestroyed()) {
		singletonPages[page].focus()
		return singletonPages[page]
	}
	
	const window = new BrowserWindow({
		...props,
		titleBarStyle: 'hiddenInset',
		modal: (props.parent != undefined),
		show: false, // window is shown on 'ready-to-show' event instead
		webPreferences: {
			preload: join(__dirname, 'preload.js'),
			nodeIntegration: false,
			contextIsolation: true,
		},
		...optionOverrides,
	})

	if (props.singleton && page) {
		singletonPages[page] = window
	}

	const userPreferences = new Store()

	Channel.SETTINGS.onUpdate(window, (updatedPreferences) => {
		userPreferences.store = updatedPreferences as any
		Channel.SETTINGS.sendToAllWindows(userPreferences.store as any)
	})

	window.on('ready-to-show', () => {
		Channel.OPERATING_SYSTEM.send(window, process.platform)
		Channel.INITIAL_SETTINGS.send(window, userPreferences.store as any)
		Channel.SETTINGS.send(window, userPreferences.store as any)

		// add additional delay to let rendering finish
		setTimeout(() => {
			window.show()
		}, 100)
	})

	window.webContents.on('will-prevent-unload', (event) => {
		const options = {
			type: 'warning',
			buttons: ['Discard', 'Cancel'],
			message: 'Discard document?',
			detail: 'Any unsaved changes will be lost.',
		}
		const response = dialog.showMessageBoxSync(window, options)
		if (response === 0) {
			event.preventDefault()
		}
	})


	const pageParam = (page) ? `page=${page}` : ''

	if (process.env.NODE_ENV === 'development') {
		const rendererPort = process.argv[2]
		window.loadURL(`http://localhost:${rendererPort}/?${pageParam}`)
	}
	else {
		window.loadFile(join(app.getAppPath(), 'renderer', 'index.html'), { search: pageParam })
	}

	return window
}


export function setMenu(window: BrowserWindow, menu: MenuItemConstructorOptions[]): Menu {
	
	const compiledMenu = Menu.buildFromTemplate(menu)
	
	// On Mac we have to use Menu.setApplicationMenu whenever the focus changes.
	if (process.platform === 'darwin') {
		Menu.setApplicationMenu(compiledMenu)

		window.on('focus', () => {
			Menu.setApplicationMenu(compiledMenu)
		})
	}
	else {
		window.setMenu(compiledMenu)
	}

	return compiledMenu
}
