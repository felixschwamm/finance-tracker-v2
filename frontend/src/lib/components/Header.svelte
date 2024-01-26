<script lang="ts">
    import { formatEuro } from "$lib/utils";

    export let remainingBudget = 0;
</script>

<div class="d-flex justify-content-between align-items-center">
    <div>
        <div class="d-flex align-items-center" style="margin-bottom: -10px;">
            <span style="font-weight: 600; font-size: 36px">
                {formatEuro(remainingBudget)}
            </span>
                <span style="font-size: 24px; font-weight: 600;">&nbsp;€</span>
        </div>
        <span class="text-muted">übrig für Mai</span>
    </div>
    <div
        style="height: 45px; width: 45px; background-color: black; border-radius: 45px;"
    ></div>
</div>

<style>
</style>
