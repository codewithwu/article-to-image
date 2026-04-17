import React from 'react';

const ToolbarButton = ({ label, onClick, title, active }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`btn ${active ? 'active' : ''}`}
  >
    {label}
  </button>
);

function MarkdownToolbar({ textareaRef, onFormat }) {
  const getSelection = () => {
    const textarea = textareaRef?.current;
    if (!textarea) return { start: 0, end: 0, text: '' };
    return {
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
      text: textarea.value.substring(textarea.selectionStart, textarea.selectionEnd),
    };
  };

  const setCursorPosition = (position) => {
    const textarea = textareaRef?.current;
    if (textarea) {
      textarea.setSelectionRange(position, position);
    }
  };

  const insertMarkdown = (before, after = '') => {
    const textarea = textareaRef?.current;
    if (!textarea) return;

    const { start, end, text } = getSelection();
    const currentValue = textarea.value;

    let newValue;
    let newCursorPos;

    if (text) {
      newValue = currentValue.substring(0, start) + before + text + after + currentValue.substring(end);
      newCursorPos = start + before.length + text.length;
    } else {
      newValue = currentValue.substring(0, start) + before + after + currentValue.substring(end);
      newCursorPos = start + before.length;
    }

    // Use native input event since we're manipulating DOM directly for cursor control
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    nativeInputValueSetter.call(textarea, newValue);

    const inputEvent = new Event('input', { bubbles: true });
    textarea.dispatchEvent(inputEvent);

    setCursorPosition(newCursorPos);

    if (onFormat) {
      onFormat(newValue);
    }
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
    <div className="editor-toolbar">
      <ToolbarButton label="加粗" onClick={handleBold} title="加粗 (Ctrl+B)" />
      <ToolbarButton label="斜体" onClick={handleItalic} title="斜体 (Ctrl+I)" />
      <div className="toolbar-divider" />
      <ToolbarButton label="一级标题" onClick={handleH1} title="一级标题" />
      <ToolbarButton label="二级标题" onClick={handleH2} title="二级标题" />
      <ToolbarButton label="三级标题" onClick={handleH3} title="三级标题" />
      <div className="toolbar-divider" />
      <ToolbarButton label="无序列表" onClick={handleUl} title="无序列表" />
      <ToolbarButton label="有序列表" onClick={handleOl} title="有序列表" />
      <ToolbarButton label="引用" onClick={handleQuote} title="引用" />
    </div>
  );
}

export default MarkdownToolbar;
