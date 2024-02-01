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
    } else {
        // Define month names
        const monthNames = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
        
        // Format for dates from the current year
        if (date.getFullYear() === now.getFullYear()) {
            if (diffDays > 1 && diffDays <= 7) {
                // If the date was between 2 and 7 days ago
                return `vor ${Math.floor(diffDays)} Tagen`;
            } else {
                // If the date is older than 7 days but from the current year
                return `${inputDate.getDate().toString().padStart(2, '0')}. ${monthNames[inputDate.getMonth()]}`;
            }
        } else {
            // If the date is from a different year
            return `${inputDate.getDate().toString().padStart(2, '0')}. ${monthNames[inputDate.getMonth()]} ${inputDate.getFullYear()}`;
        }
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

export function getMonthShortName(month: number): string {
    switch (month) {
        case 1:
            return 'Jan'
        case 2:
            return 'Feb'
        case 3:
            return 'Mär'
        case 4:
            return 'Apr'
        case 5:
            return 'Mai'
        case 6:
            return 'Jun'
        case 7:
            return 'Jul'
        case 8:
            return 'Aug'
        case 9:
            return 'Sep'
        case 10:
            return 'Okt'
        case 11:
            return 'Nov'
        case 12:
            return 'Dez'
        default:
            return ''
    }
}

export function getCategoryColor(category: string) {
    switch (category) {
        case ExpenseCategory.WOHNEN:
            return 'B30000'
        case ExpenseCategory.ESSEN:
            return '7C1158'
        case ExpenseCategory.GESUNDHEIT:
            return '4421AF'
        case ExpenseCategory.KLEIDUNG:
            return '1A53FF'
        case ExpenseCategory.TRANSPORT:
            return '00B7C7'
        case ExpenseCategory.FREIZEIT:
            return '5AD45A'
        case ExpenseCategory.SONSTIGES:
            return 'A6A6A6'
    }
}

