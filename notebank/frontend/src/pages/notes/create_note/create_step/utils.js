import { PDF } from 'utils/document/pdf';

export const getProgressStatus = (idx, currentStep, progress) => {
  if (progress !== 100 && idx === currentStep) {
    return 'active';
  }
  return undefined;
};

export const blurFile = async file => {
  if (file.type === 'application/pdf') {
    return await blurPDF(file);
  } else {
    return await blurImage(file);
  }
};

export const blurPDF = async pdfFile => {
  const pdf = new PDF();
  await pdf.load(pdfFile.url);

  const urls = [];
  const pageCount = pdf.getPageCount();
  for (let i = 0; i < pageCount; i++) {
    const canvas = document.createElement('canvas');
    await pdf.renderPageToCanvas(canvas, i + 1, 0.1);
    const url = canvas.toDataURL();
    urls.push(url);
  }

  return urls;
};

export const blurImage = async imageFile => {
  const img = document.createElement('img');
  img.src = imageFile.url;
  await new Promise((res, rej) => {
    img.onload = res;
  });
  
  const canvas = document.createElement('canvas');
  canvas.width = img.width * 0.1;
  canvas.height = img.height * 0.1;
  const context = canvas.getContext('2d');
  context.drawImage(img, 0, 0, img.width * 0.1, img.height * 0.1);

  const url = canvas.toDataURL();
  return [url];
};

export const changeExtensionToPng = fileName => {
  const chunks = fileName.split('.');
  const newName = [];
  for (let i = 0; i < chunks.length - 1; i++) {
    newName.push(chunks[i]);
  }
  newName.push('png');
  return newName.join('.');
};