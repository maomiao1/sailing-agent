import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 数据库类型定义
export type Project = {
  id: string;
  month: string;
  name: string;
  responsible_person?: string;
  manual_file_url?: string;
  manual_content?: string;
  status: 'draft' | 'generating' | 'completed';
  created_at: string;
  updated_at: string;
};

export type Component = {
  id: string;
  project_id: string;
  component_type: 'first_lesson' | 'detail_page' | 'route_map' | 'registration_form' | 'checkin_log' | 'opening_speech';
  content: string;
  is_edited: boolean;
  generated_at: string;
  edited_at?: string;
  created_at: string;
  updated_at: string;
};

export type Template = {
  id: string;
  component_type: string;
  template_name: string;
  generation_prompt: string;
  standards?: string;
  examples?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
