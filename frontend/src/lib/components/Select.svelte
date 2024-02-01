<script lang="ts">

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher<{changeSelected: number}>();

    export let selected = 0;
    export let items: string[] = [];

    const selectedClasses = 'border-primary rounded bg-primary text-white me-2';
    const unselectedClasses = 'rounded bg-white border-light border-1 border me-2';

    function changeSelected(index: number) {
        selected = index;
        dispatch('changeSelected', index);
    }

</script>

<style>

</style>

<div class="d-flex align-items-center">
    {#each items as item, index}
        <div on:click={() => changeSelected(index)} class={index === selected ? selectedClasses : unselectedClasses} style="font-size: 14px; cursor: pointer; padding: 0 12px; line-height: 34px; min-width: 50px; text-align: center;">{item}</div>
    {/each}
</div>