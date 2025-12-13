/**
 * 验证部署准备就绪
 * 运行命令：node verify-deployment-ready.js
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

console.log('🔍 开始检查部署准备情况...\n');

let allChecksPass = true;

// 检查 1: 环境变量
console.log('📋 检查 1: 环境变量配置');
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'GEMINI_API_KEY'
];

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`  ❌ ${varName}: 未配置`);
    allChecksPass = false;
  }
});

// 检查 2: 必要文件
console.log('\n📋 检查 2: 必要文件存在');
const requiredFiles = [
  'package.json',
  'next.config.ts',
  '.env.local',
  '.gitignore',
  'app/page.tsx',
  'lib/supabase.ts',
  'lib/evolink-gemini.ts'
];

requiredFiles.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✅ ${filePath}`);
  } else {
    console.log(`  ❌ ${filePath}: 文件不存在`);
    allChecksPass = false;
  }
});

// 检查 3: .gitignore 是否正确配置
console.log('\n📋 检查 3: .gitignore 配置');
const gitignorePath = path.join(__dirname, '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');

  const shouldIgnore = ['.env*', 'node_modules', '.next'];
  shouldIgnore.forEach(pattern => {
    if (gitignoreContent.includes(pattern)) {
      console.log(`  ✅ 忽略 ${pattern}`);
    } else {
      console.log(`  ⚠️  未忽略 ${pattern}`);
    }
  });
} else {
  console.log('  ❌ .gitignore 文件不存在');
  allChecksPass = false;
}

// 检查 4: package.json scripts
console.log('\n📋 检查 4: npm scripts');
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const requiredScripts = ['dev', 'build', 'start'];

  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`  ✅ ${script}: ${packageJson.scripts[script]}`);
    } else {
      console.log(`  ❌ ${script}: 未配置`);
      allChecksPass = false;
    }
  });
} else {
  console.log('  ❌ package.json 文件不存在');
  allChecksPass = false;
}

// 检查 5: Supabase 连接
console.log('\n📋 检查 5: Supabase 连接测试');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey) {
  const supabase = createClient(supabaseUrl, supabaseKey);

  supabase
    .from('templates')
    .select('count')
    .limit(1)
    .then(({ data, error }) => {
      if (error) {
        console.log('  ❌ Supabase 连接失败:', error.message);
        allChecksPass = false;
      } else {
        console.log('  ✅ Supabase 连接成功');
      }

      printSummary();
    });
} else {
  console.log('  ❌ Supabase 环境变量未配置');
  allChecksPass = false;
  printSummary();
}

function printSummary() {
  console.log('\n' + '='.repeat(60));
  if (allChecksPass) {
    console.log('✅ 所有检查通过！可以开始部署到 Vercel');
    console.log('\n下一步:');
    console.log('1. 确保代码已推送到 GitHub');
    console.log('2. 访问 https://vercel.com 进行部署');
    console.log('3. 详细步骤参考 DEPLOYMENT.md 文档');
    console.log('4. 使用 部署检查清单.md 逐项检查');
  } else {
    console.log('❌ 存在问题，请修复后再部署');
    console.log('\n请检查:');
    console.log('1. .env.local 文件是否正确配置');
    console.log('2. 所有必要文件是否存在');
    console.log('3. Supabase 数据库是否正常运行');
  }
  console.log('='.repeat(60) + '\n');

  process.exit(allChecksPass ? 0 : 1);
}
