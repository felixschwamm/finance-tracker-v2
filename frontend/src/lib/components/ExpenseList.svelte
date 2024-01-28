<script lang="ts">
    import type { ExpenseCategory } from "$lib/utils";
    import { onMount } from "svelte";
    import Dropdown from "./Dropdown.svelte";
    import ExpenseListItem from "./ExpenseListItem.svelte";
    import Select from "./Select.svelte";

    onMount(() => {
        updateExpenses(ExpenseQuerySort.NEWEST);
    });

    let items: ExpenseListItem[] = [];

    type ExpenseListItem = {
        date: Date;
        title: string;
        amount: number;
        category?: ExpenseCategory;
        id: string;
    };

    enum ExpenseQuerySort {
        NEWEST = "NEWEST",
        EXPENSIVE = "EXPENSIVE",
    }

    async function updateExpenses(sort: ExpenseQuerySort): Promise<void> {
        const res = await fetch("http://192.168.178.146:8000/expenses?sort=" + sort.toString())
        const json = await res.json();
        items = json.map((item: any) => ({
            title: item.name,
            date: new Date(item.date),
            amount: item.amount,
            category: item.category,
            id: item.id,
        }));
    }

    async function deleteExpense(id: string): Promise<void> {
        const res = await fetch(`http://192.168.178.146:8000/expenses/${id}`, {
            method: "DELETE",
        });
        if (res.ok) {
            items = items.filter((item) => item.id !== id);
        }
    }

    const dropdownItems = [
        "Jan 2024",
        "Feb 2024",
        "Mär 2024",
        "Apr 2024",
        "Mai 2024",
        "Jun 2024",
        "Jul 2024",
        "Aug 2024",
        "Sep 2024",
        "Okt 2024",
        "Nov 2024",
        "Dez 2024"
    ]
</script>

<div>
    <div class="d-flex align-items-center justify-content-between">
        <span style="font-size: 26px; font-weight: 600;">Ausgaben</span>
    </div>
    <div class="d-flex justify-content-between align-items-center mb-2">
        <Select items={["neu", "teuer"]} on:changeSelected={event => updateExpenses(event.detail === 0 ? ExpenseQuerySort.NEWEST : ExpenseQuerySort.EXPENSIVE)}></Select>
        <Dropdown items={dropdownItems}></Dropdown>
    </div>
    {#if items.length === 0}
        <div class="d-flex justify-content-center align-items-center border border-light rounded px-2" style="height: 100px">
            <span class="text-muted" style="text-align: center; font-size: 14px">Keine Ausgaben für den ausgewählten Zeitraum</span>
        </div>
    {/if}
    {#each items as item, index}
        <ExpenseListItem
            amount={item.amount}
            date={item.date}
            title={item.title}
            id={item.id}
            category={item.category}
            editAction={() => console.log("edit")}
            deleteAction={deleteExpense}
        ></ExpenseListItem>
        {#if items.length !== index}
            <div class="p-1"></div>
        {/if}
    {/each}
    <div class="d-flex justify-content-center mb-4" style="margin-top: -17px">
        <button
            class="btn bg-white text-primary border-light rounded"
            style="z-index: 99;">2 mehr anzeigen</button
        >
    </div>
</div>

<style>
</style>
