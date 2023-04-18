<template>
	<component
		v-if="!dismissed"
		:is="(href) ? 'a' : 'div'"
		class="notification"
		:href="props.href"
		target="_blank"
	>
		<button aria-label="dismiss notification" @click="dismiss">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="presentation">
				<path d="M18 6 6 18M6 6l12 12"/>
			</svg>
		</button>
		<div>
			<h3>{{ props.title }}</h3>
			<p>{{ props.message }}</p>
		</div>
		<hr v-if="props.href || props.isDownload"/>
		<svg v-if="props.isDownload" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5 5 5-5m-5 5V3"/>
		</svg>
		<svg v-else-if="props.href" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m4-3h6v6m-11 5L21 3"/>
		</svg>
	</component>
</template>

<script setup lang="ts">
	import { ref } from 'vue'

	const props = defineProps({
		title: String,
		message: String,
		href: String,
		isDownload: Boolean,
	})

	const dismissed = ref(false)

	function dismiss(event: MouseEvent) {
		event.preventDefault()
		dismissed.value = true
	}
</script>

<style scoped>
	.notification
	{
		background-color: var(--tint);
		backdrop-filter: blur(5px);
		border-radius: 10px;
		width: 290px;
		max-width: 80vw;
		box-sizing: border-box;
		padding: 15px 25px;
		user-select: none;
		box-shadow: 0 5px 10px 5px rgb(0 0 0 / 5%),
			0px 2px 4px 0 rgb(0 0 0 / 10%),
			inset 0 0 0 1px rgb(0 0 0 / 15%);

		position: fixed;
		top: 10px;
		right: 10px;
		z-index: 99999;

		display: flex;
		flex-direction: row;
		gap: 20px;

		animation: slide-in 0.8s cubic-bezier(0, 0.5, 0, 1);
	}

	a.notification
	{
		cursor: pointer;
		color: currentColor;
		text-decoration: none;
	}

	.notification button
	{
		position: absolute;
		top: -8px;
		left: -10px;
		width: 25px;
		height: 25px;

		background: var(--background);
		border: none;
		border-radius: 100%;
		padding: 5px;
		margin: 0;
		outline: none;
		box-shadow: 0 5px 10px 5px rgb(0 0 0 / 5%),
			0px 2px 4px 0 rgb(0 0 0 / 10%),
			inset 0 0 0 1px rgb(0 0 0 / 15%);

		
		display: flex;
		align-items: center;
		justify-content: center;

		cursor: pointer;
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.notification:hover button,
	.notification button:focus
	{
		opacity: 1;
	}

	.notification button:active
	{
		background-image: linear-gradient(var(--tint), var(--tint));
	}

	.notification button svg
	{
		stroke: currentColor;
		stroke-width: 1.5;
		opacity: 0.8;
		width: 100%;
	}

	.notification h3
	{
		text-transform: uppercase;
		margin: 0;
		margin-bottom: 5px;
		font-weight: normal;
		font-size: 1rem;
		letter-spacing: 0.08em;
		opacity: 0.8;
	}

	.notification p
	{
		font-style: italic;
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		margin: 0;
		opacity: 0.7;
	}

	.notification hr
	{
		display: block;
		width: 1px;
		border: none;
		background: currentColor;
		opacity: 0.3;
	}

	.notification > svg
	{
		fill: none;
		stroke: currentColor;
		stroke-width: 1px;
		max-width: 2rem;
		width: 100%;
		opacity: 0.8;
	}

	@keyframes slide-in
	{
		from { transform: translateX(200%) }
		to { transform: translateX(0) }
	}

	@media print
	{
		.notification
		{
			display: none;
		}
	}
</style>