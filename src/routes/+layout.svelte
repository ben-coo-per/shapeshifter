<script lang="ts">
	import { svgStore } from '$lib/svgStore';
	let gptStyle = `.gpt-container {
    border: 1px solid black;}`;
	let gptSVG = ``;

	async function getStyle(words: string) {
		const response = await fetch(`/get-style?words=${words}`);
		gptStyle = await response.json();
	}

	async function getSVG(word: string) {
		const response = await fetch(`/get-svg?word=${word}`);
		gptSVG = await response.json();

		if (gptSVG) {
			svgStore.update((svgs) => [...svgs, gptSVG]);
		}
	}

	function handleSubmit(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const words = Array.from(form.querySelectorAll('input')).map((input) => input.value);

		getStyle(words.join('+'));
		words.forEach((word) => getSVG(word));
	}
</script>

<svelte:head>
	{@html `<style>${gptStyle}</style>`}
</svelte:head>

<main class="gpt-main">
	<div class="gpt-header header">
		<h1>SHFTR</h1>
	</div>
	<slot></slot>
	<div class="controls">
		<h3 class="gpt-text">Enter three words to generate a style</h3>
		<form onsubmit={handleSubmit} class="control-form">
			<input class="gpt-input" type="text" />
			+
			<input class="gpt-input" type="text" />
			+
			<input class="gpt-input" type="text" />
			<button class="gpt-button" type="submit">=</button>
		</form>
	</div>
</main>

<style>
	main {
		margin: -8px;
		padding: 8px;
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
	}
	.header {
		padding: 10px 20px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.control-form {
		display: flex;
		gap: 10px;
		align-items: center;
	}
	.controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 20px;
	}
</style>
