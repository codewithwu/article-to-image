/**
 * 计算文本在给定字号下占据的高度
 * 使用更准确的字符宽度比估算
 */
function measureTextHeight(text, fontSize, lineHeight, containerWidth, padding) {
  const availableWidth = containerWidth - padding * 2;

  // 中文字符宽度约为字号的 1:1，英文约为 0.5:1
  // 混合文本取平均值约 0.6-0.7，这里用保守值确保不溢出
  const avgCharWidthRatio = 0.85;
  const avgCharWidth = fontSize * avgCharWidthRatio;

  // 计算每行可容纳的字符数
  const charsPerLine = Math.floor(availableWidth / avgCharWidth);

  // 计算总行数（考虑换行）
  const lines = text.split('\n').map(line => {
    if (line.length === 0) return 1;
    return Math.ceil(line.length / charsPerLine);
  });

  const totalLines = lines.reduce((sum, l) => sum + l, 0);
  // lineHeight 是倍数（如 1.7），所以要乘以 fontSize
  return totalLines * lineHeight * fontSize;
}

/**
 * 计算段落占据的高度
 */
function measureParagraphHeight(paragraph, fontSize, lineHeight, containerWidth, padding) {
  return measureTextHeight(paragraph, fontSize, lineHeight, containerWidth, padding);
}

/**
 * 将长文切分成适合手机屏幕的多个区块
 * @param {string} content - 输入的完整文本
 * @param {object} options - 配置选项
 * @returns {Array<{content: string}>} - 切分后的区块数组
 */
export function splitTextIntoBlocks(content, options = {}) {
  const {
    containerWidth = 960,
    containerHeight = 1800,
    bodyFontSize = 40,
    bodyLineHeight = 1.6,
    padding = 60,
  } = options;

  // 按换行符分割段落
  const paragraphs = content.split(/\n+/).filter(p => p.trim().length > 0);

  const blocks = [];
  let currentBlock = { content: '' };
  let currentHeight = 0;

  // 内容区域上下各预留80px空白
  const contentPaddingTop = 60;
  const contentPaddingBottom = 100;
  // 底部装饰元素占用的空间（约60px：圆圈16 + 横线4 + 间距8 + 底部padding60）
  const bottomDecorationHeight = 60;

  // 实际可用高度 = 容器高度 - 容器padding - 内容上下padding - 底部装饰 - 顶部安全边距
  const availableHeight = containerHeight - padding * 2 - contentPaddingTop - contentPaddingBottom - bottomDecorationHeight;

  for (const paragraph of paragraphs) {
    const paraHeight = measureParagraphHeight(paragraph, bodyFontSize, bodyLineHeight, containerWidth, padding);

    // 检查是否需要新建区块（留出安全边距防止文字被切）
    const safetyMargin = bodyFontSize * 4; // 留出四行文字的安全边距
    if (currentHeight + paraHeight > availableHeight - safetyMargin && currentBlock.content) {
      blocks.push({ ...currentBlock });
      currentBlock = { content: '' };
      currentHeight = 0;
    }

    // 添加段落到当前区块
    if (currentBlock.content) {
      currentBlock.content += '\n\n' + paragraph;
    } else {
      currentBlock.content = paragraph;
    }
    currentHeight += paraHeight + 20; // 段落间距
  }

  // 添加最后一个区块
  if (currentBlock.content) {
    blocks.push({ ...currentBlock });
  }

  return blocks;
}
