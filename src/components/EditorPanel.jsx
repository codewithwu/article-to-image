import React from 'react';
import TemplateCard from './TemplateCard';
import { templates, TITLE_SIZE_MIN, TITLE_SIZE_MAX, BODY_SIZE_MIN, BODY_SIZE_MAX } from '../templates/index';

const MagicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
    <path d="M2 17l10 5 10-5"/>
    <path d="M2 12l10 5 10-5"/>
  </svg>
);

function EditorPanel({
  content,
  onContentChange,
  selectedTemplate,
  onTemplateChange,
  titleSize,
  onTitleSizeChange,
  bodySize,
  onBodySizeChange,
  onTransform,
  isGenerating,
}) {
  return (
    <div
      className="editor-panel"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        borderRight: '1px solid #e5e7eb',
      }}
    >
      {/* 顶部按钮 */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
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

      {/* 滚动内容区 */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: 24,
        }}
      >
        {/* 文本输入 */}
        <div style={{ marginBottom: 28 }}>
          <label
            style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 600,
              color: '#374151',
              marginBottom: 10,
            }}
          >
            文章内容
          </label>
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="请输入长文内容...&#10;&#10;支持多段落自动分割"
            style={{
              width: '100%',
              height: 220,
              padding: '14px 16px',
              borderRadius: 10,
              border: '2px solid #e5e7eb',
              fontSize: 15,
              lineHeight: 1.6,
              resize: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* 模板选择 */}
        <div style={{ marginBottom: 28 }}>
          <label
            style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 600,
              color: '#374151',
              marginBottom: 12,
            }}
          >
            选择模板
          </label>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate === template.id}
                onClick={() => onTemplateChange(template.id)}
              />
            ))}
          </div>
        </div>

        {/* 字号调节 */}
        <div style={{ marginBottom: 28 }}>
          <label
            style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 600,
              color: '#374151',
              marginBottom: 12,
            }}
          >
            标题字号
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              type="range"
              min={TITLE_SIZE_MIN}
              max={TITLE_SIZE_MAX}
              value={titleSize}
              onChange={(e) => onTitleSizeChange(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span
              style={{
                minWidth: 48,
                textAlign: 'right',
                fontSize: 14,
                fontWeight: 600,
                color: '#3b82f6',
              }}
            >
              {titleSize}px
            </span>
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <label
            style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 600,
              color: '#374151',
              marginBottom: 12,
            }}
          >
            正文字号
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              type="range"
              min={BODY_SIZE_MIN}
              max={BODY_SIZE_MAX}
              value={bodySize}
              onChange={(e) => onBodySizeChange(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span
              style={{
                minWidth: 48,
                textAlign: 'right',
                fontSize: 14,
                fontWeight: 600,
                color: '#3b82f6',
              }}
            >
              {bodySize}px
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorPanel;
