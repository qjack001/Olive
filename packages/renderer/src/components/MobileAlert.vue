<template>
	<div id="mobile-alert" role="dialog" :class="{ 'visible' : visible.value }">
		<logo/>
		<p>
			This app was not built for mobile and behaves poorly with 
			touchscreens. Please view it on a computer.
		</p>
		<button @click="dismiss">
			Take me to the app anyway
		</button>
	</div>
</template>

<script setup>
	import { reactive } from 'vue'
	import Logo from './Logo.vue'

	const visible = reactive({ value: true })

	const dismiss = () =>
	{
		visible.value = false
	}
</script>

<style scoped>
	#mobile-alert
	{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;

		background: #f6f6f6;
		color: rgba(0, 0, 0, 0.6);
		padding: 80px 40px;

		transition: opacity 0.6s ease-in;
	}

	p
	{
		font-family: "modern-typewriter", "classic-typewriter", "old-typewriter", "italic-typewriter", monospace;
		text-align: center;
		font-size: 12px;
		line-height: 1.8;
		letter-spacing: -0.02em;
		opacity: 0.8;

		max-width: 60ch;
		padding: 0 10px;
		margin: 0 auto;
	}

	button
	{
		font-family: "modern-typewriter", "classic-typewriter", "old-typewriter", "italic-typewriter", monospace;
		text-align: center;
		font-size: 12px;
		line-height: 1.8;
		letter-spacing: -0.02em;
		text-transform: uppercase;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

		display: block;
		margin: 30px auto;
		cursor: pointer;

		background: #c0c0c0;
		color: #ffffff;
		border: none;
		outline: none;
		box-shadow: inset 0 -2px 4px 0 rgba(0, 0, 0, 0.1);
		padding: 5px 12px;
		border-radius: 5px;
	}

	@media screen and (min-width: 480px)
	{
		#mobile-alert
		{
			display: none;
		}
	}

	@media screen and (max-width: 480px)
	{
		#mobile-alert.visible
		{
			opacity: 1;
		}

		#mobile-alert:not(.visible)
		{
			opacity: 0;
			pointer-events: none;
		}
	}

	@media print
	{
		#mobile-alert
		{
			opacity: 0 !important;
			display: none !important;
		}
	}
</style>
