import React from 'react';

const ToolbarButton = ({ label, onClick, title, active }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    style={{
      padding: '8px 12px',
      borderRadius: 6,
      border: active ? '1px solid #3b82f6' : '1px solid #e5e7eb',
      background: active ? '#eff6ff' : '#fff',
      color: active ? '#3b82f6' : '#374151',
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap',
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.target.style.background = '#f3f4f6';
        e.target.style.borderColor = '#d1d5db';
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.target.style.background = '#fff';
        e.target.style.borderColor = '#e5e7eb';
      }
    }}
  >
    {label}
  </button>
);

function MarkdownToolbar({ textareaRef, onFormat }) {
  const insertMarkdown = (before, after = '') => {
    const textarea = textareaRef?.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    if (selectedText) {
      const newText = before + selectedText + after;
      const beforeText = textarea.value.substring(0, start);
      const afterText = textarea.value.substring(end);
      textarea.value = beforeText + newText + afterText;

      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    } else {
      textarea.value = textarea.value.substring(0, start) + before + after + textarea.value.substring(end);
      textarea.setSelectionRange(start + before.length, start + before.length);
      textarea.focus();
    }

    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    if (onFormat) onFormat(textarea.value);
  };

  const handleBold = () => insertMarkdown('**', '**');
  const handleItalic = () => insertMarkdown('*', '*');
  const handleH1 = () => insertMarkdown('# ', '');
  const handleH2 = () => insertMarkdown('## ', '');
  const handleH3 = () => insertMarkdown('### ', '');
  const handleUl = () => insertMarkdown('- ', '');
  const handleOl = () => insertMarkdown('1. ', '');
  const handleQuote = () => insertMarkdown('> ', '');

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        padding: '12px 16px',
        background: '#f9fafb',
        borderBottom: '1px solid #e5e7eb',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <ToolbarButton label="加粗" onClick={handleBold} title="加粗 (Ctrl+B)" />
      <ToolbarButton label="斜体" onClick={handleItalic} title="斜体 (Ctrl+I)" />
      <div style={{ width: 1, background: '#e5e7eb', margin: '0 4px', alignSelf: 'stretch' }} />
      <ToolbarButton label="一级标题" onClick={handleH1} title="一级标题" />
      <ToolbarButton label="二级标题" onClick={handleH2} title="二级标题" />
      <ToolbarButton label="三级标题" onClick={handleH3} title="三级标题" />
      <div style={{ width: 1, background: '#e5e7eb', margin: '0 4px', alignSelf: 'stretch' }} />
      <ToolbarButton label="无序列表" onClick={handleUl} title="无序列表" />
      <ToolbarButton label="有序列表" onClick={handleOl} title="有序列表" />
      <ToolbarButton label="引用" onClick={handleQuote} title="引用" />
    </div>
  );
}

export default MarkdownToolbar;
