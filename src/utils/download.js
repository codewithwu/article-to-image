import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * 下载单张图片
 */
export async function downloadImage(canvas, filename = 'article-image.png') {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, filename);
        resolve();
      } else {
        reject(new Error('Failed to create blob'));
      }
    }, 'image/png');
  });
}

/**
 * 批量下载多张图片为 ZIP
 */
export async function downloadImagesAsZip(images, filename = 'article-images.zip') {
  const zip = new JSZip();

  const promises = images.map((image, index) => {
    return new Promise((resolve, reject) => {
      image.canvas.toBlob((blob) => {
        if (blob) {
          zip.file(`${filename.replace('.zip', '')}_${String(index + 1).padStart(2, '0')}.png`, blob);
          resolve();
        } else {
          reject(new Error(`Failed to create blob for image ${index + 1}`));
        }
      }, 'image/png');
    });
  });

  await Promise.all(promises);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, filename);
}
