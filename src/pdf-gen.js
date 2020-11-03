import pdfMake from 'pdfmake/build/pdfmake.min';
import pdfFonts from '@/vfs_fonts';
// import pdfFonts from "pdfmake/build/vfs_fonts";

import ProcessSpec from '@/spec-parser';
import {
  getInfoDef, getSecurityDef, getApiDef, getApiListDef,
} from '@/pdf-parts-gen';

export default async function createPdf(specUrl, options) {
  const parsedSpec = await ProcessSpec(specUrl, options.pdfSortTags);

  const pdfStyles = {
    title: { fontSize: 32 },
    h1: { fontSize: 22 },
    h2: { fontSize: 20 },
    h3: { fontSize: 18 },
    h4: { fontSize: 16 },
    h5: { fontSize: 14 },
    h6: { fontSize: 12, bold: true },
    p: { fontSize: 12 },
    small: { fontSize: 10 },
    sub: { fontSize: 8 },
    right: { alignment: 'right' },
    left: { alignment: 'left' },
    topMargin1: { margin: [0, 180, 0, 10] },
    topMargin2: { margin: [0, 60, 0, 5] },
    topMargin3: { margin: [0, 20, 0, 3] },
    topMargin4: { margin: [0, 15, 0, 3] },
    topMarginRegular: { margin: [0, 3, 0, 0] },
    tableMargin: { margin: [0, 5, 0, 15] },
    b: { bold: true },
    i: { italics: true },
    primary: { color: (options.pdfPrimaryColor ? options.pdfPrimaryColor : '#b44646') },
    alternate: { color: (options.pdfAlternateColor ? options.pdfAlternateColor : '#005b96') },
    gray: { color: 'gray' },
    lightGray: { color: '#aaaaaa' },
    darkGray: { color: '#666666' },
    red: { color: 'orangered' },
    blue: { color: '#005b96' },
    mono: { font: 'RobotoMono', fontSize: 10 },
  };

  const allContent = [];
  let infoDef = {};
  let tocDef = {};
  let securityDef = {};
  let apiListDef = {};
  let apiDef = {};

  if (options.includeInfo) {
    infoDef = getInfoDef(parsedSpec, options.pdfTitle, options.localize);
    allContent.push(infoDef);
  }
  if (options.includeToc) {
    tocDef = {
      toc: {
        title: { text: options.localize.index, style: ['b', 'h2'] },
        numberStyle: { bold: true },
        style: ['small'],
      },
      pageBreak: 'after',
    };
    // allContent.push({text:'', pageBreak:'after'});
    allContent.push(tocDef);
  }
  if (options.includeSecurity) {
    securityDef = getSecurityDef(parsedSpec, options.localize);
    allContent.push(securityDef);
  }
  if (options.includeApiDetails) {
    apiDef = getApiDef(parsedSpec, '', options.pdfSchemaStyle, options.localize, options.includeExample, options.includeApiList);
    allContent.push(apiDef);
  }
  if (options.includeApiList) {
    apiListDef = getApiListDef(parsedSpec, options.localize.apiList, options.localize);
    allContent.push(apiListDef);
  }

  const finalDocDef = {
    footer(currentPage, pageCount) {
      const f = {
        margin: 10,
        columns: [
          { image: 'data:image/png;base64,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', style: ['left'], width: 64 },
          { text: options.pdfFooterText, style: ['sub', 'gray', 'left'] },
          { text: `${currentPage} of ${pageCount}`, style: ['sub', 'gray', 'right'] },
        ],
      };
      if (currentPage > 1) {
        return f;
      }
      return {};
    },
    content: allContent,
    styles: pdfStyles,
  };


  pdfMake.fonts = {
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf',
      italics: 'Roboto-Italic.ttf',
      bolditalics: 'Roboto-Medium.ttf',
    },
    RobotoMono: {
      normal: 'RobotoMono-Regular.ttf',
      bold: 'RobotoMono-Regular.ttf',
      italics: 'RobotoMono-Regular.ttf',
      bolditalics: 'RobotoMono-Regular.ttf',
    },

  };
  // pdfMake.vfs = pdfFonts.pdfMake.vfs;
  pdfMake.vfs = pdfFonts;
  pdfMake.createPdf(finalDocDef).open();
}
