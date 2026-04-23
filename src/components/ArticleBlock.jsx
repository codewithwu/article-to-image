import React from 'react';
import ReactMarkdown from 'react-markdown';
import { templates, IMAGE_WIDTH, IMAGE_HEIGHT, PADDING } from '../templates/index';

function ArticleBlock({ block, template, bodySize, paragraphStartIndex = 0 }) {
  const templateStyles = templates.find(t => t.id === template)?.styles || templates[0].styles;
  const currentParagraphIndex = React.useRef(paragraphStartIndex);

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
      <div
        style={{
          flex: 1,
          fontSize: bodySize,
          color: templateStyles.bodyColor,
          lineHeight: 1.7,
          fontFamily: "'Noto Serif SC', 'Songti SC', 'SimSun', serif",
          letterSpacing: '0.01em',
          paddingTop: 30,  // 顶部预留30px空白
          paddingBottom: 40, // 底部预留40px空白
          paddingLeft: 30,  // 左边预留30px空白
          paddingRight: 30, // 右边预留30px空白
          overflow: 'hidden',
        }}
      >
        <ReactMarkdown
          components={{
            p: ({ children }) => {
              const paragraphIdx = currentParagraphIndex.current++;
              const isContinuation = block.continuation && paragraphIdx === 0;
              return (
                <p
                  className="article-paragraph"
                  style={{
                    margin: '0 0 1em 0',
                    textIndent: isContinuation ? '2em' : '0',
                  }}
                >
                  {isContinuation && (
                    <span style={{ marginRight: '0.3em', fontStyle: 'italic', opacity: 0.6 }}>↩</span>
                  )}
                  {children}
                </p>
              );
            },
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

      <div
        style={{
          position: 'absolute',
          bottom: 40,  // 放在底部空白区域内
          right: 30,
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
