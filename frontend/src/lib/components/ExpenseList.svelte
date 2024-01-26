<script lang="ts">
    import type { ExpenseCategory } from "$lib/utils";
    import ExpenseListItem from "./ExpenseListItem.svelte";
    import Select from "./Select.svelte";

    export let items: ExpenseListItem[] = [];

    let selectedSort = 0;

    /* $: console.log(selectedSort); */

    type ExpenseListItem = {
        date: Date;
        title: string;
        amount: number;
        category?: ExpenseCategory;
    };
</script>

<div>
    <div class="d-flex align-items-center justify-content-between">
        <span style="font-size: 26px; font-weight: 600;">Ausgaben</span>
        <span style="font-size: 14px;" class="text-muted">letzte 30 Tage</span>
    </div>
    <Select items={['neuste', 'teuerste']} bind:selected={selectedSort}></Select>
    {#each items as item, index}
        <ExpenseListItem
            amount={item.amount}
            date={item.date}
            title={item.title}
            category={item.category}
        ></ExpenseListItem>
        {#if items.length !== index}
            <div class="p-1"></div>
        {/if}
    {/each}
    <div class="d-flex justify-content-center mb-4" style="margin-top: -17px">
        <button class="btn bg-white text-primary border-light rounded" style="z-index: 99;"
            >2 mehr anzeigen</button
        >
    </div>
</div>

<style>
</style>
