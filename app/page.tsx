'use client';

import { useState, useEffect } from 'react';
import { supabase, type Project } from '@/lib/supabase';
import ProjectCard from '@/components/ProjectCard';
import CreateProjectDialog from '@/components/CreateProjectDialog';
import EditProjectDialog from '@/components/EditProjectDialog';
import MonthSelector from '@/components/MonthSelector';
import { Plus } from 'lucide-react';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentMonth, setCurrentMonth] = useState('');
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAvailableMonths();
  }, []);

  useEffect(() => {
    if (currentMonth) {
      loadProjects();
    }
  }, [currentMonth]);

  async function loadAvailableMonths() {
    // 获取所有已存在的月份
    const { data, error } = await supabase
      .from('projects')
      .select('month')
      .order('month', { ascending: false });

    if (error) {
      console.error('加载月份失败:', error);
      setProjects([]);
      setLoading(false);
      return;
    } else {
      const months = Array.from(new Set(data?.map(p => p.month) || []));
      setAvailableMonths(months);
      // 设置当前月份为最新的月份
      if (months.length > 0) {
        if (!months.includes(currentMonth)) {
          setCurrentMonth(months[0]);
        }
      } else {
        setCurrentMonth('');
        setProjects([]);
        setLoading(false);
      }
    }
  }

  async function loadProjects() {
    setLoading(true);
    // 只查询必要字段，不加载 manual_content 以提升性能
    const { data, error } = await supabase
      .from('projects')
      .select('id, month, name, responsible_person, status, created_at, updated_at')
      .eq('month', currentMonth)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('加载项目失败:', error);
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  }

  async function handleCreateProject(name: string, responsiblePerson: string, month: string) {
    const { data, error} = await supabase
      .from('projects')
      .insert({
        month,
        name,
        responsible_person: responsiblePerson,
        status: 'draft'
      })
      .select()
      .single();

    if (error) {
      console.error('创建项目失败:', error);
      alert('创建项目失败，请重试');
    } else {
      setIsDialogOpen(false);
      // 刷新月份列表
      await loadAvailableMonths();
      // 切换到新创建项目的月份
      setCurrentMonth(month);
    }
  }

  function handleEditClick(project: Project) {
    setEditingProject(project);
    setIsEditDialogOpen(true);
  }

  async function handleUpdateProject(id: string, name: string, responsiblePerson: string, month: string) {
    const { error } = await supabase
      .from('projects')
      .update({
        name,
        responsible_person: responsiblePerson,
        month
      })
      .eq('id', id);

    if (error) {
      console.error('更新项目失败:', error);
      alert('更新项目失败，请重试');
    } else {
      setIsEditDialogOpen(false);
      setEditingProject(null);
      // 刷新月份列表
      await loadAvailableMonths();
      // 如果月份改变了，切换到新月份，否则刷新当前列表
      if (month !== currentMonth) {
        setCurrentMonth(month);
      } else {
        loadProjects();
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full overflow-hidden flex justify-center">
        <img
          src="/网站头图最终版.jpg"
          alt="航海实战组件内容生成Agent"
          style={{
            display: 'block',
            width: '100%',
            maxWidth: '1200px',
            height: 'auto',
            imageRendering: '-webkit-optimize-contrast',
            WebkitFontSmoothing: 'antialiased'
          }}
        />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10">
        {/* Month Selector and Add Button */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <MonthSelector
            availableMonths={availableMonths}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            onMonthsUpdate={loadAvailableMonths}
          />
          <button
            onClick={() => setIsDialogOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg border-2 border-primary/30 whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #409E88 0%, #368573 100%)',
              boxShadow: '0 4px 12px rgba(64, 158, 136, 0.3)'
            }}
          >
            <Plus size={20} />
            添加新项目
          </button>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
              <p className="text-text-secondary">加载中...</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            <p className="text-lg mb-4">还没有项目</p>
            <p>点击上方"添加新项目"按钮创建第一个项目</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onUpdate={loadProjects}
                onEdit={handleEditClick}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreate={handleCreateProject}
      />

      {/* Edit Project Dialog */}
      <EditProjectDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingProject(null);
        }}
        onUpdate={handleUpdateProject}
        project={editingProject}
      />
    </div>
  );
}
