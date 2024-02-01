<script lang="ts">
    import { PUBLIC_BASE_URL } from "$env/static/public";
    import { expensesPerCategoryForSelectedYear, fetchExpensesPerCategoryForSelectedYear } from "$lib/store";
    import { ExpenseCategory, getCategoryColor } from "$lib/utils";
    import { onMount } from "svelte";

    type ExpensesPerCategory = {
        [K in ExpenseCategory]: number;
    };

    let mounted = false;

    onMount(() => {
        mounted = true;
    });

    export let selectedYear: number = 2024;

    $: mounted && updateExpensesPerCategoryForSelectedYear(selectedYear);
    $: $expensesPerCategoryForSelectedYear.length !== 0 && update($expensesPerCategoryForSelectedYear);

    function updateExpensesPerCategoryForSelectedYear(year: number) {
        fetchExpensesPerCategoryForSelectedYear(year).then((expenses) => {
            $expensesPerCategoryForSelectedYear = expenses;
        });
    }

    let expensesPerCategory: ExpensesPerCategory[] = Array(12).fill({
        ESSEN: 0,
        FREIZEIT: 0,
        GESUNDHEIT: 0,
        KLEIDUNG: 0,
        TRANSPORT: 0,
        WOHNEN: 0,
        SONSTIGES: 0,
    });

    let selectedMonth: number = 0;

    let barWidths = {
        ESSEN: "0%",
        FREIZEIT: "0%",
        GESUNDHEIT: "0%",
        KLEIDUNG: "0%",
        TRANSPORT: "0%",
        WOHNEN: "0%",
        SONSTIGES: "0%",
    };
    let barHeights = Array(12).fill({
        ESSEN: "0%",
        FREIZEIT: "0%",
        GESUNDHEIT: "0%",
        KLEIDUNG: "0%",
        TRANSPORT: "0%",
        WOHNEN: "0%",
        SONSTIGES: "0%",
    })

    $: barWidths = calculateBarWidthsForAllCategories(selectedMonth);

    async function fetchExpensesPerCategory(year: number): Promise<ExpensesPerCategory[]> {
        const res = await fetch(PUBLIC_BASE_URL + "/overview/" + year);
        const json = await res.json();
        return json;
    }

    function update(expenses: ExpensesPerCategory[]) {
        expensesPerCategory = expenses;
        barWidths = calculateBarWidthsForAllCategories(selectedMonth);
        barHeights = calculateBarHeight();
    }

    function getMaxExpense(expenses: ExpensesPerCategory): number {
        return Object.values(expenses).reduce((max, current) => {
            if (current > max) {
                return current;
            }
            return max;
        }, 0);
    }

    function calculateBarHeight(): { [K in ExpenseCategory]: string }[] {

        const maxSumOfAllMonths = expensesPerCategory.reduce((max, current) => {
            const sum = Object.values(current).reduce((sum, current) => sum + current, 0);
            if (sum > max) {
                return sum;
            }
            return max;
        }, 0);

        return expensesPerCategory.map((expenses) => {
    
            const sum = Object.values(expenses).reduce((sum, current) => sum + current, 0);

            return Object.entries(expenses).reduce((barHeights, [category, expense]) => {
                if (sum === 0) {
                    barHeights[category as ExpenseCategory] = "0%";
                    return barHeights;
                }
                barHeights[category as ExpenseCategory] = `${(expense / maxSumOfAllMonths) * 100}%`;
                return barHeights;
            }, {} as { [K in ExpenseCategory]: string });
        });
    }

    function calculateBarWidthsForAllCategories(month: number): {
        [K in ExpenseCategory]: string;
    } {
        const maxExpense = getMaxExpense(expensesPerCategory[month]);
        return Object.entries(expensesPerCategory[month]).reduce(
            (barWidths, [category, expense]) => {
                if (maxExpense === 0) {
                    barWidths[category as ExpenseCategory] = "0%";
                    return barWidths;
                }
                barWidths[category as ExpenseCategory] = `${
                    (expense / maxExpense) * 100
                }%`;
                return barWidths;
            },
            {} as { [K in ExpenseCategory]: string },
        );
    }

    function getMonthName(month: number): string {
        const date = new Date();
        date.setMonth(month);
        return date.toLocaleString("de-DE", { month: "long" });
    }

    function getMonthShortName(month: number): string {
        const date = new Date();
        date.setMonth(month);
        return date.toLocaleString("de-DE", { month: "short" });
    }

    function formatCurrency(number: number): string {
        // if the number has no decimal places keep it as it is and if it has more than 2 decimal places round it to 2 decimal places if it has less than 2 decimal places add 0 to the end
        const formattedNumber = number.toFixed(2);
        // replace . with , for the decimal part
        return formattedNumber.replace(".", ",");
    }

