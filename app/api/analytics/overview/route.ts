import { prisma } from "@/lib/prisma";
import { requireRole } from "@/middleware/roleGuard";
import { NextResponse } from "next/server";

function fmt(n: number) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

function buildInsights(input: {
  totals: {
    income: number;
    expense: number;
    net: number;
    transactionCount: number;
    usersWithRecords: number;
  };
  monthly: { month: string; income: number; expense: number; net: number }[];
  topExpenseCategories: { category: string; total: number; pct: number }[];
  expenseToIncome: number | null;
  savingsRate: number | null;
}): string[] {
  const out: string[] = [];
  const { totals, monthly, topExpenseCategories, expenseToIncome, savingsRate } =
    input;

  if (totals.transactionCount === 0) {
    out.push(
      "No transaction data is recorded yet. Once users add income and expenses, this dashboard will surface trends, concentration risk, and month-over-month changes to support decisions.",
    );
    return out;
  }

  out.push(
    `Across ${totals.usersWithRecords} user(s) with activity and ${totals.transactionCount} transactions, recorded income totals ₹${fmt(totals.income)} versus ₹${fmt(totals.expense)} in expenses, for a net position of ₹${fmt(totals.net)}.`,
  );

  if (totals.net < 0) {
    out.push(
      `The organization shows a net deficit: expenses exceed income by ₹${fmt(Math.abs(totals.net))}. Prioritize reviewing the largest expense categories, renegotiating recurring costs, or increasing inflows before commitments grow.`,
    );
  } else if (totals.net > 0 && totals.income > 0) {
    out.push(
      `Aggregate net is positive (₹${fmt(totals.net)}). Validate that recent months—not only lifetime totals—stay healthy so short-term volatility does not erode runway.`,
    );
  }

  if (expenseToIncome != null) {
    if (expenseToIncome > 1) {
      out.push(
        `Total expenses are ${(expenseToIncome * 100).toFixed(0)}% of total recorded income, meaning spending exceeds inflows in the dataset.`,
      );
    } else if (expenseToIncome > 0.85) {
      out.push(
        `Expense-to-income is ${(expenseToIncome * 100).toFixed(0)}%, leaving a thin margin. Scenario-plan for delayed income or unexpected costs.`,
      );
    } else {
      out.push(
        `Expense-to-income stands at ${(expenseToIncome * 100).toFixed(0)}% — compare this benchmark to your target operating margin.`,
      );
    }
  }

  if (savingsRate != null && totals.income > 0) {
    out.push(
      `Implied surplus rate (net ÷ income) is about ${savingsRate.toFixed(1)}%. Use this as a baseline when setting budgets or reinvestment targets.`,
    );
  }

  if (topExpenseCategories[0]) {
    const top = topExpenseCategories[0];
    if (top.pct >= 35) {
      out.push(
        `Concentration risk: "${top.category}" represents about ${top.pct.toFixed(0)}% of all expenses. A disruption in that line item would disproportionately affect totals.`,
      );
    } else {
      out.push(
        `Largest expense category is "${top.category}" at ₹${fmt(top.total)} (~${top.pct.toFixed(0)}% of expenses). Track this category month-to-month for early drift.`,
      );
    }
  }

  const last = monthly[monthly.length - 1];
  const prev = monthly[monthly.length - 2];
  if (last && prev && prev.expense > 0) {
    const delta = last.expense - prev.expense;
    const pctCh = (delta / prev.expense) * 100;
    if (Math.abs(pctCh) >= 12) {
      out.push(
        `Compared to ${prev.month}, ${last.month} expenses ${delta > 0 ? "increased" : "decreased"} by about ${Math.abs(pctCh).toFixed(0)}%. Identify whether this is seasonal, one-off, or structural.`,
      );
    }
  }

  const activeMonths = monthly.filter((m) => m.income > 0 || m.expense > 0);
  const defMonths = activeMonths.filter((m) => m.net < 0);
  if (defMonths.length >= 3) {
    out.push(
      `${defMonths.length} month(s) in the trailing window show negative net (expenses above income for that month). Review those periods for recurring patterns.`,
    );
  }

  return out;
}

