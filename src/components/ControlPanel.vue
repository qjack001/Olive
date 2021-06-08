<template>
	<section>
		<logo/>
		<p>
			Use the arrow keys to navigate the paper around. SHIFT + arrow keys moves 
			in bigger jumps, ALT + arrow keys moves in micro jumps. Press CMD+P to export
			as a PDF.
		</p>
		<div class="radio-box" v-on:change="updateFont">
			<input type="radio" name="font" id="font-radio-1" checked><label for="radio-1">Modern</label>
			<input type="radio" name="font" id="font-radio-2"><label for="radio-2">Very Old</label>
			<input type="radio" name="font" id="font-radio-3"><label for="radio-3">Italic</label>
		</div>
	</section>
</template>

<script setup>
	import Logo from './Logo.vue'

	const updateFont = () =>
	{
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
		font-size: 0.6em;
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

	input[type=radio]
	{
		visibility: hidden;
	}

	.radio-box
	{
		pointer-events: all;
		border-radius: 5px;
		position: relative;
		overflow: hidden;
		background: #c2c2c2;
		width: 70ch;
		z-index: 99;
		margin: 10px auto;
	}
	
	.radio-box input[type=radio]
	{
		display: none;
	}

	.radio-box label
	{
		display: inline-block;
		padding: 4px 10px;
		cursor: pointer;
		border-radius: 4px;
		color: #ffffff;
		margin: 3px 0;
	}

	.radio-box input[type=radio]:checked + label
	{
		background: #f6f6f6;
		color: rgba(0, 0, 0, 0.6);
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
