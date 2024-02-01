<script lang="ts">
    import { onMount } from "svelte";
    import ExpenseListItem from "./ExpenseListItem.svelte";
    import Select from "./Select.svelte";
    import type { Expense } from "$lib/types";
    import {
        addExpenseModalOpened,
        selectedMonth,
        selectedMonthExpensesByMostExpensive,
        selectedMonthExpensesByNewest,
        addExpenseModalData,
        addExpenseModalEditMode,
        selectedMonthExpenses,

        currentMonthExpenses

    } from "$lib/store";
    import MonthPicker from "./MonthPicker.svelte";
    import { ExpenseCategory } from "$lib/utils";

    let mounted = false;

    onMount(() => {
        mounted = true;
    });

    $: {
        if (mounted) {
            if (selectedSorting === 0) {
                items = $selectedMonthExpensesByNewest;
            } else {
                items = $selectedMonthExpensesByMostExpensive;
            }
        }
    }

    let items: Expense[] = [];
    let selectedSorting: number = 0;

    async function deleteExpense(id: string): Promise<void> {
        const res = await fetch(`http://192.168.178.146:8000/expenses/${id}`, {
            method: "DELETE",
        });
        if (res.ok) {
            $currentMonthExpenses  = $currentMonthExpenses.filter(
                (item) => item.id !== id,
            );
            $selectedMonthExpenses = $selectedMonthExpenses.filter(
                (item) => item.id !== id,
            );
        }
    }

    function formatCurrency(value: number): string {
        // Convert the number to a string using fixed point notation
        let fixedValue = value.toFixed(2);

        // Replace dot with comma for the decimal part
        fixedValue = fixedValue.replace(".", ",");

        // Add thousand separators
        let parts = fixedValue.split(",");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        return parts.join(",");
    }

    function editExpense(id: string): void {
        let amount = items.find((item) => item.id === id)?.amount;
        let amountString;
        if (amount) {
            amountString = formatCurrency(amount);
        }
        $addExpenseModalData = {
            id,
            amount: amountString ?? "",
            name: items.find((item) => item.id === id)?.name ?? "",
            category:
                items.find((item) => item.id === id)?.category ??
                ExpenseCategory.SONSTIGES,
        };
        $addExpenseModalOpened = true;
        $addExpenseModalEditMode = true;
    }
</script>

<div class="mb-3">
    <div class="d-flex align-items-center justify-content-between">
        <span style="font-size: 26px; font-weight: 600;">Ausgaben</span>
    </div>
    <div class="d-flex justify-content-between align-items-center mb-2">
        <Select
            items={["neu", "teuer"]}
            on:changeSelected={(event) => (selectedSorting = event.detail)}
        ></Select>
        <MonthPicker
            on:changeSelected={(event) => ($selectedMonth = event.detail)}
        ></MonthPicker>
    </div>
    {#if items.length === 0}
        <div
            class="d-flex justify-content-center align-items-center border border-light rounded px-2"
            style="height: 100px"
        >
            <span class="text-muted" style="text-align: center; font-size: 14px"
                >Keine Ausgaben für den ausgewählten Zeitraum</span
            >
        </div>
    {/if}
    {#each items as item, index}
        <ExpenseListItem
            amount={item.amount}
            date={item.date}
            name={item.name}
            id={item.id}
            category={item.category}
            editAction={(id) => editExpense(id)}
            deleteAction={deleteExpense}
        ></ExpenseListItem>
        {#if items.length !== index}
            <div class="p-1"></div>
        {/if}
    {/each}
</div>

<style>
</style>
