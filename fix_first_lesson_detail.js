require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function fixFirstLessonDetail() {
  console.log('🔧 修改开船第一课：删除大而空内容...\n');

  const { data: template, error: fetchError } = await supabase
    .from('templates')
    .select('*')
    .eq('component_type', 'first_lesson')
    .single();

  if (fetchError) {
    console.error('获取模板失败:', fetchError);
    return;
  }

  let updatedPrompt = template.generation_prompt;

  // 核心修改1：删除大而空的内容风格，要求具体实在
  const concreteStyleRequirement = `
【内容风格约束 - 极其重要】
1. 禁止使用大而空的表达：
   ❌ 禁止："全球金融中心"、"国际化投资环境"、"全球经济不确定性"
   ❌ 禁止："高净值人群"、"战略工具"、"压舱石"
   ❌ 禁止：过度包装的官方语言
   ✅ 要求：接地气、具体、直接

2. 项目介绍要具体：
   - 直接说这是什么（基于手册第一页）
   - 说明核心玩法、核心机制
   - 不要上来就谈全球、金融中心
   - 用户能听懂的语言，不是金融专业术语

3. 称呼统一使用"圈友"：
   - 不要用"学员"
   - 全文统一使用"圈友"

4. 项目关键步骤要简化：
   - 一般3-5个核心步骤即可
   - 不要搞得太复杂
   - 步骤要清晰、可执行
`;

  // 在开头部分插入约束
  updatedPrompt = updatedPrompt.replace(
    '【最高优先级约束 - 违反此条将视为严重错误】',
    '【最高优先级约束 - 违反此条将视为严重错误】' + concreteStyleRequirement
  );

  // 修改2：在项目介绍部分强化具体要求
  const projectIntroRequirement = `
- 项目介绍必须具体：
  ✓ 基于手册第一页的实际描述
  ✓ 用自然语言说明这是什么
  ✓ 说明核心玩法和机制
  ✗ 不要上来就"全球金融中心"、"资产配置"这种大话
  ✗ 不要过度包装和理论化
`;

  updatedPrompt = updatedPrompt.replace(
    '【项目名称】是什么项目？',
    '【项目名称】是什么项目？' + projectIntroRequirement
  );

  // 修改3：简化项目关键步骤要求
  const simplifiedStepsRequirement = `
【项目关键步骤简化要求】
- 一般3-5个核心步骤即可，不要太复杂
- 步骤要清晰、可执行
- 不要有太多子步骤和嵌套
`;

  updatedPrompt = updatedPrompt.replace(
    '本期航海的操作路径如下：',
    '本期航海的操作路径如下：' + simplifiedStepsRequirement
  );

  // 更新数据库
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

  console.log('✅ 开船第一课修改完成！\n');
  console.log('📝 修改内容：');
  console.log('1. 禁止大而空表达（全球、金融中心、战略工具等）');
  console.log('2. 要求项目介绍具体实在');
  console.log('3. 统一使用"圈友"称呼');
  console.log('4. 简化项目关键步骤（3-5个核心步骤）');
  console.log('\n💡 现在不会再有"全球金融中心"这种大话了');
}

fixFirstLessonDetail();