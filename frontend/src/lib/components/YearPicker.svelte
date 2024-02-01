<script lang="ts">
    import { getMonthShortName } from "$lib/utils";
    import { createEventDispatcher } from "svelte";

    const currentYear = new Date().getFullYear();

    const dispatch = createEventDispatcher<{ changeSelected: number }>();

    let selectedYear = currentYear;

    function nextYear() {
        selectedYear++;
        dispatch("changeSelected", selectedYear);
    }

    function previousYear() {
        selectedYear--;
        dispatch("changeSelected", selectedYear);
    }

</script>

<div
    style="line-height: 32px; min-width: 50px; text-align: center; width: fit-content; background-color: hsl(0, 0%, 96%);"
    class="d-flex border-light rounded border overflow-hidden mb-2"
>
    <button
        on:click={() => previousYear()}
        style="all: unset; background-color: hsl(0, 0%, 96%); padding: 0 14px"
    >
        <i class="fa-solid fa-angle-left"></i>
    </button>
    <div class="d-flex h-100 align-items-center" style="padding: 0;">
        <span style="width: 80px;">{selectedYear}</span>
    </div>
    <button
        on:click={() => nextYear()}
        style="all: unset; background-color: hsl(0, 0%, 96%); padding: 0 14px"
    >
        <i class="fa-solid fa-angle-right"></i>
    </button>
</div>
