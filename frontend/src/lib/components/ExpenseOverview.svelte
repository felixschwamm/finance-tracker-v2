<script lang="ts">
    import { ExpenseCategory } from "$lib/utils";
    import Dropdown from "./Dropdown.svelte";
    import ExpenseOverviewChart from "./ExpenseOverviewChart.svelte";
    import Select from "./Select.svelte";

    enum ExpenseChartTimeframe {
        YEAR = "YEAR",
        MONTH = "MONTH",
    }

    type ExpensesPerCategory = {
        [K in ExpenseCategory]: number;
    };

    export let loadExpensesPerCategory: (
        year: number,
    ) => Promise<ExpensesPerCategory[]>;

    let selectedTimeframeIndex: number = 0;
    let selectedTimeframe: ExpenseChartTimeframe;

    $: {
        if (selectedTimeframeIndex === 0) {
            selectedTimeframe = ExpenseChartTimeframe.YEAR;
        } else {
            selectedTimeframe = ExpenseChartTimeframe.MONTH;
        }
    }

    $: console.log(selectedTimeframe);
</script>

<div>
    <span style="font-size: 26px; font-weight: 600;">Überblick</span>
    <div class="mb-2">
        <Dropdown
            items={["2023", "2024", "2025"]}
        ></Dropdown>
    </div>
    <ExpenseOverviewChart {loadExpensesPerCategory}></ExpenseOverviewChart>
</div>
