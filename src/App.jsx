import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import html2canvas from 'html2canvas';
import HomePage from './components/HomePage';
import EditorPage from './components/EditorPage';
import PreviewPage from './components/PreviewPage';
import ArticleBlock from './components/ArticleBlock';
import DraftBox from './components/DraftBox';
import { splitTextIntoBlocks } from './utils/textSplitter';
import { downloadImagesAsZip } from './utils/download';
import { templates, IMAGE_WIDTH, IMAGE_HEIGHT } from './templates/index';
import { getDrafts, saveDraft, deleteDraft } from './utils/draftStorage';
import './App.css';

function App() {
  const [showHome, setShowHome] = useState(true);
  const [content, setContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const [bodySize] = useState(40);
  const [images, setImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreviewMode, setShowPreviewMode] = useState(false);
  const [parsedContent, setParsedContent] = useState('');
  const [generationProgress, setGenerationProgress] = useState(null);
  const [error, setError] = useState(null);
  const [transitionClass, setTransitionClass] = useState('');
  const [showDraftBox, setShowDraftBox] = useState(false);
  const [drafts, setDrafts] = useState([]);

  // Load drafts on mount
  useEffect(() => {
    setDrafts(getDrafts());
  }, []);

  // Handle page transition
  useEffect(() => {
    if (transitionClass) {
      const timer = setTimeout(() => setTransitionClass(''), 300);
      return () => clearTimeout(timer);
    }
  }, [transitionClass]);

  const handleEnterApp = useCallback(() => {
    setTransitionClass('page-exit');
    setTimeout(() => {
      setShowHome(false);
      setTransitionClass('page-enter');
    }, 400);
  }, []);

  const handleTransform = useCallback(async (contentToTransform = content, templateOverride) => {
    if (!contentToTransform.trim()) return;

    setIsGenerating(true);
    setImages([]);
    setError(null);
    setGenerationProgress({ current: 0, total: 0 });

    const targetTemplate = templateOverride || selectedTemplate;

    try {
      const blocks = splitTextIntoBlocks(contentToTransform, {
        containerWidth: IMAGE_WIDTH - 120,
        containerHeight: IMAGE_HEIGHT - 120,
        bodyFontSize: bodySize,
        padding: 60,
      });

      setGenerationProgress({ current: 0, total: blocks.length });

      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      document.body.appendChild(tempContainer);

      const blockElement = document.createElement('div');
      tempContainer.appendChild(blockElement);
      const root = ReactDOM.createRoot(blockElement);

      const generatedImages = [];

      for (let index = 0; index < blocks.length; index++) {
        const block = blocks[index];

        await new Promise(resolve => {
          root.render(
            <ArticleBlock
              block={block}
              template={targetTemplate}
              bodySize={bodySize}
            />
          );
          setTimeout(resolve, 150);
        });

        setGenerationProgress({ current: index + 1, total: blocks.length });

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
      }

      setImages(generatedImages);
      root.unmount();
      document.body.removeChild(tempContainer);
      setGenerationProgress({ current: blocks.length, total: blocks.length });
    } catch (err) {
      console.error('Error generating images:', err);
      setError('生成图片时出现错误，请重试。如果问题持续存在，请尝试减少文章内容。');
    } finally {
      setIsGenerating(false);
    }
  }, [content, selectedTemplate, bodySize]);

  const handleFormatAndPreview = useCallback(() => {
    if (!content.trim()) return;
    setParsedContent(content);
    setTransitionClass('fade-out');
    setTimeout(() => {
      setShowPreviewMode(true);
      setTransitionClass('fade-in');
    }, 150);
    handleTransform(content);
  }, [content, handleTransform]);

  const handleDownloadAll = useCallback(async () => {
    if (images.length > 0) {
      await downloadImagesAsZip(images, 'article-images.zip');
    }
  }, [images]);

  const handleBackToEditor = useCallback(() => {
    setTransitionClass('fade-out');
    setTimeout(() => {
      setShowPreviewMode(false);
      setError(null);
      setImages([]);
      setTransitionClass('fade-in');
    }, 150);
  }, []);

  const handleTemplateChangeInPreview = useCallback((templateId) => {
    if (parsedContent) {
      handleTransform(parsedContent, templateId);
    }
    setSelectedTemplate(templateId);
  }, [parsedContent, handleTransform]);

  const handleBackToHome = useCallback(() => {
    setTransitionClass('page-exit');
    setTimeout(() => {
      setShowPreviewMode(false);
      setShowHome(true);
      setContent('');
      setTransitionClass('page-enter');
    }, 400);
  }, []);

  const handleSaveDraft = useCallback(() => {
    if (content.trim()) {
      const updatedDrafts = saveDraft(content);
      setDrafts(updatedDrafts);
    }
  }, [content]);

  const handleRestoreDraft = useCallback((draftContent) => {
    setContent(draftContent);
    setShowDraftBox(false);
  }, []);

  const handleDeleteDraft = useCallback((id) => {
    const updatedDrafts = deleteDraft(id);
    setDrafts(updatedDrafts);
  }, []);

  return (
    <div className="app">
      <div className={`app-container ${transitionClass}`}>
        {showHome ? (
          <HomePage onEnter={handleEnterApp} />
        ) : showPreviewMode ? (
          <PreviewPage
            images={images}
            selectedTemplate={selectedTemplate}
            onTemplateChange={handleTemplateChangeInPreview}
            onDownloadAll={handleDownloadAll}
            onBack={handleBackToEditor}
            onHome={handleBackToHome}
            isGenerating={isGenerating}
            generationProgress={generationProgress}
            error={error}
          />
        ) : (
          <>
            <EditorPage
              content={content}
              onContentChange={setContent}
              onTransform={handleFormatAndPreview}
              isGenerating={isGenerating}
              onHome={handleBackToHome}
              onSaveDraft={handleSaveDraft}
              draftCount={drafts.length}
              onDraftBoxClick={() => setShowDraftBox(true)}
            />
            {showDraftBox && (
              <DraftBox
                drafts={drafts}
                onRestore={handleRestoreDraft}
                onDelete={handleDeleteDraft}
                onClose={() => setShowDraftBox(false)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
