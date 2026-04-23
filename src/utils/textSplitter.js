/**
 * 计算单行文字需要的行高
 */
function calculateLineHeight(line, fontSize, availableWidth, lineHeightMultiplier) {
  const lineWidth = measureLineWidth(line, fontSize);
  const linesNeeded = Math.ceil(lineWidth / availableWidth);
  return linesNeeded * lineHeightMultiplier * fontSize + 8;
}

/**
 * 计算单行文字的宽度
 */
function measureLineWidth(text, fontSize) {
  // 中文字符宽度约为字号，英文约为字号 * 0.5
  let width = 0;
  for (const char of text) {
    if (/[\u4e00-\u9fa5]/.test(char)) {
      width += fontSize; // 中文
    } else if (/[a-zA-Z0-9]/.test(char)) {
      width += fontSize * 0.5; // 英文/数字
    } else {
      width += fontSize * 0.5; // 其他字符
    }
  }
  return width;
}

/**
 * 检查字符是否为句子分隔符（逗号、句号、问号、感叹号、分号）
 */
function isSentenceEnding(char) {
  return ['，', '。', '？', '！', '；', '、'].includes(char);
}

/**
 * 将一行文字拆分到能容纳的最大位置
 * 尽量填满可用空间，在句子边界处分割
 * 返回 [前半部分, 后半部分] - 如果无法拆分(一行本身就放不下任何内容)则返回 [null, null]
 */
function splitLineToFit(line, availableWidth, fontSize, lineHeightMultiplier, maxHeight) {
  // 如果连一个字符都放不下，返回 null
  const singleCharHeight = lineHeightMultiplier * fontSize + 8;
  if (singleCharHeight > maxHeight) {
    return [null, null];
  }

  // 找到最多能容纳的字符数
  let fitCount = 0;
  let currentWidth = 0;
  let currentLineCount = 1;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const charWidth = /[\u4e00-\u9fa5]/.test(char) ? fontSize : fontSize * 0.5;
    const newWidth = currentWidth + charWidth;

    // 检查是否需要换行
    if (newWidth > availableWidth && i > 0) {
      currentLineCount++;
      currentWidth = charWidth;
    } else {
      currentWidth = newWidth;
    }

    const totalHeight = currentLineCount * lineHeightMultiplier * fontSize + 8;

    if (totalHeight <= maxHeight) {
      fitCount = i + 1;
    } else {
      break;
    }
  }

  if (fitCount === 0) {
    return [null, null];
  }

  // 如果 fitCount 正好在句子边界上，直接分割
  if (isSentenceEnding(line[fitCount - 1])) {
    return [line.substring(0, fitCount), line.substring(fitCount)];
  }

  // 从 fitCount 向前找到最近的句子边界，尽量填满空间
  // 同时也向后看，如果下一个句子结束符更近且能放下，就用那个
  let bestSplitPoint = fitCount;
  let bestDistance = Infinity;

  // 向前搜索句子边界（在 fitCount 之前的句子结束符）
  for (let i = fitCount - 2; i >= 0; i--) {
    if (isSentenceEnding(line[i])) {
      const splitAt = i + 1;
      const distance = fitCount - splitAt;
      // 计算这个分割点的实际行数
      const substrWidth = measureLineWidth(line.substring(0, splitAt), fontSize);
      const substrLines = Math.ceil(substrWidth / availableWidth);
      const substrHeight = substrLines * lineHeightMultiplier * fontSize + 8;

      // 如果这个分割点能填满（高度接近 maxHeight 的 90% 以上），优先用它
      if (substrHeight >= maxHeight * 0.9 && distance < bestDistance) {
        return [line.substring(0, splitAt), line.substring(splitAt)];
      }
      if (distance < bestDistance) {
        bestSplitPoint = splitAt;
        bestDistance = distance;
      }
    }
  }

  // 如果向前找到的边界距离不远（<15个字），就用它
  if (bestDistance < 15) {
    return [line.substring(0, bestSplitPoint), line.substring(bestSplitPoint)];
  }

  // 否则尽量填满，尝试在 fitCount 附近找一个好位置
  // 如果 fitCount 后面的字符能让当前行更满，且不超过高度限制，就扩展到那里
  let extendedCount = fitCount;
  for (let i = fitCount; i < Math.min(fitCount + 20, line.length); i++) {
    const substrWidth = measureLineWidth(line.substring(0, i + 1), fontSize);
    const substrLines = Math.ceil(substrWidth / availableWidth);
    const substrHeight = substrLines * lineHeightMultiplier * fontSize + 8;
    if (substrHeight <= maxHeight) {
      extendedCount = i + 1;
    } else {
      break;
    }
  }

  // 检查 extendedCount 是否在句子边界（向前找最近的）
  for (let i = extendedCount - 1; i >= Math.max(0, extendedCount - 20); i--) {
    if (isSentenceEnding(line[i])) {
      const splitAt = i + 1;
      const substrWidth = measureLineWidth(line.substring(0, splitAt), fontSize);
      const substrLines = Math.ceil(substrWidth / availableWidth);
      const substrHeight = substrLines * lineHeightMultiplier * fontSize + 8;
      if (substrHeight <= maxHeight) {
        return [line.substring(0, splitAt), line.substring(splitAt)];
      }
    }
  }

  return [line.substring(0, fitCount), line.substring(fitCount)];
}

