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
    <div className="image-card">
      <div className="image-card-preview">
        <img
          src={imageData.dataUrl}
          alt={`Article block ${index + 1}`}
        />
        <button
          onClick={handleDownload}
          className="image-card-btn"
        >
          <DownloadIcon />
        </button>
      </div>
      <div className="image-card-label">
        第 {index + 1} 张
      </div>
    </div>
  );
}

export default ImageCard;
