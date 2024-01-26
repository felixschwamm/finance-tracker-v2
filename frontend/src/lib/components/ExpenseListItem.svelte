<script lang="ts">
    import {
        formatDate,
        formatEuro,
        ExpenseCategory,
        getCategoryColor,
    } from "$lib/utils";
    import { onMount } from "svelte";

    export let title = "";
    export let date: Date;
    export let amount = 0;
    export let category: ExpenseCategory = ExpenseCategory.SONSTIGES;

    let container: HTMLDivElement;
    let showDeleteDiv = false;
    let showEditDiv = false;
    let translateX = 0;
    let velocityX = 0;
    let animationFrameId: any;
    let isAnimating = false;
    const smoothReturnSpeed = 0.1;
    const maxMomentumDistance = 200;
    const friction = 0.9;

    onMount(() => {
        import("hammerjs").then(({ default: Hammer }) => {
            const hammer = new Hammer(container);
            hammer.get("pan").set({ direction: Hammer.DIRECTION_HORIZONTAL });
            hammer.on("panleft panright", handlePan);
            hammer.on("panend", handlePanEnd);
            hammer.on("panstart", handlePanStart);
        });
    });

    function handlePan(event: any) {
        translateX = event.deltaX;
        if (translateX > 0) {
            showEditDiv = true;
            showDeleteDiv = false;
        } else {
            showDeleteDiv = true;
            showEditDiv = false;
        }
    }

    const handlePanEnd = () => {
        isAnimating = true;

        function animate() {
            if (Math.abs(velocityX) < 0.1 && Math.abs(translateX) > 1) {
                // Smoothly glide back to the original position
                translateX *= smoothReturnSpeed;
            } else if (Math.abs(translateX) <= 1) {
                // Item is close enough to the original position
                translateX = 0;
                cancelAnimationFrame(animationFrameId);
                isAnimating = false;
            } else {
                // Continue decelerating
                translateX += velocityX * 20;
                velocityX *= friction;
                animationFrameId = requestAnimationFrame(animate);
            }
        }

        animationFrameId = requestAnimationFrame(animate);
    };

    const handlePanStart = () => {
        if (isAnimating) {
            cancelAnimationFrame(animationFrameId);
            isAnimating = false;
        }
    };
</script>

<div class="position-relative" style="width: 100%">
    <div
        style={`border-radius: 10px; position: absolute; pointer-events: none; background-color: #F33C3C; visibility: ${
            showDeleteDiv ? "visible" : "hidden"
        }; z-index: -1`}
        class="w-100 h-100"
    ></div>
    <div
        style={`border-radius: 10px; position: absolute; pointer-events: none; background-color: #647DFF; visibility: ${
            showEditDiv ? "visible" : "hidden"
        }; z-index: -1`}
        class="w-100 h-100"
    ></div>
    <div bind:this={container}
        class="d-flex align-items-center bg-white"
        style={`transform: translateX(${translateX}px); border: 1px solid hsl(0, 0%, 90%); border-radius: 10px; padding: 10px 20px 10px 0`}
    >
        <div
            style={`height: 12px; width: 10px; border-top-right-radius: 6px; border-bottom-right-radius: 6px; margin-right: 12px; background-color: #${getCategoryColor(
                category,
            )}`}
        ></div>
        <div class="d-l">
            <span class="d-block" style="font-size: 16px; margin-bottom: -4px"
                >{title}</span
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
