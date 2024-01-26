export function formatDate(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffTime = today.getTime() - inputDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    if (diffDays < 1) {
        // If the date is today, return the time in "hh-mm" format
        return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
    } else if (diffDays === 1) {
        // If the date was yesterday, return "gestern"
        return "gestern";
    } else if (diffDays > 1 && diffDays <= 7) {
        // If the date was between 2 and 7 days ago
        return `vor ${Math.floor(diffDays)} Tagen`;
    } else {
        // If the date is older than 7 days, return in "dd. MMM" format
        const monthNames = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
        return `${inputDate.getDate().toString().padStart(2, '0')}. ${monthNames[inputDate.getMonth()]}`;
    }
}

export function formatEuro(number: number): string {
    // Convert the number to a fixed decimal string to handle floating point precision issues
    const fixedNumber = number.toFixed(2);

    // Split the number into whole and decimal parts
    let [whole, decimal] = fixedNumber.split('.');

    // If the decimal part is '00', we don't need to display the cents
    if (decimal === '00') {
        decimal = '';
    } else {
        decimal = ',' + decimal; // Add the comma for the decimal separator
    }

    // Insert the thousand separators
    const wholeWithSeparators = whole.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return wholeWithSeparators + decimal;
}

export enum ExpenseCategory {
    WOHNEN = 'WOHNEN',
    ESSEN = 'ESSEN',
    GESUNDHEIT = 'GESUNDHEIT',
    KLEIDUNG = 'KLEIDUNG',
    TRANSPORT = 'TRANSPORT',
    FREIZEIT = 'FREIZEIT',
    SONSTIGES = 'SONSTIGES'
}

export function getCategoryColor(category: string) {
    switch (category) {
        case ExpenseCategory.WOHNEN:
            return 'AF6E49'
        case ExpenseCategory.ESSEN:
            return '52D450'
        case ExpenseCategory.GESUNDHEIT:
            return 'F33C3C'
        case ExpenseCategory.KLEIDUNG:
            return 'C266D1'
        case ExpenseCategory.TRANSPORT:
            return 'FADB3C'
        case ExpenseCategory.FREIZEIT:
            return '4CCAE5'
        case ExpenseCategory.SONSTIGES:
            return 'A6A6A6'
    }
}

