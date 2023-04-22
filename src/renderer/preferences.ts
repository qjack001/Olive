import { reactive, ref, type Ref } from 'vue'
import { env } from './electron'
import { ColorName } from './paper-color'

export interface UserPreferences
{
	defaultPaperColor: ColorName | undefined
	inkBleed: boolean
	pageMarkers: boolean
	bellSound: boolean
	otherSounds: boolean
}

type RefWrapped<T> = {
	[K in keyof T]: Ref<T[K]>
}

function unwrapRefs<T>(wrapped: RefWrapped<T>): T {
	const keys = Object.keys(wrapped) as Array<keyof typeof wrapped>
	return keys.reduce((unwrapped, key) => {
		unwrapped[key] = wrapped[key].value
		return unwrapped
	}, {} as T)
}

export const defaultPreferences: UserPreferences =
{
	defaultPaperColor: undefined,
	inkBleed: false,
	pageMarkers: true,
	bellSound: true,
	otherSounds: true,
}

export const userPreferences: RefWrapped<UserPreferences> = {
	defaultPaperColor: ref(defaultPreferences.defaultPaperColor),
	inkBleed: ref(defaultPreferences.inkBleed),
	pageMarkers: ref(defaultPreferences.pageMarkers),
	bellSound: ref(defaultPreferences.bellSound),
	otherSounds: ref(defaultPreferences.otherSounds),
}

export const getInitPreferences = new Promise<UserPreferences>((resolve) => {
	if (env.isBrowser()) {
		resolve(defaultPreferences)
	}

	window.menu?.receive('init_settings', (settings?: Partial<UserPreferences>) => {
		resolve({
			defaultPaperColor: settings?.defaultPaperColor ?? defaultPreferences.defaultPaperColor,
			inkBleed:          settings?.inkBleed          ?? defaultPreferences.inkBleed,
			pageMarkers:       settings?.pageMarkers       ?? defaultPreferences.pageMarkers,
			bellSound:         settings?.bellSound         ?? defaultPreferences.bellSound,
			otherSounds:       settings?.otherSounds       ?? defaultPreferences.otherSounds,
		})
	})
})

window.menu?.receive('settings', (settings?: Partial<UserPreferences>) => {
	updateUserPreferences('defaultPaperColor', settings)
	updateUserPreferences('inkBleed', settings)
	updateUserPreferences('pageMarkers', settings)
	updateUserPreferences('bellSound', settings)
	updateUserPreferences('otherSounds', settings)
})

function updateUserPreferences<K extends keyof UserPreferences>(key: K, newValue?: Partial<UserPreferences>): void {
	if (newValue) {
		userPreferences[key].value = newValue[key] ?? userPreferences[key].value
	}
}

export function updatePreferences() {
	window.menu?.send('settings', JSON.parse(JSON.stringify(unwrapRefs(userPreferences))))
}