import React, { useState, useEffect } from 'react';

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const FrameIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect x="4" y="4" width="40" height="40" stroke="currentColor" strokeWidth="2"/>
    <rect x="10" y="10" width="28" height="28" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4"/>
    <line x1="4" y1="16" x2="44" y2="16" stroke="currentColor" strokeWidth="1"/>
    <line x1="4" y1="32" x2="44" y2="32" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
  </svg>
);

function HomePage({ onEnter }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`home-page ${isVisible ? 'visible' : ''}`}>
      <div className="home-background">
        <div className="bg-grain" />
        <div className="bg-gradient" />
      </div>

      <main className="home-main">
        <div className="home-hero">
          <div className="hero-badge">
            <SparkleIcon />
            <span>智能长文排版</span>
          </div>

          <h1 className="hero-title">
            <span className="title-line">将思绪</span>
            <span className="title-line accent">化为画卷</span>
          </h1>

          <p className="hero-subtitle">
            长文智能分割，转换为精美的社交媒体图片<br />
            支持多模板，一键导出
          </p>

          <button className="hero-cta" onClick={onEnter}>
            <span>开始创作</span>
            <ArrowIcon />
          </button>
        </div>

        <div className="home-features">
          <div className="feature-item">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
            </div>
            <h3>智能分页</h3>
            <p>长文自动分割成适合阅读的图片</p>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h3>多模板</h3>
            <p>极简、商务、活力多种风格</p>
          </div>

          <div className="feature-item">
            <div className="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
            </div>
            <h3>一键导出</h3>
            <p>批量下载，高清图片</p>
          </div>
        </div>
      </main>

      <footer className="home-footer">
        <div className="footer-brand">
          <FrameIcon />
          <span>ProseFrame</span>
        </div>
        <p className="footer-tagline">让文字更有温度</p>
      </footer>
    </div>
  );
}

export default HomePage;
