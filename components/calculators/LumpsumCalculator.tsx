"use client";
import React, { useState } from "react";
import InputField from "@/components/common/InputField";
import Button from "@/components/common/Button";
import ResultCard from "@/components/common/ResultCard";
import TimePeriodToggle from "@/components/common/TimePeriodToggle";

interface LumpsumResult {
  initialInvestment: number;
  totalReturns: number;
  maturityAmount: number;
  expectedReturn: number;
  timePeriod: string;
  months: number | null;
  years: number | null;
}

const LumpsumCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState("100000");
  const [expectedReturn, setExpectedReturn] = useState("12");
  const [periodType, setPeriodType] = useState<"months" | "years">("years");
  const [monthsValue, setMonthsValue] = useState("12");
  const [yearsValue, setYearsValue] = useState("10");
  const [result, setResult] = useState<LumpsumResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const calculateLumpsum = async () => {
    setLoading(true);
    setError("");
    
    try {
      const requestBody: any = {
        initialInvestment: parseFloat(initialInvestment),
        expectedReturn: parseFloat(expectedReturn),
      };

      if (periodType === "months") {
        requestBody.months = parseFloat(monthsValue);
      } else {
        requestBody.years = parseFloat(yearsValue);
      }

      const response = await fetch("/api/calculator/lumpsum", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Calculation failed");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Lumpsum Calculator
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Calculate the future value of your one-time lumpsum investment.
          </p>
        </div>

        <InputField
          label="Initial Investment Amount"
          value={initialInvestment}
          onChange={setInitialInvestment}
          prefix="₹"
          placeholder="100000"
          min={1000}
        />

        <InputField
          label="Expected Annual Return"
          value={expectedReturn}
          onChange={setExpectedReturn}
          suffix="%"
          placeholder="12"
          min={1}
          max={30}
          step={0.1}
        />

        <TimePeriodToggle
          selectedPeriod={periodType}
          onToggle={setPeriodType}
          monthsValue={monthsValue}
          yearsValue={yearsValue}
          onMonthsChange={setMonthsValue}
          onYearsChange={setYearsValue}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <Button
          onClick={calculateLumpsum}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Calculating..." : "Calculate Lumpsum"}
        </Button>
      </div>

      {/* Result Section */}
      <div>
        {result && (
          <ResultCard
            title="Lumpsum Calculation Results"
            results={[
              {
                label: "Initial Investment",
                value: formatCurrency(result.initialInvestment),
              },
              {
                label: "Investment Period",
                value: result.timePeriod,
              },
              {
                label: "Expected Return",
                value: `${result.expectedReturn}% p.a.`,
              },
              {
                label: "Total Returns",
                value: formatCurrency(result.totalReturns),
              },
              {
                label: `Amount at ${result.timePeriod}`,
                value: formatCurrency(result.maturityAmount),
                highlight: true,
              },
            ]}
          />
        )}

        {!result && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-500">
              Enter your investment details and click calculate to see the results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LumpsumCalculator;