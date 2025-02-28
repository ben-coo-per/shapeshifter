<script lang="ts">
	import { svgStore } from '$lib/svgStore';
	let gptStyle = ``;
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
		getSVG(words[0]);
	}
</script>

<svelte:head>
	{@html `<style>${gptStyle}</style>`}
</svelte:head>

<main class="gpt-main">
	<div class="gpt-header header">
		<h1>SHFTR</h1>
	</div>
	<h3 class="gpt-text">Enter three words to generate a style</h3>
	<form onsubmit={handleSubmit} class="header__words">
		<input class="gpt-input" type="text" />
		+
		<input class="gpt-input" type="text" />
		+
		<input class="gpt-input" type="text" />
		<button class="gpt-button" type="submit">=</button>
	</form>

	<slot></slot>
</main>

<style>
	main {
		margin: -8px;
		padding: 8px;
	}
	.header {
		padding: 10px 20px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.header__words {
		display: flex;
		gap: 10px;
		align-items: center;
	}
</style>
