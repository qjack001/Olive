<template>
	<canvas
		:id="elementId"
		:width="canvasWidth"
		:height="canvasHeight"
		:class="{ 'can-write': userPreferences.drawWithPen.value }"
	/>
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue'
	import { v4 as uuid } from 'uuid'
	import { Point } from '../util/oli-file'
	import { userPreferences } from '../util/preferences'
	import InfiniteCanvas, {
		InfiniteCanvasRenderingContext2D,
		InfiniteCanvasEventWithDefaultBehavior
	} from 'ef-infinite-canvas'
	
	
	type CanvasEvent = MouseEvent | PointerEvent

	const props = defineProps({penPoints: Array})
	const { penPoints } = props as {penPoints: Point[]}
	const context = ref<InfiniteCanvasRenderingContext2D>()

	defineEmits(['update:penPoints'])
	defineExpose({
		setOffset: (x: number, y: number) => {
			pageOffset.x = x
			pageOffset.y = y
		},
		drawAll: (points: Point[]) => {    
			points.map((point, i, points) => {
				drawLineWithPen(points[i - 1], point)
			})
		},
	})
	
	const MIN_WIDTH = 0.5
	const MAX_WIDTH = 2
	let isDrawing = false

	const elementId = uuid()

	// 32,767 maximum width or height, 268,435,456 maximum area
	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#maximum_canvas_size
	const canvasWidth = ref(1200 * 2)
	const canvasHeight = ref(8000)

	const mouseOffset = { x: 0, y: 0 }
	const pageOffset = { x: 0, y: 0 }

	const between = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
	const clamp = (min: number, wanted: number, max?: number) => Math.max(Math.min(wanted, max ?? wanted), min)

	function drawLineWithPen(lastPoint: Point, newPoint: Point) {
		if (newPoint == null || lastPoint == null) {
			return
		}
		
		context.value!.strokeStyle = `rgb(0 0 100 / ${newPoint.o}%)`
		context.value!.beginPath()
		context.value!.moveTo(lastPoint.x, lastPoint.y)
		context.value!.lineWidth = newPoint.w
		context.value!.lineTo(newPoint.x, newPoint.y)
		context.value!.stroke()
	}

	function startDrawing(event: CanvasEvent & InfiniteCanvasEventWithDefaultBehavior) {
		event.preventDefault(true)
		isDrawing = true
		penPoints.push({ 
			x: event.clientX + pageOffset.x + mouseOffset.x,
			y: event.clientY + pageOffset.y + mouseOffset.y,
			w: MAX_WIDTH,
			o: between(70, 80),
		})
	}

	function stopDrawing(event: CanvasEvent) {
		event.preventDefault()
		isDrawing = false
		penPoints.push(null)
	}

	function draw(event: CanvasEvent) {
		event.preventDefault()
		if (isDrawing) {
			const lastPoint = penPoints[penPoints.length - 1]

			// increment the last points line-width a random amount between -1 and 1
			const newWidth = (lastPoint?.w ?? MAX_WIDTH) + (Math.random() * 2) - 1

			const newPoint: Point = { 
				x: event.clientX + pageOffset.x + mouseOffset.x,
				y: event.clientY + pageOffset.y + mouseOffset.y,
				w: clamp(MIN_WIDTH, newWidth, MAX_WIDTH),
				o: between(70, 80),
			}

			drawLineWithPen(lastPoint, newPoint)
			penPoints.push(newPoint)
		}
	}

	function setCanvasSize() {
		mouseOffset.x = (-window.innerWidth * 0.5) + 1200
		mouseOffset.y = (-window.innerHeight * 0.5) + 800
	}

	onMounted(() => {
		const canvas = document.getElementById(elementId) as HTMLCanvasElement
		const infiniteCanvas = new InfiniteCanvas(canvas, { rotationEnabled: false })
		context.value = infiniteCanvas.getContext('2d')
		context.value.lineJoin = 'round'
		context.value.lineCap = 'round'

		infiniteCanvas.addEventListener('mousedown', startDrawing)
		infiniteCanvas.addEventListener('pointerdown', startDrawing)
		infiniteCanvas.addEventListener('mousemove', draw)
		infiniteCanvas.addEventListener('pointermove', draw)
		infiniteCanvas.addEventListener('mouseup', stopDrawing)
		infiniteCanvas.addEventListener('pointerup', stopDrawing)

		// no zooming or panning
		infiniteCanvas.addEventListener('wheel', (e) => e.preventDefault(true))

		setCanvasSize()
		window.addEventListener('resize', setCanvasSize)
	})
</script>

<style scoped>
	canvas
	{
		position: absolute;
		top: -800px;
		left: -1200px;
		z-index: 99;
		pointer-events: none;
	}

	canvas.can-write
	{
		pointer-events: all;
	}

	@media print
	{
		canvas
		{
			display: none;
		}
	}
</style>