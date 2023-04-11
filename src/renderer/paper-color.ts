type RGB = `rgb(${number}, ${number}, ${number})` | `rgb(${number} ${number} ${number})` | `rgb(${number} ${number} ${number} / ${number}%)`
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})` | `rgba(${number} ${number} ${number} / ${number}%)`
type HSL = `hsl(${number} ${number}% ${number}% / ${number}%)` | `hsl(${number}deg ${number}% ${number}% / ${number}%)` | `hsl(${number}deg ${number}% ${number}%)`
type HSLA = `hsla(${number} ${number}% ${number}% / ${number}%)` | `hsla(${number}deg ${number}% ${number}% / ${number}%)`
type HEX = `#${string}`
export type CssColor = RGB | RGBA | HSL | HSLA | HEX

export const ALL_COLORS = ['white', 'red', 'blue', 'green', 'lavender', 'pink', 'brown', 'ash'] as const

type ColorTuple = typeof ALL_COLORS
export type ColorName = ColorTuple[number]

export const Color: Record<ColorName, CssColor> = {
	white: '#fffcf6',
	red: '#cf7b7b',
	blue: '#b8c8e2',
	green: '#afe8c9',
	lavender: '#d0c0eb',
	pink: '#ffd4f9',
	brown: '#b19678',
	ash: '#282828'
}

export const TintColor: Record<ColorName, CssColor> = {
	white: 'hsla(40 32% 85% / 50%)',
	red: 'rgb(173 90 90 / 50%)',
	blue: 'rgb(141 163 203 / 50%)',
	green: 'rgb(117 195 153 / 50%)',
	lavender: 'rgb(170 152 202 / 50%)',
	pink: 'rgb(206 158 199 / 50%)',
	brown: 'rgb(151 120 84 / 50%)',
	ash: 'rgb(15 15 15 / 50%)',
}

export const DEFAULT_COLOR: ColorName = getRandomColor()

export function getRandomColor(): ColorName {
	const allButBlack = ALL_COLORS.filter((color) => color != 'ash')
	return allButBlack[Math.floor(Math.random() * allButBlack.length)]
}