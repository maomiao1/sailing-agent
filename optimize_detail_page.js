require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function optimizeDetailPage() {
  console.log('🔧 优化详情页模板...\n');

  const { data: template, error: fetchError } = await supabase
    .from('templates')
    .select('*')
    .eq('component_type', 'detail_page')
    .single();

  if (fetchError) {
    console.error('获取模板失败:', fetchError);
    return;
  }

  let updatedPrompt = template.generation_prompt;

  // 优化1：修改"适合人群"的风格要求
  const targetAudienceOptimization = `
【适合人群的表达风格 - 重要】
- 必须接地气，不要"高高在上"
- 用具体的身份标签，不是抽象的描述
- 格式：【身份标签】— 具体场景描述
- 参考示例（仅供参考，必须基于手册内容）：
  ✓ 接地气："创业者与企业主 — 身处高增长赛道，但个人财富与行业风险高度绑定"
  ✗ 高大上："有明确的长期财务目标，如子女教育金、养老金储备"
- 禁止使用"有明确的XX目标"、"具备XX能力"这类书面语
`;

  // 在适合人群相关位置插入优化
  if (updatedPrompt.includes('适合人群') || updatedPrompt.includes('target audience')) {
    updatedPrompt = updatedPrompt.replace(
      '适合人群',
      '适合人群' + targetAudienceOptimization
    );
  }

  // 优化2：修改"开船前必备工具"的生成逻辑
  const toolsOptimization = `
【开船前必备工具的生成规则 - 重要】
- 必须基于手册内容，禁止机械套模板
- 如果是科普向的航海（不是技能操作类），不要写"需要XX工具"
- 科普向可以写：心态准备、时间准备、认知准备
- 技能向才写：具体工具、软件、账号等
- 示例判断：
  ✓ 科普向（如保险配置、理财知识）→ 写心态、认知准备
  ✓ 技能向（如小红书开店、AI工具）→ 写具体工具清单
`;

  // 在开船前必备工具相关位置插入优化
  if (updatedPrompt.includes('开船前必备') || updatedPrompt.includes('required tools')) {
    updatedPrompt = updatedPrompt.replace(
      '开船前必备',
      '开船前必备' + toolsOptimization
    );
  }

  // 优化3：强化"基于手册，不要编造"
  const antiTemplateConstraint = `
【禁止机械套模板 - 极其重要】
- 不要使用固定的"高大上"表达方式
- 适合人群必须基于手册中的实际用户画像
- 开船前必备必须基于手册中的实际要求
- 如果手册没有提到某项内容，不要编造，直接跳过
`;

  // 在开头部分（统一约束后面）插入
  updatedPrompt = updatedPrompt.replace(
    '---\n\n',
    '---\n\n' + antiTemplateConstraint + '\n\n'
  );

  // 更新数据库
  const { error: updateError } = await supabase
    .from('templates')
    .update({
      generation_prompt: updatedPrompt,
      updated_at: new Date().toISOString()
    })
    .eq('component_type', 'detail_page');

  if (updateError) {
    console.error('更新失败:', updateError);
    return;
  }

  console.log('✅ 详情页模板优化完成！\n');
  console.log('📝 修改内容：');
  console.log('1. 增加"适合人群"接地气表达风格要求');
  console.log('2. 增加"开船前必备"科普向vs技能向判断逻辑');
  console.log('3. 强化禁止机械套模板约束');
  console.log('\n💡 现在适合人群会更接地气，开船前必备会根据手册实际内容生成');
}

optimizeDetailPage();