import { NextRequest, NextResponse } from "next/server";

interface LumpsumRequest {
  initialInvestment: number;
  expectedReturn: number;
  months?: number;
  years?: number;
}

export async function POST(request: NextRequest) {
  try {
    const { initialInvestment, expectedReturn, months, years }: LumpsumRequest = await request.json();

    // Validate inputs
    if (!initialInvestment || !expectedReturn || (!months && !years)) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    if (initialInvestment <= 0 || expectedReturn <= 0) {
      return NextResponse.json(
        { error: "Investment amount and return must be positive" },
        { status: 400 }
      );
    }

    // Calculate time period in years
    let timePeriodInYears: number;
    let displayPeriod: string;
    let maturityAmount : number;

    const annualRate = expectedReturn / 100;

    if (months) {
      if (months <= 0) {
        return NextResponse.json(
          { error: "Months must be positive" },
          { status: 400 }
        );
      }
      timePeriodInYears = months / 12;
      displayPeriod = `${months} months`;
      maturityAmount = initialInvestment * Math.pow(1 + (annualRate/12), months);
    } else if (years) {
      if (years <= 0) {
        return NextResponse.json(
          { error: "Years must be positive" },
          { status: 400 }
        );
      }
      timePeriodInYears = years;
      displayPeriod = `${years} years`;
      maturityAmount = initialInvestment * Math.pow(1 + annualRate, timePeriodInYears);
    } else {
      return NextResponse.json(
        { error: "Either months or years must be provided" },
        { status: 400 }
      );
    }

    // Compound interest formula: A = P(1 + r/n)^(nt)
    // For annual compounding: A = P(1 + r)^t
    
    initialInvestment * Math.pow(1 + annualRate, timePeriodInYears);
    const totalReturns = maturityAmount - initialInvestment;

    return NextResponse.json({
      initialInvestment,
      totalReturns: Math.round(totalReturns),
      maturityAmount: Math.round(maturityAmount),
      expectedReturn,
      timePeriod: displayPeriod,
      months: months || null,
      years: years || null,
    });
  } catch (error) {
    console.error("Lumpsum calculation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}