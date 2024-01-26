<script lang="ts">
    import AddExpenseModal from "$lib/components/AddExpenseModal.svelte";
import ExpenseList from "$lib/components/ExpenseList.svelte";
    import ExpenseListItem from "$lib/components/ExpenseListItem.svelte";
    import ExpenseOverview from "$lib/components/ExpenseOverview.svelte";
    import Fab from "$lib/components/Fab.svelte";
    import Header from "$lib/components/Header.svelte";
    import MonthlyExpenseBar from "$lib/components/MonthlyExpenseBar.svelte";
    import { ExpenseCategory } from "$lib/utils";

    const items = [
        {
            date: new Date("2024-01-24T10:01:50"),
            amount: 29.99,
            title: "Kartbahn",
            category: ExpenseCategory.FREIZEIT
        },
        {
            date: new Date("2024-01-20T10:00:00"),
            amount: 21.22,
            title: "Sushi Boat",
            category: ExpenseCategory.ESSEN
        },
        {
            date: new Date("2024-01-14T10:00:00"),
            amount: 60,
            title: "Auto tanken",
            category: ExpenseCategory.TRANSPORT
        },
    ];

    let modalOpened = true;
</script>

<div class="p-4">
    <AddExpenseModal bind:opened={modalOpened}></AddExpenseModal>
    <Header remainingBudget={1500-950}></Header>
    <div class="p-2"></div>
    <MonthlyExpenseBar budget={1500} expenses={{
        'ESSEN': 100,
        'GESUNDHEIT': 50,
        'KLEIDUNG': 230,
        'FREIZEIT': 20,
        'WOHNEN': 400,
        'TRANSPORT': 120,
        'SONSTIGES': 30,
    }}></MonthlyExpenseBar>
    <div class="p-2"></div>
    <ExpenseList {items}></ExpenseList>
    <ExpenseOverview></ExpenseOverview>
    <Fab on:click={() => modalOpened = !modalOpened}></Fab>
</div>
