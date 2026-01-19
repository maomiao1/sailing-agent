require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function analyzeTemplate() {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('component_type', 'first_lesson')
    .single();

  if (error) {
    console.error('查询失败:', error);
    return;
  }

  // 保存当前模板到文件
  const lines = data.generation_prompt.split('\n');
  let modificationPoints = [];

  // 分析关键修改位置
  lines.forEach((line, index) => {
    // 找到项目识别相关位置
    if (line.includes('准确识别当前主项目名称')) {
      modificationPoints.push({
        line: index + 1,
        content: line,
        type: '项目识别',
        reason: '需要加强"必须一字不改"约束'
      });
    }

    // 找到内容要求相关位置
    if (line.includes('【内容要求】') || line.includes('必须100%基于当前上传的航海手册')) {
      modificationPoints.push({
        line: index + 1,
        content: line,
        type: '内容要求',
        reason: '需要强化"基于手册，禁止编造"'
      });
    }

    // 找到格式相关位置
    if (line.includes('【格式规则】') || line.includes('内容风格要求')) {
      modificationPoints.push({
        line: index + 1,
        content: line,
        type: '格式要求',
        reason: '需要增加"避免空洞包装语言"'
      });
    }
  });

  console.log('=== 需要修改的关键位置 ===');
  modificationPoints.forEach(point => {
    console.log(`\n第${point.line}行 [${point.type}]`);
    console.log(`内容: ${point.content.substring(0, 150)}...`);
    console.log(`原因: ${point.reason}`);
  });

  return modificationPoints;
}

analyzeTemplate();