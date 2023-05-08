<template>
	<input 
		id="writer"
		v-on:keydown="pressKey"
		@blur="refocus"
	>
	<p 
		:class="{ animate, disappearing }"
		:style="{
			transform: `translate(${-position.x}px,${-position.y}px)`,
			filter: (userPreferences.inkBleed.value) ? 'blur(0.3px)' : 'none',
		}"
	>
		<span 
			v-for="char in characters.list" 
			:key="char.id"
			:style="{ left: `${char.posX}px`, top: `${char.posY}px` }"
			:class="{ 'letter': true, 'erase': char.erase }"
		>
			{{ char.value }}
		</span>
		<template v-if="userPreferences.pageMarkers.value">
			<div id="horizontal" class="page-marker" :style="{ transform: `translateY(${position.y}px)` }"/>
			<div id="vertical" class="page-marker" :style="{ top: `${getVerticalPageMarkerPosition()}px` }"/>
		</template>
		<drawing-canvas v-model:penPoints="penPoints.list" ref="drawingCanvas"/>
	</p>
</template>

<script setup lang="ts">
	import { reactive, onMounted, ref, watch } from 'vue'
	import { v4 as uuid } from 'uuid'
	import { Channel } from '../util/electron'
	import { userPreferences } from '../util/preferences'
	import { Character, OliFile, Point } from '../util/oli-file'
	import { useSound } from '@vueuse/sound'
	import smackSfx from '/sounds/smack.mp3'
	import chunkSfx from '/sounds/chunk.mp3'
	import dingSfx from '/sounds/ding.mp3'
	import returnSfx from '/sounds/return.mp3'
	import DrawingCanvas from './DrawingCanvas.vue'


	// constants for defining units of movement, cursor
	const widthUnit = 9 // font-size: 16px
	const heightUnit = 24
	const maxWidth = (widthUnit * 84)

	// reactive vars: current position and list of all letter objects
	const position = reactive({ x: 0, y: 0 })
	const characters = reactive({ list: [] as Character[] })

	const drawingCanvas = ref()
	const penPoints = reactive({ list: [] as Point[] })

	const initialPenPoints = reactive({ list: [] as Point[] })

	
	// keep track of whether or not the backspace/delete key is held down
	const deleteKeyPressed = reactive({ value: false })
	const deletePosition = reactive({ x: 0 })

	//
	const animate = ref(false)
	const disappearing = ref(false)

	// sound effects
	const { play: typeSound } = useSound(smackSfx, { volume: 0.05, interrupt: true })
	const { play: moveSound } = useSound(chunkSfx, { volume: 0.02, interrupt: true })
	const { play: dingSound } = useSound(dingSfx, { volume: 4, interrupt: false })
	const { play: returnSound } = useSound(returnSfx, { volume: 1, interrupt: false, playbackRate: 1.5 })


	function pressKey(e: KeyboardEvent): void
	{
		// guard against key commands
		if (e.metaKey)
		{
			if (e.key == 'Backspace') {
				Channel.ERASE_MODE.send(!deleteKeyPressed.value)
			}

			return
		}

		e.preventDefault()

		/* for movement, adjust amount based on modifier keys.
		 * if shift pressed move 5 units,
		 * if alt pressed move 0.2 units,
		 * otherwise move 1 unit
		 */
		let amount = (e.shiftKey) ? 5 : (e.altKey) ? 0.2 : 1
		
		switch (e.key)
		{
			case 'Enter': return cartridgeReturn()
			case 'Tab': return movePositionX(4)
			case 'ArrowLeft': return movePositionX(-amount)
			case 'ArrowRight': return movePositionX(amount)
			case 'ArrowUp': return movePositionY(-amount)
			case 'ArrowDown': return movePositionY(amount)
			case 'Backspace': return handleDelete()
			default: addLetter(e.key ?? '')
		}
	}

	function cartridgeReturn(): void
	{
		// only make return noise when more than 2 characters in
		if (userPreferences.otherSounds.value && position.x > (2 * widthUnit))
		{
			returnSound()
		}

		movePositionY(1)

		// animate cartridge return
		setTimeout(() => {
			animate.value = true
			movePositionX(-maxWidth)
			setTimeout(() => { animate.value = false }, 400)
		}, 20)
	}

	function addLetter(letter: string): void
	{
		if (letter.length != 1)
		{
			// non-printable key, skip
			return
		}

		if (letter != ' ') {
			if (userPreferences.otherSounds.value) {
				typeSound()
			}
			
			characters.list.push({
				id: uuid(),
				value: letter,
				posX: position.x,
				posY: position.y,
				erase: deleteKeyPressed.value,
			})

			// newly added text; alert when leaving page until saved
			window.onbeforeunload = () => true
		}

		movePositionX(1)
	}

	function movePositionX(amount: number): void
	{
		position.x += widthUnit * amount

		if (position.x > maxWidth - widthUnit)
		{
			position.x = maxWidth - widthUnit
			deletePosition.x = position.x
			return
		}
		else if (position.x < 0)
		{
			position.x = 0
			deletePosition.x = position.x
			return
		}

		if (userPreferences.otherSounds.value) {
			// add slight variation to each ka-chunk
			moveSound({ playbackRate: (Math.random() * 0.1) + 0.9 })
		}

		// when nearing the end, ding the alarm
		if (position.x > maxWidth - (5 * widthUnit))
		{
			if (userPreferences.bellSound.value) {
				// add slight variation to each ding
				dingSound({ playbackRate: (Math.random() * 0.02) + 0.98 })
			}
		}

		deletePosition.x = position.x
	}

	function movePositionY(amount: number): void
	{
		position.y += heightUnit * amount

		if (position.y < 0)
		{
			position.y = 0
			return
		}

		if (userPreferences.otherSounds.value) {
			moveSound()
		}
	}

	function handleDelete(): void
	{
		deletePosition.x -= widthUnit
		if (deletePosition.x < 0)
		{
			deletePosition.x = 0
		}

		characters.list.push({
			id: uuid(),
			value: '▆', // replace with ▋ for larger strike-out character
			posX: deletePosition.x,
			posY: position.y,
			erase: false,
		})
	}

	function getVerticalPageMarkerPosition(): number
	{
		const linesPerPage = 40.4 // correct for slight drift (only accurate to ~5 pages)
		const pageHeight = (heightUnit * linesPerPage)
		const currentPage = Math.round(position.y / pageHeight) || 1 // minimum: 1
		return heightUnit * Math.round(linesPerPage * currentPage) // round to nearest line
	}

	function refocus(): void
	{
		document.getElementById('writer')?.focus()
	}

	onMounted(() => {

		Channel.FILE_CONTENT.onUpdate((file: OliFile) => {
			characters.list = file.content ?? []
			initialPenPoints.list = file.penMarkings ?? []

			// delay drawing, since it can block all other processes and takes a while
			setTimeout(() => drawingCanvas.value.drawAll(initialPenPoints.list), 100)
		})

		Channel.SAVE_REQUEST.onUpdate(() => {
			
			Channel.FILE_CONTENT.send({
				version: 1.0,
				content: characters.list,
				penMarkings: [...initialPenPoints.list, ...penPoints.list]
			})

			// allow closing without alert now that content is saved
			window.onbeforeunload = () => undefined
		})

		Channel.ERASE_MODE.onUpdate((modeValue) => deleteKeyPressed.value = modeValue)

		Channel.DISAPPEARING_MODE.onUpdate((modeValue) => disappearing.value = modeValue)

		refocus() // focus writer immediately on load
	})

	watch(position, () => drawingCanvas.value.setOffset(position.x, position.y))
	watch(penPoints, () => {
		// newly added pen scribbles; alert when leaving page until saved
		window.onbeforeunload = () => true
	})
