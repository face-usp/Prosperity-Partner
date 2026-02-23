"use client";
import React, { useState } from "react";
import InputField from "@/components/common/InputField";
import Button from "@/components/common/Button";
import ResultCard from "@/components/common/ResultCard";
import TimePeriodToggle from "@/components/common/TimePeriodToggle";

interface GoalResult {
  monthlyGoal?: {
    goalAmount: string;
    annualRate: string;
    months: number;
    years: string;
    lumpsumNeeded: string;
    monthlySIP: string;
    message: string;
  };
  yearlyGoal?: {
    goalAmount: string;
    annualRate: string;
    years: number;
    lumpsumNeeded: string;
    yearlySIP: string;
    message: string;
  };
}

const GoalCalculator = () => {
  const [goalAmount, setGoalAmount] = useState("1000000");
  const [periodType, setPeriodType] = useState<"months" | "years">("years");
  const [monthsValue, setMonthsValue] = useState("120");
  const [yearsValue, setYearsValue] = useState("10");
  const [annualRate, setAnnualRate] = useState("12");
  const [result, setResult] = useState<GoalResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const calculateGoal = async () => {
    setLoading(true);
    setError("");
    
    try {
      const requestBody: any = {
        goalAmount: parseFloat(goalAmount),
        annualRate: parseFloat(annualRate),
      };

      if (periodType === "months") {
        requestBody.months = parseFloat(monthsValue);
      } else {
        requestBody.years = parseFloat(yearsValue);
      }

      const response = await fetch("/api/calculator/goal", {
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

  const renderResults = () => {
    if (!result) return null;

    const goalData = periodType === "months" ? result.monthlyGoal : result.yearlyGoal;
    if (!goalData) return null;

    const results = [
      {
        label: "Goal Amount",
        value: `₹${goalData.goalAmount}`,
      },
      {
        label: "Annual Rate",
        value: goalData.annualRate,
      },
      {
        label: "Time Period",
        value: periodType === "months" && 'months' in goalData
          ? `${goalData.months} months (${goalData.years} years)`
          : `${goalData.years} years`,
      },
      {
        label: "Lumpsum Needed Today",
        value: `₹${goalData.lumpsumNeeded}`,
        highlight: true,
      },
      {
        label: periodType === "months" ? "Monthly SIP Required" : "Yearly SIP Required",
        value: periodType === "months" && 'monthlySIP' in goalData
          ? `₹${goalData.monthlySIP}`
          : `₹${'yearlySIP' in goalData ? goalData.yearlySIP : ''}`,
        highlight: true,
      },
    ];

    return (
      <div className="space-y-6">
        <ResultCard
          title="Target Goal Results"
          results={results}
        />
        
        {/* Message Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-3">Investment Strategy</h4>
          <p className="text-blue-800 text-sm leading-relaxed">
            {goalData.message}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Target Goal Calculator
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Calculate how much you need to invest today (lumpsum) or regularly (SIP) to reach your financial target.
          </p>
        </div>

        <InputField
          label="Goal Amount"
          value={goalAmount}
          onChange={setGoalAmount}
          prefix="₹"
          placeholder="1000000"
          min={10000}
        />

        <InputField
          label="Expected Annual Return"
          value={annualRate}
          onChange={setAnnualRate}
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
          label="Time to Achieve Goal"
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <Button
          onClick={calculateGoal}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Calculating..." : "Calculate Target Goal"}
        </Button>
      </div>

      {/* Result Section */}
      <div>
        {result ? (
          renderResults()
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-500">
              Enter your target goal details and click calculate to see the investment options.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalCalculator;