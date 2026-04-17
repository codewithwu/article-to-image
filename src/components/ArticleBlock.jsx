import React from 'react';
import ReactMarkdown from 'react-markdown';
import { templates, IMAGE_WIDTH, IMAGE_HEIGHT, PADDING } from '../templates/index';

function ArticleBlock({ block, template, bodySize }) {
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

      {/* 正文 - 使用 ReactMarkdown 渲染 */}
      <div
        style={{
          flex: 1,
          fontSize: bodySize,
          color: templateStyles.bodyColor,
          lineHeight: 1.7,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '0.01em',
          overflow: 'hidden',
        }}
      >
        <ReactMarkdown
          components={{
            p: ({ children }) => <p style={{ margin: '0 0 1em 0' }}>{children}</p>,
            h1: ({ children }) => <h1 style={{ fontSize: bodySize * 1.5, fontWeight: 700, margin: '0 0 0.5em 0', lineHeight: 1.3 }}>{children}</h1>,
            h2: ({ children }) => <h2 style={{ fontSize: bodySize * 1.3, fontWeight: 700, margin: '0 0 0.5em 0', lineHeight: 1.3 }}>{children}</h2>,
            h3: ({ children }) => <h3 style={{ fontSize: bodySize * 1.1, fontWeight: 700, margin: '0 0 0.5em 0', lineHeight: 1.3 }}>{children}</h3>,
            ul: ({ children }) => <ul style={{ margin: '0 0 1em 0', paddingLeft: '1.5em' }}>{children}</ul>,
            ol: ({ children }) => <ol style={{ margin: '0 0 1em 0', paddingLeft: '1.5em' }}>{children}</ol>,
            li: ({ children }) => <li style={{ marginBottom: '0.3em' }}>{children}</li>,
            blockquote: ({ children }) => (
              <blockquote style={{
                margin: '0 0 1em 0',
                paddingLeft: '1em',
                borderLeft: `3px solid ${templateStyles.accentColor}`,
                color: templateStyles.bodyColor,
                opacity: 0.85,
              }}>
                {children}
              </blockquote>
            ),
            strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
            em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
          }}
        >
          {block.content}
        </ReactMarkdown>
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
