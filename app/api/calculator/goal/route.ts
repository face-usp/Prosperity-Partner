import { NextRequest, NextResponse } from "next/server";

interface GoalRequest {
  goalAmount: number;
  annualRate: number;
  months?: number;
  years?: number;
}

export async function POST(request: NextRequest) {
  try {
    const { goalAmount, annualRate, months, years }: GoalRequest = await request.json();

    // Input validation
    if (!goalAmount || !annualRate) {
      return NextResponse.json(
        { error: "Please provide amount and rate" },
        { status: 400 }
      );
    }

    if (!months && !years) {
      return NextResponse.json(
        { error: "Please provide either months or years" },
        { status: 400 }
      );
    }

    const FV = Number(goalAmount);
    const r = Number(annualRate) / 100;

    const formatINR = (num: number) =>
      num.toLocaleString("en-IN", { maximumFractionDigits: 2 });

    const results: any = {};

    if (months) {
      const n = Number(months);
      const i = r / 12;
      const lumpsumNeeded = FV / Math.pow(1 + i, n);
      const monthlySIP = (FV * i) / (Math.pow(1 + i, n) - 1);
      const yrs = (n / 12).toFixed(1);

      results.monthlyGoal = {
        goalAmount: formatINR(FV),
        annualRate: `${annualRate}%`,
        months: n,
        years: yrs,
        lumpsumNeeded: formatINR(Math.round(lumpsumNeeded)),
        monthlySIP: formatINR(monthlySIP),
        message: `To reach ₹${formatINR(FV)} in ${n} months (${yrs} years), invest ₹${formatINR(lumpsumNeeded)} today (lumpsum) or ₹${formatINR(monthlySIP)} per month as SIP.`,
      };
    }

    if (years) {
      const t = Number(years);
      const lumpsumNeeded = FV / Math.pow(1 + r, t);
      const yearlySIP = (FV * r) / (Math.pow(1 + r, t) - 1);

      results.yearlyGoal = {
        goalAmount: formatINR(FV),
        annualRate: `${annualRate}%`,
        years: t,
        lumpsumNeeded: formatINR(Math.round(lumpsumNeeded)),
        yearlySIP: formatINR(yearlySIP),
        message: `To reach ₹${formatINR(FV)} in ${t} years, invest ₹${formatINR(lumpsumNeeded)} today (lumpsum) or ₹${formatINR(yearlySIP)} per year as SIP.`,
      };
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Goal calculation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}