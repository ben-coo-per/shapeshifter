<script lang="ts">
	import { onMount } from 'svelte';
	import * as pl from 'planck-js';
	import { svgStore } from '$lib/svgStore';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let world: pl.World;

	interface FallingObject {
		body: pl.Body;
		img: HTMLCanvasElement;
		width: number;
		height: number;
	}

	let objects: FallingObject[] = [];

	/**
	 * Converts an SVG string into a Base64 image URI
	 */
	function svgToDataURI(svgString: string): string {
		const encoded = encodeURIComponent(svgString)
			.replace(/%20/g, ' ')
			.replace(/%3D/g, '=')
			.replace(/%3A/g, ':')
			.replace(/%2F/g, '/')
			.replace(/%22/g, "'");
		return `data:image/svg+xml,${encoded}`;
	}

	/**
	 * Creates a physics-enabled falling SVG object with bouncing effects.
	 */
	function createFallingSVG(
		x: number,
		y: number,
		svgString: string,
		width: number,
		height: number
	): void {
		// Create a physics body
		const body: pl.Body = world.createBody({
			type: 'dynamic',
			position: pl.Vec2(x, y)
		});

		body.createFixture(pl.Box(width / 2.5, height / 2.5), {
			density: 1,
			friction: 0.5,
			restitution: 0.2
		});

		// Create an offscreen canvas to render SVG to an image
		const offscreenCanvas: HTMLCanvasElement = document.createElement('canvas');
		offscreenCanvas.width = width;
		offscreenCanvas.height = height;
		const offCtx: CanvasRenderingContext2D | null = offscreenCanvas.getContext('2d');

		if (!offCtx) return;

		// Convert SVG string to Base64 data URI
		const img = new Image();
		img.src = svgToDataURI(svgString);

		img.onload = () => {
			offCtx.clearRect(0, 0, width, height);
			offCtx.drawImage(img, 0, 0, width, height);
			objects.push({ body, img: offscreenCanvas, width, height });
		};

		img.onerror = () => {
			console.error('Failed to load SVG:', svgString);
		};
	}

	/**
	 * Main update loop to sync physics simulation with rendering.
	 */
	function update(): void {
		world.step(1 / 60);
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		objects.forEach(({ body, img, width, height }) => {
			const pos = body.getPosition();
			const angle = body.getAngle();

			ctx.save();
			ctx.translate(pos.x, pos.y);
			ctx.rotate(angle);
			ctx.drawImage(img, -width / 2, -height / 2, width, height);
			ctx.restore();
		});

		requestAnimationFrame(update);
	}

	onMount(() => {
		if (!canvas) return;

		canvas.width = 800;
		canvas.height = 600;
		ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

		// Initialize physics world with slight gravity
		world = new pl.World(pl.Vec2(0, 100));

		// Create ground (static body)
		const ground: pl.Body = world.createBody();
		ground.createFixture(pl.Edge(pl.Vec2(0, canvas.height), pl.Vec2(canvas.width, canvas.height)), {
			friction: 1.0,
			restitution: 0.1
		});

		update();
	});

	// Track rendered SVGs
	let renderedSVGs: Set<string> = new Set();

	svgStore.subscribe((svgs) => {
		svgs.forEach((svg, index) => {
			if (!renderedSVGs.has(svg)) {
				createFallingSVG(Math.random() * window.innerWidth * 0.75, 75, svg, 75, 75);
				renderedSVGs.add(svg);
			}
		});
	});
</script>

<canvas bind:this={canvas} class="gpt-container"></canvas>

<style>
	canvas {
		display: block;
		width: 80%;
		height: 50%;
		margin: 16px auto 0 auto;
	}
</style>
