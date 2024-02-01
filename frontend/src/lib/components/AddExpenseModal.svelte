<script lang="ts">
    import { ExpenseCategory } from "$lib/utils";
    import { onMount } from "svelte";

    import CategorySelection from "./CategorySelection.svelte";
    import FullWidthInput from "./FullWidthInput.svelte";
    import { PUBLIC_BASE_URL } from "$env/static/public";
    import {
        addExpenseModalData,
        addExpenseModalEditMode,
        addExpenseModalOpened,
        currentMonthExpenses,
        selectedMonthExpenses,
    } from "$lib/store";

    let amountInput: FullWidthInput;
    let activePage = 0;
    let modal: HTMLDivElement;
    let nameInputValue = "";
    let amountInputValue: string = "";
    let selectedCategory: ExpenseCategory = ExpenseCategory.SONSTIGES;

    $: {
        loadDataFromStore($addExpenseModalData);
    }

    $: {
        if ($addExpenseModalOpened) {
            //amountInput.focus();
            modal.scrollTo(0, 0);
            modal.style.overflow = "hidden";
        }
    }

    function scrollToTopAndDisableScroll() {
        window.scrollTo(0, 0);
        document.body.style.overflow = "hidden";
    }

    function loadDataFromStore(data: any) {
        if (data) {
            nameInputValue = data.name;
            amountInputValue = data.amount.toString();
            selectedCategory = data.category;
        }
    }

    async function submitData() {
        if ($addExpenseModalEditMode) {
            await editData();
            return;
        }
        const res = await fetch(PUBLIC_BASE_URL + "/expenses/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: nameInputValue,
                amount: getAmountAsNumber(),
                category: selectedCategory,
            }),
        });
        const json = await res.json();
        addExpenseToStore(json.id);
        close();
    }

    async function editData() {
        const res = await fetch(
            PUBLIC_BASE_URL + "/expenses/" + $addExpenseModalData.id,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: nameInputValue,
                    amount: getAmountAsNumber(),
                    category: selectedCategory,
                }),
            },
        );
        const json = await res.json();
        updateExpenseInStore(json.id);
        close();
    }

    function updateExpenseInStore(id: string) {
        $currentMonthExpenses = $currentMonthExpenses.map((item) => {
            if (item.id === id) {
                return {
                    name: nameInputValue,
                    amount: getAmountAsNumber(),
                    category: selectedCategory,
                    date: new Date(),
                    id,
                };
            }
            return item;
        });
        $selectedMonthExpenses = $selectedMonthExpenses.map((item) => {
            if (item.id === id) {
                return {
                    name: nameInputValue,
                    amount: getAmountAsNumber(),
                    category: selectedCategory,
                    date: new Date(),
                    id,
                };
            }
            return item;
        });
    }

    function addExpenseToStore(id: string) {
        $currentMonthExpenses = [
            ...$currentMonthExpenses,
            {
                name: nameInputValue,
                amount: getAmountAsNumber(),
                category: selectedCategory,
                date: new Date(),
                id,
            },
        ];
    }

    function getAmountAsNumber(): number {
        // remove . and replace , with .
        const amountWithoutDots = amountInputValue
            .replace(/\./g, "")
            .replace(/,/g, ".");
        return parseFloat(amountWithoutDots);
    }

    function reset() {
        activePage = 0;
        nameInputValue = "";
        amountInputValue = "";
        selectedCategory = ExpenseCategory.SONSTIGES;
    }

    function close() {
        reset();
        $addExpenseModalOpened = false;
        $addExpenseModalEditMode = false;
    }
</script>

<div
    bind:this={modal}
    class:closed={!$addExpenseModalOpened}
    class="w-100 h-100 bg-white"
    style="position: fixed; left: 0; top: 0; z-index: 999; transition: .2s ease-out;"
>
    <div
        class:active={activePage === 0}
        class="w-100 h-50 d-flex align-items-center position-fixed"
        style="flex-direction: column; transform: translateX(-100%); top: 0; left: 0"
    >
        <div
            class="flex-grow-1 d-flex justify-content-center align-items-center"
            style="flex-direction: column;"
        >
            <span class="mb-3" style="text-align: center; font-size: 18px"
                >Betrag</span
            >
            <FullWidthInput
                fontSize={60}
                bind:this={amountInput}
                bind:value={amountInputValue}
            ></FullWidthInput>
        </div>
        <div class="d-flex justify-content-between w-100 p-3">
            <button on:click={() => close()} class="btn text-primary rounded"
                >Abbrechen</button
            >
            <button
                on:click={() => (activePage = 1)}
                class="btn btn-primary rounded bg-primary">Weiter</button
            >
        </div>
    </div>
    <div
        class:active={activePage === 1}
        class="w-100 h-50 d-flex align-items-center position-fixed"
        style="flex-direction: column; transform: translateX(-100%); top: 0; left: 0"
    >
        <div
            class="flex-grow-1 d-flex justify-content-center align-items-center"
            style="flex-direction: column;"
        >
            <span class="mb-3" style="text-align: center; font-size: 18px"
                >Bezeichnung</span
            >
            <FullWidthInput
                type="text"
                bind:value={nameInputValue}
                maxWidthProportion={0.9}
            ></FullWidthInput>
            <span class="mt-4" style="font-size: 14px;"
                >{nameInputValue.length} / 40 Zeichen</span
            >
        </div>
        <div class="d-flex justify-content-between w-100 p-3">
            <button
                on:click={() => (activePage = 0)}
                class="btn text-primary rounded">Zurück</button
            >
            <button
                on:click={() => (activePage = 2)}
                class="btn btn-primary rounded bg-primary">Weiter</button
            >
        </div>
    </div>
    <div
        class:active={activePage === 2}
        class="w-100 h-100 d-flex align-items-center position-fixed"
        style="flex-direction: column; transform: translateX(-100%); top: 0; left: 0"
    >
        <div
            class="flex-grow-1 d-flex justify-content-center align-items-center"
            style="flex-direction: column;"
        >
            <span class="mb-3" style="text-align: center; font-size: 18px"
                >Kategorie</span
            >
            <CategorySelection bind:selectedCategory></CategorySelection>
        </div>
        <div class="d-flex justify-content-between w-100 p-3">
            <button
                on:click={() => (activePage = 1)}
                class="btn text-primary rounded">Zurück</button
            >
            <button
                on:click={() => submitData()}
                class="btn btn-primary rounded bg-primary">Fertig</button
            >
        </div>
    </div>
</div>

<style>
    .closed {
        transform: translateY(100%);
    }

    .active {
        transform: translateX(0%) !important;
    }
</style>
