<style>
	.item {
		background-color: darkred;
		height: 40px;
    width: 40px;
    appearance: none;
    padding: 0;
    margin: 0;
	}

  .item--active {
    background-color: darkgreen;
  }

  .item--placeholder {
    background-color: gray;
  }
</style>
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let state: number;
  export let index: number;
  export let type: number;

  const onClick = (index: number) => {
    dispatch('click', {
      index,
    });
  };

  console.log(`state: ${state}`);
  $: stateClass = state === 1 ? 'item--active' : '';

</script>

{#if type > 0}
<button on:click={() => onClick(index)}
  class="item {stateClass}">
</button>
{:else}
	<div class="item item--placeholder"/>
{/if}



