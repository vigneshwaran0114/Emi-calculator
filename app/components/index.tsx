// components/InputField.tsx
import React from "react";

interface InputFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "number" | "text";
  min?: string | number;
  step?: string | number;
}

interface ScheduleItem {
  month: number;
  year: number;
  principal: number;
  interest: number;
  balance: number;
}

interface AmortizationTableProps {
  schedule: ScheduleItem[];
  emi: string | null;
  formatCurrency: (value: number) => string;
}

interface ResultCardProps {
  title: string;
  value: string | null;
  highlight?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = "number",
  min,
  step,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      min={min}
      step={step}
    />
  </div>
);

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  value,
  highlight = false,
}) => (
  <div>
    <p className="text-gray-600">{title}</p>
    <p
      className={`text-2xl font-bold ${
        highlight ? "text-blue-700" : "text-gray-900"
      }`}
    >
      {value ?? "---"}
    </p>
  </div>
);

export const AmortizationTable: React.FC<AmortizationTableProps> = ({
  schedule,
  emi,
  formatCurrency,
}) => (
  <div className="overflow-x-auto max-h-[600px] border border-gray-200 rounded-lg shadow-md">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50 sticky top-0">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Month
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Year
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            EMI
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Principal Paid
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Interest Paid
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Balance Amount
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {schedule.map((item) => (
          <tr key={item?.month} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {item.month}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {item.year}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {emi}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
              {formatCurrency(item.principal)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
              {formatCurrency(item.interest)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {formatCurrency(item.balance)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
