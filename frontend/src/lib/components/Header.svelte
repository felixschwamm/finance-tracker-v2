<script lang="ts">
    import { budget, currentMonthExpensesTotal } from "$lib/store";
    import { formatEuro } from "$lib/utils";

    let remainingBudget = 0;

    $: remainingBudget = $budget - $currentMonthExpensesTotal;

    function getMonthShortName(month: number): string {
        const monthNames = [
            "Jan",
            "Feb",
            "Mär",
            "Apr",
            "Mai",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Okt",
            "Nov",
            "Dez",
        ];

        return monthNames[month];
    }

    function getCurrentMonth(): number {
        return new Date().getMonth();
    }
</script>

<div class="d-flex justify-content-between align-items-center">
    <div>
        <div class="d-flex align-items-center" style={`margin-bottom: -10px; ${remainingBudget < 0 ? 'color: #b82e2e;' : ''}`}>
            <span style="font-weight: 600; font-size: 36px">
                {formatEuro(remainingBudget)}
            </span>
                <span style="font-size: 24px; font-weight: 600;">&nbsp;€</span>
        </div>
        <span class="text-muted">übrig für {getMonthShortName(getCurrentMonth())}</span>
    </div>
    <div
        style="height: 45px; width: 45px; background-color: black; border-radius: 45px;"
    ></div>
</div>

<style>
</style>
