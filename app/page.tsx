// app/page.tsx
"use client";

import { useState, useCallback, useMemo } from "react";
import {
  InputField,
  ResultCard,
  AmortizationTable,
} from "./components/index";

interface EmiResult {
  emi: number;
  totalInterest: number;
  totalPayable: number;
}

interface ScheduleItem {
  month: number;
  year: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function EMICalculatorPage() {
  // State for inputs with better default values and validation
  const [loanAmount, setLoanAmount] = useState<string>("1000000");
  const [interestRate, setInterestRate] = useState<string>("8.5");
  const [loanTenure, setLoanTenure] = useState<string>("20");

  // State for results
  const [emiResult, setEmiResult] = useState<EmiResult | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  // Memoized currency formatter
  const currencyFormatter = useMemo(() => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format;
  }, []);

  // Calculate EMI and schedule when inputs change
  const calculateResults = useCallback(() => {
    const principal = parseFloat(loanAmount) || 0;
    const annualRate = parseFloat(interestRate) || 0;
    const tenureYears = parseInt(loanTenure, 10) || 0;

    if (principal <= 0 || annualRate <= 0 || tenureYears <= 0) {
      setEmiResult(null);
      setSchedule([]);
      return;
    }

    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = tenureYears * 12;

    // Calculate EMI
    let emi: number;
    if (monthlyRate === 0) {
      emi = principal / totalMonths;
    } else {
      emi =
        (principal *
          monthlyRate *
          Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }

    const totalPayable = emi * totalMonths;
    const totalInterest = totalPayable - principal;

    // Generate amortization schedule
    let balance = principal;
    const schedule: ScheduleItem[] = [];
    const startDate = new Date();

    for (let i = 1; i <= totalMonths; i++) {
      const interest = balance * monthlyRate;
      const principalPayment = emi - interest;
      balance -= principalPayment;

      const currentDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + i,
        1
      );

      schedule.push({
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        principal: principalPayment,
        interest,
        balance: i === totalMonths ? 0 : Math.max(0, balance), // Ensure balance doesn't go negative
      });
    }

    setEmiResult({ emi, totalInterest, totalPayable });
    setSchedule(schedule);
  }, [loanAmount, interestRate, loanTenure]);

  // Calculate results on initial render and when inputs change
  useMemo(() => {
    calculateResults();
  }, [calculateResults]);

  // Format results using the memoized formatter
  const formattedResults = useMemo(() => {
    if (!emiResult) return null;
    return {
      emi: currencyFormatter(emiResult.emi),
      totalInterest: currencyFormatter(emiResult.totalInterest),
      totalPayable: currencyFormatter(emiResult.totalPayable),
    };
  }, [emiResult, currencyFormatter]);

  return (
    <main className="bg-slate-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 text-center">
            EMI Calculator
          </h1>
          <p className="text-gray-500 mb-8 text-center">
            Plan your loan with our easy-to-use EMI calculator.
          </p>

          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <InputField
              label="Loan Amount (₹)"
              id="loanAmount"
              value={loanAmount}
              onChange={(value) => {
                if (/^\d*\.?\d*$/.test(value)) setLoanAmount(value);
              }}
              placeholder="e.g., 1000000"
              min="0"
            />
            <InputField
              label="Interest Rate (% p.a.)"
              id="interestRate"
              value={interestRate}
              onChange={(value) => {
                if (/^\d*\.?\d*$/.test(value)) setInterestRate(value);
              }}
              placeholder="e.g., 8.5"
              min="0"
              step="0.1"
            />
            <InputField
              label="Loan Tenure (Years)"
              id="loanTenure"
              value={loanTenure}
              onChange={(value) => {
                if (/^\d*$/.test(value)) setLoanTenure(value);
              }}
              placeholder="e.g., 20"
              min="1"
            />
          </div>

          {/* Results Section */}
          {emiResult && formattedResults && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Loan Summary
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <ResultCard
                  title="Monthly EMI"
                  value={formattedResults.emi}
                  highlight
                />
                <ResultCard
                  title="Total Interest Payable"
                  value={formattedResults.totalInterest}
                  highlight
                />
                <ResultCard
                  title="Total Amount Payable"
                  value={formattedResults.totalPayable}
                  highlight
                />
              </div>
            </div>
          )}

          {/* Amortization Table */}
          {schedule.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Loan Amortization Schedule
              </h2>
              <AmortizationTable
                schedule={schedule}
                emi={formattedResults?.emi ?? ""}
                formatCurrency={currencyFormatter}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}