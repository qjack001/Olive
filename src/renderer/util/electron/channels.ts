import { type OliFileVersion1 } from '../oli-file'
import { type ColorName } from '../paper-color'
import { type UserPreferences } from '../preferences'
import { type OperatingSystem } from './environment'
import { MainToRendererOnlyChannel, RendererToMainOnlyChannel, TwoWayChannel } from './ipc-renderer-channel'


/**
 * Inter-Process Communication channels; used for sending messages between the
 * main process and renderer. For more information see:
 * https://www.electronjs.org/docs/latest/tutorial/ipc#ipc-channels
 */
export const Channel =
{
	/**
	 * The user's preferences, sent only on initialization of a new window.
	 * Can be listened to for settings (without updating every time the settings
	 * change). Main to renderer only.
	 */
	INITIAL_SETTINGS: new MainToRendererOnlyChannel<UserPreferences>('INITIAL_SETTINGS'),

	/**
	 * The user's preferences, sent every time they change.
	 */
	SETTINGS: new TwoWayChannel<UserPreferences>('SETTINGS'),

	/**
	 * Sent when the paper color is updated. Sent to the renderer when color is
	 * chosen in the menubar, and sent to the main process when color is selected
	 * from the user's preferences/randomly chosen.
	 */
	SET_COLOR: new TwoWayChannel<ColorName | undefined>('SET_COLOR'),

	/**
	 * The user's operating system. Main to renderer only.
	 */
	OPERATING_SYSTEM: new MainToRendererOnlyChannel<OperatingSystem>('OPERATING_SYSTEM'),

	/**
	 * The contents of the file -- sent to the renderer when a file is opened,
	 * and to the main process when a file is being saved.
	 */
	FILE_CONTENT: new TwoWayChannel<OliFileVersion1>('FILE_CONTENT'),
	
	/**
	 * Request for file content to save. Main to renderer only.
	 */
	SAVE_REQUEST: new MainToRendererOnlyChannel<boolean>('SAVE_REQUEST'),

	/**
	 * Turns on or off "erase mode" -- the mode in which typing erases the
	 * existing letters rather than print new ones. Is activated by the
	 * Command-Delete shortcut or by toggling in the menubar. When shortcut is
	 * preformed, the menubar doesn't seem to detect it unless currently open;
	 * thus, the renderer also listens for this key command and sends it to Main
	 * to sync the menubar's status.
	 */
	ERASE_MODE: new TwoWayChannel<boolean>('ERASE_MODE'),

	/**
	 * Turns on or off "disappearing mode" -- in which the letters are printed
	 * using "disappearing ink", and fade invisible after a few seconds. Main to
	 * renderer only.
	 */
	DISAPPEARING_MODE: new MainToRendererOnlyChannel<boolean>('DISAPPEARING_MODE'),

	/**
	 * Closes the model of the given path (the path in this cas is the name of
	 * the page, present in the path's query param: `?page=<page name here>`).
	 * Renderer to Main only, as the main process can close the model window on
	 * its own; the renderer can use this to close a model window on a certain
	 * UI interaction.
	 */
	CLOSE_MODEL: new RendererToMainOnlyChannel<string>('CLOSE_MODEL')
}
