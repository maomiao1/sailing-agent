'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase, type Project, type Component } from '@/lib/supabase';
import { COMPONENT_TYPES, COMPONENT_NAMES, COMPONENT_DESCRIPTIONS } from '@/lib/constants';
import { ArrowLeft, Upload, FileText, Loader2, Copy, Edit2, Check } from 'lucide-react';
import Link from 'next/link';
import ComponentSection from '@/components/ComponentSection';

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [uploadingManual, setUploadingManual] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  async function loadProjectData() {
    setLoading(true);

    // Load project
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError) {
      console.error('加载项目失败:', projectError);
      alert('加载项目失败');
      return;
    }

    setProject(projectData);

    // Load components
    const { data: componentsData } = await supabase
      .from('components')
      .select('*')
      .eq('project_id', projectId);

    setComponents(componentsData || []);
    setLoading(false);
  }

  async function handleManualUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !project) return;

    // 文件大小检查（限制 50MB）
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert('文件太大！请将文件压缩到 50MB 以内，或者将 .docx 文件另存为 .txt 格式后上传。');
      return;
    }

    setUploadingManual(true);

    try {
      let text = '';
      const fileType = file.name.toLowerCase();

      // 根据文件类型读取内容
      if (fileType.endsWith('.txt') || fileType.endsWith('.md')) {
        // 纯文本文件
        text = await file.text();
      } else if (fileType.endsWith('.docx')) {
        // .docx 文件 - 使用 mammoth 库解析
        const mammoth = (await import('mammoth')).default;
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (fileType.endsWith('.doc')) {
        alert('不支持 .doc 格式，请将文件另存为 .docx 或 .txt 格式');
        return;
      } else {
        alert('不支持的文件格式，请上传 .txt, .md 或 .docx 文件');
        return;
      }

      // 检查提取的文本内容
      if (!text || text.trim().length === 0) {
        alert('文件内容为空，请检查文件');
        return;
      }

      // 更新项目数据
      const { error } = await supabase
        .from('projects')
        .update({
          manual_content: text,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;

      setProject({ ...project, manual_content: text });
      alert(`航海手册上传成功！已提取 ${Math.round(text.length / 1000)} K 字符`);
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败，请重试。如果是 .docx 文件，建议先转换为 .txt 格式');
    } finally {
      setUploadingManual(false);
    }
  }

  async function handleGenerateAll() {
    if (!project?.manual_content) {
      alert('请先上传航海手册');
      return;
    }

    setGenerating(true);

    try {
      // Call API to generate all components
      const response = await fetch('/api/generate-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          manualContent: project.manual_content
        })
      });

      if (!response.ok) throw new Error('生成失败');

      const data = await response.json();

      // Update project status
      await supabase
        .from('projects')
        .update({ status: 'completed' })
        .eq('id', projectId);

      alert('内容生成成功！');
      loadProjectData();
    } catch (error) {
      console.error('生成失败:', error);
      alert('生成失败，请重试');
    } finally {
      setGenerating(false);
    }
  }

  async function handleGenerateSingle(componentType: string) {
    if (!project?.manual_content) {
      alert('请先上传航海手册');
      return;
    }

    try {
      // 如果是生成开船第一课，需要先获取详情页内容
      let detailPageContent: string | undefined;
      if (componentType === 'first_lesson') {
        const detailPageComponent = components.find(c => c.component_type === 'detail_page');
        if (!detailPageComponent?.content) {
          alert('请先生成详情页，再生成开船第一课');
          return;
        }
        detailPageContent = detailPageComponent.content;
      }

      const response = await fetch('/api/generate-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          componentType,
          manualContent: project.manual_content,
          detailPageContent  // 传递详情页内容
        })
      });

      if (!response.ok) throw new Error('生成失败');

      alert('生成成功！');
      loadProjectData();
    } catch (error) {
      console.error('生成失败:', error);
      alert('生成失败，请重试');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white shadow-sm border-b border-border">
          <div className="container mx-auto px-6 py-5">
            <div className="h-8 w-48 bg-background animate-pulse rounded"></div>
          </div>
        </header>
        <main className="container mx-auto px-6 py-10 max-w-6xl">
          <div className="bg-card rounded-2xl shadow-sm p-8 mb-10 border border-border">
            <div className="h-8 w-40 bg-background animate-pulse rounded mb-6"></div>
            <div className="h-48 bg-background animate-pulse rounded"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-2xl shadow-sm p-6 border border-border">
                <div className="h-6 w-32 bg-background animate-pulse rounded mb-2"></div>
                <div className="h-4 w-64 bg-background animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-text-secondary mb-4">项目不存在</p>
          <Link href="/" className="text-primary hover:underline">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-6 py-5 flex items-center gap-4">
          <Link
            href="/"
            className="text-text-secondary hover:text-primary transition-colors p-2 hover:bg-background rounded-lg"
          >
            <ArrowLeft size={24} />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
            {project.responsible_person && (
              <p className="text-sm text-text-secondary mt-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                负责人: {project.responsible_person}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-6xl">
        {/* Upload Section */}
        <div className="bg-card rounded-2xl shadow-sm p-8 mb-10 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Upload size={20} className="text-primary" />
            </div>
            上传航海手册
          </h2>

          <div className="space-y-5">
            <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/50 transition-colors bg-background/30">
              <input
                type="file"
                id="manualFile"
                accept=".txt,.md,.doc,.docx"
                onChange={handleManualUpload}
                className="hidden"
              />
              <label
                htmlFor="manualFile"
                className="cursor-pointer inline-flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <FileText size={32} className="text-primary" />
                </div>
                <p className="text-foreground font-semibold mb-2 text-lg">
                  拖拽文件到此处或点击上传
                </p>
                <p className="text-sm text-text-secondary">
                  支持格式: .txt, .md, .doc, .docx（最大50MB）
                </p>
              </label>
            </div>

            {project.manual_content && (
              <div className="border border-success/30 rounded-xl overflow-hidden bg-success/5">
                <div className="px-5 py-4 border-b border-success/30">
                  <div className="text-success font-semibold flex items-center gap-2">
                    <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                    已上传航海手册（{Math.round(project.manual_content.length / 1000)}K字符）
                  </div>
                </div>
                <div className="p-5 bg-white max-h-80 overflow-y-auto">
                  <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                    {project.manual_content.substring(0, 2000)}
                    {project.manual_content.length > 2000 && '\n\n... (内容已截断，仅显示前2000字)'}
                  </pre>
                </div>
              </div>
            )}

            <button
              onClick={handleGenerateAll}
              disabled={!project.manual_content || generating}
              className="w-full px-6 py-4 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-lg border-2 border-primary/30"
              style={{
                background: !project.manual_content || generating
                  ? '#cccccc'
                  : 'linear-gradient(135deg, #409E88 0%, #368573 100%)',
                boxShadow: !project.manual_content || generating
                  ? 'none'
                  : '0 6px 16px rgba(64, 158, 136, 0.4)'
              }}
            >
              {generating ? (
                <>
                  <Loader2 className="animate-spin" size={22} />
                  生成中...
                </>
              ) : (
                '一键生成全部内容'
              )}
            </button>
          </div>
        </div>

        {/* Components Sections */}
        <div className="space-y-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">组件内容生成</h2>
            <p className="text-text-secondary">一键生成后，可对每个组件进行编辑和复制</p>
          </div>

          {Object.values(COMPONENT_TYPES).map((type) => {
            const component = components.find((c) => c.component_type === type);
            return (
              <ComponentSection
                key={type}
                componentType={type}
                componentName={COMPONENT_NAMES[type as keyof typeof COMPONENT_NAMES]}
                description={COMPONENT_DESCRIPTIONS[type as keyof typeof COMPONENT_DESCRIPTIONS]}
                content={component?.content}
                onGenerate={() => handleGenerateSingle(type)}
                onUpdate={loadProjectData}
                projectId={projectId}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
