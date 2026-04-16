import React, { useState, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import html2canvas from 'html2canvas';
import EditorPanel from './components/EditorPanel';
import PreviewPanel from './components/PreviewPanel';
import ArticleBlock from './components/ArticleBlock';
import { splitTextIntoBlocks } from './utils/textSplitter';
import { downloadImagesAsZip } from './utils/download';
import { templates, IMAGE_WIDTH, IMAGE_HEIGHT } from './templates/index';
import './App.css';

function App() {
  const [content, setContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const [titleSize, setTitleSize] = useState(64);
  const [bodySize, setBodySize] = useState(40);
  const [images, setImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTransform = useCallback(async () => {
    if (!content.trim()) return;

    setIsGenerating(true);
    setImages([]);

    try {
      const blocks = splitTextIntoBlocks(content, {
        containerWidth: IMAGE_WIDTH - 120,
        containerHeight: IMAGE_HEIGHT - 120,
        titleFontSize: titleSize,
        bodyFontSize: bodySize,
        padding: 60,
      });

      // 渲染所有区块
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      document.body.appendChild(tempContainer);

      const generatedImages = [];

      for (let index = 0; index < blocks.length; index++) {
        const block = blocks[index];
        const blockElement = document.createElement('div');
        tempContainer.appendChild(blockElement);

        const root = ReactDOM.createRoot(blockElement);
        root.render(
          <ArticleBlock
            block={block}
            template={selectedTemplate}
            titleSize={titleSize}
            bodySize={bodySize}
          />
        );

        // 等待 DOM 更新
        await new Promise(resolve => setTimeout(resolve, 150));

        const canvas = await html2canvas(blockElement.firstChild, {
          width: IMAGE_WIDTH,
          height: IMAGE_HEIGHT,
          scale: 2,
          useCORS: true,
          logging: false,
        });

        generatedImages.push({
          canvas,
          dataUrl: canvas.toDataURL('image/png'),
        });

        root.unmount();
      }

      setImages(generatedImages);

      // 清理临时容器
      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error('Error generating images:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [content, selectedTemplate, titleSize, bodySize]);

  const handleDownloadAll = useCallback(async () => {
    if (images.length > 0) {
      await downloadImagesAsZip(images, 'article-images.zip');
    }
  }, [images]);

  return (
    <div className="app">
      <div className="app-container">
        <EditorPanel
          content={content}
          onContentChange={setContent}
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
          titleSize={titleSize}
          onTitleSizeChange={setTitleSize}
          bodySize={bodySize}
          onBodySizeChange={setBodySize}
          onTransform={handleTransform}
          isGenerating={isGenerating}
        />
        <PreviewPanel
          images={images}
          onDownloadAll={handleDownloadAll}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
}

export default App;
