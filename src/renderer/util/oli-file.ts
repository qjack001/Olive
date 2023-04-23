import { ColorName } from './paper-color'

/**
 * Character object represents a single character printed on the page.
 */
export interface Character
{
	/** X-axis position on page, relative to the page (not window) */
	posX: number

	/** Y-axis position on page, relative to the page (not window) */
	posY: number

	/** A unique ID used for tracking within the Vue renderer */
	id: string

	/** String representation of the character */
	value: string

	/** Whether this is a character drawn in Erase Mode or not.
	 * If true, letter is printed using background color */
	erase: boolean
}

export type Point = null |
{
	x: number,
	y: number,
	w: number,
	o: number,
}

export const FILE_EXTENSION = ".oli"

export interface OliFileVersion1
{
	version: 1.0
	content: Character[]
	penMarkings?: Point[]
	paperColor?: ColorName
}

export type OliFile = OliFileVersion1
