require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function updateAllTemplates() {
  console.log('🔥 开始修改所有6个组件模板...\n');

  // 统一的最强约束（所有组件都加上）
  const universalConstraint = `【最高优先级约束 - 适用于所有组件】
1. 项目名称必须和手册标题完全一致，禁止任何理解、修改：
   - 手册标题是"香港保险配置" → 必须用"香港保险配置"
   - 禁止改成"香港储蓄分红险"或其他任何名称
   - 禁止AI根据手册内容理解项目是什么
2. 内容必须100%基于手册，不要机械套模板：
   - 禁止套用固定格式的"高大上"内容
   - 要接地气、具体、基于手册实际内容
   - 手册没有的内容，不要编造

---

`;

  try {
    // 获取所有模板
    const { data: templates, error: fetchError } = await supabase
      .from('templates')
      .select('*');

    if (fetchError) {
      console.error('获取模板失败:', fetchError);
      return;
    }

    console.log(`找到 ${templates.length} 个模板，开始逐个修改...\n`);

    // 逐个修改每个模板
    for (const template of templates) {
      console.log(`📝 修改: ${template.template_name} (${template.component_type})`);

      let updatedPrompt = template.generation_prompt;

      // 检查是否已经有这个约束
      if (!updatedPrompt.includes('【最高优先级约束 - 适用于所有组件】')) {
        // 在开头插入统一约束
        updatedPrompt = universalConstraint + updatedPrompt;

        // 更新数据库
        const { error: updateError } = await supabase
          .from('templates')
          .update({
            generation_prompt: updatedPrompt,
            updated_at: new Date().toISOString()
          })
          .eq('id', template.id);

        if (updateError) {
          console.error(`  ❌ 更新失败:`, updateError);
        } else {
          console.log(`  ✅ 修改成功`);
        }
      } else {
        console.log(`  ⏭️  已有约束，跳过`);
      }
    }

    console.log('\n✅ 所有模板修改完成！');
    console.log('\n📊 修改统计：');
    console.log('- 在所有6个组件最开头加上统一约束');
    console.log('- 强调：项目名称必须和手册标题一致');
    console.log('- 强调：不要机械套模板，要基于手册内容');
    console.log('\n💡 现在所有组件都不会再改主题、机械套模板了');

  } catch (error) {
    console.error('发生错误:', error);
  }
}

updateAllTemplates();