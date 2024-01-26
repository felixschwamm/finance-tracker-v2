<script lang="ts">
    import { ExpenseCategory } from "$lib/utils";


    import CategorySelection from "./CategorySelection.svelte";
import FullWidthInput from "./FullWidthInput.svelte";

    export let opened = false;

    let amountInput: FullWidthInput;
    let activePage = 2;
    let nameInputValue = "";

</script>

<style>
    .closed {
        transform: translateY(100%);
    }

    .active {
        transform: translateX(0%) !important;
    }
</style>


<div
    class:closed={!opened}
    class="w-100 h-100 bg-white"
    style="position: fixed; left: 0; top: 0; z-index: 999; transition: .2s ease-out;"
>
    <div class:active={activePage === 0} class="w-100 h-50 d-flex align-items-center position-fixed" style="flex-direction: column; transform: translateX(-100%); top: 0; left: 0">
        <div
            class="flex-grow-1 d-flex justify-content-center align-items-center"
            style="flex-direction: column;"
        >
            <span class="mb-3" style="text-align: center; font-size: 18px"
                >Betrag</span
            >
            <FullWidthInput fontSize={60} bind:this={amountInput}></FullWidthInput>
        </div>
        <div class="d-flex justify-content-between w-100 p-3">
            <button on:click={() => opened = !opened} class="btn text-primary rounded">Abbrechen</button>
            <button on:click={() => activePage = 1} class="btn btn-primary rounded bg-primary">Weiter</button>
        </div>
    </div>
    <div class:active={activePage === 1} class="w-100 h-50 d-flex align-items-center position-fixed" style="flex-direction: column; transform: translateX(-100%); top: 0; left: 0">
        <div
            class="flex-grow-1 d-flex justify-content-center align-items-center"
            style="flex-direction: column;"
        >
            <span class="mb-3" style="text-align: center; font-size: 18px"
                >Bezeichnung</span
            >
            <FullWidthInput on:changeText={val => nameInputValue = val.detail} type="text" bind:this={amountInput} maxWidth={0.9}></FullWidthInput>
            <span class="mt-4" style="font-size: 14px;">{nameInputValue.length} / 40 Zeichen</span>
        </div>
        <div class="d-flex justify-content-between w-100 p-3">
            <button on:click={() => activePage = 0} class="btn text-primary rounded">Zurück</button>
            <button on:click={() => activePage = 2} class="btn btn-primary rounded bg-primary">Weiter</button>
        </div>
    </div>
    <div class:active={activePage === 2} class="w-100 h-50 d-flex align-items-center position-fixed" style="flex-direction: column; transform: translateX(-100%); top: 0; left: 0">
        <div
            class="flex-grow-1 d-flex justify-content-center align-items-center"
            style="flex-direction: column;"
        >
            <span class="mb-3" style="text-align: center; font-size: 18px"
                >Kategorie</span
            >
            <CategorySelection recommendedCategory={ExpenseCategory.ESSEN}></CategorySelection>
        </div>
        <div class="d-flex justify-content-between w-100 p-3">
            <button on:click={() => activePage = 1} class="btn text-primary rounded">Zurück</button>
            <button class="btn btn-primary rounded bg-primary">Weiter</button>
        </div>
    </div>
</div>
