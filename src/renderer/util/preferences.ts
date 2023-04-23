import { ref, type Ref } from 'vue'
import { Channel, env } from './electron'
import { ColorName } from '../paper-color'

/**
 * The stored preferences settings of the user.
 * Note: this is electron-app-only, the web-based
 * demo uses the defaults defined in `defaultPreferences`.
 */
export interface UserPreferences
{
	/**
	 * The color used for the background. If undefined,
	 * a random color will be selected each time a
	 * window is opened.
	 * 
	 * @default undefined
	 */
	defaultPaperColor: ColorName | undefined

	/**
	 * Whether or not to soften the edges of the text
	 * and pen markings (simulating a bit of ink bleed
	 * into the paper). If true, a slight blur filter
	 * is applied.
	 * 
	 * @default false
	 */
	inkBleed: boolean

	/**
	 * Whether or not to show the page markers, which
	 * visually indicate where the edges of the paper
	 * are (horizontally and vertically).
	 * 
	 * @default true
	 */
	pageMarkers: boolean

	/**
	 * Whether or not to ring the bell noise as the
	 * end of the page is approached.
	 * 
	 * @default true
	 */
	bellSound: boolean

	/**
	 * Whether or not to make the sound effects of
	 * typing and moving the page.
	 * 
	 * @default true
	 */
	otherSounds: boolean
}

/** An interface where each field has been wrapped with Vue's Ref */
type RefWrapped<T> = {[K in keyof T]: Ref<T[K]>}

/**
 * Utility function that takes a `RefWrapped` object and returns
 * the unwrapped (plain) object.
 */
function unwrapRefs<T>(wrapped: RefWrapped<T>): T
{
	const keys = Object.keys(wrapped) as Array<keyof typeof wrapped>
	return keys.reduce((unwrapped, key) => {
		unwrapped[key] = wrapped[key].value
		return unwrapped
	}, {} as T)
}

/**
 * The default preferences. Used if preference settings have not been set,
 * are incomplete, or the app is running in the browser.
 */
export const defaultPreferences: UserPreferences =
{
	defaultPaperColor: undefined,
	inkBleed: false,
	pageMarkers: true,
	bellSound: true,
	otherSounds: true,
}

/**
 * The user preference settings. Set to the defaults defined in
 * `defaultPreferences`; until the settings have been passed to
 * the renderer through the INITIAL_SETTINGS channel. Any subsequent
 * updates set through the SETTINGS channel are automatically
 * applied. Note: each property is wrapped in Vue's Ref, providing
 * automatic re-render functionality.
 */
export const userPreferences: RefWrapped<UserPreferences> =
{
	defaultPaperColor: ref(defaultPreferences.defaultPaperColor),
	inkBleed: ref(defaultPreferences.inkBleed),
	pageMarkers: ref(defaultPreferences.pageMarkers),
	bellSound: ref(defaultPreferences.bellSound),
	otherSounds: ref(defaultPreferences.otherSounds),
}

/**
 * A promise that is fulfilled once the user preference settings
 * have been sent (occurs on the first message received through
 * the INITIAL_SETTINGS channel). Note: if running the application
 * in the browser, the promise will be immediately resolved with
 * the defaults defined in `defaultPreferences`.
 */
export const getInitPreferences = new Promise<UserPreferences>((resolve) =>
{
	if (env.isBrowser())
	{
		resolve(defaultPreferences)
	}

	Channel.INITIAL_SETTINGS.onUpdate((settings) =>
	{
		resolve({
			defaultPaperColor: settings?.defaultPaperColor ?? defaultPreferences.defaultPaperColor,
			inkBleed:          settings?.inkBleed          ?? defaultPreferences.inkBleed,
			pageMarkers:       settings?.pageMarkers       ?? defaultPreferences.pageMarkers,
			bellSound:         settings?.bellSound         ?? defaultPreferences.bellSound,
			otherSounds:       settings?.otherSounds       ?? defaultPreferences.otherSounds,
		})
	})
})

/**
 * Internal utility function that updates the stored `userPreferences` variable
 * with the given new value, if it exists. If the new value is undefined, the
 * user preference for that property is not updated.
 */
function updateUserPreferences<K extends keyof UserPreferences>(key: K, newValue?: Partial<UserPreferences>): void
{
	if (newValue)
	{
		userPreferences[key].value = newValue[key] ?? userPreferences[key].value
	}
}

/**
 * update the user preferences automatically whenever a change is sent through
 * the SETTINGS channel.
 */
Channel.SETTINGS.onUpdate((settings) =>
{
	updateUserPreferences('defaultPaperColor', settings)
	updateUserPreferences('inkBleed', settings)
	updateUserPreferences('pageMarkers', settings)
	updateUserPreferences('bellSound', settings)
	updateUserPreferences('otherSounds', settings)
})

/**
 * Updates the stored user preferences with the current `userPreferences`
 * object. The settings are sent to the main process through the SETTINGS
 * channel and stored locally on the user's computer, to be recalled on
 * future runs of the application. If run in the browser, has no effect.
 */
export function updatePreferences()
{
	Channel.SETTINGS.send(unwrapRefs(userPreferences))
}
