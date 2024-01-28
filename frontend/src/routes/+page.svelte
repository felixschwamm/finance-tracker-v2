<script lang="ts">
    import AddExpenseModal from "$lib/components/AddExpenseModal.svelte";
    import Dropdown from "$lib/components/Dropdown.svelte";
import ExpenseList from "$lib/components/ExpenseList.svelte";
    import ExpenseListItem from "$lib/components/ExpenseListItem.svelte";
    import ExpenseOverview from "$lib/components/ExpenseOverview.svelte";
    import Fab from "$lib/components/Fab.svelte";
    import Header from "$lib/components/Header.svelte";
    import MonthlyExpenseBar from "$lib/components/MonthlyExpenseBar.svelte";
    import { ExpenseCategory } from "$lib/utils";  

    function loadExpensesPerCategory(year: number): Promise<{ [K in ExpenseCategory]: number }[]> {
        // just return 12 times the same array for now
        const expensesPerCategory = {
            ESSEN: 100,
            FREIZEIT: 800,
            GESUNDHEIT: 100,
            KLEIDUNG: 100,
            TRANSPORT: 100,
            WOHNEN: 100,
            SONSTIGES: 200,
        };
        
        return new Promise((resolve) => {
            setTimeout(() => {
                const arr1 = Array(6).fill(expensesPerCategory);
                const arr2 = Array(6).fill({
                    ESSEN: 100,
                    FREIZEIT: 100,
                    GESUNDHEIT: 100,
                    KLEIDUNG: 100,
                    TRANSPORT: 100,
                    WOHNEN: 100,
                    SONSTIGES: 100,
                });
                resolve([...arr1, ...arr2]);
            }, 1000);
        });

    }

    let modalOpened = false;
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
    <ExpenseList></ExpenseList>
    <ExpenseOverview {loadExpensesPerCategory}></ExpenseOverview>
    <div class="py-5"></div>
    <Fab on:click={() => modalOpened = !modalOpened}></Fab>
</div>
