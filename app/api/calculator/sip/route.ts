import { NextRequest, NextResponse } from "next/server";

interface SIPRequest {
  monthlyInvestment: number;
  expectedReturn: number;
  timePeriod: number;
}

export async function POST(request: NextRequest) {
  try {
    const { monthlyInvestment, expectedReturn, timePeriod }: SIPRequest = await request.json();

    // Validate inputs
    if (!monthlyInvestment || !expectedReturn || !timePeriod) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    if (monthlyInvestment <= 0 || expectedReturn <= 0 || timePeriod <= 0) {
      return NextResponse.json(
        { error: "All values must be positive" },
        { status: 400 }
      );
    }
    const P = Number(monthlyInvestment);
    const r = Number(expectedReturn) / 100; // convert percent -> decimal
    const n = Number(timePeriod);
    const i = r / 12;

    // Ordinary annuity (end of month deposits)
  const fv_end = P * ((Math.pow(1 + i, n) - 1) / i);

  // Annuity due (beginning of month deposits)
  const fv_begin = fv_end * (1 + i);
  const invested = P * n;
  const wealth_end = fv_end - invested;
  const wealth_begin = fv_begin - invested;
    
  
    const totalInvestment = monthlyInvestment * n;
    const totalReturns = fv_end - totalInvestment;

    return NextResponse.json({
      totalInvestment: Math.round(totalInvestment),
      totalReturns: Math.round(totalReturns),
      maturityAmount: Math.round(fv_end),
      monthlyInvestment,
      expectedReturn,
      timePeriod,
    });
  } catch (error) {
    console.error("SIP calculation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}