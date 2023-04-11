<template>
	<section class="help-document">
		<h1>
			How to use
		</h1>
		<section>
			<h2>Write</h2>
			<p>
				Type until you reach the end of the page; the bell will ding to
				warn you when you're close. Press <b>Enter</b> to advance to the
				next line. Write on top of text to bold letters, add an underline,
				or create novel letter combinations.
			</p>
			<h2>Move</h2>
			<p>
				Use the arrow keys to move around the page. Hold <b>Shift</b> to
				move in large steps, and <b>{{ isMac ? 'Option' : 'Alt' }}</b> to
				move in smaller increments. 
			</p>
			<h2>Erase</h2>
			<p>
				Press the <b>{{ isMac ? 'Delete' : 'Backspace' }}</b> key to
				black-out the previous letter. Press <b>{{ isMac ? 'Command & Delete' : 'Control & Backspace' }}</b>
				to toggle in and out of Erase Mode -- type overtop of your previous
				text in this mode to erase it (this may require multiple passes). 
			</p>
			<ol class="erase-cursor-graphic">
				<li>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 9" fill="currentColor">
						<path d="M14.01 9H0V0h2v5.5h.37l.88-2.23A2 2 0 015.11 2H9.9a2 2 0 011.86 1.27l.88 2.23H13V0h2v9z"/>
					</svg>
					<p>Solid cursor means regular text.</p>
				</li>
				<li>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 9" fill="none" stroke="currentColor" stroke-width="1">
						<path d="M14.01 9H0V0h2v5.5h.37l.88-2.23A2 2 0 015.11 2H9.9a2 2 0 011.86 1.27l.88 2.23H13V0h2v9z"/>
					</svg>
					<p>Outlined cursor means erasing text.</p>
				</li>
			</ol>
			<h2>Print</h2>
			<p>
				Export your document to PDF by pressing <b>{{ isMac ? 'Command & P' : 'Control & P' }}</b>,
				or selecting <b>"Export to PDF"</b> in the menu (under <b>"File"</b>).
			</p>
		</section>
	</section>
</template>

<script setup lang="ts">
	import { ref } from 'vue'

	const isMac = ref(false)
	window.menu?.receive('os', (os: string) => isMac.value = (os == 'darwin'))
</script>

<style scoped>
	.help-document
	{
		margin: 40px;
	}

	h1
	{
		text-align: center;
	}

	.help-document section
	{
		display: grid;
		grid-template-columns: 1fr 4fr;
		gap: 20px 40px;

		margin: 40px 0 0;
	}

	h2, b
	{
		font-family: 'Atari';
		font-weight: bold;
		font-size: 0.8rem;
		letter-spacing: 0.03em;
		text-align: center;
		margin: 1em 0;

		-webkit-text-stroke: 0.5px currentColor;
	}

	p
	{
		text-indent: 4ch;
		letter-spacing: 0.1em;
		line-height: 1.3;
		margin: 0;
	}

	ol.erase-cursor-graphic
	{
		grid-column: 1 / -1;
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 40px;
	}

	ol.erase-cursor-graphic li,
	ol.erase-cursor-graphic p
	{
		display: block;
		text-align: center;
		font-style: italic;
		font-size: 0.75rem;

		max-width: 140px;
		text-indent: 0;
	}

	ol.erase-cursor-graphic svg
	{
		width: 30px;
		margin-bottom: 10px;
	}
</style>