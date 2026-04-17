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

function PreviewPage({ images, selectedTemplate, onTemplateChange, onDownloadAll, onBack, isGenerating }) {
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
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: '#f8fafc',
      }}
    >
      {/* 左侧图片预览区 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* 顶部栏 */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #e5e7eb',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={onBack}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                background: '#fff',
                color: '#374151',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f3f4f6';
                e.target.style.borderColor = '#d1d5db';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#fff';
                e.target.style.borderColor = '#e5e7eb';
              }}
            >
              <BackIcon />
              返回编辑
            </button>
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 600,
                color: '#1f2937',
              }}
            >
              预览区域
            </h3>
            {images.length > 0 && (
              <span
                style={{
                  fontSize: 13,
                  color: '#6b7280',
                }}
              >
                (共 {images.length} 张图片)
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* 缩放控制 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                style={{
                  padding: '8px',
                  borderRadius: 6,
                  border: '1px solid #e5e7eb',
                  background: '#fff',
                  color: zoom <= 50 ? '#d1d5db' : '#374151',
                  cursor: zoom <= 50 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                }}
                title="缩小"
              >
                <ZoomOutIcon />
              </button>
              <span style={{ fontSize: 13, color: '#6b7280', minWidth: 50, textAlign: 'center' }}>
                {zoom}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                style={{
                  padding: '8px',
                  borderRadius: 6,
                  border: '1px solid #e5e7eb',
                  background: '#fff',
                  color: zoom >= 200 ? '#d1d5db' : '#374151',
                  cursor: zoom >= 200 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                }}
                title="放大"
              >
                <ZoomInIcon />
              </button>
            </div>

            {images.length > 0 && (
              <button
                onClick={onDownloadAll}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#10b981',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.background = '#059669'}
                onMouseLeave={(e) => e.target.style.background = '#10b981'}
              >
                <DownloadIcon />
                批量下载
              </button>
            )}
          </div>
        </div>

        {/* 图片列表 */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: 24,
          }}
        >
          {images.length === 0 ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9ca3af',
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <p style={{ fontSize: 15, margin: 0 }}>
                {isGenerating ? '正在生成图片...' : '等待生成图片...'}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fill, minmax(${imageSize}px, 1fr))`,
                gap: 20,
              }}
            >
              {images.map((imageData, index) => (
                <ImageCard key={index} imageData={imageData} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 右侧模板选择 */}
      <div
        style={{
          width: 320,
          minWidth: 320,
          background: '#fff',
          borderLeft: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              color: '#1f2937',
            }}
          >
            模板选择
          </h3>
          <p
            style={{
              margin: '4px 0 0 0',
              fontSize: 13,
              color: '#6b7280',
            }}
          >
            点击模板实时更新预览
          </p>
        </div>

        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
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
      </div>
    </div>
  );
}

export default PreviewPage;
