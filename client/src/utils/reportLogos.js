import logoImg3 from "../assets/img3.jpg?inline";
import logoImg2 from "../assets/img2.png?inline";
import logoImg1 from "../assets/img1.png?inline";

const splitDataUrl = (dataUrl) => {
  const commaIndex = dataUrl.indexOf(",");
  const meta = dataUrl.slice(0, commaIndex);
  const base64 = dataUrl.slice(commaIndex + 1);
  const extension = /image\/jpe?g/i.test(meta) ? "jpeg" : "png";
  return { base64, extension };
};

const logoImg3Split = splitDataUrl(logoImg3);
const logoImg2Split = splitDataUrl(logoImg2);
const logoImg1Split = splitDataUrl(logoImg1);

export const REPORT_LOGOS = [
  { dataUrl: logoImg3, jsPdfFormat: "JPEG", ...logoImg3Split, ratio: 559 / 314 },
  { dataUrl: logoImg1, jsPdfFormat: "PNG", ...logoImg1Split, ratio: 1280 / 668 },
  { dataUrl: logoImg2, jsPdfFormat: "PNG", ...logoImg2Split, ratio: 469 / 212 },
];

const EMU_PER_PIXEL = 9525;

export const addReportLogosToPdf = (doc, options = {}) => {
  const { x = 28, y = 16, height = 22, gap = 6 } = options;
  let cursor = x;

  REPORT_LOGOS.forEach((logo) => {
    const width = height * logo.ratio;
    try {
      doc.addImage(logo.dataUrl, logo.jsPdfFormat, cursor, y, width, height);
    } catch {
      // A malformed asset must not break the whole export.
    }
    cursor += width + gap;
  });

  return cursor - gap - x;
};

export const addReportLogosToWorksheet = (worksheet, options = {}) => {
  const { row = 0, col = 0, height = 22, gap = 6 } = options;
  let cursorPx = 0;

  REPORT_LOGOS.forEach((logo) => {
    const width = Math.round(height * logo.ratio);
    const imageId = worksheet.addImage({ base64: logo.base64, extension: logo.extension });
    worksheet.addImage(imageId, {
      tl: { col, row, colOff: Math.round(cursorPx * EMU_PER_PIXEL), rowOff: 0 },
      ext: { width, height },
      editAs: "oneCell",
    });
    cursorPx += width + gap;
  });

  return cursorPx - gap;
};