</script>

<style scoped>
	p
	{
		position: relative;
		width: 672px;
		/* "start position" of cursor */
		margin: 50vh 0 0 calc(50vw - 7px);
		pointer-events: none;

		mix-blend-mode: multiply;
	}

	p.animate
	{
		transition: transform 0.3s linear;
	}

	.letter
	{
		white-space: pre;
		opacity: 0.85;
		text-align: center;
		width: calc(v-bind(widthUnit) * 1px);

		display: block;
		position: absolute;
		-webkit-text-stroke: 0.5px currentColor;
	}

	.letter.erase
	{
		color: var(--background) !important;
		opacity: 0.9 !important;
		text-shadow: 0 0 1px var(--background);
		-webkit-print-color-adjust: exact;
		print-color-adjust: exact;
	}

	.disappearing .letter
	{
		animation: fade-away 5s ease-in;
		animation-fill-mode: forwards;
	}

	@keyframes fade-away
	{
		to { opacity: 0 }
	}

	input
	{
		/* dims background when focus is lost */
		background: var(--tint);
		transition: opacity 0.3s ease;

		display: block;
		position: fixed;
		width: 100%;
		height: 100vh;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		
		border: none;
		box-shadow: none;
		outline: none;
		border-radius: 0;
		color: transparent;
		user-select: none;
		pointer-events: none;
	}

	input:focus, input:focus-within
	{
		opacity: 0;
	}

	.page-marker
	{
		background: currentColor;
		opacity: 0.3;
		position: absolute;
		pointer-events: none;
	}

	#horizontal.page-marker
	{
		width: 1.5px;
		height: 9px;

		right: -90px;
		top: 14px;
	}

	#vertical.page-marker
	{
		width: 9px;
		height: 1.5px;

		left: -16px;
		transform: translateY(-5px);
	}

	@media print
	{
		p#output, p
		{
			margin: 16pt 0px !important;
			transform: translate(0, 0) !important;
		}

		#horizontal.page-marker,
		#vertical.page-marker
		{
			display: none;
		}

		.disappearing .letter
		{
			opacity: 1;
			animation: none;
		}
	}
</style>