export async function GET(req: Request) {
  try {
    requireRole(["ADMIN", "ANALYST"])(req as any);

    const now = new Date();

    const [
      incomeAgg,
      expenseAgg,
      transactionCount,
      groupCats,
      distinctUserGroups,
    ] = await Promise.all([
      prisma.financialRecord.aggregate({
        where: { type: "INCOME" },
        _sum: { amount: true },
      }),
      prisma.financialRecord.aggregate({
        where: { type: "EXPENSE" },
        _sum: { amount: true },
      }),
      prisma.financialRecord.count(),
      prisma.financialRecord.groupBy({
        by: ["category", "type"],
        _sum: { amount: true },
        _count: { id: true },
      }),
      prisma.financialRecord.groupBy({ by: ["userId"] }),
    ]);

    const totalIncome = incomeAgg._sum.amount ?? 0;
    const totalExpense = expenseAgg._sum.amount ?? 0;

    const categories = groupCats.map((row) => {
      const total = row._sum.amount ?? 0;
      const base = row.type === "INCOME" ? totalIncome : totalExpense;
      return {
        category: row.category,
        type: row.type as "INCOME" | "EXPENSE",
        total,
        count: row._count.id,
        pctOfType: base > 0 ? (total / base) * 100 : 0,
      };
    });
    categories.sort((a, b) => b.total - a.total);

    const monthBuckets: { month: string; start: Date; end: Date }[] = [];
    for (let i = 11; i >= 0; i--) {
      const ref = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1),
      );
      const y = ref.getUTCFullYear();
      const m = ref.getUTCMonth();
      const start = new Date(Date.UTC(y, m, 1));
      const end = new Date(Date.UTC(y, m + 1, 1));
      const key = `${y}-${String(m + 1).padStart(2, "0")}`;
      monthBuckets.push({ month: key, start, end });
    }

    const monthly = await Promise.all(
      monthBuckets.map(async ({ month, start, end }) => {
        const [inc, exp] = await Promise.all([
          prisma.financialRecord.aggregate({
            where: { type: "INCOME", date: { gte: start, lt: end } },
            _sum: { amount: true },
          }),
          prisma.financialRecord.aggregate({
            where: { type: "EXPENSE", date: { gte: start, lt: end } },
            _sum: { amount: true },
          }),
        ]);
        const income = inc._sum.amount ?? 0;
        const expense = exp._sum.amount ?? 0;
        return { month, income, expense, net: income - expense };
      }),
    );

    const [userExpenseGroups, userIncomeGroups] = await Promise.all([
      prisma.financialRecord.groupBy({
        by: ["userId"],
        where: { type: "EXPENSE" },
        _sum: { amount: true },
      }),
      prisma.financialRecord.groupBy({
        by: ["userId"],
        where: { type: "INCOME" },
        _sum: { amount: true },
      }),
    ]);

    userExpenseGroups.sort(
      (a, b) => (b._sum.amount ?? 0) - (a._sum.amount ?? 0),
    );
    userIncomeGroups.sort(
      (a, b) => (b._sum.amount ?? 0) - (a._sum.amount ?? 0),
    );

    const topExp = userExpenseGroups.slice(0, 8);
    const topInc = userIncomeGroups.slice(0, 8);
    const userIds = [
      ...new Set([...topExp.map((x) => x.userId), ...topInc.map((x) => x.userId)]),
    ];

    const users =
      userIds.length === 0
        ? []
        : await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true, email: true },
        });
    const userMap = new Map(users.map((u) => [u.id, u]));

    const topExpenseUsers = topExp.map((row) => ({
      userId: row.userId,
      name: userMap.get(row.userId)?.name ?? "Unknown",
      email: userMap.get(row.userId)?.email ?? "",
      total: row._sum.amount ?? 0,
    }));

    const topIncomeUsers = topInc.map((row) => ({
      userId: row.userId,
      name: userMap.get(row.userId)?.name ?? "Unknown",
      email: userMap.get(row.userId)?.email ?? "",
      total: row._sum.amount ?? 0,
    }));

    const expenseToIncome = totalIncome > 0 ? totalExpense / totalIncome : null;
    const savingsRate =
      totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : null;

    const expenseCatsOnly = categories.filter((c) => c.type === "EXPENSE");
    const topExpenseCategories = expenseCatsOnly.map((c) => ({
      category: c.category,
      total: c.total,
      pct: c.pctOfType,
    }));
    topExpenseCategories.sort((a, b) => b.total - a.total);

    const insights = buildInsights({
      totals: {
        income: totalIncome,
        expense: totalExpense,
        net: totalIncome - totalExpense,
        transactionCount,
        usersWithRecords: distinctUserGroups.length,
      },
      monthly,
      topExpenseCategories,
      expenseToIncome,
      savingsRate,
    });

    const recommendations: string[] = [];
    if (transactionCount > 0) {
      recommendations.push(
        "Use the monthly income vs. expense bars to align budget meetings with calendar months shown here.",
      );
      recommendations.push(
        "If one category dominates the expense mix, split it into sub-tags in records next quarter to improve granularity.",
      );
      recommendations.push(
        "Cross-check top spenders and earners with active projects or teams — outliers may indicate data entry patterns, not true cost drivers.",
      );
      if ((expenseToIncome ?? 0) > 0.9) {
        recommendations.push(
          "Consider a freeze on non-essential expenses until trailing-three-month net turns consistently positive.",
        );
      }
    }

    return NextResponse.json({
      totals: {
        income: totalIncome,
        expense: totalExpense,
        net: totalIncome - totalExpense,
        transactionCount,
        usersWithRecords: distinctUserGroups.length,
      },
      ratios: { expenseToIncome, savingsRate },
      monthly,
      categories,
      topExpenseUsers,
      topIncomeUsers,
      insights,
      recommendations,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Forbidden";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}
