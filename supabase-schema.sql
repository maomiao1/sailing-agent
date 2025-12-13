-- 航海实战组件内容生成Agent - 数据库设计
-- 执行此文件来创建所有必要的表和索引

-- 1. 项目表
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month VARCHAR(50) NOT NULL,                  -- 月份标识，如 "2026年3月"
  name VARCHAR(200) NOT NULL,                  -- 项目名称，如"小红书虚拟资料"
  responsible_person VARCHAR(100),             -- 负责人
  manual_file_url TEXT,                        -- 航海手册文件URL
  manual_content TEXT,                         -- 航海手册文本内容
  status VARCHAR(20) DEFAULT 'draft',          -- draft(草稿), generating(生成中), completed(已完成)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 组件内容表
CREATE TABLE IF NOT EXISTS components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  component_type VARCHAR(50) NOT NULL,         -- first_lesson, detail_page, route_map,
                                               -- registration_form, checkin_log, opening_speech
  content TEXT NOT NULL,                       -- 生成的内容（Markdown格式）
  is_edited BOOLEAN DEFAULT FALSE,             -- 是否被手动编辑过
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  edited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 模板表（存储6大组件的生成标准和Prompt）
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  component_type VARCHAR(50) NOT NULL,
  template_name VARCHAR(100) NOT NULL,         -- 模板名称
  generation_prompt TEXT NOT NULL,             -- AI生成的提示词
  standards TEXT,                              -- 标准说明
  examples TEXT,                               -- 示例内容
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引提高查询性能
CREATE INDEX IF NOT EXISTS idx_projects_month ON projects(month);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_components_project ON components(project_id);
CREATE INDEX IF NOT EXISTS idx_components_type ON components(component_type);
CREATE INDEX IF NOT EXISTS idx_templates_type ON templates(component_type);

-- 创建更新时间自动触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为projects表添加触发器
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 为components表添加触发器
DROP TRIGGER IF EXISTS update_components_updated_at ON components;
CREATE TRIGGER update_components_updated_at
    BEFORE UPDATE ON components
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 为templates表添加触发器
DROP TRIGGER IF EXISTS update_templates_updated_at ON templates;
CREATE TRIGGER update_templates_updated_at
    BEFORE UPDATE ON templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 初始化模板数据（6大组件的生成标准）
-- 这些数据将在应用启动时自动填充
INSERT INTO templates (component_type, template_name, generation_prompt, standards, examples) VALUES
('first_lesson', '开船第一课模板',
'你是一位专业的教研内容编写专家。根据航海手册生成"开船第一课"内容。首先判断是"项目类"还是"技能类"。项目类需包含：项目整体介绍、详细航线规划、实战要点、成功案例。技能类需包含：技能价值说明、学习路径规划、实战训练计划。输出Markdown格式，2000-3000字，专业易懂。',
'项目类：项目介绍+航线规划+实战要点+案例。技能类：技能价值+学习路径+训练计划',
''),

('detail_page', '详情页模板',
'你是营销文案专家。根据航海手册生成吸引人的"详情页"内容。必须包含：项目背景、核心价值、课程大纲、适合人群、学习收益、常见问题FAQ。重点突出项目卖点和差异化价值。输出Markdown格式，1500-2500字。',
'必须包含：背景、价值、大纲、人群、收益、FAQ',
''),

('route_map', '航线图模板',
'你是项目规划专家。根据航海手册生成清晰的"航线图"。按时间顺序列出每个阶段的目标、任务、产出物。使用表格或时间轴格式，确保每日安排具体可执行。',
'时间轴格式，每阶段包含：时间、目标、任务、产出',
''),

('registration_form', '报名表单模板',
'你是用户调研专家。根据航海手册设计"报名表单"。包含基础信息（姓名、联系方式）和项目相关问题（经验、目标、资源等）。问题设计要帮助筛选合适学员。',
'基础信息+项目相关问题，5-10个问题',
''),

('checkin_log', '打卡日志模板',
'你是学习督导专家。根据航海手册设计"打卡日志"模板。每日包含：今日任务、完成情况、遇到问题、收获反思。问题设计要引导学员深度思考。',
'每日打卡包含：任务、完成、问题、反思',
''),

('opening_speech', '开船话术模板',
'你是社群运营专家。根据航海手册编写"开船话术"。包含：欢迎开场、项目介绍、规则说明、注意事项、互动破冰。语气亲切专业，营造积极氛围。',
'开场+介绍+规则+注意+破冰，800-1200字',
'')
ON CONFLICT DO NOTHING;

-- 完成
-- 注意：执行此SQL前，请确保已在Supabase中启用uuid-ossp扩展
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