/**
 * 将长文按行分割成多个区块
 * 逐行累积高度，更精确地控制每张图片的内容量
 */
export function splitTextIntoBlocks(content, options = {}) {
  const {
    containerWidth = 960,
    containerHeight = 1800,
    bodyFontSize = 40,
    bodyLineHeight = 1.6,
    padding = 60,
  } = options;

  // 内容区域边距（顶部30，左右各30，底部40）
  const contentPaddingTop = 30;
  const contentPaddingLeft = 30;
  const contentPaddingRight = 30;
  const contentPaddingBottom = 40;
  const bottomDecorationHeight = 0;

  // 实际可用高度（containerHeight 已是不含外层 padding 的内层高度，不再减 padding*2）
  // 预留 50px 安全边距，防止因字体渲染差异导致底部文字被裁切
  const availableHeight = containerHeight - contentPaddingTop - contentPaddingBottom - bottomDecorationHeight - 50;

  // 可用宽度（减去左右边距）
  const availableWidth = containerWidth - padding * 2 - contentPaddingLeft - contentPaddingRight;

  // 按换行符分割所有行
  const allLines = content.split(/\n/);

  const blocks = [];
  let currentBlockLines = [];
  let currentHeight = 0;
  let isContinuation = false; // 标记下一个 block 是否为续行

  for (const line of allLines) {
    // 跳过空行，但保留段落分隔
    if (line.trim().length === 0) {
      // 空行作为段落分隔符处理
      if (currentBlockLines.length > 0 && currentBlockLines[currentBlockLines.length - 1] !== '') {
        currentBlockLines.push('');
      }
      continue;
    }

    // 计算当前行需要的行数（基于实际宽度测量）
    const lineWidth = measureLineWidth(line, bodyFontSize);
    const linesNeeded = Math.ceil(lineWidth / availableWidth);
    const lineHeight = linesNeeded * bodyLineHeight * bodyFontSize + 8; // 含行间距

    // 先尝试把当前行加入当前区块
    const testHeight = currentHeight + lineHeight;

    if (testHeight > availableHeight && currentBlockLines.length > 0) {
      // 空间不够，尝试按字符拆分当前行
      const remainingHeight = availableHeight - currentHeight;
      const [firstPart, secondPart] = splitLineToFit(line, availableWidth, bodyFontSize, bodyLineHeight, remainingHeight);

      if (firstPart) {
        // 能拆分，前半部分放入当前区块
        currentBlockLines.push(firstPart);
        blocks.push({ content: currentBlockLines.join('\n') });

        if (secondPart) {
          // 剩余部分放入新区块，标记为续行
          currentBlockLines = [secondPart];
          currentHeight = calculateLineHeight(secondPart, bodyFontSize, availableWidth, bodyLineHeight);
          isContinuation = true;

          // 如果剩余部分仍然放不下，继续拆分
          while (currentHeight > availableHeight && currentBlockLines.length > 0) {
            const line = currentBlockLines[0];
            const remainingHeight = availableHeight;
            const [part1, part2] = splitLineToFit(line, availableWidth, bodyFontSize, bodyLineHeight, remainingHeight);

            if (part1) {
              currentBlockLines = [part1];
              blocks.push({ content: currentBlockLines.join('\n'), continuation: isContinuation });
              isContinuation = true; // 继续拆分，下一个仍是续行
              currentBlockLines = part2 ? [part2] : [];
              currentHeight = part2 ? calculateLineHeight(part2, bodyFontSize, availableWidth, bodyLineHeight) : 0;
            } else {
              // 无法拆分，整行移到下一区块
              blocks.push({ content: currentBlockLines.join('\n'), continuation: true });
              currentBlockLines = [];
              currentHeight = 0;
              break;
            }
          }
        } else {
          currentBlockLines = [];
          currentHeight = 0;
          isContinuation = false;
        }
      } else {
        // 无法拆分（当前行本身就放不下），整行移到新区块，标记为续行
        blocks.push({ content: currentBlockLines.join('\n'), continuation: false });
        currentBlockLines = [line];
        currentHeight = lineHeight;
        isContinuation = true;
      }
    } else {
      // 空间足够，加入当前行
      currentBlockLines.push(line);
      currentHeight = testHeight;
      isContinuation = false; // 正常行加入，重置续行标记
    }
  }

  // 添加最后一个区块
  if (currentBlockLines.length > 0) {
    blocks.push({ content: currentBlockLines.join('\n'), continuation: isContinuation });
  }

  return blocks;
}
