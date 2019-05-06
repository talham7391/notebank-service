import { scaleToFitWithin } from 'utils/document';

export class PDF {
  pdf = null;

  load = async url => {
    const doc = pdfjsLib.getDocument(url);
    this.pdf = await doc.promise;
  };

  getPageCount = _ => this.pdf && this.pdf.numPages;

  getPage = async num => {
    if (0 < num && num <= this.getPageCount()) {
      return await this.pdf.getPage(num);
    }
    return null;
  };

  renderPageToCanvas = async (canvas, pageNumber, scale) => {
    const page = await this.getPage(pageNumber);

    const viewport = page.getViewport({scale});
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const canvasContext = canvas.getContext('2d');
    const renderContext = {
      canvasContext,
      viewport,
    };
    const render = page.render(renderContext);
    await render.promise;
  };

  renderToCanvasWithFit = async (canvas, options) => {
    const defaults = {
      width: 300,
      height: 300,
    };
    const opt = {...defaults, ...options};

    const canvasContext = canvas.getContext('2d');
    const page = await this.getPage(1);

    let viewport = page.getViewport({scale: 1});
    const size = scaleToFitWithin({
      width: opt.width,
      height: opt.height,
    },{
      width: viewport.width,
      height: viewport.height,
    });
    let scale = null;
    if (size.width > size.height) {
      scale = size.width / viewport.width;
    } else {
      scale = size.height / viewport.height;
    }
    viewport = page.getViewport({scale});

    canvasContext.width = viewport.width;
    canvasContext.height = viewport.height;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
      canvasContext,
      viewport,
    };
    page.render(renderContext);  
    return size;
  };
};