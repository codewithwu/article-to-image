import React from 'react';

function TemplateCard({ template, isSelected, onClick }) {
  const templateStyles = template.styles;

  return (
    <div
      onClick={onClick}
      className={`template-card ${isSelected ? 'selected' : ''}`}
    >
      <div
        className="template-preview"
        style={{ background: templateStyles.background }}
      >
        <div
          className="template-preview-line"
          style={{
            width: 4,
            height: 16,
            background: templateStyles.accentColor,
            borderRadius: 2,
            marginBottom: 6,
          }}
        />
        <div
          className="template-preview-line"
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
          className="template-preview-line"
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
          className="template-preview-line"
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
          className="template-preview-line"
          style={{
            width: '60%',
            height: 6,
            background: templateStyles.bodyColor,
            borderRadius: 3,
            opacity: 0.5,
          }}
        />
      </div>

      <div
        className="template-name"
        style={{ color: templateStyles.titleColor }}
      >
        {template.name}
      </div>
      <div className="template-desc">
        {template.description}
      </div>
    </div>
  );
}

export default TemplateCard;
