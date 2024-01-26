<script lang="ts">
    import { ExpenseCategory } from "$lib/utils";
    import { getCategoryColor } from "$lib/utils";


    export let recommendedCategory: ExpenseCategory | undefined = undefined;

    const categories: string[] = [];
    
    for (let category in ExpenseCategory) {
        categories.push(category);
    }

</script>

{#each [...Array(3).keys()] as i}
    <div class="d-flex mb-1">
    <div class="rounded me-1 border border-light d-flex align-items-center position-relative" style={`height: 42px; width: 130px; ${recommendedCategory === categories[2*i] ? 'border-color: #' + getCategoryColor(categories[2*i]) + '!important' : ''};`}>
        {#if recommendedCategory === categories[2*i]}
        <span class="bg-white px-1" style="position: absolute; left: 50%; top: 0; font-size: 10px; transform: translateX(-50%) translateY(-50%)">EMPFOHLEN</span>
        {/if}
        <div style="height: 10px; width: 9px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; background-color: #{getCategoryColor(categories[2*i])}"></div>
        <span class="ms-2 w-100" style="text-align: center; font-size: 14px; transform: translateX(-9px); text-transform: capitalize;">{categories[2*i].toLocaleLowerCase()}</span>
    </div>
    <div class="rounded border border-light d-flex align-items-center position-relative" style={`height: 42px; width: 130px; ${recommendedCategory === categories[2*i + 1] ? 'border-color: #' + getCategoryColor(categories[2*i + 1]) + '!important' : ''};`}>
        {#if recommendedCategory === categories[2*i + 1]}
        <span class="bg-white px-1" style="position: absolute; left: 50%; top: 0; font-size: 10px; transform: translateX(-50%) translateY(-50%)">EMPFOHLEN</span>
        {/if}
        <div style="height: 10px; width: 9px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; background-color: #{getCategoryColor(categories[2*i + 1])}"></div>
        <span class="ms-2 w-100" style="text-align: center; font-size: 14px; transform: translateX(-9px); text-transform: capitalize;">{categories[2*i + 1].toLocaleLowerCase()}</span>
    </div>
    </div>

{/each}