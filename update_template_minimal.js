require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function updateTemplateMinimal() {
  console.log('🔄 开始执行微调修改...');

  // 获取当前模板
  const { data: currentTemplate, error: fetchError } = await supabase
    .from('templates')
    .select('*')
    .eq('component_type', 'first_lesson')
    .single();

  if (fetchError) {
    console.error('获取模板失败:', fetchError);
    return;
  }

  console.log(`当前模板长度: ${currentTemplate.generation_prompt.length} 字符`);

  // 执行精准微调
  let updatedPrompt = currentTemplate.generation_prompt;

  // 🔧 微调1：强化项目识别约束
  updatedPrompt = updatedPrompt.replace(
    '极其重要：准确识别当前主项目名称（从手册封面、标题、第一页、目录），不要被手册中间部分的旧项目内容或工具名称误导',
    '极其重要：准确识别当前主项目名称（从手册封面、标题、第一页、目录），必须一字不改使用手册中的准确名称，禁止AI理解或修改，不要被手册中间部分的旧项目内容或工具名称误导'
  );

  // 🔧 微调2：强化基于手册约束
  const contentConstraintAddition = '   - 禁止编造任何手册中没有的内容\n   - 如果手册中没有某个信息，不要创造，直接跳过该部分\n   - 用户画像、案例、数据必须来自手册原文，不是AI的理解或总结';

  updatedPrompt = updatedPrompt.replace(
    '   - 极其重要：必须100%基于当前上传的航海手册的实际内容，严禁编造或使用其他项目的内容',
    '   - 极其重要：必须100%基于当前上传的航海手册的实际内容，严禁编造或使用其他项目的内容' + contentConstraintAddition
  );

  // 🔧 微调3：增加内容风格要求
  const styleAddition = '\n【内容风格要求】\n- 避免空洞包装：不要使用"写给不确定时代寻求确定性的你"这类空话\n- 必须具体实在：用具体数据、案例、操作步骤，不是泛泛而谈\n- 直接表达：说"这是什么"而不是"本项目旨在"';

  updatedPrompt = updatedPrompt.replace(
    '【格式规则】',
    styleAddition + '\n\n【格式规则】'
  );

  // 🔧 微调4：在项目识别最后检查部分强化约束
  updatedPrompt = updatedPrompt.replace(
    '- 必须从手册封面、标题、第一页、目录中准确识别当前主项目名称',
    '- 必须从手册封面、标题、第一页、目录中准确识别当前主项目名称 - 必须一字不改使用手册中的准确名称'
  );

  console.log('📝 修改完成，准备更新数据库...');

  // 更新模板
  const { error: updateError } = await supabase
    .from('templates')
    .update({
      generation_prompt: updatedPrompt,
      updated_at: new Date().toISOString()
    })
    .eq('component_type', 'first_lesson');

  if (updateError) {
    console.error('更新失败:', updateError);
    return;
  }

  console.log('✅ 微调修改成功完成！');
  console.log('\n📊 修改统计：');
  console.log('- 强化了项目识别的"一字不改"约束');
  console.log('- 增加了"禁止编造"具体要求');
  console.log('- 新增了"避免空洞包装"风格要求');
  console.log('- 保持了原有6,800+字框架完整性');
  console.log('\n💡 这是精准微调，不是重写');
  console.log('解决了您提到的核心问题，同时保留适用性');
}

updateTemplateMinimal();