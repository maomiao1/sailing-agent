require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function fixRegistrationForm() {
  console.log('🔧 修改报名表单：完全参考手写格式...\n');

  const { data: template, error: fetchError } = await supabase
    .from('templates')
    .select('*')
    .eq('component_type', 'registration_form')
    .single();

  if (fetchError) {
    console.error('获取模板失败:', fetchError);
    return;
  }

  let updatedPrompt = template.generation_prompt;

  // 核心修改：完全重写报名表单生成规则
  const standardFormStructure = `
【报名表单标准结构 - 必须严格遵守】

固定的4个标准问题（适用于所有航海）：

1. 你有多大可能把航海推荐给你的朋友？（0-10 分）
   - 这是NPS问题，保持不变

2. 我确认，我已清楚了解以下航海规则：
   - 类型：确认题
   - 固定4条规则（保持不变）：
     1. 保证金不是学费，它是为了保证船员持续行动的机制
     2. 航海期间完成 12 次打卡，才能申请退还保证金，申请后将在 7 个工作日内原路退回
     3. 航海内不能批量添加好友，不支持无价值的链接
     4. 航海是半自助式学习，教练会直播讲解手册，但不提供一对一辅导

3. 学习目标——你期待 21 天做成哪些事？
   - 类型：单选题
   - 可选值：【基于手册提取2个核心目标】
   - 示例格式：
     能够辩证地看待XX，建立一套关于XX的科学决策逻辑。,厘清自己的XX需求，看懂XX，避免被坑。

4. 我确认，我了解该项目需要提前做好如下认知准备：
   - 类型：单选题
   - 描述：【基于手册提取认知准备说明，通常是免责声明或重要提示】
   - 可选值：我已了解该项目的重要提示。

【生成规则】
1. 问题1和问题2完全固定，不要修改
2. 问题3的可选值必须基于手册提取，格式：目标1,目标2
3. 问题4的描述必须基于手册提取，如果没有就写通用的学习提示
4. 不要添加其他问题
5. 保持简洁，不要过度复杂

【输出格式】
报名表单

1. 你有多大可能把航海推荐给你的朋友？（0-10 分）

2. 我确认，我已清楚了解以下航海规则：
  1. 保证金不是学费，它是为了保证船员持续行动的机制
  2. 航海期间完成 12 次打卡，才能申请退还保证金，申请后将在 7 个工作日内原路退回
  3. 航海内不能批量添加好友，不支持无价值的链接
  4. 航海是半自助式学习，教练会直播讲解手册，但不提供一对一辅导

3. 学习目标——你期待 21 天做成哪些事？
- 类型：单选题
- 可选值：
[基于手册提取的目标1],[基于手册提取的目标2]

4. 我确认，我了解该项目需要提前做好如下认知准备：
- 类型：单选题
- 描述：
[基于手册提取的认知准备说明]
- 可选值：我已了解该项目的重要提示。
`;

  // 完全替换原有的报名表单生成规则
  if (updatedPrompt.includes('【报名表单生成规则')) {
    updatedPrompt = updatedPrompt.replace(
      /【报名表单生成规则[^】]*】[\s\S]*?(?=\n【|$)/,
      standardFormStructure
    );
  } else {
    // 如果没有找到，就直接在统一约束后插入
    updatedPrompt = updatedPrompt.replace(
      '---\n\n',
      '---\n\n' + standardFormStructure + '\n\n'
    );
  }

  // 更新数据库
  const { error: updateError } = await supabase
    .from('templates')
    .update({
      generation_prompt: updatedPrompt,
      updated_at: new Date().toISOString()
    })
    .eq('component_type', 'registration_form');

  if (updateError) {
    console.error('更新失败:', updateError);
    return;
  }

  console.log('✅ 报名表单修改完成！\n');
  console.log('📝 修改内容：');
  console.log('1. 固定4个标准问题结构');
  console.log('2. 问题1（NPS）和问题2（规则确认）完全固定');
  console.log('3. 问题3（学习目标）基于手册提取2个目标');
  console.log('4. 问题4（认知准备）基于手册提取说明');
  console.log('5. 不添加其他问题，保持简洁');
  console.log('\n💡 现在报名表单会严格按照手写格式生成');
}

fixRegistrationForm();