</script>

<div class="border rounded border-light overflow-hidden">
    <div class="border-bottom border-light p-3 pb-0">
        <div class="d-flex pb-1" style="width: 100%; height: 150px; overflow-x: auto; user-select: none;"> <!-- overflow-x: scroll; -->
            {#each Array.from({ length: 12 }) as _, index}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                    style={`flex: 1; flex-direction: column; font-size: 11px; text-align: center; min-width: 32px; opacity: ${index === selectedMonth ? "1" : "0.3"}`}
                    class="h-100 d-flex text-muted align-items-center"
                    on:click={() => selectedMonth = index}
                >
                    <div class="flex-grow-1 d-flex justify-content-end align-items-center" style="border-radius: 2px; overflow: hidden; flex-direction: column;">
                        {#each Object.values(ExpenseCategory) as category, categoryIndex}
                            <div style={`width: 14px; transition: height .2s ease-out; background-color: #${getCategoryColor(category.toUpperCase())}; height: ${barHeights[index][category]}; ${categoryIndex === 0 ? "border-top-left-radius: 2px; border-top-right-radius: 2px" : ""}`}></div>
                        {/each}
                    </div>
                    <div style="height: 16px;" class="d-flex justify-content-center align-items-center mt-1">
                        {#if index % 2 == 0}
                            <span style="text-transform: uppercase;">{getMonthShortName(index)}</span>
                        {:else}
                            <div
                                style="width: 2px; height: 5px; background: #aaa; border-radius: 2px"
                            ></div>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
        <div class="mb-2" style="font-weight: 600; font-size: 20px;">
            {getMonthName(selectedMonth)} {selectedYear}
        </div>
    </div>
    <div>
        <div class="d-flex">
            <div
                style="background-color: #f6f6f6; min-width: 110px"
                class="border-end border-light px-2"
            >
                {#each Object.keys(ExpenseCategory) as category}
                    <div
                        class="w-100"
                        style="text-align: end; font-size: 14px; text-transform: capitalize; line-height: var(--expenses-per-category-line-height)"
                    >
                        {category.toLowerCase()}
                    </div>
                {/each}
            </div>
            <div class="w-100 d-flex">
                <div class="flex-grow-1">
                    {#each Object.values(ExpenseCategory) as category}
                        <div
                            class="d-flex align-items-center"
                            style="height: var(--expenses-per-category-line-height)"
                        >
                            <div
                                style={`background-color: #${getCategoryColor(
                                    category.toUpperCase(),
                                )}; transition: width .2s ease-out; width: ${
                                    barWidths[category]
                                }; height: 7px; border-top-right-radius: 30px; border-bottom-right-radius: 30px`}
                            ></div>
                        </div>
                    {/each}
                </div>
                <div>
                    {#each Object.values(ExpenseCategory) as category}
                        <div
                            class="w-100 px-2"
                            style="line-height: var(--expenses-per-category-line-height); text-align: right; font-size: 14px;"
                        >
                            {formatCurrency(expensesPerCategory[selectedMonth][category])} €
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    :root {
        --expenses-per-category-line-height: 28px;
    }
</style>
