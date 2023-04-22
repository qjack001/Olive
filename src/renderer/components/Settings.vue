<template>
	<section>
		<h1>Preferences</h1>
		<div>
			<label for="color-select">
				<h3>Default paper color</h3>
				<p>The color chosen for new documents</p>
			</label>
			<select
				id="color-select"
				v-model="userPreferences.defaultPaperColor.value"
				@change="updatePreferences"
			>
				<option :value="undefined">Random</option>
				<option v-for="color in ALL_COLORS" :value="color">
					{{ capitalize(color) }}
				</option>
			</select>
		</div>
		<div>
			<label for="ink-bleed-toggle">
				<h3>Ink bleed</h3>
				<p>Soften the edges of letters and pen marks</p>
			</label>
			<input
				type="checkbox"
				id="ink-bleed-toggle"
				v-model="userPreferences.inkBleed.value"
				@change="updatePreferences"
			/>
			<label class="toggle" for="ink-bleed-toggle"/>
		</div>
		<div>
			<label for="page-marker-toggle">
				<h3>Page markers</h3>
				<p>Show small indicators to mark where the page ends (horizontally and vertically)</p>
			</label>
			<input
				type="checkbox"
				id="page-marker-toggle"
				v-model="userPreferences.pageMarkers.value"
				@change="updatePreferences"
			/>
			<label class="toggle" for="page-marker-toggle"/>
		</div>
		<div>
			<label for="bell-toggle">
				<h3>Bell sound</h3>
				<p>Ding the bell when approaching the end of the page</p>
			</label>
			<input
				type="checkbox"
				id="bell-toggle"
				v-model="userPreferences.bellSound.value"
				@change="updatePreferences"
			/>
			<label class="toggle" for="bell-toggle"/>
		</div>
		<div>
			<label for="sounds-toggle">
				<h3>Typewriter sounds</h3>
				<p>Play sounds when the page moves and when letters are printed</p>
			</label>
			<input
				type="checkbox"
				id="sounds-toggle"
				v-model="userPreferences.otherSounds.value"
				@change="updatePreferences"
			/>
			<label class="toggle" for="sounds-toggle"/>
		</div>
	</section>
</template>

<script setup lang="ts">
	import { ALL_COLORS } from '../paper-color'
	import { updatePreferences, userPreferences } from '../preferences'	

	function capitalize(text: string) {
		return text.charAt(0).toUpperCase() + text.slice(1)
	}
</script>

<style scoped>
	section
	{
		padding: 20px 40px;
		text-align: center;
	}

	div
	{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		margin-top: 40px;

		text-align: start;
	}

	label h3
	{
		margin: 5px 0;

		font-family: 'Atari';
		font-weight: bold;
		font-size: 0.8rem;
		letter-spacing: 0.03em;
		-webkit-text-stroke: 0.5px currentColor;
	}

	label p
	{
		font-style: italic;
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		margin: 0;
		max-width: 45ch;
	}

	select
	{
		margin: 0;
		display: block;
		box-sizing: border-box;
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		outline: none;

		line-height: 1em;
		height: 2em;
		padding: 0.4em 3.5em 0.4em 1em;

		background-color: var(--background);
		border: 1px solid currentColor;
		border-radius: 8px;
		font: inherit;
		letter-spacing: 0.08em;

		background-image:
			linear-gradient(45deg, transparent 50%, currentColor 50%),
			linear-gradient(135deg,  currentColor 50%, transparent 50%),
			linear-gradient(to right,  var(--tint),  var(--tint));
		background-position:
			calc(100% - 20px) calc(0.8em),
			calc(100% - 15px) calc(0.8em),
			100% 0;
		background-size:
			5px 5px,
			5px 5px,
			2.5em 2.5em;
		background-repeat: no-repeat;
	}

	select:focus-visible
	{
		outline: 2px solid var(--tint);
	}

	input[type=checkbox]
	{
		opacity: 0;
		position: absolute;
		width: 0;
		height: 0;
	}

	.toggle
	{
		outline: 0;
		display: block;
		width: 3em;
		height: 1.5em;
		position: relative;
		cursor: pointer;
		user-select: none;

		background: var(--background);
		border-radius: 2em;
		padding: 2px;
		transition: background-color 0.2s ease;
		border: 1px solid currentColor;
	}

	.toggle::before
	{
		content: "OFF";

		position: absolute;
		display: block;
		width: 50%;
		height: 100%;
		right: 0;

		line-height: 1.5rem;
		font-size: 0.6rem;
		letter-spacing: 0.1em;
		text-align: center;
		
		opacity: 0.8;
		transition: opacity 0.2s ease;
	}

	.toggle::after
	{
		position: relative;
		display: block;
		content: "";
		width: 50%;
		height: 100%;
		left: 0;
		will-change: padding;

		border-radius: 2em;
		background: var(--tint);
		transition: left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), padding 0.3s ease, margin 0.3s ease;
		box-shadow: inset 0 0 0 1px currentColor;
	}

	.toggle:active::before
	{
		opacity: 0;
	}

	.toggle:active::after
	{
		padding-right: 0.8em;
	}

	input[type=checkbox]:checked + .toggle
	{
		background: var(--tint);
	}

	input[type=checkbox]:checked + .toggle::before
	{
		content: "ON";
		left: 0;
		right: unset;
	}

	input[type=checkbox]:checked + .toggle::after
	{
		left: 50%;
	}

	input[type=checkbox]:checked + .toggle:active::after
	{
		margin-left: -0.8em;
	}
</style>