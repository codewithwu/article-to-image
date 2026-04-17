import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import html2canvas from 'html2canvas';
import EditorPage from './components/EditorPage';
import PreviewPage from './components/PreviewPage';
import ArticleBlock from './components/ArticleBlock';
import { splitTextIntoBlocks } from './utils/textSplitter';
import { downloadImagesAsZip } from './utils/download';
import { templates, IMAGE_WIDTH, IMAGE_HEIGHT } from './templates/index';
import './App.css';

function App() {
  const [content, setContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const [bodySize, setBodySize] = useState(40);
  const [images, setImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreviewMode, setShowPreviewMode] = useState(false);
  const [parsedContent, setParsedContent] = useState('');

  const handleTransform = useCallback(async (contentToTransform = content, templateOverride) => {
    if (!contentToTransform.trim()) return;

    setIsGenerating(true);
    setImages([]);

    const targetTemplate = templateOverride || selectedTemplate;

    try {
      const blocks = splitTextIntoBlocks(contentToTransform, {
        containerWidth: IMAGE_WIDTH - 120,
        containerHeight: IMAGE_HEIGHT - 120,
        bodyFontSize: bodySize,
        padding: 60,
      });

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
            template={targetTemplate}
            bodySize={bodySize}
          />
        );

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
      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error('Error generating images:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [content, selectedTemplate, bodySize]);

  const handleFormatAndPreview = useCallback(() => {
    if (!content.trim()) return;
    setParsedContent(content);
    setShowPreviewMode(true);
    handleTransform(content);
  }, [content, handleTransform]);

  const handleDownloadAll = useCallback(async () => {
    if (images.length > 0) {
      await downloadImagesAsZip(images, 'article-images.zip');
    }
  }, [images]);

  const handleBackToEditor = useCallback(() => {
    setShowPreviewMode(false);
  }, []);

  const handleTemplateChangeInPreview = useCallback((templateId) => {
    if (parsedContent) {
      handleTransform(parsedContent, templateId);
    }
    setSelectedTemplate(templateId);
  }, [parsedContent, handleTransform]);

  return (
    <div className="app">
      <div className="app-container">
        {showPreviewMode ? (
          <PreviewPage
            images={images}
            selectedTemplate={selectedTemplate}
            onTemplateChange={handleTemplateChangeInPreview}
            onDownloadAll={handleDownloadAll}
            onBack={handleBackToEditor}
            isGenerating={isGenerating}
          />
        ) : (
          <EditorPage
            content={content}
            onContentChange={setContent}
            onTransform={handleFormatAndPreview}
            isGenerating={isGenerating}
          />
        )}
      </div>
    </div>
  );
}

export default App;
