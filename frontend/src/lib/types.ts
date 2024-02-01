import type { ExpenseCategory } from "./utils";

export type Expense = {
    id: string;
    name: string;
    amount: number;
    date: Date;
    category: ExpenseCategory
};