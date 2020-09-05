<style>
	.grid {
		display: grid;
		gap: 5px;
	}

  .grid--inactive {
    backdrop-filter: blur(5px);
  }
</style>
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
import Item from './Item.svelte';

  const dispatch = createEventDispatcher();

  export let grid: number[];
  export let state: number[];
  export let size: number;
  export let isActive: boolean;

  const onClick = (event: CustomEvent<{ index: number }>) => {
    dispatch('click', {
      index: event.detail.index,
    });
  };

  const gridStyle = `grid-template-columns: repeat(${size}, min-content)`;
</script>

<div class='grid {(!isActive) && 'grid--inactive'}' 
  style={gridStyle}>
  {#each grid as item, itemIndex}
  <Item index={itemIndex}
    type={item}
    state={state[itemIndex]}
    on:click={onClick}
  />
  {/each}
</div>
