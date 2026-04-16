import React from 'react';
import { templates } from '../templates/index';

function TemplateCard({ template, isSelected, onClick }) {
  const templateStyles = template.styles;

  return (
    <div
      onClick={onClick}
      className={`template-card ${isSelected ? 'selected' : ''}`}
      style={{
        width: 120,
        padding: 12,
        borderRadius: 12,
        border: isSelected ? '3px solid #3b82f6' : '2px solid #e5e7eb',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        background: templateStyles.background,
        boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      {/* 预览框 */}
      <div
        style={{
          width: '100%',
          height: 80,
          background: templateStyles.background,
          borderRadius: 6,
          marginBottom: 8,
          display: 'flex',
          flexDirection: 'column',
          padding: 8,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: 4,
            height: 16,
            background: templateStyles.accentColor,
            borderRadius: 2,
            marginBottom: 6,
          }}
        />
        <div
          style={{
            width: '70%',
            height: 8,
            background: templateStyles.titleColor,
            borderRadius: 4,
            marginBottom: 6,
            opacity: 0.8,
          }}
        />
        <div
          style={{
            width: '90%',
            height: 6,
            background: templateStyles.bodyColor,
            borderRadius: 3,
            marginBottom: 3,
            opacity: 0.5,
          }}
        />
        <div
          style={{
            width: '85%',
            height: 6,
            background: templateStyles.bodyColor,
            borderRadius: 3,
            marginBottom: 3,
            opacity: 0.5,
          }}
        />
        <div
          style={{
            width: '60%',
            height: 6,
            background: templateStyles.bodyColor,
            borderRadius: 3,
            opacity: 0.5,
          }}
        />
      </div>

      {/* 模板名称 */}
      <div
        style={{
          textAlign: 'center',
          fontSize: 13,
          fontWeight: 600,
          color: templateStyles.titleColor,
        }}
      >
        {template.name}
      </div>
      <div
        style={{
          textAlign: 'center',
          fontSize: 10,
          color: '#9ca3af',
          marginTop: 2,
        }}
      >
        {template.description}
      </div>
    </div>
  );
}

export default TemplateCard;
