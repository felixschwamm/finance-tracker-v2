<script lang="ts">
    import { ExpenseCategory } from "$lib/utils";
    import { getCategoryColor } from "$lib/utils";


    export let selectedCategory: ExpenseCategory = ExpenseCategory.SONSTIGES;

    const categories: string[] = [];
    
    for (let category in ExpenseCategory) {
        categories.push(category);
    }

</script>

{#each [...Array(3).keys()] as i}
    <div class="d-flex mb-1">
    <div on:click={() => selectedCategory = categories[2*i]} class="rounded me-1 border border-light d-flex align-items-center position-relative" style={`height: 42px; width: 130px; ${selectedCategory === categories[2*i] ? 'border-color: #' + getCategoryColor(categories[2*i]) + '!important' : ''};`}>
        <div style="height: 20px; width: 8px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; background-color: #{getCategoryColor(categories[2*i])}"></div>
        <span class="ms-2 w-100" style="text-align: center; font-size: 14px; transform: translateX(-9px); text-transform: capitalize;">{categories[2*i].toLocaleLowerCase()}</span>
    </div>
    <div on:click={() => selectedCategory = categories[2*i+1]} class="rounded border border-light d-flex align-items-center position-relative" style={`height: 42px; width: 130px; ${selectedCategory === categories[2*i + 1] ? 'border-color: #' + getCategoryColor(categories[2*i + 1]) + '!important' : ''};`}>
        <div style="height: 20px; width: 8px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; background-color: #{getCategoryColor(categories[2*i + 1])}"></div>
        <span class="ms-2 w-100" style="text-align: center; font-size: 14px; transform: translateX(-9px); text-transform: capitalize;">{categories[2*i + 1].toLocaleLowerCase()}</span>
    </div>
    </div>

{/each}

<div class="d-flex mb-1">
    <div on:click={() => selectedCategory = ExpenseCategory.SONSTIGES} class="rounded me-1 border border-light d-flex align-items-center position-relative" style={`height: 42px; width: 260px; ${selectedCategory === categories[6] ? 'border-color: #' + getCategoryColor(categories[6]) + '!important' : ''};`}>
        <div style="height: 20px; width: 8px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; background-color: #{getCategoryColor(categories[6])}"></div>
        <span class="ms-2 w-100" style="text-align: center; font-size: 14px; transform: translateX(-9px); text-transform: capitalize;">{categories[6].toLocaleLowerCase()}</span>
    </div>
</div>