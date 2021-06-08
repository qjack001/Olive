<template>
	<section class="controls">
		<logo/>
		<p>
			Use the arrow keys to navigate the cursor. [SHIFT] + arrow keys moves in large steps, 
			[ALT] + arrow keys moves in micro steps. Press [CMD] + P to export as a PDF. Press [ESC] to 
			hide this UI.
		</p>
		<div class="radio-box" v-on:change="updateFont">
			<input 
				value="modern" 
				type="radio" 
				name="font" 
				id="font-radio-1" 
				checked
			>
			<label for="font-radio-1">
				Modern
			</label>
			<input 
				value="classic" 
				type="radio" 
				name="font" 
				id="font-radio-2"
			>
			<label for="font-radio-2">
				Classic
			</label>
			<input 
				value="old" 
				type="radio" 
				name="font" 
				id="font-radio-3"
			>
			<label for="font-radio-3">
				Very Old
			</label>
			<input 
				value="italic"
				type="radio" 
				name="font" 
				id="font-radio-4"
			>
			<label for="font-radio-4">
				Italic
			</label>
		</div>
	</section>
</template>

<script setup>
	import Logo from './Logo.vue'

	const updateFont = () =>
	{
		let font = document.querySelector('input[name="font"]:checked').value
		document.body.className = font || ''
	}
</script>

<style scoped>
	section
	{
		z-index: 999;
		pointer-events: none;

		font-family: "modern-typewriter", "old-typewriter", "italic-typewriter", monospace;
		background: rgba(238, 238, 238, 0.5);
		backdrop-filter: blur(5px);

		position: fixed;
		top: calc(50vh + 23px);
		left: 0;
		right: 0;
		bottom: 0;

		text-align: center;
		font-size: 8.5px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	p
	{
		opacity: 0.6;

		max-width: 70ch;
		padding: 0 10px;
		margin: 0 auto;

	}

	.radio-box
	{
		pointer-events: all;
		user-select: none;
		position: relative;
		overflow: hidden;
		z-index: 99;
		margin: 10px auto;

		width: calc(70ch - 8px);
		max-width: 90%;
		background: #9a9a9a;
		border-radius: 5px;

		opacity: 0.6;
	}
	
	.radio-box input[type=radio]
	{
		display: none;
		visibility: hidden;
	}

	.radio-box label
	{
		display: inline-block;
		cursor: pointer;
		margin: 3px 0;
		padding: 4px 10px;
		
		color: #ffffff;
		border-radius: 4px;
	}

	.radio-box input[type=radio]:checked + label
	{
		background: #f6f6f6;
		color: #000000;
	}

	section *
	{
		transition: opacity 0.3s ease;
	}

	.hide-ui section *
	{
		opacity: 0;
		pointer-events: none;
	}

	@media print
	{
		section
		{
			opacity: 0 !important;
			display: none !important;
		}
	}
</style>
