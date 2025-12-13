import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { projectId, componentType, content } = await request.json();

    if (!projectId || !componentType || !content) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // Find existing component
    const { data: existing } = await supabase
      .from('components')
      .select('id')
      .eq('project_id', projectId)
      .eq('component_type', componentType)
      .single();

    if (existing) {
      // Update existing component
      const { error } = await supabase
        .from('components')
        .update({
          content,
          is_edited: true,
          edited_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      // Create new component (in case it doesn't exist)
      const { error } = await supabase
        .from('components')
        .insert({
          project_id: projectId,
          component_type: componentType,
          content,
          is_edited: true,
          generated_at: new Date().toISOString()
        });

      if (error) throw error;
    }

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('更新失败:', error);
    return NextResponse.json(
      { error: '更新失败，请重试' },
      { status: 500 }
    );
  }
}
