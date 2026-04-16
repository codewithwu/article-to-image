import React, { useCallback } from 'react';
import { downloadImage } from '../utils/download';

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

function ImageCard({ imageData, index }) {
  const handleDownload = useCallback(async () => {
    await downloadImage(imageData.canvas, `article-image-${String(index + 1).padStart(2, '0')}.png`);
  }, [imageData.canvas, index]);

  return (
    <div
      className="image-card"
      style={{
        background: '#f9fafb',
        borderRadius: 12,
        padding: 16,
        border: '1px solid #e5e7eb',
      }}
    >
      <div
        style={{
          position: 'relative',
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <img
          src={imageData.dataUrl}
          alt={`Article block ${index + 1}`}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />

        {/* 下载按钮 */}
        <button
          onClick={handleDownload}
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(0,0,0,0.9)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.7)'}
        >
          <DownloadIcon />
        </button>
      </div>

      <div
        style={{
          marginTop: 10,
          textAlign: 'center',
          fontSize: 13,
          color: '#6b7280',
          fontWeight: 500,
        }}
      >
        第 {index + 1} 张
      </div>
    </div>
  );
}

export default ImageCard;
