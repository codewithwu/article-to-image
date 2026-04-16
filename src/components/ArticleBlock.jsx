import React from 'react';
import { templates, IMAGE_WIDTH, IMAGE_HEIGHT, PADDING } from '../templates/index';

function ArticleBlock({ block, template, titleSize, bodySize }) {
  const templateStyles = templates.find(t => t.id === template)?.styles || templates[0].styles;

  return (
    <div
      className={`article-block template-${template}`}
      style={{
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        background: templateStyles.background,
        padding: PADDING,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 装饰线条 */}
      <div
        style={{
          position: 'absolute',
          top: PADDING,
          left: PADDING,
          width: 6,
          height: 80,
          background: templateStyles.accentColor,
          borderRadius: 3,
        }}
      />

      {/* 标题 */}
      {block.title && (
        <h1
          style={{
            fontSize: titleSize,
            color: templateStyles.titleColor,
            margin: '20px 0 40px 30px',
            fontWeight: 700,
            lineHeight: 1.3,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '-0.02em',
          }}
        >
          {block.title}
        </h1>
      )}

      {/* 正文 */}
      <div
        style={{
          flex: 1,
          fontSize: bodySize,
          color: templateStyles.bodyColor,
          lineHeight: 1.7,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '0.01em',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {block.content}
      </div>

      {/* 底部装饰 */}
      <div
        style={{
          position: 'absolute',
          bottom: PADDING,
          right: PADDING,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            background: templateStyles.accentColor,
            borderRadius: 2,
          }}
        />
        <div
          style={{
            width: 16,
            height: 16,
            background: templateStyles.accentColor,
            borderRadius: '50%',
          }}
        />
      </div>
    </div>
  );
}

export default ArticleBlock;
