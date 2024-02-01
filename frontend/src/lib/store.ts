import { writable, derived } from "svelte/store";
import type { Expense } from "./types";
import type { Writable } from "svelte/store";
import { PUBLIC_BASE_URL } from "$env/static/public";
import { ExpenseCategory } from "./utils";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

type ExpensesPerCategory = {
  [K in ExpenseCategory]: number;
};

export const isAuthenticated = writable(false);
export const user = writable({});
export const popupOpen = writable(false);
export const error = writable();
export const budget = writable(0);
export const currentMonthExpenses: Writable<Expense[]> = writable([]);
export const selectedMonth: Writable<{ month: number; year: number }> = writable({
  month: currentMonth,
  year: currentYear,
});
export const selectedMonthExpenses: Writable<Expense[]> = writable([]);

export const addExpenseModalOpened = writable(false);
export const addExpenseModalData: Writable<{amount: string, name: string, category: ExpenseCategory, id: string | null}> = writable({amount: "", name: "", category: ExpenseCategory.SONSTIGES, id: null});
export const addExpenseModalEditMode = writable(false);

export const expensesPerCategoryForSelectedYear: Writable<ExpensesPerCategory[]> = writable([]);
export const selectedYear: Writable<number> = writable(currentYear);

export const tasks = writable([]);

export const user_tasks = derived([tasks, user], ([$tasks, $user]) => {
  let logged_in_user_tasks: any = [];

  if ($user && $user.email) {
    logged_in_user_tasks = $tasks.filter((task) => task.user === $user.email);
  }

  return logged_in_user_tasks;
});

export const currentMonthExpensesTotal = derived(
  currentMonthExpenses,
  ($currentMonthExpenses) => {
    let total = 0;
    $currentMonthExpenses.forEach((expense) => {
      total += expense.amount;
    });
    return total;
  }
);

export const currentMonthExpensesByMostExpensive = derived(
  currentMonthExpenses,
  ($currentMonthExpenses) => {
    return $currentMonthExpenses.slice().sort((a, b) => b.amount - a.amount);
  }
);

export const selectedMonthExpensesByMostExpensive = derived(
  selectedMonthExpenses,
  ($selectedMonthExpenses) => {
    const res = $selectedMonthExpenses.slice().sort((a, b) => b.amount - a.amount);
    return res;
  }
);

export const selectedMonthExpensesByNewest = derived(
  selectedMonthExpenses,
  ($selectedMonthExpenses) => {
    const res = $selectedMonthExpenses.slice().sort((a, b) => {
      const dateA = a.date;
      const dateB = b.date;
      return dateB.getTime() - dateA.getTime();
    });
    return res;
  }
);

export async function fetchCurrentMonthExpenses() {
  const res = await fetch(`${PUBLIC_BASE_URL}/expenses`);
  const expenses = await res.json();
  currentMonthExpenses.set(expenses.map((expense: any) => {
    return {
      ...expense,
      date: new Date(expense.date),
      };
    }));
}

export async function fetchExpenses(month: number, year: number) {
  const res = await fetch(`${PUBLIC_BASE_URL}/expenses?month=${month + 1}&year=${year}`);
  const expenses = await res.json();
  return expenses.map((expense: any) => {
    return {
      ...expense,
      date: new Date(expense.date),
    };
  });
}

export async function fetchBudget() {
  const res = await fetch(`${PUBLIC_BASE_URL}/budget`);
  const newBudget = (await res.json())?.budget ?? 0;
  budget.set(newBudget);
  return budget;
}

export async function fetchExpensesPerCategoryForSelectedYear(year: number) {
  const res = await fetch(`${PUBLIC_BASE_URL}/overview/${year}`);
  const expensesPerCategory = await res.json();
  return expensesPerCategory;
}