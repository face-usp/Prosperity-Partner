import React from "react";

interface ResultItem {
  label: string;
  value: string;
  highlight?: boolean;
}

interface ResultCardProps {
  title: string;
  results: ResultItem[];
}

const ResultCard: React.FC<ResultCardProps> = ({ title, results }) => {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {results.map((result, index) => (
          <div
            key={index}
            className={`flex justify-between items-center ${
              result.highlight
                ? "bg-white rounded-lg p-3 border border-amber-300"
                : ""
            }`}
          >
            <span className="text-gray-700 text-sm">{result.label}</span>
            <span
              className={`font-semibold ${
                result.highlight
                  ? "text-amber-700 text-lg"
                  : "text-gray-900"
              }`}
            >
              {result.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultCard;