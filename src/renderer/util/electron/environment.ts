import { Ref, ref } from 'vue'
import { Channel } from './channels'


/**
 * The runtime of the app.
 */

/** Operating System names, as returned by Node's process method */
export type OperatingSystem = 'aix' | 'darwin' | 'freebsd' | 'linux' | 'openbsd' | 'sunos' | 'win32'
type RuntimeEnvironment = OperatingSystem | 'browser' | 'other' // this app can also be run in the browser
enum envEnum { BROWSER, MAC_OS, WINDOWS, LINUX, OTHER }

/** Private variable for storing the current environment */
const runtimeEnvironment: Ref<RuntimeEnvironment> = ref((window.menu === undefined)
	? 'browser'
	: 'other'
)

Channel.OPERATING_SYSTEM.onUpdate((os) => runtimeEnvironment.value = os)

/**
 * The current environment the application is running in. Either MacOS, Windows,
 * Linux, or the browser.
 */
export const env =
{
	BROWSER: envEnum.BROWSER,
	MAC_OS: envEnum.MAC_OS,
	WINDOWS: envEnum.WINDOWS,
	LINUX: envEnum.LINUX,
	OTHER: envEnum.OTHER,

	/**
	 * Returns the current runtime of the application
	 */
	runtime: (): envEnum => {
		switch (runtimeEnvironment.value) {
			case 'browser': return env.BROWSER
			case 'darwin': return env.MAC_OS
			case 'win32': return env.WINDOWS
			case 'linux': return env.LINUX
			default: return env.OTHER
		}
	},

	is: (environment: envEnum): boolean => (env.runtime() == environment),
	isBrowser: (): boolean => (env.runtime() == env.BROWSER),
	isElectronApp: (): boolean => (env.runtime() != env.BROWSER),
}
