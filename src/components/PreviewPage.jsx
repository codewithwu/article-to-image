import React, { useState } from 'react';
import TemplateCard from './TemplateCard';
import ImageCard from './ImageCard';
import { templates } from '../templates/index';

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const ZoomInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    <line x1="11" y1="8" x2="11" y2="14"/>
    <line x1="8" y1="11" x2="14" y2="11"/>
  </svg>
);

const ZoomOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    <line x1="8" y1="11" x2="14" y2="11"/>
  </svg>
);

const ImageIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const Spinner = () => (
  <div className="spinner" />
);

function PreviewPage({ images, selectedTemplate, onTemplateChange, onDownloadAll, onBack, onHome, isGenerating, generationProgress, error }) {
  const [zoom, setZoom] = useState(100);
  const [imageSize, setImageSize] = useState(240);

  const handleZoomIn = () => {
    if (zoom < 200) {
      const newZoom = zoom + 25;
      setZoom(newZoom);
      setImageSize(Math.round(imageSize * 1.25));
    }
  };

  const handleZoomOut = () => {
    if (zoom > 50) {
      const newZoom = zoom - 25;
      setZoom(newZoom);
      setImageSize(Math.round(imageSize / 1.25));
    }
  };

  return (
    <div className="preview-page">
      <div className="preview-main">
        <div className="preview-header">
          <div className="preview-header-left">
            <button
              onClick={onBack}
              className="btn"
            >
              <BackIcon />
              返回编辑
            </button>
            <button
              onClick={onHome}
              className="btn btn-ghost"
            >
              <HomeIcon />
              首页
            </button>
            <h3 className="preview-title">
              预览区域
            </h3>
            {images.length > 0 && (
              <span className="preview-subtitle">
                (共 {images.length} 张图片)
              </span>
            )}
          </div>

          <div className="preview-header-right">
            <div className="zoom-controls">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="btn-icon"
                title="缩小"
              >
                <ZoomOutIcon />
              </button>
              <span className="zoom-label">
                {zoom}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="btn-icon"
                title="放大"
              >
                <ZoomInIcon />
              </button>
            </div>

            {images.length > 0 && (
              <button
                onClick={onDownloadAll}
                className="btn btn-success"
              >
                <DownloadIcon />
                批量下载
              </button>
            )}
          </div>
        </div>

        {isGenerating && generationProgress && (
          <div className="progress-bar-container">
            <div className="progress-bar-text">
              <Spinner />
              正在生成图片... ({generationProgress.current} / {generationProgress.total})
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="preview-content">
          {images.length === 0 ? (
            <div className="preview-empty">
              <div className="preview-empty-icon">
                <ImageIcon />
              </div>
              <p className="preview-empty-text">
                {isGenerating ? '正在生成图片...' : '等待生成图片...'}
              </p>
            </div>
          ) : (
            <div
              className="image-grid"
              style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${imageSize}px, 1fr))` }}
            >
              {images.map((imageData, index) => (
                <ImageCard key={index} imageData={imageData} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="preview-sidebar">
        <div className="preview-sidebar-header">
          <h3 className="preview-sidebar-title">
            模板选择
          </h3>
          <p className="preview-sidebar-subtitle">
            点击模板实时更新预览
          </p>
        </div>

        <div className="preview-sidebar-content">
          <div className="template-list">
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
      </div>
    </div>
  );
}

export default PreviewPage;
