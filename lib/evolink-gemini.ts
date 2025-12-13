/**
 * EvoLink.AI 中转站 - Gemini 2.5 Flash 适配器
 * 使用 Google Native API 格式
 */

const API_BASE_URL = 'https://api.evolink.ai';
const API_KEY = process.env.GEMINI_API_KEY || '';
const MODEL_NAME = 'gemini-2.5-flash';

interface GenerateContentRequest {
  contents: {
    role: string;
    parts: { text: string }[];
  }[];
  generationConfig?: {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
  };
}

interface GenerateContentResponse {
  candidates: {
    content: {
      parts: { text: string }[];
      role: string;
    };
    finishReason: string;
    index: number;
  }[];
}

/**
 * 调用 EvoLink Gemini API 生成内容
 */
export async function generateContent(prompt: string): Promise<string> {
  try {
    const url = `${API_BASE_URL}/v1beta/models/${MODEL_NAME}:generateContent`;

    const requestBody: GenerateContentRequest = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192
      }
    };

    console.log('🚀 调用 EvoLink API:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API 调用失败:', response.status, errorText);
      throw new Error(`API调用失败: ${response.status} - ${errorText}`);
    }

    const data: GenerateContentResponse = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('API返回数据格式错误：没有候选结果');
    }

    const text = data.candidates[0].content.parts[0].text;
    console.log('✅ 生成成功，内容长度:', text.length);

    return text;
  } catch (error) {
    console.error('❌ Gemini API调用失败:', error);
    throw new Error(`AI内容生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 生成6大组件的主函数
 */
export async function generateComponent(
  componentType: string,
  manualContent: string,
  template: { generation_prompt: string; standards?: string; examples?: string },
  detailPageContent?: string  // 新增：详情页内容（开船第一课需要）
): Promise<string> {
  // 构建完整的Prompt
  let fullPrompt = `
${template.generation_prompt}

【标准要求】
${template.standards || '按照专业标准生成内容'}

${template.examples ? `【参考示例】\n${template.examples}\n` : ''}

【航海手册内容】
${manualContent}
`;

  // 如果是开船第一课，添加详情页内容
  if (componentType === 'first_lesson' && detailPageContent) {
    fullPrompt += `

【详情页内容】
${detailPageContent}
`;
  }

  fullPrompt += `

请根据以上信息生成高质量的内容，使用Markdown格式输出。
`;

  return await generateContent(fullPrompt);
}
