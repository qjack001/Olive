import { reactive } from 'vue'
import { ColorName } from './paper-color'

export interface UserPreferences
{
	defaultPaperColor: ColorName | undefined
	pageMarkers: boolean
	bellSound: boolean
	otherSounds: boolean
}

export const defaultPreferences: UserPreferences =
{
	defaultPaperColor: undefined,
	pageMarkers: true,
	bellSound: true,
	otherSounds: true,
}

export const userPreferences = reactive<UserPreferences>(defaultPreferences)
	
window.menu?.receive('init_settings', (settings: any) => {
	userPreferences.defaultPaperColor = settings.defaultPaperColor ?? userPreferences.defaultPaperColor
	userPreferences.pageMarkers = settings.pageMarkers ?? userPreferences.pageMarkers
	userPreferences.bellSound = settings.bellSound ?? userPreferences.bellSound
	userPreferences.otherSounds = settings.otherSounds ?? userPreferences.otherSounds
})

window.menu?.receive('settings', (settings: any) => {
	userPreferences.defaultPaperColor = settings.defaultPaperColor ?? userPreferences.defaultPaperColor
	userPreferences.pageMarkers = settings.pageMarkers ?? userPreferences.pageMarkers
	userPreferences.bellSound = settings.bellSound ?? userPreferences.bellSound
	userPreferences.otherSounds = settings.otherSounds ?? userPreferences.otherSounds
})

export function updatePreferences() {
	window.menu?.send('settings', JSON.parse(JSON.stringify(userPreferences)))
}