import React, { useRef } from 'react';
import MarkdownToolbar from './MarkdownToolbar';
import ReactMarkdown from 'react-markdown';

const MagicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
    <path d="M2 17l10 5 10-5"/>
    <path d="M2 12l10 5 10-5"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const Spinner = () => (
  <div className="spinner" />
);

function EditorPage({ content, onContentChange, onTransform, isGenerating, onHome }) {
  const textareaRef = useRef(null);
  const previewRef = useRef(null);

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

      const textBefore = sourceText.substring(0, matchPos);
      const lines = textBefore.split('\n');
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 27;
      const scrollTop = (lines.length - 1) * lineHeight;

      textarea.scrollTop = Math.max(0, scrollTop - 100);
      textarea.focus();
    }
  };

  return (
    <div className="editor-page">
      <div className="editor-header">
        <h1 className="editor-brand">ProseFrame<span className="editor-divider">|</span>将长文智能分割，转换为精美的社交媒体图片</h1>
        <button onClick={onHome} className="btn btn-ghost btn-home">
          <HomeIcon />
          首页
        </button>
      </div>
      <MarkdownToolbar textareaRef={textareaRef} onFormat={onContentChange} />

      <div className="editor-content">
        <div className="editor-panel">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="在这里输入或粘贴你的文章内容，支持 Markdown 格式..."
            className="editor-textarea"
          />
        </div>

        <div className="preview-panel">
          <div className="preview-panel-header">
            预览
          </div>
          <div
            ref={previewRef}
            onMouseUp={handlePreviewSelect}
            className="preview-panel-content markdown-content"
          >
            <ReactMarkdown>{content || '*暂无内容*'}</ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="editor-footer">
        <button
          onClick={onTransform}
          disabled={isGenerating || !content.trim()}
          className="btn-transform"
        >
          {isGenerating ? (
            <>
              <Spinner />
              生成中...
            </>
          ) : (
            <>
              <MagicIcon />
              一键排版
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default EditorPage;
