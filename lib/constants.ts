// 6大组件类型定义（按显示顺序排列）
export const COMPONENT_TYPES = {
  DETAIL_PAGE: 'detail_page',
  ROUTE_MAP: 'route_map',
  REGISTRATION_FORM: 'registration_form',
  FIRST_LESSON: 'first_lesson',
  CHECKIN_LOG: 'checkin_log',
  OPENING_SPEECH: 'opening_speech',
} as const;

// 组件中文名称
export const COMPONENT_NAMES = {
  [COMPONENT_TYPES.FIRST_LESSON]: '开船第一课',
  [COMPONENT_TYPES.DETAIL_PAGE]: '详情页',
  [COMPONENT_TYPES.ROUTE_MAP]: '航线图',
  [COMPONENT_TYPES.REGISTRATION_FORM]: '报名表单',
  [COMPONENT_TYPES.CHECKIN_LOG]: '打卡日志',
  [COMPONENT_TYPES.OPENING_SPEECH]: '开船话术',
};

// 组件说明
export const COMPONENT_DESCRIPTIONS = {
  [COMPONENT_TYPES.FIRST_LESSON]: '在航海手册开放预览时，学员会通过开船第一课了解项目背景、目标、航线规划和实操重点。',
  [COMPONENT_TYPES.DETAIL_PAGE]: '在招募阶段，学员通过详情页了解项目价值、课程安排、适合人群等关键信息，决定是否报名。',
  [COMPONENT_TYPES.ROUTE_MAP]: '清晰的时间规划表，让学员提前了解整个航海周期的各阶段目标、任务和交付成果。',
  [COMPONENT_TYPES.REGISTRATION_FORM]: '报名时收集学员基础信息和项目相关背景，帮助更好地了解学员需求和匹配度。',
  [COMPONENT_TYPES.CHECKIN_LOG]: '每日打卡模板，引导学员记录进展、反思问题，养成持续实践和复盘的习惯。',
  [COMPONENT_TYPES.OPENING_SPEECH]: '航海正式启动时的开场话术，营造仪式感、明确规则、促进学员互动破冰。',
};

// 项目状态
export const PROJECT_STATUS = {
  DRAFT: 'draft',
  GENERATING: 'generating',
  COMPLETED: 'completed',
} as const;

// 状态显示文本
export const STATUS_TEXT = {
  [PROJECT_STATUS.DRAFT]: '草稿',
  [PROJECT_STATUS.GENERATING]: '生成中',
  [PROJECT_STATUS.COMPLETED]: '已完成',
};

// 生财有术主题色
export const THEME_COLORS = {
  primary: '#1a6d6d',      // 深绿色
  primaryLight: '#2a8a8a', // 浅绿色
  primaryDark: '#0f5252',  // 更深的绿色
  accent: '#d4af37',       // 金色点缀
  background: '#f5f7fa',   // 背景色
  card: '#ffffff',         // 卡片背景
  text: '#2c3e50',         // 主文字色
  textSecondary: '#7f8c8d',// 次要文字色
  border: '#e1e8ed',       // 边框色
  success: '#27ae60',      // 成功色
  warning: '#f39c12',      // 警告色
  error: '#e74c3c',        // 错误色
};
