<script lang="ts">
    import { ExpenseCategory } from "$lib/utils";
    import Dropdown from "./Dropdown.svelte";
    import ExpenseOverviewChart from "./ExpenseOverviewChart.svelte";
    import Select from "./Select.svelte";
    import YearPicker from "./YearPicker.svelte";

    enum ExpenseChartTimeframe {
        YEAR = "YEAR",
        MONTH = "MONTH",
    }

    type ExpensesPerCategory = {
        [K in ExpenseCategory]: number;
    };

    let selectedTimeframeIndex: number = 0;
    let selectedTimeframe: ExpenseChartTimeframe;
    let selectedYear: number = new Date().getFullYear();

    $: {
        if (selectedTimeframeIndex === 0) {
            selectedTimeframe = ExpenseChartTimeframe.YEAR;
        } else {
            selectedTimeframe = ExpenseChartTimeframe.MONTH;
        }
    }

    function handleSelectedYearChange(newYear: number) {
        selectedYear = newYear;
    }

</script>

<div>
    <span style="font-size: 26px; font-weight: 600;">Überblick</span>
    <YearPicker on:changeSelected={event => handleSelectedYearChange(event.detail)}></YearPicker>
    <ExpenseOverviewChart selectedYear={selectedYear}></ExpenseOverviewChart>
</div>
