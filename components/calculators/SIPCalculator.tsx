"use client";
import React, { useState } from "react";
import InputField from "@/components/common/InputField";
import Button from "@/components/common/Button";
import ResultCard from "@/components/common/ResultCard";

interface SIPResult {
  totalInvestment: number;
  totalReturns: number;
  maturityAmount: number;
  monthlyInvestment: number;
  expectedReturn: number;
  timePeriod: number;
}

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState("0");
  const [expectedReturn, setExpectedReturn] = useState("0");
  const [timePeriod, setTimePeriod] = useState("0");
  const [result, setResult] = useState<SIPResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const calculateSIP = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/calculator/sip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          monthlyInvestment: parseFloat(monthlyInvestment), // invested
          expectedReturn: parseFloat(expectedReturn), // annual rate
          timePeriod: parseFloat(timePeriod), // months
        }),
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
            SIP Calculator
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Calculate the future value of your Systematic Investment Plan (SIP) investments.
          </p>
        </div>

        <InputField
          label="Monthly Investment Amount"
          value={monthlyInvestment}
          onChange={setMonthlyInvestment}
          prefix="₹"
          placeholder="0"
        />

        <InputField
          label="Expected Annual Return"
          value={expectedReturn}
          onChange={setExpectedReturn}
          suffix="%"
          placeholder="0"
        />

        <InputField
          label="Investment Period"
          value={timePeriod}
          onChange={setTimePeriod}
          suffix="months"
          placeholder="0"
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <Button
          onClick={calculateSIP}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Calculating..." : "Calculate SIP"}
        </Button>
      </div>

      {/* Result Section */}
      <div>
        {result && (
          <ResultCard
            title="SIP Calculation Results"
            results={[
              {
                label: "Monthly Investment",
                value: formatCurrency(result.monthlyInvestment),
              },
              {
                label: "Investment Period",
                value: `${result.timePeriod} months`,
              },
              {
                label: "Expected Return",
                value: `${result.expectedReturn}% p.a.`,
              },
              {
                label: "Total Investment",
                value: formatCurrency(result.totalInvestment),
              },
              {
                label: "Total Returns",
                value: formatCurrency(result.totalReturns),
              },
              {
                label: "Maturity Amount",
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

export default SIPCalculator;