require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function optimizeRemainingComponents() {
  console.log('🔧 批量优化剩余组件模板...\n');

  // 优化1：报名表单
  console.log('1️⃣ 优化报名表单...');
  const registrationOptimization = `
【报名表单生成规则 - 重要】
- 必须基于手册内容，不要机械套固定模板
- 问题设计要贴合航海主题和目标
- 参考手写格式，但内容必须基于手册调整
- 不要使用"你有多大可能..."这种NPS问题除非手册中明确要求
- 关注点：学习目标、认知准备、规则确认
`;

  const { data: regTemplate } = await supabase
    .from('templates')
    .select('*')
    .eq('component_type', 'registration_form')
    .single();

  let regPrompt = regTemplate.generation_prompt;
  if (!regPrompt.includes('【报名表单生成规则')) {
    regPrompt = regPrompt.replace('---\n\n', '---\n\n' + registrationOptimization + '\n\n');
    await supabase
      .from('templates')
      .update({ generation_prompt: regPrompt, updated_at: new Date().toISOString() })
      .eq('component_type', 'registration_form');
    console.log('  ✅ 报名表单优化完成');
  }

  // 优化2：打卡日志
  console.log('\n2️⃣ 优化打卡日志...');
  const checkinOptimization = `
【打卡日志格式要求 - 重要】
- 必须基于手册风格，不要机械照搬固定格式
- 参考手写格式（用户提供的示例）：
  0. 表头：标题 + 简短说明
  1. 核心认知（限制字数要求）
  2. 实战行动（描述今日行动）
  3. 卡点/疑问（遇到的问题）
  4. 明日计划（具体计划）
- 问题要具体、贴合航海主题
- 不要使用过于宽泛的"今天完成了什么"这类问题
`;

  const { data: checkinTemplate } = await supabase
    .from('templates')
    .select('*')
    .eq('component_type', 'checkin_log')
    .single();

  let checkinPrompt = checkinTemplate.generation_prompt;
  if (!checkinPrompt.includes('【打卡日志格式要求')) {
    checkinPrompt = checkinPrompt.replace('---\n\n', '---\n\n' + checkinOptimization + '\n\n');
    await supabase
      .from('templates')
      .update({ generation_prompt: checkinPrompt, updated_at: new Date().toISOString() })
      .eq('component_type', 'checkin_log');
    console.log('  ✅ 打卡日志优化完成');
  }

  // 优化3：开船话术
  console.log('\n3️⃣ 优化开船话术...');
  const openingSpeechOptimization = `
【开船话术风格要求 - 重要】
- 必须基于手册内容，不要编造项目定位和核心立场
- 风格要求：
  ✓ 亲切、专业、有温度
  ✓ 说明航海目标和学习重点
  ✓ 设定合理预期（门槛、时间、难度）
  ✓ 发布任务和直播预告
- 结构参考（内容必须基于手册）：
  1. 欢迎语
  2. 项目定位说明（基于手册）
  3. 核心立场/目标
  4. 学习维度拆解
  5. 客观预期设定
  6. 今日任务
  7. 直播预告
  8. 注意事项
- 禁止编造项目核心立场，必须基于手册提取
`;

  const { data: speechTemplate } = await supabase
    .from('templates')
    .select('*')
    .eq('component_type', 'opening_speech')
    .single();

  let speechPrompt = speechTemplate.generation_prompt;
  if (!speechPrompt.includes('【开船话术风格要求')) {
    speechPrompt = speechPrompt.replace('---\n\n', '---\n\n' + openingSpeechOptimization + '\n\n');
    await supabase
      .from('templates')
      .update({ generation_prompt: speechPrompt, updated_at: new Date().toISOString() })
      .eq('component_type', 'opening_speech');
    console.log('  ✅ 开船话术优化完成');
  }

  console.log('\n✅ 所有剩余组件优化完成！\n');
  console.log('📊 优化总结：');
  console.log('- 报名表单：基于手册内容，不机械套模板');
  console.log('- 打卡日志：参考手写格式，贴合主题');
  console.log('- 开船话术：基于手册实际内容，不编造');
}

optimizeRemainingComponents();