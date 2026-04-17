/**
 * 计算文本在给定字号下占据的高度
 */
function measureTextHeight(text, fontSize, lineHeight, containerWidth, padding) {
  const charsPerLine = Math.floor((containerWidth - padding * 2) / (fontSize * 0.6));
  const lines = Math.ceil(text.length / charsPerLine);
  return lines * lineHeight * fontSize;
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

  const availableHeight = containerHeight - padding * 2;

  for (const paragraph of paragraphs) {
    const paraHeight = measureParagraphHeight(paragraph, bodyFontSize, bodyLineHeight, containerWidth, padding);

    // 检查是否需要新建区块
    if (currentHeight + paraHeight > availableHeight && currentBlock.content) {
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
