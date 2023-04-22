import { Ref, ref } from 'vue'

type OperatingSystem = 'aix' | 'darwin' | 'freebsd' | 'linux' | 'openbsd' | 'sunos' | 'win32'
type RuntimeEnvironment = OperatingSystem | 'browser' | 'other'
enum envEnum {
	BROWSER,
	MAC_OS,
	WINDOWS,
	LINUX,
	OTHER,
}

const runtimeEnvironment: Ref<RuntimeEnvironment> = ref((window.menu === undefined) ? 'browser' : 'other')
window.menu?.receive('os', (os: OperatingSystem) => runtimeEnvironment.value = os)

export const env =
{
	BROWSER: envEnum.BROWSER,
	MAC_OS: envEnum.MAC_OS,
	WINDOWS: envEnum.WINDOWS,
	LINUX: envEnum.LINUX,
	OTHER: envEnum.OTHER,

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