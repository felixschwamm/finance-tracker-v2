<script lang="ts">
    import ExpenseList from "./ExpenseList.svelte";
    import ExpenseOverview from "./ExpenseOverview.svelte";

    const selectedClasses = "border-primary bg-primary text-white";
    let selectedTab: "expenses" | "overview" = "expenses";
</script>

<div class="w-100 d-flex mb-2">
    <button
        on:click={() => (selectedTab = "expenses")}
        style="flex: 1"
        class={`btn border rounded me-1 ${selectedTab === "expenses" ? selectedClasses : ''}`}>Ausgaben</button
    >
    <button
        on:click={() => (selectedTab = "overview")}
        style="flex: 1"
        class={`btn border rounded ms-1 ${selectedTab === "overview" ? selectedClasses : ''}`}>Überblick</button
    >
</div>

<div class="position-relative w-100">
    <div
        class="w-100"
        style={`transition: all .3s ease-out; position: absolute; top: 0; left: 0; ${
            selectedTab === "expenses"
                ? "transform: translateX: (0%); opacity: 1"
                : "transform: translateX(-100%); opacity: 0"
        }`}
    >
        <ExpenseList />
    </div>

    <div
        class="w-100"
        style={`transition: all .3s ease-out; position: absolute; top: 0; left: 0; ${
            selectedTab === "overview"
                ? "transform: translateX: (0%); opacity: 1"
                : "transform: translateX(100%); opacity: 0"
        }`}
    >
        <ExpenseOverview />
    </div>
</div>
