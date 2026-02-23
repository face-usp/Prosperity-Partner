import { NextRequest, NextResponse } from "next/server";

interface ExistingSaving {
  amount: number;
  preRetirementReturn: number;
}

interface RetirementRequest {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentMonthlyExpenses: number;
  percentExpensesContinue?: number;
  expectedInflation: number;
  postRetirementReturn: number;
  existingSavings?: ExistingSaving[];
}

export async function POST(request: NextRequest) {
  try {
    const {
      currentAge,
      retirementAge,
      lifeExpectancy,
      currentMonthlyExpenses,
      percentExpensesContinue = 100,
      expectedInflation,
      postRetirementReturn,
      existingSavings = [],
    }: RetirementRequest = await request.json();

    // ---- Validations ----
    if (
      !currentAge ||
      !retirementAge ||
      !lifeExpectancy ||
      !currentMonthlyExpenses ||
      expectedInflation === undefined ||
      postRetirementReturn === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required inputs." },
        { status: 400 }
      );
    }

    if (!Array.isArray(existingSavings)) {
      return NextResponse.json(
        { error: "existingSavings must be an array of objects." },
        { status: 400 }
      );
    }

    // Variables for years and months post and pre retirement age
    const yearsToRetirement = retirementAge - currentAge;
    const yearsPostRetirement = lifeExpectancy - retirementAge;
    const monthsAfterRetirement = yearsPostRetirement * 12;
    const monthsInRetirement = yearsToRetirement * 12;

    // ---- Step 1: Monthly expenses at retirement ----
    const monthlyExpenseAtRetirement =
      currentMonthlyExpenses *
      Math.pow(1 + expectedInflation / 100, yearsToRetirement) *
      (percentExpensesContinue / 100);

    // ---- Step 2: Corpus required ----
    const realReturn =
      (1 + postRetirementReturn / 100) / (1 + expectedInflation / 100) - 1;
    const monthlyRealReturn = realReturn / 12;

    const corpusRequired =
      monthlyExpenseAtRetirement *
      ((1 - Math.pow(1 + monthlyRealReturn, -monthsAfterRetirement)) /
        monthlyRealReturn);

    // ---- Step 3: Appreciation of existing savings ----
    let totalExistingSavings = 0;
    let totalWeightedReturn = 0;

    existingSavings.forEach(({ amount, preRetirementReturn }) => {
      if (amount && preRetirementReturn !== undefined) {
        totalExistingSavings += amount;
        totalWeightedReturn += amount * preRetirementReturn;
      }
    });

    const weightedPreRetirementReturn =
      totalExistingSavings === 0 ? 0 : totalWeightedReturn / totalExistingSavings;

    const appreciatedExistingSavings = existingSavings.reduce(
      (acc, { amount, preRetirementReturn }) => {
        const monthlyRate = (preRetirementReturn / 100) / 12;
        return acc + amount * Math.pow(1 + monthlyRate, monthsInRetirement);
      },
      0
    );

    // ---- Step 4: Lumpsum investment required today ----
    const remainingCorpusNeeded = corpusRequired - appreciatedExistingSavings;
    const annualRate = weightedPreRetirementReturn / 100;
    const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;

    const lumpsumRequired =
      remainingCorpusNeeded / Math.pow(1 + monthlyRate, monthsInRetirement);

    // ---- Step 5: Monthly SIP required ----
    const monthsToRetirement = yearsToRetirement * 12;
    const r = weightedPreRetirementReturn / 100 / 12;
    const n = monthsToRetirement;

    const sipRequired = (remainingCorpusNeeded * r) / (Math.pow(1 + r, n) - 1);

    // ---- Step 6: Delay Scenarios ----
    const delays = [0, 1, 3, 5];
    const investmentPattern = delays.map((delay) => {
      const remainingYears = yearsToRetirement - delay;
      const nMonths = remainingYears * 12;
      const lumpsum =
        remainingCorpusNeeded /
        Math.pow(1 + weightedPreRetirementReturn / 100, remainingYears);
      const sip = (remainingCorpusNeeded * r) / (Math.pow(1 + r, nMonths) - 1);

      return {
        delayYears: delay,
        lumpsum: Number(lumpsum.toFixed(3)),
        sip: Number(sip.toFixed(3)),
      };
    });

    // ---- Response ----
    return NextResponse.json({
      monthlyExpenseAtRetirement: Number(monthlyExpenseAtRetirement.toFixed(3)),
      corpusRequired: Number(Math.round(corpusRequired)),
      appreciatedExistingSavings: Number(appreciatedExistingSavings.toFixed(3)),
      additionalRetirementCorpusNeeded: Number(
        (corpusRequired - appreciatedExistingSavings).toFixed(3)
      ),
      lumpsumRequired: Number(Math.round(lumpsumRequired)),
      sipRequired: Number(sipRequired.toFixed(3)),
      weightedPreRetirementReturn: Number(weightedPreRetirementReturn.toFixed(3)),
      investmentPattern,
    });
  } catch (err) {
    console.error("Retirement calculation error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}