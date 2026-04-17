import React, { useRef, useEffect } from 'react';
import MarkdownToolbar from './MarkdownToolbar';
import ReactMarkdown from 'react-markdown';

const MagicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
    <path d="M2 17l10 5 10-5"/>
    <path d="M2 12l10 5 10-5"/>
  </svg>
);

function EditorPage({ content, onContentChange, onTransform, isGenerating }) {
  const textareaRef = useRef(null);
  const previewRef = useRef(null);

  // 处理预览区文字选中
  const handlePreviewSelect = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      return;
    }

    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    const sourceText = content;
    let searchStart = 0;
    let matchPos = -1;

    for (let i = 0; i < sourceText.length; i++) {
      const idx = sourceText.indexOf(selectedText, searchStart);
      if (idx === -1) break;
      matchPos = idx;
      searchStart = idx + 1;
    }

    if (matchPos !== -1 && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.setSelectionRange(matchPos, matchPos + selectedText.length);

      // 计算选中区域位置并滚动到可视区域
      const textBefore = sourceText.substring(0, matchPos);
      const lines = textBefore.split('\n');
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 27;
      const scrollTop = (lines.length - 1) * lineHeight;

      textarea.scrollTop = Math.max(0, scrollTop - 100);
      textarea.focus();
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
      }}
    >
      {/* Markdown 工具栏 */}
      <MarkdownToolbar textareaRef={textareaRef} onFormat={onContentChange} />

      {/* 编辑区域 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          gap: 16,
          padding: 24,
          overflow: 'hidden',
        }}
      >
        {/* 左侧编辑区 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="在这里输入或粘贴你的文章内容，支持 Markdown 格式..."
            style={{
              flex: 1,
              width: '100%',
              padding: 16,
              borderRadius: 10,
              border: '2px solid #e5e7eb',
              fontSize: 15,
              lineHeight: 1.8,
              resize: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* 右侧预览区 */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 10,
            border: '2px solid #e5e7eb',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '8px 16px',
              background: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              fontSize: 13,
              color: '#6b7280',
              fontWeight: 500,
            }}
          >
            预览
          </div>
          <div
            ref={previewRef}
            onMouseUp={handlePreviewSelect}
            style={{
              flex: 1,
              padding: 16,
              overflow: 'auto',
              fontSize: 15,
              lineHeight: 1.8,
            }}
          >
            <ReactMarkdown>{content || '*暂无内容*'}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* 底部按钮 */}
      <div
        style={{
          padding: 20,
          borderTop: '1px solid #e5e7eb',
        }}
      >
        <button
          onClick={onTransform}
          disabled={isGenerating || !content.trim()}
          style={{
            width: '100%',
            padding: '14px 24px',
            borderRadius: 10,
            border: 'none',
            background: isGenerating ? '#9ca3af' : '#3b82f6',
            color: '#fff',
            fontSize: 16,
            fontWeight: 600,
            cursor: isGenerating || !content.trim() ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.2s',
          }}
        >
          <MagicIcon />
          {isGenerating ? '生成中...' : '一键排版'}
        </button>
      </div>
    </div>
  );
}

export default EditorPage;
