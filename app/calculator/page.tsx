"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SIPCalculator from "@/components/calculators/SIPCalculator";
import LumpsumCalculator from "@/components/calculators/LumpsumCalculator";
import GoalCalculator from "@/components/calculators/GoalCalculator";
import RetirementCalculator from "@/components/calculators/RetirementCalculator";
import { Calculator, TrendingUp, Target, Clock } from "lucide-react";

const calculatorTypes = [
  {
    id: "sip",
    name: "SIP Calculator",
    description: "Calculate returns on your Systematic Investment Plan",
    icon: Calculator,
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: "lumpsum",
    name: "Lumpsum Calculator",
    description: "Calculate returns on your one-time investment",
    icon: TrendingUp,
    color: "bg-green-50 border-green-200 hover:bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: "goal",
    name: "Target Goal Calculator",
    description: "Calculate investment needed to reach your financial target",
    icon: Target,
    color: "bg-amber-50 border-amber-200 hover:bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    id: "retirement",
    name: "Retirement Planner",
    description: "Plan your retirement with smart investments",
    icon: Clock,
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    iconColor: "text-purple-600",
  },
];

export default function CalculatorPage() {
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);

  const renderCalculator = () => {
    switch (activeCalculator) {
      case "sip":
        return <SIPCalculator />;
      case "lumpsum":
        return <LumpsumCalculator />;
      case "goal":
        return <GoalCalculator />;
      case "retirement":
        return <RetirementCalculator />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-[120px] pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-serif text-gray-900 mb-4">
              Financial Calculators
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Plan your investments and achieve your financial goals with our comprehensive calculators
            </p>
          </div>

          {!activeCalculator ? (
            /* Calculator Selection Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {calculatorTypes.map((calc) => {
                const IconComponent = calc.icon;
                return (
                  <div
                    key={calc.id}
                    onClick={() => setActiveCalculator(calc.id)}
                    className={`${calc.color} border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105`}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`${calc.iconColor} mr-4`}>
                        <IconComponent size={32} />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {calc.name}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {calc.description}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Active Calculator */
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Calculator Header */}
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">
                    {calculatorTypes.find(c => c.id === activeCalculator)?.name}
                  </h2>
                  <button
                    onClick={() => setActiveCalculator(null)}
                    className="text-white hover:text-amber-200 transition-colors"
                  >
                    ← Back to Calculators
                  </button>
                </div>
              </div>
              
              {/* Calculator Content */}
              <div className="p-6">
                {renderCalculator()}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}