require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTemplates() {
  const { data, error } = await supabase
    .from('templates')
    .select('component_type, template_name');

  if (error) {
    console.error('查询失败:', error);
  } else {
    console.log('数据库中的模板类型：');
    data.forEach(t => console.log(`- ${t.component_type}: ${t.template_name}`));
  }
}

checkTemplates();
