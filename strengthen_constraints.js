require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function strengthenConstraints() {
  console.log('🔥 进一步强化约束（针对主题修改问题）...');

  const { data: currentTemplate, error: fetchError } = await supabase
    .from('templates')
    .select('*')
    .eq('component_type', 'first_lesson')
    .single();

  if (fetchError) {
    console.error('获取模板失败:', fetchError);
    return;
  }

  let updatedPrompt = currentTemplate.generation_prompt;

  // 在最开头加上最强约束
  const strongestConstraint = `【最高优先级约束 - 违反此条将视为严重错误】
1. 项目名称必须和手册标题完全一致，禁止任何形式的理解、修改、优化：
   - 手册标题是"香港保险配置" → 必须用"香港保险配置"
   - 禁止改成"香港储蓄分红险"或其他任何名称
   - 禁止添加任何前缀、后缀、修饰词
   - 禁止AI根据内容理解来修改项目名称
2. 内容必须100%基于手册，禁止编造任何手册中没有的内容

---

`;

  // 在开头插入最强约束
  updatedPrompt = strongestConstraint + updatedPrompt;

  // 修改"理解项目 vs 工具"部分，明确禁止理解
  updatedPrompt = updatedPrompt.replace(
    '0. **第一步：理解项目 vs 工具**（最关键！）',
    '0. **第一步：直接使用手册标题中的项目名称，禁止理解或修改**（最关键！）\n   - 找到手册标题中的项目名称，一字不改地使用\n   - 禁止根据手册内容理解项目是什么\n   - 示例：标题写"香港保险配置" → 就用"香港保险配置"，不要理解成"香港储蓄分红险"'
  );

  // 删除可能导致理解的部分
  updatedPrompt = updatedPrompt.replace(
    '   - 项目：手册标题中的主题名称（如"热词快站"、"小红书垂直小店"、"AI短剧"）\n   - 工具：用来完成项目的辅助工具（如Claude Code、GLM4.6、n8n、Google Trends等）',
    '   - 项目名称：直接从手册标题获取，一字不改\n   - 禁止理解：不要根据手册内容判断项目是什么，直接用标题'
  );

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

  console.log('✅ 强化约束完成！');
  console.log('\n📝 修改内容：');
  console.log('1. 在最开头增加最高优先级约束');
  console.log('2. 明确示例：香港保险配置 ≠ 香港储蓄分红险');
  console.log('3. 修改"理解项目vs工具"逻辑，改为"直接使用标题"');
  console.log('4. 删除可能导致AI理解的部分');
  console.log('\n💡 现在应该不会再修改主题了');
}

strengthenConstraints();