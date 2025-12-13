'use client';

import { useState, memo } from 'react';
import { ChevronDown, ChevronUp, Copy, Edit2, Check, Loader2, FileText } from 'lucide-react';

interface ComponentSectionProps {
  componentType: string;
  componentName: string;
  description: string;
  content?: string;
  onGenerate: () => void;
  onUpdate: () => void;
  projectId: string;
}

function ComponentSection({
  componentType,
  componentName,
  description,
  content,
  onGenerate,
  onUpdate,
  projectId,
}: ComponentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content || '');
  const [copySuccess, setCopySuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCopy = async () => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
      alert('复制失败');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/update-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          componentType,
          content: editedContent
        })
      });

      if (!response.ok) throw new Error('保存失败');

      setIsEditing(false);
      onUpdate();
      alert('保存成功！');
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-all">
      {/* Header */}
      <div
        className="p-6 cursor-pointer hover:bg-background/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-3">
              {componentName}
              {content && content.trim().length > 0 && (
                <span className="px-3 py-1 bg-success/10 text-success text-xs font-semibold rounded-full border border-success/20">
                  已生成
                </span>
              )}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
          </div>

          <div className="flex items-center gap-2">
            {content && content.trim().length > 0 ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(!isEditing);
                    setIsExpanded(true);
                    setEditedContent(content);
                  }}
                  className="px-4 py-2 border-2 border-primary/30 text-primary hover:text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-2 bg-primary/5 hover:bg-primary"
                >
                  <Edit2 size={16} />
                  编辑
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy();
                  }}
                  className="px-4 py-2 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, #409E88 0%, #368573 100%)'
                  }}
                >
                  {copySuccess ? (
                    <>
                      <Check size={16} />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      复制
                    </>
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onGenerate();
                  }}
                  className="px-4 py-2 text-white rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, #409E88 0%, #368573 100%)'
                  }}
                >
                  生成
                </button>
              </>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onGenerate();
                }}
                className="px-4 py-2 text-white rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                style={{
                  background: 'linear-gradient(135deg, #409E88 0%, #368573 100%)'
                }}
              >
                生成
              </button>
            )}

            <button className="text-text-secondary hover:text-foreground transition-colors p-2">
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-border p-6 bg-background/30">
          {isEditing ? (
            <div className="space-y-4">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-96 px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white font-sans text-sm leading-relaxed"
                placeholder="编辑内容..."
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(content || '');
                  }}
                  className="px-5 py-2.5 border border-border text-text-secondary hover:bg-card rounded-lg font-medium transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md"
                  style={{
                    background: saving
                      ? '#cccccc'
                      : 'linear-gradient(135deg, #409E88 0%, #368573 100%)'
                  }}
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      保存中...
                    </>
                  ) : (
                    '保存'
                  )}
                </button>
              </div>
            </div>
          ) : (content && content.trim().length > 0) ? (
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-foreground bg-white p-6 rounded-xl border border-border leading-relaxed text-sm">
                {content}
              </pre>
            </div>
          ) : (
            <div className="text-center py-12 text-text-secondary">
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-text-secondary opacity-50" />
              </div>
              <p className="font-medium mb-1">还未生成内容</p>
              <p className="text-sm">点击上方"生成"按钮生成内容</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(ComponentSection);
