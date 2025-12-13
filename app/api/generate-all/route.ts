import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateComponent } from '@/lib/evolink-gemini';
import { COMPONENT_TYPES } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { projectId, manualContent } = await request.json();

    if (!projectId || !manualContent) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // Update project status to generating
    await supabase
      .from('projects')
      .update({ status: 'generating' })
      .eq('id', projectId);

    // Get all templates
    const { data: templates } = await supabase
      .from('templates')
      .select('*')
      .eq('is_active', true);

    if (!templates || templates.length === 0) {
      return NextResponse.json(
        { error: '找不到模板配置' },
        { status: 500 }
      );
    }

    // Generate all components
    const results = await Promise.allSettled(
      Object.values(COMPONENT_TYPES).map(async (componentType) => {
        const template = templates.find((t) => t.component_type === componentType);
        if (!template) {
          throw new Error(`找不到 ${componentType} 的模板`);
        }

        // Generate content using Gemini API
        const content = await generateComponent(
          componentType,
          manualContent,
          template
        );

        // Check if component already exists
        const { data: existing } = await supabase
          .from('components')
          .select('id')
          .eq('project_id', projectId)
          .eq('component_type', componentType)
          .single();

        if (existing) {
          // Update existing
          await supabase
            .from('components')
            .update({
              content,
              generated_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);
        } else {
          // Insert new
          await supabase
            .from('components')
            .insert({
              project_id: projectId,
              component_type: componentType,
              content,
              generated_at: new Date().toISOString()
            });
        }

        return { type: componentType, status: 'success' };
      })
    );

    // Update project status to completed
    await supabase
      .from('projects')
      .update({ status: 'completed' })
      .eq('id', projectId);

    const successCount = results.filter((r) => r.status === 'fulfilled').length;
    const failedCount = results.filter((r) => r.status === 'rejected').length;

    return NextResponse.json({
      success: true,
      successCount,
      failedCount,
      results
    });
  } catch (error) {
    console.error('生成失败:', error);
    return NextResponse.json(
      { error: '生成失败，请重试' },
      { status: 500 }
    );
  }
}
