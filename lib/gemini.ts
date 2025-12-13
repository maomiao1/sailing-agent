import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || 'placeholder-api-key';
const genAI = new GoogleGenerativeAI(apiKey);

// 使用 Gemini 2.0 Flash 模型（性价比最高）
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
  }
});

export async function generateContent(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API调用失败:', error);
    throw new Error('AI内容生成失败，请稍后重试');
  }
}

// 生成6大组件的主函数
export async function generateComponent(
  componentType: string,
  manualContent: string,
  template: { generation_prompt: string; standards?: string; examples?: string }
): Promise<string> {
  // 构建完整的Prompt
  const fullPrompt = `
${template.generation_prompt}

【标准要求】
${template.standards || '按照专业标准生成内容'}

${template.examples ? `【参考示例】\n${template.examples}\n` : ''}

【航海手册内容】
${manualContent}

请根据以上信息生成高质量的内容，使用Markdown格式输出。
`;

  return await generateContent(fullPrompt);
}

export { genAI };
