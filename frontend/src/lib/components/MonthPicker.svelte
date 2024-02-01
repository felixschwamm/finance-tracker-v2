<script lang="ts">
    import { getMonthShortName } from "$lib/utils";
    import { createEventDispatcher } from "svelte";

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const dispatch = createEventDispatcher<{ changeSelected: { month: number; year: number } }>();

    export let selected: { month: number; year: number } = { month: currentMonth, year: currentYear };

    function nextMonth() {
        if (selected.month === 11) {
            selected.month = 0;
            selected.year++;
        } else {
            selected.month++;
        }
        dispatch("changeSelected", selected);
    }

    function previousMonth() {
        if (selected.month === 0) {
            selected.month = 11;
            selected.year--;
        } else {
            selected.month--;
        }
        dispatch("changeSelected", selected);
    }
</script>

<div
    style="line-height: 32px; min-width: 50px; text-align: center; width: fit-content; background-color: hsl(0, 0%, 96%);"
    class="d-flex border-light rounded border overflow-hidden"
>
    <button
        on:click={() => previousMonth()}
        style="all: unset; background-color: hsl(0, 0%, 96%); padding: 0 14px"
    >
        <i class="fa-solid fa-angle-left"></i>
    </button>
    <div class="d-flex h-100 align-items-center" style="padding: 0;">
        <span style="width: 80px;">{getMonthShortName(selected.month + 1) + ' ' + selected.year}</span>
    </div>
    <button
        on:click={() => nextMonth()}
        style="all: unset; background-color: hsl(0, 0%, 96%); padding: 0 14px"
    >
        <i class="fa-solid fa-angle-right"></i>
    </button>
</div>
