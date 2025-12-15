'use client';

import { useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';

interface MonthSelectorProps {
  availableMonths: string[];
  currentMonth: string;
  onMonthChange: (month: string) => void;
  onMonthsUpdate: () => void;
}

export default function MonthSelector({
  availableMonths,
  currentMonth,
  onMonthChange,
  onMonthsUpdate
}: MonthSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 生成月份选项（从当前年份向前后3年）
  const generateAllMonths = () => {
    const currentYear = new Date().getFullYear();
    const months: string[] = [];

    for (let year = currentYear - 1; year <= currentYear + 2; year++) {
      for (let month = 1; month <= 12; month++) {
        months.push(`${year}年${month}月`);
      }
    }

    return months;
  };

  const allMonths = generateAllMonths();

  const handleMonthSelect = (month: string) => {
    onMonthChange(month);
    setIsOpen(false);
    // 如果选择的月份不在现有列表中，刷新列表
    if (!availableMonths.includes(month)) {
      setTimeout(() => {
        onMonthsUpdate();
      }, 100);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-primary/30 rounded-lg hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
      >
        <Calendar size={20} className="text-primary" />
        <div className="text-left">
          <div className="text-xs text-text-secondary">当前月份</div>
          <div className="text-lg font-bold text-foreground">
            {currentMonth || '请选择月份'}
          </div>
        </div>
        <ChevronDown
          size={20}
          className={`text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-2xl border border-border z-50 max-h-96 overflow-y-auto">
            {/* Available Months Section */}
            {availableMonths.length > 0 && (
              <div className="p-3 border-b border-border">
                <div className="text-xs font-semibold text-text-secondary mb-2 px-2">
                  已有项目的月份
                </div>
                {availableMonths.map((month) => (
                  <button
                    key={month}
                    onClick={() => handleMonthSelect(month)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      month === currentMonth
                        ? 'bg-primary text-white font-semibold'
                        : 'hover:bg-background text-foreground'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}

            {/* All Months Section */}
            <div className="p-3">
              <div className="text-xs font-semibold text-text-secondary mb-2 px-2">
                选择其他月份
              </div>
              {allMonths
                .filter(month => !availableMonths.includes(month))
                .map((month) => (
                  <button
                    key={month}
                    onClick={() => handleMonthSelect(month)}
                    className="w-full text-left px-4 py-2 rounded-lg transition-colors hover:bg-background text-foreground"
                  >
                    {month}
                  </button>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
