/**
 * Interfaces and classes for defining IPC channels.
 */

import { windowMenuExists } from "./environment"


/**
 * Inter-Process Communication (IPC) channel. See:
 * https://www.electronjs.org/docs/latest/tutorial/ipc#ipc-channels
 */
interface IpcChannel
{
	/**
	 * The namespace of the channel. Note: must be unique.
	 */
	readonly channelName: string
}

/**
 * A channel that can send messages from the main process to the renderer.
 */
interface MainToRendererChannel<T> extends IpcChannel
{
	/**
	 * Runs a callback function when a message is received through the given channel.
	 * @param then The callback function to run on a new message.
	 */
	readonly onUpdate: (then: (data: T) => void) => void
}

/**
 * A channel that can send messages from the renderer to the main process.
 */
interface RendererToMainChannel<T> extends IpcChannel
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
		// @ts-ignore
		this.onUpdate = (then: (data: T) => void) => {
			if (windowMenuExists())
			{
				// @ts-ignore
				window.menu.receive(channelName, then)
			}
		}
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
		// @ts-ignore
		this.send = (data: T) => {
			if (windowMenuExists())
			{
				// @ts-ignore
				window.menu.send(channelName, deepClone(data))
			}
		}
	}
}

/**
 * Represents an Inter-Process Communication (IPC) channel, used to send
 * messages between the main process and the renderer.
 */
export class TwoWayChannel<T> implements MainToRendererChannel<T>, RendererToMainChannel<T>
{
	readonly channelName: string
	readonly onUpdate: (then: (data: T) => void) => void
	readonly send: (data: T) => void

	/**
	 * Creates a new channel, with communication from Main to Renderer, as well
	 * as Renderer to Main.
	 * @param channelName The namespace of the channel; must be unique
	 */
	constructor(channelName: string)
	{
		this.channelName = channelName
		this.onUpdate = (then: (data: T) => void) => {
			if (windowMenuExists())
			{
				// @ts-ignore
				window.menu.receive(channelName, then)
			}
		}
		this.send = (data: T) => {
			if (windowMenuExists())
			{
				// @ts-ignore
				window.menu.send(channelName, deepClone(data))
			}
		}
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
