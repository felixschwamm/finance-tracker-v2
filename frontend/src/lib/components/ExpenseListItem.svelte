<script lang="ts">
    import {
        formatDate,
        formatEuro,
        ExpenseCategory,
        getCategoryColor,
    } from "$lib/utils";
    import { onMount } from "svelte";

    export let name = "";
    export let date: Date;
    export let amount = 0;
    export let id = "";
    export let category: ExpenseCategory = ExpenseCategory.SONSTIGES;
    export let deleteAction: (id: string) => void = () => {};
    export let editAction: (id: string) => void = () => {};

    let myElement: HTMLDivElement;
    let showDeleteDiv = false;
    let showEditDiv = false;
    let deleteActive = false;
    let editActive = false;
    let translateX = 0;
    let isAnimatingBack = false;

    onMount(() => {
        import("hammerjs").then(({ default: Hammer }) => {
            const hammer = new Hammer(myElement);

            let posX = 0,
                lastPosX = 0,
                velocityX = 0;

            hammer.on("panstart", (ev) => {
                // If an animation is in progress, reset the element
                if (isAnimatingBack) {
                    myElement.style.transition = "";
                    myElement.style.transform = "translateX(0px)";
                    posX = 0;
                    lastPosX = 0;
                    isAnimatingBack = false;
                    showDeleteDiv = false;
                    showEditDiv = false;
                    editActive = false;
                    deleteActive = false;
                }
            });

            hammer.on("panmove", (ev) => {
                // Calculate position and apply transformation
                posX = lastPosX + ev.deltaX;
                velocityX = ev.velocityX;
                myElement.style.transform = `translateX(${posX}px)`;
                if (posX > 0) {
                    showDeleteDiv = true;
                    showEditDiv = false;
                } else {
                    showDeleteDiv = false;
                    showEditDiv = true;
                }
                // if it is dragged 25% of the width, activate the delete button
                if (posX > myElement.offsetWidth * 0.4) {
                    deleteActive = true;
                } else {
                    deleteActive = false;
                }

                // if it is dragged 25% of the width, activate the edit button
                if (posX < -myElement.offsetWidth * 0.4) {
                    editActive = true;
                } else {
                    editActive = false;
                }
            });

            hammer.on("panend", () => {
                // Apply momentum based on velocity
                posX += velocityX * 50; // adjust multiplier for desired momentum
                myElement.style.transform = `translateX(${posX}px)`;

                if (editActive) {
                    editAction(id);
                }

                if (deleteActive) {
                    deleteAction(id);
                }

                // Animate back to original position with ease-out
                setTimeout(() => {
                    isAnimatingBack = true;
                    myElement.style.transition = "transform 0.3s ease-out";
                    myElement.style.transform = "translateX(0px)";
                    lastPosX = 0;
                    editActive = false;
                    deleteActive = false;
                }, 100); // adjust timeout for desired momentum duration

                // Reset transition after animation
                myElement.addEventListener("transitionend", () => {
                    myElement.style.transition = "";
                    isAnimatingBack = false;
                });
            });
        });
    });
</script>

<div class="position-relative" style="width: 100%">
    <div
        style={`border-radius: 10px; position: absolute; pointer-events: none; background-color: #F33C3C; visibility: ${
            showDeleteDiv ? "visible" : "hidden"
        }; z-index: -1`}
        class="w-100 h-100 d-flex align-items-center px-4 text-white"
    >
        <i style={`transform: ${deleteActive ? 'scale(1.6)' : 'scale(1)'}; transition: transform .3s ease-out`} class="fa-solid fa-trash"></i>
    </div>
    <div
        style={`border-radius: 10px; position: absolute; pointer-events: none; background-color: #647DFF; visibility: ${
            showEditDiv ? "visible" : "hidden"
        }; z-index: -1`}
        class="w-100 h-100 d-flex align-items-center justify-content-end px-4 text-white"
    >
        <i style={`transform: ${editActive ? 'scale(1.6)' : 'scale(1)'}; transition: transform .3s ease-out`} class="fa-solid fa-pen"></i>
    </div>
    <div
        bind:this={myElement}
        class="d-flex align-items-center bg-white"
        style={`transform: translateX(${translateX}px); border: 1px solid hsl(0, 0%, 90%); border-radius: 10px; padding: 10px 20px 10px 0;`}
    >
        <div
            style={`height: 26px; margin-left: -1px; width: 8px; border-top-right-radius: 6px; border-bottom-right-radius: 6px; margin-right: 12px; background-color: #${getCategoryColor(
                category,
            )}`}
        ></div>
        <div class="d-l">
            <span class="d-block" style="font-size: 16px; margin-bottom: -4px"
                >{name}</span
            >
            <span class="text-muted" style="font-size: 14px;"
                >{formatDate(date)}</span
            >
        </div>
        <div class="flex-grow-1 d-flex justify-content-end align-items-center">
            <div class="d-flex align-items-center">
                <span>{formatEuro(amount)}</span><span
                    class="ms-1"
                    style="font-size: 12px;">€</span
                >
            </div>
        </div>
    </div>
</div>
