<script>
	let gptStyle = `
   body {
  background-color: #3a3a3a;
  color: #d47f00;
  font-family: Arial, sans-serif;
}

.gpt-button {
  background-color: #d47f00;
  color: #3a3a3a;
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}

.gpt-button:hover {
  background-color: #bf6f00;
}

.gpt-input {
  background-color: #2a2a2a;
  color: #d47f00;
  border: 2px solid #d47f00;
  padding: 8px;
  font-size: 14px;
  border-radius: 4px;
}

.gpt-header {
  font-size: 24px;
  font-weight: bold;
  color: #d47f00;
  text-shadow: 2px 2px 5px #222;
}

.gpt-container {
  background-color: #222;
  padding: 20px;
  border-radius: 10px;
  box-shadow: inset 0 0 10px #111;
}

.gpt-animation-el {
  background-color: #d47f00;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0px 0px 10px #ff9e00;
  animation: goopyEffect 2s infinite alternate;
}

@keyframes goopyEffect {
  0% {
    transform: scale(1);
    filter: blur(2px);
  }
  100% {
    transform: scale(1.2);
    filter: blur(5px);
  }
}`;
</script>

<svelte:head>
	{@html `<style>${gptStyle}</style>`}
</svelte:head>

<div class="gpt-header header">
	<h1>SHFTR</h1>
	<div class="header__adjectives">
		<input class="gpt-input" type="text" value="trendy" />
		+
		<input class="gpt-input" type="text" value="orange" />
		+
		<input class="gpt-input" type="text" value="goop" />
		<button class="gpt-button">=</button>
	</div>
</div>
<slot />

<style>
	.header {
		padding: 10px 20px;
		text-align: center;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.header__adjectives {
		display: flex;
		gap: 10px;
		align-items: center;
	}
</style>
