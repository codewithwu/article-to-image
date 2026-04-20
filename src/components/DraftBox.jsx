import React from 'react';

function formatRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  return `${days}天前`;
}

function DraftBox({ drafts, onRestore, onDelete, onClose }) {
  return (
    <div className="draft-box-overlay" onClick={onClose}>
      <div className="draft-box" onClick={e => e.stopPropagation()}>
        <div className="draft-box-header">
          <h2 className="draft-box-title">草稿箱</h2>
          <button className="draft-box-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="draft-box-content">
          {drafts.length === 0 ? (
            <div className="draft-box-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              <p>暂无草稿</p>
            </div>
          ) : (
            <div className="draft-list">
              {drafts.map(draft => (
                <div key={draft.id} className="draft-item" onClick={() => onRestore(draft.content)}>
                  <div className="draft-item-content">
                    <div className="draft-item-title">{draft.title}</div>
                    <div className="draft-item-time">{formatRelativeTime(draft.timestamp)}</div>
                  </div>
                  <button
                    className="draft-item-delete"
                    onClick={e => {
                      e.stopPropagation();
                      onDelete(draft.id);
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DraftBox;
