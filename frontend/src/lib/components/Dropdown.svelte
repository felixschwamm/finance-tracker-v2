<script lang="ts">
    export let items: string[] = [];
    export let selected = 0;
</script>

<div
    style="line-height: 32px; min-width: 50px; text-align: center; width: fit-content"
    class="d-flex border-light rounded border overflow-hidden"
>
    <button
        on:click={() => selected = selected === 0 ? items.length - 1 : selected - 1}
        style="all: unset; background-color: hsl(0, 0%, 96%); border-right: 1px solid hsl(0, 0%, 90%); padding: 0 14px"
    >
        <i class="fa-solid fa-angle-left"></i>
    </button>
    <div class="d-flex h-100 align-items-center" style="padding: 0 8px;">
        <select style="all: unset; font-size: 14px" bind:value={selected}>
            {#each items as item, index}
                <option value={index}>{item}</option>
            {/each}
        </select>
        <div class="mb-1 ms-1">
            <i class="fa-solid fa-caret-down" style="font-size: 12px;"></i>
        </div>
    </div>
    <button
        on:click={() => selected = selected === items.length - 1 ? 0 : selected + 1}
        style="all: unset; background-color: hsl(0, 0%, 96%); border-left: 1px solid hsl(0, 0%, 90%); padding: 0 14px"
    >
        <i class="fa-solid fa-angle-right"></i>
    </button>
</div>
