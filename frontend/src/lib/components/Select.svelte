<script lang="ts">

    export let selected = 0;
    export let items: string[] = [];

    const selectedClasses = 'border-primary rounded bg-primary text-white me-2 mb-2';
    const unselectedClasses = 'rounded bg-white border-light border-1 mb-2 border me-2';

</script>

<style>

</style>

<div class="d-flex align-items-center">
    {#each items as item, index}
        <div on:click={() => selected = index} class={index === selected ? selectedClasses : unselectedClasses} style="font-size: 14px; cursor: pointer; padding: 6px 12px">{item}</div>
    {/each}
</div>