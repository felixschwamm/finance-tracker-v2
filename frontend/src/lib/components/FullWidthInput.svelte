<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";

    const dispatch = createEventDispatcher<{ changeCurrency: number, changeText: string }>();

    let auxSpan: HTMLSpanElement;
    let amountInput: HTMLInputElement;

    export let fontSize = 40;
    export let maxWidth = 0.7;
    export let type: "currency" | "text" = "currency";

    let focus;
    let realValue: number | string = (type === "currency" ? 0 : "");

    onMount(() => {
        updateAmountInputWidth();

        focus = () => {
            amountInput.focus();
        };
    });

    function updateAmountInputWidth() {
        amountInput.style.width = auxSpan.offsetWidth + "px";
    }

    function updateAmoutInputFontSize(maxRelWidth: number) {
        const originalFontSize = fontSize;
        let currentFontSize = parseInt(
            window
                .getComputedStyle(amountInput, null)
                .getPropertyValue("font-size"),
        );

        if (
            amountInput.offsetWidth > window.innerWidth * maxRelWidth &&
            currentFontSize > 1
        ) {
            // Reduce font size if input overflows
            while (
                amountInput.offsetWidth > window.innerWidth * maxRelWidth &&
                currentFontSize > 1
            ) {
                currentFontSize--;
                setAmountInputFontSize(currentFontSize);
            }
        } else if (
            amountInput.offsetWidth < window.innerWidth * maxRelWidth &&
            currentFontSize < originalFontSize
        ) {
            // Increase font size if there's space, but don't exceed original size
            while (
                amountInput.offsetWidth < window.innerWidth * maxRelWidth &&
                currentFontSize < originalFontSize
            ) {
                currentFontSize++;
                setAmountInputFontSize(currentFontSize);
                if (amountInput.offsetWidth > window.innerWidth * maxRelWidth) {
                    currentFontSize--;
                    setAmountInputFontSize(currentFontSize);
                    break;
                }
            }
        }
    }

    function setAmountInputFontSize(size: number) {
        auxSpan.style.fontSize = size + "px";
        amountInput.style.fontSize = size + "px";
        updateAmountInputWidth();
    }

    function handleCurrencyInputChange(event: Event) {
        const target = event.target as HTMLInputElement;
        let value = target.value;

        if (value.length > 14) {
            target.value = target.value.slice(0, -1);
            return;
        }

        // Remove non-numeric characters
        value = value.replace(/\D/g, "");

        // Ensure at least two characters for cents
        while (value.length < 2) {
            value = "0" + value;
        }

        // Split into cents and main part
        let cents = value.slice(-2);
        let mainPart = value.slice(0, -2);

        // If mainPart is empty, set it to 0
        if (mainPart === "") {
            mainPart = "0";
        } else {
            // Remove leading zeros from mainPart
            mainPart = parseInt(mainPart, 10).toString();
        }

        // Combine main part and cents with comma
        value = mainPart + "," + cents;

        // Insert dots for thousands
        let start = value.length - 6;
        while (start > 1) {
            value = value.slice(0, start) + "." + value.slice(start);
            start -= 3;
        }

        // Set the formatted value back to the input
        target.value = value;

        auxSpan.innerHTML = value;

        // Set the real value
        realValue = parseFloat(value.replace(/\./g, "").replace(/,/g, "."));

        // Dispatch the event
        dispatch("changeCurrency", realValue);

    }

    function handleTextInputChange(event: Event) {
        const target = event.target as HTMLInputElement;
        let value = target.value;

        if (value.length > 40) {
            target.value = target.value.slice(0, -1);
            return;
        }

        // replace all non-text characters and only allow one space in a row
        value = value.replace(/[^a-zA-ZäöüÄÖÜß ]/g, "").replace(/  +/g, " ");
        target.value = value;

        if (value.length === 0) {
            auxSpan.innerHTML = "Eingeben...";
            return;
        }

        auxSpan.innerHTML = value.replace(/ /g, "&nbsp;");

        // Set the real value
        realValue = value;

        // Dispatch the event
        dispatch("changeText", realValue);
    }

    function handleAmountInputChange(event: Event) {

        if (type === "currency") {
            handleCurrencyInputChange(event);
        } else {
            handleTextInputChange(event);
        }

        updateAmoutInputFontSize(maxWidth);
        updateAmountInputWidth();
    }
</script>

<div class="d-flex align-items-center" style="margin-left: 21px;">
    <input
        on:input={handleAmountInputChange}
        bind:this={amountInput}
        class="p-0"
        type={type === 'currency' ? 'tel' : 'text'}
        style={`text-align: end; font-size: ${fontSize}px; border: 0; width: 30px; border: 0; outline: 0;`}
        placeholder={type === 'currency' ? '0,00' : 'Eingeben...'}
    />
    <span style={`font-size: 26px; ${amountInput?.value === '' ? 'color: hsl(0, 0%, 60%);' : ''}`} class:invisible={type === 'text'}>&nbsp;€</span>
    <span
        style={`font-size: ${fontSize}px; font-weight: 400; visibility: hidden; pointer-events: none; position: fixed`}
        bind:this={auxSpan}>{ type === 'currency' ? '0,00' : 'Eingeben...' }</span
    >
</div>
