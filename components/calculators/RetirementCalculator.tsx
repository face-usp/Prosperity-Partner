"use client";
import React, { useState } from "react";
import InputField from "@/components/common/InputField";
import Button from "@/components/common/Button";
import ResultCard from "@/components/common/ResultCard";
import { Plus, Trash2 } from "lucide-react";

interface ExistingSaving {
  amount: string;
  preRetirementReturn: string;
}

interface RetirementResult {
  monthlyExpenseAtRetirement: number;
  corpusRequired: number;
  appreciatedExistingSavings: number;
  additionalRetirementCorpusNeeded: number;
  lumpsumRequired: number;
  sipRequired: number;
  weightedPreRetirementReturn: number;
  investmentPattern: Array<{
    delayYears: number;
    lumpsum: number;
    sip: number;
  }>;
}

const RetirementCalculator = () => {
  const [currentAge, setCurrentAge] = useState("30");
  const [retirementAge, setRetirementAge] = useState("60");
  const [lifeExpectancy, setLifeExpectancy] = useState("80");
  const [currentMonthlyExpenses, setCurrentMonthlyExpenses] = useState("50000");
  const [percentExpensesContinue, setPercentExpensesContinue] = useState("100");
  const [expectedInflation, setExpectedInflation] = useState("6");
  const [postRetirementReturn, setPostRetirementReturn] = useState("8");
  const [existingSavings, setExistingSavings] = useState<ExistingSaving[]>([
    { amount: "", preRetirementReturn: "" },
  ]);
  const [result, setResult] = useState<RetirementResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addSavingRow = () => {
    setExistingSavings([...existingSavings, { amount: "", preRetirementReturn: "" }]);
  };

  const removeSavingRow = (index: number) => {
    if (existingSavings.length > 1) {
      setExistingSavings(existingSavings.filter((_, i) => i !== index));
    }
  };

  const updateSaving = (index: number, field: keyof ExistingSaving, value: string) => {
    const updated = [...existingSavings];
    updated[index][field] = value;
    setExistingSavings(updated);
  };

  const calculateRetirement = async () => {
    setLoading(true);
    setError("");

    try {
      // Filter out empty savings entries
      const validSavings = existingSavings
        .filter((s) => s.amount && s.preRetirementReturn)
        .map((s) => ({
          amount: parseFloat(s.amount),
          preRetirementReturn: parseFloat(s.preRetirementReturn),
        }));

      const response = await fetch("/api/calculator/retirement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentAge: parseFloat(currentAge),
          retirementAge: parseFloat(retirementAge),
          lifeExpectancy: parseFloat(lifeExpectancy),
          currentMonthlyExpenses: parseFloat(currentMonthlyExpenses),
          percentExpensesContinue: parseFloat(percentExpensesContinue),
          expectedInflation: parseFloat(expectedInflation),
          postRetirementReturn: parseFloat(postRetirementReturn),
          existingSavings: validSavings,
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
            Retirement Planner
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            Plan your retirement corpus and calculate monthly investments needed for a comfortable retirement.
          </p>
        </div>

        {/* Age Inputs */}
        <div className="grid grid-cols-3 gap-4">
          <InputField
            label="Current Age"
            value={currentAge}
            onChange={setCurrentAge}
            suffix="yrs"
            placeholder="30"
            min={18}
            max={65}
          />
          <InputField
            label="Retirement Age"
            value={retirementAge}
            onChange={setRetirementAge}
            suffix="yrs"
            placeholder="60"
            min={40}
            max={75}
          />
          <InputField
            label="Life Expectancy"
            value={lifeExpectancy}
            onChange={setLifeExpectancy}
            suffix="yrs"
            placeholder="80"
            min={65}
            max={100}
          />
        </div>

        {/* Expense Inputs */}
        <InputField
          label="Current Monthly Expenses"
          value={currentMonthlyExpenses}
          onChange={setCurrentMonthlyExpenses}
          prefix="₹"
          placeholder="50000"
          min={10000}
        />

        <InputField
          label="% of Expenses to Continue Post-Retirement"
          value={percentExpensesContinue}
          onChange={setPercentExpensesContinue}
          suffix="%"
          placeholder="100"
          min={0}
          max={100}
        />

        {/* Return Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Expected Inflation"
            value={expectedInflation}
            onChange={setExpectedInflation}
            suffix="%"
            placeholder="6"
            min={1}
            max={15}
            step={0.1}
          />
          <InputField
            label="Post-Retirement Return"
            value={postRetirementReturn}
            onChange={setPostRetirementReturn}
            suffix="%"
            placeholder="8"
            min={1}
            max={20}
            step={0.1}
          />
        </div>

        {/* Existing Savings Section */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Existing Savings (Optional)
            </label>
            <button
              type="button"
              onClick={addSavingRow}
              className="flex items-center gap-1 text-amber-600 hover:text-amber-700 text-sm font-medium"
            >
              <Plus size={16} />
              Add More
            </button>
          </div>

          <div className="space-y-3">
            {existingSavings.map((saving, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1">
                  <input
                    type="number"
                    value={saving.amount}
                    onChange={(e) => updateSaving(index, "amount", e.target.value)}
                    placeholder="Amount"
                    min={0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    value={saving.preRetirementReturn}
                    onChange={(e) =>
                      updateSaving(index, "preRetirementReturn", e.target.value)
                    }
                    placeholder="Return %"
                    min={0}
                    max={30}
                    step={0.1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  />
                </div>
                {existingSavings.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSavingRow(index)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Add your existing savings with their expected pre-retirement returns
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <Button onClick={calculateRetirement} disabled={loading} className="w-full">
          {loading ? "Calculating..." : "Calculate Retirement Plan"}
        </Button>
      </div>

      {/* Result Section */}
      <div>
        {result && (
          <div className="space-y-6">
            {/* Main Results */}
            <ResultCard
              title="Retirement Corpus Analysis"
              results={[
                {
                  label: "Monthly Expense at Retirement",
                  value: formatCurrency(result.monthlyExpenseAtRetirement),
                },
                {
                  label: "Total Corpus Required",
                  value: formatCurrency(result.corpusRequired),
                  highlight: true,
                },
                {
                  label: "Appreciated Existing Savings",
                  value: formatCurrency(result.appreciatedExistingSavings),
                },
                {
                  label: "Additional Corpus Needed",
                  value: formatCurrency(result.additionalRetirementCorpusNeeded),
                  highlight: true,
                },
              ]}
            />

            {/* Investment Required */}
            <ResultCard
              title="Investment Required Today"
              results={[
                {
                  label: "Weighted Pre-Retirement Return",
                  value: `${result.weightedPreRetirementReturn}%`,
                },
                {
                  label: "Lumpsum Required",
                  value: formatCurrency(result.lumpsumRequired),
                  highlight: true,
                },
                {
                  label: "Monthly SIP Required",
                  value: formatCurrency(result.sipRequired),
                  highlight: true,
                },
              ]}
            />

            {/* Investment Pattern with Delays */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Impact of Delaying Investment
              </h3>
              <div className="space-y-3">
                {result.investmentPattern.map((pattern, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 border border-purple-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-purple-900">
                        {pattern.delayYears === 0
                          ? "Start Today"
                          : `Delay by ${pattern.delayYears} year${
                              pattern.delayYears > 1 ? "s" : ""
                            }`}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Lumpsum:</span>
                        <p className="font-semibold text-purple-900">
                          {formatCurrency(pattern.lumpsum)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Monthly SIP:</span>
                        <p className="font-semibold text-purple-900">
                          {formatCurrency(pattern.sip)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!result && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-500">
              Enter your retirement details and click calculate to see your retirement plan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RetirementCalculator;