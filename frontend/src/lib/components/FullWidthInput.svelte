<script lang="ts">
    import { onMount, afterUpdate } from "svelte";

    let auxiliarySpan: HTMLSpanElement;
    let amountInputElement: HTMLInputElement;

    export let fontSize = 40;
    export let maxWidthProportion = 0.7;
    export let type: "currency" | "text" = "currency";
    export let value: string = "";

    onMount(() => {
        updateInputElementWidth();
    });

    afterUpdate(() => {
        updateValueInDom();
    });

    export function focus() {
        amountInputElement.focus();
    }

    function updateInputElementWidth() {
        amountInputElement.style.width = auxiliarySpan.offsetWidth + "px";
    }

    function updateInputElementFontSize(maxRelativeWidth: number) {
        const originalFontSize = fontSize;
        let currentFontSize = parseFloat(
            window
                .getComputedStyle(amountInputElement, null)
                .getPropertyValue("font-size"),
        );

        adjustFontSizeToFit(currentFontSize, maxRelativeWidth, originalFontSize);
    }

    function adjustFontSizeToFit(currentFontSize: number, maxRelativeWidth: number, originalFontSize: number) {
        if (amountInputElement.offsetWidth > window.innerWidth * maxRelativeWidth) {
            decreaseFontSizeUntilFit(currentFontSize, maxRelativeWidth);
        } else {
            increaseFontSizeUntilMaxOrFit(currentFontSize, maxRelativeWidth, originalFontSize);
        }
    }

    function decreaseFontSizeUntilFit(currentFontSize: number, maxRelativeWidth: number) {
        while (amountInputElement.offsetWidth > window.innerWidth * maxRelativeWidth && currentFontSize > 1) {
            currentFontSize--;
            setInputElementFontSize(currentFontSize);
        }
    }

    function increaseFontSizeUntilMaxOrFit(currentFontSize: number, maxRelativeWidth: number, originalFontSize: number) {
        while (amountInputElement.offsetWidth < window.innerWidth * maxRelativeWidth && currentFontSize < originalFontSize) {
            currentFontSize++;
            setInputElementFontSize(currentFontSize);
            if (amountInputElement.offsetWidth > window.innerWidth * maxRelativeWidth) {
                currentFontSize--;
                setInputElementFontSize(currentFontSize);
                break;
            }
        }
    }

    function setInputElementFontSize(fontSize: number) {
        auxiliarySpan.style.fontSize = fontSize + "px";
        amountInputElement.style.fontSize = fontSize + "px";
        updateInputElementWidth();
    }

    function formatCurrencyInput(inputValue: string): string {
        inputValue = inputValue.replace(/\D/g, "");

        while (inputValue.length < 2) {
            inputValue = "0" + inputValue;
        }

        let cents = inputValue.slice(-2);
        let mainPart = parseInt(inputValue.slice(0, -2), 10);
        if (isNaN(mainPart)) {
            mainPart = 0;
        }
        let formattedValue = mainPart + "," + cents;

        for (let start = formattedValue.length - 6; start > 1; start -= 3) {
            formattedValue = formattedValue.slice(0, start) + "." + formattedValue.slice(start);
        }

        return formattedValue;
    }

    function handleInputChange(event: Event) {
        const target = event.target as HTMLInputElement;
        let inputValue = target.value;

        if (inputValue.length > (type === "currency" ? 14 : 40)) {
            target.value = inputValue.slice(0, -1);
            return;
        }

        if (type === "currency") {
            inputValue = formatCurrencyInput(inputValue);
        } else {
            inputValue = inputValue.replace(/[^a-zA-ZäöüÄÖÜß ]/g, "").replace(/  +/g, " ");
        }

        target.value = inputValue;
        auxiliarySpan.innerHTML = inputValue.replace(/ /g, "&nbsp;");
        if (!inputValue) {
            auxiliarySpan.innerHTML = type === "currency" ? "0,00" : "Eingeben...";
        }
        if (type === "text" && inputValue === "") {
            auxiliarySpan.innerHTML = "Eingeben...";
        }
        value = inputValue;
        updateInputElementFontSize(maxWidthProportion);

    }

    function updateValueInDom() {
        if (amountInputElement) {
            if (type === "currency") {
                amountInputElement.value = value && value !== "" ? formatCurrencyInput(value) : "";
                auxiliarySpan.innerHTML = value && value !== "" ? amountInputElement.value.replace(/ /g, "&nbsp;") : "0,00";
            } else if (type === "text") {
                amountInputElement.value = value;
                auxiliarySpan.innerHTML = value.replace(/ /g, "&nbsp;");
                if (!value) {
                    auxiliarySpan.innerHTML = "Eingeben...";
                }
            }
            updateInputElementWidth();
            updateInputElementFontSize(maxWidthProportion);
        }
    }
</script>

<div class="d-flex align-items-center" style="margin-left: 21px;">
    <input
        on:input={handleInputChange}
        bind:this={amountInputElement}
        class="p-0"
        type={type === 'currency' ? 'tel' : 'text'}
        style={`text-align: end; font-size: ${fontSize}px; border: 0; width: 30px; border: 0; outline: 0;`}
        placeholder={type === 'currency' ? '0,00' : 'Eingeben...'}
    />
    <span style={`font-size: 26px; ${amountInputElement?.value === '' ? 'color: hsl(0, 0%, 60%);' : ''}`} class:invisible={type === 'text'}>&nbsp;€</span>
    <span
        style={`font-size: ${fontSize}px; font-weight: 400; visibility: hidden; pointer-events: none; position: fixed`}
        bind:this={auxiliarySpan}>{ type === 'currency' ? '0,00' : 'Eingeben...' }</span
    >
</div>
