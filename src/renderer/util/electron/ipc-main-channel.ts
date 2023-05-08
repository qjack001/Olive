import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron'
import { OperatingSystem } from '.'
import { OliFile } from '../oli-file'
import { ColorName } from '../paper-color'
import { UserPreferences } from '../preferences'

class IpcMainContextChannel<T>
{
	readonly channelName: string
	readonly onUpdate: (window: BrowserWindow, then: (data: T) => void) => void
	readonly onUpdateFromChildWindow: (window: BrowserWindow, then: (data: T) => void) => void
	readonly onUpdateFromAnyWindow: (then: (data: T) => void) => void
	readonly send: (window: BrowserWindow, data: T) => void
	readonly sendToAllWindows: (data: T) => void

	constructor(channelName: string)
	{
		this.channelName = channelName

		this.onUpdate = (window: BrowserWindow, then: (data: T) => void): void => {
			ipcMain.on(this.channelName, (event: IpcMainEvent, data: T) => {
				if (!window.isDestroyed() && BrowserWindow.fromWebContents(event.sender)?.id === window.id) {
					then(data)
				}
			})
		}

		this.onUpdateFromChildWindow = (window: BrowserWindow, then: (data: T) => void): void => {
			ipcMain.on(this.channelName, (event: IpcMainEvent, data: T) => {
				if (!window.isDestroyed() && BrowserWindow.fromWebContents(event.sender)?.getParentWindow()?.id === window.id) {
					then(data)
				}
			})
		}

		this.onUpdateFromAnyWindow = (then: (data: T) => void): void => {
			ipcMain.on(this.channelName, (_event: IpcMainEvent, data: T) => {
				then(data)
			})
		}

		this.send = (window: BrowserWindow, data: T): void => {
			if (!window.isDestroyed()) {
				window.webContents.send(this.channelName, data)
			}
		}

		this.sendToAllWindows = (data: T): void => {
			BrowserWindow.getAllWindows().map((window) => {
				if (!window.isDestroyed()) {
					window.webContents.send(this.channelName, data)
				}
			})
		}
	}
}

export const Channel =
{
	/**
	 * The user's preferences, sent only on initialization of a new window.
	 * Can be listened to for settings (without updating every time the settings
	 * change). Main to renderer only.
	 */
	INITIAL_SETTINGS: new IpcMainContextChannel<UserPreferences>('INITIAL_SETTINGS'),

	/**
	 * The user's preferences, sent every time they change.
	 */
	SETTINGS: new IpcMainContextChannel<UserPreferences>('SETTINGS'),

	/**
	 * Sent when the paper color is updated. Sent to the renderer when color is
	 * chosen in the menubar, and sent to the main process when color is selected
	 * from the user's preferences/randomly chosen.
	 */
	SET_COLOR: new IpcMainContextChannel<ColorName | undefined>('SET_COLOR'),

	/**
	 * The user's operating system. Main to renderer only.
	 */
	OPERATING_SYSTEM: new IpcMainContextChannel<OperatingSystem>('OPERATING_SYSTEM'),

	/**
	 * The contents of the file -- sent to the renderer when a file is opened,
	 * and to the main process when a file is being saved.
	 */
	FILE_CONTENT: new IpcMainContextChannel<OliFile>('FILE_CONTENT'),
	
	/**
	 * Request for file content to save. Main to renderer only.
	 */
	SAVE_REQUEST: new IpcMainContextChannel<boolean>('SAVE_REQUEST'),

	/**
	 * Turns on or off "erase mode" -- the mode in which typing erases the
	 * existing letters rather than print new ones. Is activated by the
	 * Command-Delete shortcut or by toggling in the menubar. When shortcut is
	 * preformed, the menubar doesn't seem to detect it unless currently open;
	 * thus, the renderer also listens for this key command and sends it to Main
	 * to sync the menubar's status.
	 */
	ERASE_MODE: new IpcMainContextChannel<boolean>('ERASE_MODE'),

	/**
	 * Turns on or off "disappearing mode" -- in which the letters are printed
	 * using "disappearing ink", and fade invisible after a few seconds. Main to
	 * renderer only.
	 */
	DISAPPEARING_MODE: new IpcMainContextChannel<boolean>('DISAPPEARING_MODE'),

	/**
	 * Closes the model of the given path (the path in this cas is the name of
	 * the page, present in the path's query param: `?page=<page name here>`).
	 * Renderer to Main only, as the main process can close the model window on
	 * its own; the renderer can use this to close a model window on a certain
	 * UI interaction.
	 */
	CLOSE_MODEL: new IpcMainContextChannel<string>('CLOSE_MODEL')
}