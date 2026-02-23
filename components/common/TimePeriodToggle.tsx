import React from "react";

interface TimePeriodToggleProps {
  selectedPeriod: "months" | "years";
  onToggle: (period: "months" | "years") => void;
  monthsValue: string;
  yearsValue: string;
  onMonthsChange: (value: string) => void;
  onYearsChange: (value: string) => void;
  label?: string;
}

const TimePeriodToggle: React.FC<TimePeriodToggleProps> = ({
  selectedPeriod,
  onToggle,
  monthsValue,
  yearsValue,
  onMonthsChange,
  onYearsChange,
  label = "Investment Period",
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {/* Toggle Buttons */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-3">
        <button
          type="button"
          onClick={() => onToggle("months")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            selectedPeriod === "months"
              ? "bg-amber-600 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Months
        </button>
        <button
          type="button"
          onClick={() => onToggle("years")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            selectedPeriod === "years"
              ? "bg-amber-600 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Years
        </button>
      </div>

      {/* Input Field */}
      <div className="relative">
        <input
          type="number"
          value={selectedPeriod === "months" ? monthsValue : yearsValue}
          onChange={(e) => 
            selectedPeriod === "months" 
              ? onMonthsChange(e.target.value)
              : onYearsChange(e.target.value)
          }
          placeholder={selectedPeriod === "months" ? "12" : "1"}
          min={selectedPeriod === "months" ? 1 : 0.1}
          max={selectedPeriod === "months" ? 600 : 50}
          step={selectedPeriod === "months" ? 1 : 0.1}
          className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
          {selectedPeriod}
        </span>
      </div>
    </div>
  );
};

export default TimePeriodToggle;