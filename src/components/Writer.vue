<template>
	<input 
		id="writer"
		v-on:keydown="pressKey"
		v-on:keyup="checkDelete"
		@blur="refocus"
	>
	<p 
		id="output"
		:style="{ transform: 'translate(-'+position.x+'px, -'+position.y+'px)' }"
	>
		<span 
			v-for="char in characters.list" 
			:key="char.id"
			:style="{ left: char.posX, top: char.posY, /* opacity: char.opacity, transform: 'rotate('+char.rot+'deg)' */ }"
			:class="{ 'letter': true, 'erase': char.erase }"
		>
			{{ char.value }}
		</span>
	</p>
</template>

<script setup>
	import { reactive, onMounted } from 'vue'
	import Sounds from '../sounds'
	import useSoundWithRandomPitch from '../useSoundWithRandomPitch'
	import dingFx from '../assets/ding.mp3'
	import returnFx from '../assets/return.mp3'
	import clickFx from '../assets/click.mp3'
	import moveFx from '../assets/chunk.mp3'

	// constants for defining units of movement, cursor
	const widthUnit  =   8  // font-size: 14px
	const heightUnit =  18
	const maxWidth   = 672  // width: 672px, (baseUnit * 84)

	const { playSound: playDing } = useSoundWithRandomPitch(dingFx, 1, 1)
	const { playSound: playRt} = useSoundWithRandomPitch(returnFx, 1, 0.8)
	const { playSound: playClick } = useSoundWithRandomPitch(clickFx, 1, 0.1)
	const { playSound: playMove } = useSoundWithRandomPitch(moveFx, 1, 0.1)

	// sound effects
	const dingNoise  = Sounds.createNew("./ding.mp3",   1, 1)
	const rtNoise    = Sounds.createNew("./return.mp3", 1, 0.8)
	const clickNoise = Sounds.createNew("./click.mp3",  1, 0.1)
	const moveNoise  = Sounds.createNew("./chunk.mp3",  0.5, 0.01)

	// reactive vars: current position and list of all letter objects
	const position   = reactive({ x: 0, y: 0 })
	const characters = reactive({ list: [] })
	
	// keep track of whether or not the backspace/delete key is held down
	const deleteKeyPressed = reactive({ value: false })

	// focus writer immediatly
	onMounted(() => { document.getElementById('writer').focus() });

	// functions

	const movePositionX = (amount) =>
	{
		playMove()
		position.x += widthUnit * amount

		if (position.x > maxWidth - widthUnit)
		{
			position.x = maxWidth - widthUnit
		}
		else if (position.x < 0)
		{
			position.x = 0
		}

		if (position.x > maxWidth - (3 * widthUnit))
		{
			playDing()
		}
	}

	const movePositionY = (amount) =>
	{
		playMove()
		position.y += heightUnit * amount

		if (position.y < 0)
		{
			position.y = 0
		}
	}

	const pressKey = (e) =>
	{
		if (e.metaKey)
		{
			// gaurd agaisnt commands
			return
		}

		e.preventDefault()
		
		if (e.key != null && e.key === 'Unidentified')
		{
			console.log('unknown key event: '+e.keyCode)
		}
		else if (e.key == 'Escape')
		{
			document.body.classList.toggle("hide-ui")
		}
		else if (e.key == 'Enter')
		{
			movePositionY(1)

			if (position.x > (2 * widthUnit))
			{
				playRt() // only make return noise when more than 2 characters in
			}

			// animate cartridge return
			setTimeout(() => {
				let el = document.getElementById("output")
				el.classList.add("animate")
				movePositionX(-maxWidth)
				setTimeout(() => { el.classList.remove("animate") }, 400)
			}, 20)
		}
		else if (e.key == 'Tab')
		{
			playClick()
			movePositionX(4)
		}
		else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key))
		{
			handleMovment(e)
		}
		else if (e.key == 'Backspace')
		{
			deleteKeyPressed.value = true
		}
		else 
		{
			addLetter(e.key || '')
		}
	}

	const checkDelete = (e) =>
	{
		if (e.key == 'Backspace')
		{
			deleteKeyPressed.value = false
		}
	}

	const handleMovment = (e) =>
	{
		// if shift pressed move 5 units, if alt pressed move 0.2 units, otherwise move 1 unit
		let amount = (e.shiftKey) ? 5 : (e.altKey) ? 0.2 : 1

		if (e.key == 'ArrowLeft')
		{
			movePositionX(-amount)
		}
		else if (e.key == 'ArrowRight')
		{
			movePositionX(amount)
		}
		else if (e.key == 'ArrowUp')
		{
			movePositionY(-amount)
		}
		else if (e.key == 'ArrowDown')
		{
			movePositionY(amount)
		}
	}

	const addLetter = (letter) =>
	{
		if (letter.length != 1)
		{
			// non-printable key, skip
			return
		}

		characters.list.push({
			id: newId(),
			value: letter,
			posX: position.x+'px',
			posY: position.y+'px',
			erase: deleteKeyPressed.value
			// rot: newRotation(),
			// opacity: newOpacity()
		})

		playClick()
		movePositionX(1)
	}

	const newId = () =>
	{
		let alphabet = 'abcdefghijklmnopqrstuvwxyz'
					// letter from alphabet + epoch (first 5 digits removed, unnessesary)
		let newId = alphabet[Math.floor(Math.random() * alphabet.length)] + Date.now().toString().substring(5)
		return newId
	}

	// const newRotation = () =>
	// {
	// 	// between 2 and -2
	// 	return -2 + (Math.random() * 4)
	// }

	// const newOpacity = () =>
	// {
	// 	// between 0.7 and 1
	// 	return 0.7 + (Math.random() * 0.3)
	// }

	const refocus = () =>
	{
		document.getElementById('writer').focus()
	}

	const sleep = (ms) =>
	{
		const start = Date.now()
		let now = null
		do
		{
			now = Date.now()
		} while (now - start < ms)
	}
</script>

<style scoped>
	p
	{
		position: relative;
		width: 672px;
		margin: 50vh 0 0 calc(50vw - 7px); /* "start position" of cursor */

		/* if you want to see the <p>  */
		/* 
		background: pink;
		border: 2px solid black;
		min-height: 20px; 
		*/
	}

	p.animate
	{
		transition: transform 0.3s linear;
	}

	.letter
	{
		white-space: pre;
		opacity: 0.75;

		display: block;
		position: absolute;
	}

	.letter.erase
	{
		color: #fff !important;
		opacity: 0.9 !important;
		text-shadow: 0 0 1px #fff;
		-webkit-print-color-adjust: exact;
	}

	input
	{
		background: #555555;
		opacity: 0.15;
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
			margin: 16pt auto !important;
			transform: translate(0, 0) !important;
		}
	}
</style>
