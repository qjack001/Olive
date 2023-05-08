<template>
	<div>
		<label :for="id">
			<h3>{{ name }}</h3>
			<p>{{ description }}</p>
		</label>
		<input
			type="checkbox"
			:id="id"
			:checked="value"
			@change="$emit('update:value', ($event.target as HTMLInputElement).checked)"
		/>
		<label class="toggle" :for="id"/>
	</div>
</template>

<script setup lang="ts">
	import { v4 as uuid } from 'uuid'	

	const id = uuid()
	defineProps({
		name: String,
		description: String,
		value: Boolean,
	})
</script>

<style scoped>
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