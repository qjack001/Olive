/**
 * Should match main/preload.ts for typescript support in renderer
 */
export default interface ElectronApi {
	send: (channel: string, data: any) => void,
	receive: (channel: string, func: Function) => void
}

declare global {
	interface Window {
		menu: ElectronApi,
	}
}
