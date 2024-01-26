<script lang="ts">
    import ExpenseOverviewChart from "./ExpenseOverviewChart.svelte";
import Select from "./Select.svelte";

    enum ExpenseChartTimeframe {
        YEAR = "YEAR",
        MONTH = "MONTH"
    }

    let selectedTimeframeIndex: number = 0;
    let selectedTimeframe: ExpenseChartTimeframe;

    $: {
        if (selectedTimeframeIndex === 0) {
            selectedTimeframe = ExpenseChartTimeframe.YEAR
        } else {
            selectedTimeframe = ExpenseChartTimeframe.MONTH
        }
    }

    $: console.log(selectedTimeframe);

</script>
<div>
    <span style="font-size: 26px; font-weight: 600;">Überblick</span>
    <Select items={['Jahr', 'Monat']} bind:selected={selectedTimeframeIndex}></Select>
    <ExpenseOverviewChart></ExpenseOverviewChart>
</div>
