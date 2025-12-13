#!/usr/bin/env node

/**
 * 环境变量检查脚本
 * 用于验证是否正确配置了所有必需的环境变量
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 正在检查环境配置...\n');

// 检查 .env.local 文件是否存在
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ 错误: 未找到 .env.local 文件');
  console.log('💡 提示: 请复制 .env.example 为 .env.local');
  console.log('   命令: cp .env.example .env.local\n');
  process.exit(1);
}

// 读取环境变量
require('dotenv').config({ path: envPath });

const checks = [
  {
    name: 'Supabase URL',
    env: 'NEXT_PUBLIC_SUPABASE_URL',
    valid: (val) => val && val.startsWith('https://') && val.includes('supabase.co') && !val.includes('placeholder'),
    hint: '请在 Supabase 项目设置中获取 Project URL'
  },
  {
    name: 'Supabase Key',
    env: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    valid: (val) => val && val.length > 50 && val.startsWith('eyJ') && !val.includes('placeholder'),
    hint: '请在 Supabase 项目设置中获取 anon public key'
  },
  {
    name: 'Gemini API Key',
    env: 'GEMINI_API_KEY',
    valid: (val) => val && val.startsWith('AIzaSy') && !val.includes('placeholder'),
    hint: '请在 https://ai.google.dev/ 获取 API Key'
  }
];

let allValid = true;

checks.forEach(check => {
  const value = process.env[check.env];
  const isValid = check.valid(value);

  if (isValid) {
    console.log(`✅ ${check.name}: 已配置`);
  } else {
    console.log(`❌ ${check.name}: 未正确配置`);
    console.log(`   环境变量: ${check.env}`);
    console.log(`   💡 ${check.hint}\n`);
    allValid = false;
  }
});

console.log('');

if (allValid) {
  console.log('✨ 太棒了！所有环境变量都已正确配置');
  console.log('🚀 现在可以运行: npm run dev\n');
  process.exit(0);
} else {
  console.log('⚠️  请先完成环境变量配置');
  console.log('📖 详细步骤请查看 DEPLOYMENT_GUIDE.md\n');
  process.exit(1);
}
