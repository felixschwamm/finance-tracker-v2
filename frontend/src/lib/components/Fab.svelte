<script lang="ts">
    import { createEventDispatcher } from "svelte";


    const dispatch = createEventDispatcher();

</script>

<button on:click={event => dispatch('click', event)} class="btn bg-primary text-white shadow" style="position: fixed; right: 50%; transform: translateX(50%); bottom: 1.5rem; width: 60px; height: 60px; border-radius: 50px">
    <i class="fa-solid fa-plus" style="font-size: 20px;"></i>
</button>