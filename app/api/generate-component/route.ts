import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateComponent } from '@/lib/evolink-gemini';

export async function POST(request: NextRequest) {
  try {
    const { projectId, componentType, manualContent, detailPageContent } = await request.json();

    if (!projectId || !componentType || !manualContent) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // Get template for this component type
    const { data: template } = await supabase
      .from('templates')
      .select('*')
      .eq('component_type', componentType)
      .eq('is_active', true)
      .single();

    if (!template) {
      return NextResponse.json(
        { error: '找不到模板配置' },
        { status: 500 }
      );
    }

    // Generate content using Gemini API
    const content = await generateComponent(
      componentType,
      manualContent,
      template,
      detailPageContent  // 传递详情页内容
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
      const { error } = await supabase
        .from('components')
        .update({
          content,
          generated_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      // Insert new
      const { error } = await supabase
        .from('components')
        .insert({
          project_id: projectId,
          component_type: componentType,
          content,
          generated_at: new Date().toISOString()
        });

      if (error) throw error;
    }

    return NextResponse.json({
      success: true,
      content
    });
  } catch (error) {
    console.error('生成失败:', error);
    return NextResponse.json(
      { error: '生成失败，请重试' },
      { status: 500 }
    );
  }
}
