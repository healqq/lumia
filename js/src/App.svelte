<script lang="ts">
	import Service from './Service';
	import Grid from './Grid.svelte';
	
	const getData = async () => {
			try {
				const { field: {layout, state, size} } = await Service.sendRestart();
				return { layout, state, size };
			} catch (e) {
				throw e;
			}
	};




	let layout;
	let state;
	let size;
	let promise;
	let isGameFinished: boolean = false;

	const handleEvent = async (event) => {
		console.log(event);
		const { state: { field }, isFinished } = await Service.sendAction(event.detail.index);
		isGameFinished = isFinished;
		state = field.state;
	};

	const onRestartClick = () => {
		isGameFinished = false;
		init();
	};

	const init = () => {
		promise = getData()
		.then(data => {
			layout = data.layout;
			state = data.state;
			size = data.size;
		});
	};

init();
</script>

{#if isGameFinished}
<button on:click={onRestartClick}>
	restart game
</button>
{/if}
{#await promise}
	<p>...waiting</p>
{:then _}
	<Grid 
		isActive={!isGameFinished}
		grid={layout} 
		state={state} 
		size={size}
		on:click={handleEvent}/>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
