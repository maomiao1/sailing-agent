'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

import { type Project } from '@/lib/supabase';

interface EditProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, name: string, responsiblePerson: string, month: string) => void;
  project: Project | null;
}

export default function EditProjectDialog({
  isOpen,
  onClose,
  onUpdate,
  project,
}: EditProjectDialogProps) {
  const [name, setName] = useState('');
  const [responsiblePerson, setResponsiblePerson] = useState('');
  const [month, setMonth] = useState('');

  // Update form when project changes
  useEffect(() => {
    if (project && isOpen) {
      setName(project.name);
      setResponsiblePerson(project.responsible_person || '');
      setMonth(project.month);
    }
  }, [project, isOpen]);

  if (!isOpen || !project) return null;

  // 生成当前年份的前后3年的月份选项
  const generateMonthOptions = () => {
    const currentYear = new Date().getFullYear();
    const months: string[] = [];

    for (let year = currentYear - 1; year <= currentYear + 2; year++) {
      for (let month = 1; month <= 12; month++) {
        months.push(`${year}年${month}月`);
      }
    }

    return months;
  };

  const monthOptions = generateMonthOptions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && month) {
      onUpdate(project.id, name.trim(), responsiblePerson.trim(), month);
      handleClose();
    }
  };

  const handleClose = () => {
    setName('');
    setResponsiblePerson('');
    setMonth('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-card rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">编辑项目</h2>
          <button
            onClick={handleClose}
            className="text-text-secondary hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-foreground mb-2">
              航海月份 <span className="text-error">*</span>
            </label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">请选择月份</option>
              {monthOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-foreground mb-2">
              项目名称 <span className="text-error">*</span>
            </label>
            <input
              id="projectName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如: 小红书虚拟资料项目"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="responsiblePerson" className="block text-sm font-medium text-foreground mb-2">
              负责人
            </label>
            <input
              id="responsiblePerson"
              type="text"
              value={responsiblePerson}
              onChange={(e) => setResponsiblePerson(e.target.value)}
              placeholder="例如: 张三"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-border text-text-secondary hover:bg-background rounded-lg font-medium transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
            >
              保存修改
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
