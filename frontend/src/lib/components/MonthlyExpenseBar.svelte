<script lang="ts">
    import { getCategoryColor, ExpenseCategory } from "$lib/utils";
    import {budget, currentMonthExpenses, currentMonthExpensesTotal} from "$lib/store";
    import ExpenseChartPerCategory from "./ExpenseChartPerCategory.svelte";
    import type { Expense } from "$lib/types";

    type ExpensesPerCategory = {
        [K in ExpenseCategory]: number;
    };

    let expensesPerCategory: ExpensesPerCategory;
    let currentBudget: number = 0;

    $: currentBudget = $budget;

    $: {
        expensesPerCategory = getExpensesPerCategoryFromExpenses($currentMonthExpenses);
    }

    function getExpensesPerCategoryFromExpenses(expenses: Expense[]): ExpensesPerCategory {
        const expensesPerCategory: ExpensesPerCategory = {
            WOHNEN: 0,
            ESSEN: 0,
            GESUNDHEIT: 0,
            KLEIDUNG: 0,
            TRANSPORT: 0,
            FREIZEIT: 0,
            SONSTIGES: 0,
        };

        expenses.forEach((expense) => {
            expensesPerCategory[expense.category as ExpenseCategory] += expense.amount;
        });

        return expensesPerCategory;
    }

    function getTotalAmountSpent(expenses: ExpensesPerCategory): number {
        return Object.values(expenses).reduce((total: number, current: number) => total + current, 0);
    }
</script>

<div>
    <div
        class="d-flex w-100"
        style="height: 20px; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; overflow: hidden;"
    >
        {#each Object.entries(expensesPerCategory) as [category, categoryValue]}
            <div
                style={`background-color: #${getCategoryColor(
                    category,
                )}; width: ${(categoryValue / currentBudget) * 100}%`}
            ></div>
        {/each}
        <div
            class="flex-grow-1 border border-light border-start-0"
            style="border-top-right-radius: 5px; border-bottom-right-radius: 5px"
        ></div>
    </div>
    <div
        class="border border-light border-top-0 w-auto px-2 d-flex align-items-center"
        style="width: fit-content !important; border-bottom-left-radius: 5px; padding-top: 2px; padding-bottom: 2px; border-bottom-right-radius: 5px"
    >
        <span style="font-size: 14px">{$currentMonthExpensesTotal.toFixed(2).replace(".", ",")} / {currentBudget} €</span>
        <span style="font-size: 12px" class="text-muted ms-1">ausgegeben</span>
    </div>
</div>

<style>
</style>
