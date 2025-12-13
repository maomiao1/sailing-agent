'use client';

import { type Project, supabase } from '@/lib/supabase';
import { STATUS_TEXT } from '@/lib/constants';
import { Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface ProjectCardProps {
  project: Project;
  onUpdate: () => void;
}

export default function ProjectCard({ project, onUpdate }: ProjectCardProps) {
  const [deleting, setDeleting] = useState(false);
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-white';
      case 'generating':
        return 'bg-warning text-white';
      default:
        return 'bg-text-secondary text-white';
    }
  };

  async function handleDelete() {
    if (!confirm(`确定要删除项目"${project.name}"吗？此操作无法撤销。`)) {
      return;
    }

    setDeleting(true);

    try {
      // 先删除关联的组件
      await supabase
        .from('components')
        .delete()
        .eq('project_id', project.id);

      // 再删除项目
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id);

      if (error) throw error;

      alert('项目已删除');
      onUpdate(); // 刷新项目列表
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
      setDeleting(false);
    }
  }

  return (
    <div className="bg-card rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-border overflow-hidden group">
      <div className="p-6">
        {/* Project Name */}
        <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
          {project.name}
        </h3>

        {/* Responsible Person */}
        {project.responsible_person && (
          <p className="text-sm text-text-secondary mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            负责人: {project.responsible_person}
          </p>
        )}

        {/* Status Badge */}
        <div className="mb-5">
          <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
            {STATUS_TEXT[project.status]}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={`/project/${project.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 text-white rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md"
            style={{
              background: 'linear-gradient(135deg, #409E88 0%, #368573 100%)'
            }}
          >
            <Eye size={16} />
            查看详情
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-error/30 text-error hover:bg-error hover:text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-error/5"
            title="删除项目"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-background/50 border-t border-border">
        <p className="text-xs text-text-secondary flex items-center gap-1.5">
          <span className="w-1 h-1 bg-text-secondary rounded-full opacity-50"></span>
          创建于 {new Date(project.created_at).toLocaleDateString('zh-CN')}
        </p>
      </div>
    </div>
  );
}
