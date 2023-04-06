<template>
	<input 
		id="writer"
		v-on:keydown="pressKey"
		@blur="refocus"
	>
	<p 
		id="output"
		:style="{ transform: 'translate(-'+position.x+'px, -'+position.y+'px)' }"
	>
		<span 
			v-for="char in characters.list" 
			:key="char.id"
			:style="{ left: char.posX+'px', top: char.posY+'px' }"
			:class="{ 'letter': true, 'erase': char.erase }"
		>
			{{ char.value }}
		</span>
	</p>
</template>

<script setup lang="ts">
	import { reactive, onMounted } from 'vue'
	import { v4 as uuid } from 'uuid'
	import { useSound } from '@vueuse/sound'
	import smackSfx from '/sounds/smack.mp3'
	import chunkSfx from '/sounds/chunk.mp3'
	import dingSfx from '/sounds/ding.mp3'
	import returnSfx from '/sounds/return.mp3'

	type character = {
		posX: number,
		posY: number,
		id: string,
		value: string,
		erase: boolean,
	}

	// constants for defining units of movement, cursor
	const widthUnit = 9 // font-size: 16px
	const heightUnit = 24
	const maxWidth = (widthUnit * 84)

	// reactive vars: current position and list of all letter objects
	const position = reactive({ x: 0, y: 0 })
	const characters = reactive({ list: [] as character[] })
	
	// keep track of whether or not the backspace/delete key is held down
	const deleteKeyPressed = reactive({ value: false })
	const deletePosition = reactive({ x: 0 })

	// sound effects
	const { play: typeSound } = useSound(smackSfx, { volume: 0.1, interrupt: true })
	const { play: moveSound } = useSound(chunkSfx, { volume: 0.02, interrupt: true })
	const { play: dingSound } = useSound(dingSfx, { volume: 4, interrupt: false })
	const { play: returnSound } = useSound(returnSfx, { volume: 1, interrupt: false, playbackRate: 1.5 })


	function pressKey(e: KeyboardEvent): void
	{
		if (e.metaKey)
		{
			// guard against key commands
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
		if (position.x > (2 * widthUnit))
		{
			// only make return noise when more than 2 characters in
			returnSound()
		}

		movePositionY(1)

		// animate cartridge return
		setTimeout(() => {
			let el = document.getElementById('output')
			el?.classList.add('animate')
			movePositionX(-maxWidth)
			setTimeout(() => { el?.classList.remove('animate') }, 400)
		}, 20)
	}

	function addLetter(letter: string): void
	{
		if (letter.length != 1)
		{
			// non-printable key, skip
			return
		}

		characters.list.push({
			id: uuid(),
			value: letter,
			posX: position.x,
			posY: position.y,
			erase: deleteKeyPressed.value,
		})

		if (letter != ' ') {
			// only visible letters strike the page
			typeSound()
		}

		window.onbeforeunload = () => true // alert when leaving page until saved
		movePositionX(1)
	}

	function movePositionX(amount: number): void
	{
		// add slight variation to each ka-chunk
		moveSound({ playbackRate: (Math.random() * 0.1) + 0.9 })
		position.x += widthUnit * amount

		if (position.x > maxWidth - widthUnit)
		{
			position.x = maxWidth - widthUnit
		}
		else if (position.x < 0)
		{
			position.x = 0
		}

		// when nearing the end, ding the alarm
		if (position.x > maxWidth - (5 * widthUnit))
		{
			// add slight variation to each ding
			dingSound({ playbackRate: (Math.random() * 0.02) + 0.98 })
		}

		deletePosition.x = position.x
	}

	function movePositionY(amount: number): void
	{
		moveSound()
		position.y += heightUnit * amount

		if (position.y < 0)
		{
			position.y = 0
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

	function refocus(): void
	{
		document.getElementById('writer')?.focus()
	}

	onMounted(() => {

		window.menu?.receive('file_content', (data: string) => {
			characters.list = JSON.parse(data)
		})
		window.menu?.receive('save_request', () => {
			window.menu?.send('file_content', JSON.stringify(characters.list))
			window.onbeforeunload = () => undefined // allow closing without alert
		})

		window.menu?.receive('erase_mode', (modeValue: boolean) => {
			deleteKeyPressed.value = modeValue
		})

		refocus() // focus writer immediatly on load
	})
</script>

<style scoped>
	p
	{
		position: relative;
		width: 672px;
		/* "start position" of cursor */
		margin: 50vh 0 0 calc(50vw - 7px);
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

	input
	{
		/* dims background when focus is lost */
		background: var(--tint);
		transition: opacity 0.3s ease;

		display: block;
		position: fixed;
		width: 100%;
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
	}

	input:focus, input:focus-within
	{
		opacity: 0;
	}

	@media print
	{
		p#output, p
		{
			margin: 16pt 0px !important;
			transform: translate(0, 0) !important;
		}
	}
</style>
