<script lang="ts">
    import {
        fetchCurrentMonthExpenses,
        selectedMonthExpenses,
        currentMonthExpenses,
        selectedMonth,
        fetchExpenses,
        fetchBudget,
    } from "$lib/store";
    import { onMount } from "svelte";

    let firstLoadDone = false;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    onMount(async () => {
        await Promise.all([fetchCurrentMonthExpenses(), fetchBudget()]);
        selectedMonthExpenses.set($currentMonthExpenses);
        firstLoadDone = true;
    });

    $: {
        if (firstLoadDone) {
            if ($selectedMonth.month === currentMonth && $selectedMonth.year === currentYear) {
                selectedMonthExpenses.set($currentMonthExpenses);
            } else {
                updateSelectedMonthExpenses($selectedMonth.month, $selectedMonth.year);
            }
        }
    }

    async function updateSelectedMonthExpenses(month: number, year: number) {
        const expenses = await fetchExpenses(month, year);
        $selectedMonthExpenses = expenses;
    }
</script>

<slot />
