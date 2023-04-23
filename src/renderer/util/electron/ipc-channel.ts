/**
 * Interfaces and classes for defining IPC channels.
 */


/**
 * Inter-Process Communication (IPC) channel. See:
 * https://www.electronjs.org/docs/latest/tutorial/ipc#ipc-channels
 */
interface IPCChannel
{
	/**
	 * The namespace of the channel. Note: must be unique.
	 */
	readonly channelName: string
}

/**
 * A channel that can send messages from the main process to the renderer.
 */
interface MainToRendererChannel<T> extends IPCChannel
{
	/**
	 * Runs a callback function when a message is received through the given channel.
	 * @param callback The function to run on a new message.
	 */
	readonly onUpdate: (callback: (data: T) => void) => void
}

/**
 * A channel that can send messages from the renderer to the main process.
 */
interface RendererToMainChannel<T> extends IPCChannel
{
	/**
	 * Sends a message to the given channel.
	 * @param data The object to send as the message.
	 */
	readonly send: (data: T) => void
}

/**
 * Represents an Inter-Process Communication (IPC) channel, used to send
 * messages from the main process to the renderer only.
 */
export class MainToRendererOnlyChannel<T> implements MainToRendererChannel<T>
{
	readonly channelName: string
	readonly onUpdate: (callback: (data: T) => void) => void

	/**
	 * Creates a new channel, with Main-to-Renderer communication only.
	 * @param channelName The namespace of the channel; must be unique
	 */
	constructor(channelName: string)
	{
		this.channelName = channelName
		this.onUpdate = (callback: (data: T) => void) => window.menu?.receive(channelName, callback)
	}
}

/**
 * Represents an Inter-Process Communication (IPC) channel, used to send
 * messages from the renderer to the main process only.
 */
export class RendererToMainOnlyChannel<T> implements RendererToMainChannel<T>
{
	readonly channelName: string
	readonly send: (data: T) => void

	/**
	 * Creates a new channel, with Main-to-Renderer communication only.
	 * @param channelName The namespace of the channel; must be unique
	 */
	constructor(channelName: string)
	{
		this.channelName = channelName
		this.send = (data: T) => window.menu?.send(channelName, deepClone(data))
	}
}

/**
 * Represents an Inter-Process Communication (IPC) channel, used to send
 * messages between the main process and the renderer.
 */
export class TwoWayChannel<T> implements MainToRendererChannel<T>, RendererToMainChannel<T>
{
	readonly channelName: string
	readonly onUpdate: (callback: (data: T) => void) => void
	readonly send: (data: T) => void

	/**
	 * Creates a new channel, with communication from Main to Renderer, as well
	 * as Renderer to Main.
	 * @param channelName The namespace of the channel; must be unique
	 */
	constructor(channelName: string)
	{
		this.channelName = channelName
		this.onUpdate = (callback: (data: T) => void) => window.menu?.receive(channelName, callback)
		this.send = (data: T) => window.menu?.send(channelName, deepClone(data))
	}
}

/**
 * Utility function to deep clone an object. Objects sent over the wire must be
 * deep cloned to avoid error. Uses the JSON stringify & parse hack.
 */
function deepClone(object: any): any
{
	return JSON.parse(JSON.stringify(object))
}