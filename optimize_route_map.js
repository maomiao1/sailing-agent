require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function optimizeRouteMap() {
  console.log('🔧 优化航线图模板...\n');

  const { data: template, error: fetchError } = await supabase
    .from('templates')
    .select('*')
    .eq('component_type', 'route_map')
    .single();

  if (fetchError) {
    console.error('获取模板失败:', fetchError);
    return;
  }

  let updatedPrompt = template.generation_prompt;

  // 优化：灵活的时间分配逻辑
  const flexibleTimeAllocation = `
【时间分配的灵活规则 - 重要】
1. 总时间是21天，但每个阶段下的具体任务时间可以灵活分配
2. 不需要强制凑成整数天，可以使用小时或小数天
3. 格式参考（必须基于手册实际内容调整）：
   #_w2 第一阶段
   1. 任务1（约 2 天）
   2. 任务2（约 1 天）
   3. 任务3（约 0.5 天）
   阶段总结标题（共 3.5 天）
   #end

4. 关键点：
   - 每个任务后面用（约 X 天）标注
   - 阶段结尾用（共 X 天）总结
   - 时间可以是小数，如 0.5天、1.5天、2天等
   - 不要为了凑整数而强行分配不合理的时间

5. 示例格式（仅供参考格式，内容必须基于手册）：
   #_w2 第一阶段
   1. 了解底层逻辑（约 2 天）
   2. 厘清核心区别（约 1 天）
   认识基础知识（共 3 天）
   #end
`;

  // 在时间相关位置插入优化
  if (!updatedPrompt.includes('【时间分配的灵活规则')) {
    updatedPrompt = updatedPrompt.replace(
      '---\n\n',
      '---\n\n' + flexibleTimeAllocation + '\n\n'
    );
  }

  // 更新数据库
  const { error: updateError } = await supabase
    .from('templates')
    .update({
      generation_prompt: updatedPrompt,
      updated_at: new Date().toISOString()
    })
    .eq('component_type', 'route_map');

  if (updateError) {
    console.error('更新失败:', updateError);
    return;
  }

  console.log('✅ 航线图模板优化完成！\n');
  console.log('📝 修改内容：');
  console.log('1. 增加灵活时间分配规则');
  console.log('2. 允许使用小数天（如0.5天、1.5天）');
  console.log('3. 不强制凑成整数天');
  console.log('4. 提供了清晰的格式参考');
  console.log('\n💡 现在航线图的时间分配会更合理、更灵活');
}

optimizeRouteMap();