type RGB = `rgb(${number}, ${number}, ${number})` | `rgb(${number} ${number} ${number})` | `rgb(${number} ${number} ${number} / ${number}%)`
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})` | `rgba(${number} ${number} ${number} / ${number}%)`
type HSL = `hsl(${number} ${number}% ${number}% / ${number}%)` | `hsl(${number}deg ${number}% ${number}% / ${number}%)` | `hsl(${number}deg ${number}% ${number}%)`
type HSLA = `hsla(${number} ${number}% ${number}% / ${number}%)` | `hsla(${number}deg ${number}% ${number}% / ${number}%)`
type HEX = `#${string}`
export type CssColor = RGB | RGBA | HSL | HSLA | HEX

const ALL_COLORS = ['white', 'red', 'blue', 'green', 'purple', 'pink', 'brown', 'ash'] as const
type ColorTuple = typeof ALL_COLORS
export type ColorName = ColorTuple[number]

export const Color: Record<ColorName, CssColor> = {
	white: '#fffcf6',
	red: '#cc6b6b',
	blue: '#9db5de',
	green: '#9ddebb',
	purple: '#9f84d0',
	pink: '#ffd4f9',
	brown: '#a98b6a',
	ash: '#282828'
}

export const TintColor: Record<ColorName, CssColor> = {
	white: 'hsla(40 32% 85% / 50%)',
	red: 'rgb(165 78 78 / 50%)',
	blue: 'rgb(118 141 181 / 50%)',
	green: 'rgb(98 183 137 / 50%)',
	purple: 'rgb(126 100 173 / 50%)',
	pink: 'rgb(206 158 199 / 50%)',
	brown: 'rgb(144 111 72 / 50%)',
	ash: 'rgb(15 15 15 / 50%)',
}

export const DEFAULT_COLOR: ColorName = getRandomColor()

export function getRandomColor(): ColorName {
	const allButBlack = ALL_COLORS.filter((color) => color != 'ash')
	return allButBlack[Math.floor(Math.random() * allButBlack.length)]
}