import { ColorName } from './paper-color'
import { v4 as uuid } from 'uuid'

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
type CompressedText = [number, number, string, boolean] | [number, number, string]
type CompressedPen = [number, number, number, number] | null

export interface CompressedOliFile
{
	version: 2.0
	text?: CompressedText[]
	pen?: CompressedPen[]
	color?: ColorName
}


export function compress(file: OliFile): CompressedOliFile
{
	const version = 2.0
	const color = file.paperColor

	const text: CompressedText[] | undefined = file.content?.map((char) => {
		return (char.erase)
			? [char.posX, char.posY, char.value, char.erase]
			: [char.posX, char.posY, char.value]
	})

	const pen: CompressedPen[] | undefined = file.penMarkings?.map((point) => {
		return (point == null)
			? null
			: [round(point.x), round(point.y), round(point.w), point.o]
	})

	return { version, text, pen, color }
}

export function uncompress(file: CompressedOliFile): OliFile
{
	const version = 1.0
	const paperColor = file.color

	const content: Character[] | undefined = file.text?.map((char, index) => {
		return {
			posX: char[0],
			posY: char[1],
			value: char[2],
			erase: char[3] ?? false,
			id: uuid(),
		}
	})

	const penMarkings: Point[] | undefined = file.pen?.map((point) => {
		if (point == null) {
			return null
		}
		
		return {
			x: point[0],
			y: point[1],
			w: point[2],
			o: point[3],
		}
	})

	return { version, content, penMarkings, paperColor }
}

function round(num: number): number
{
	return Math.round(num * 100) / 100
}