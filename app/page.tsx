'use client';

import { useState, useEffect } from 'react';
import { supabase, type Project } from '@/lib/supabase';
import ProjectCard from '@/components/ProjectCard';
import CreateProjectDialog from '@/components/CreateProjectDialog';
import { Plus } from 'lucide-react';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentMonth, setCurrentMonth] = useState('2026年3月');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, [currentMonth]);

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

  async function handleCreateProject(name: string, responsiblePerson: string) {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        month: currentMonth,
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
      setProjects([data, ...projects]);
      setIsDialogOpen(false);
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
        {/* Month Title and Add Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {currentMonth}航海项目
            </h2>
            <div className="h-1 w-20 bg-primary rounded-full"></div>
          </div>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg border-2 border-primary/30"
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
    </div>
  );
}
