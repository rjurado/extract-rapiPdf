import marked from 'marked';
import htmlToPdfmake from 'html-to-pdfmake';
import { rowLinesTableLayout } from '@/table-layouts';
import {
  getTypeInfo,
  schemaInObjectNotation,
  objectToTree,
  objectToTableTree,
} from '@/object-tree-gen';

function markdownToPdfmake(markdown) {
  const html = marked(markdown);
  return htmlToPdfmake(html);
}

// Info Def
export function getInfoDef(spec, bookTitle, localize) {
  let content;
  if (spec.info) {
    let contactDef = [];
    let contactName;
    let contactEmail;
    let contactUrl;
    let termsOfService;

    if (spec.info.contact) {
      if (spec.info.contact.name) {
        contactName = { text: [{ text: `\n${localize.name}: `, style: ['b', 'small'] }, { text: spec.info.contact.name, style: ['small'] }] };
      }
      if (spec.info.contact.email) {
        contactEmail = { text: [{ text: `\n${localize.email}: `, style: ['b', 'small'] }, { text: spec.info.contact.email, style: ['small'] }] };
      }
      if (spec.info.contact.url) {
        contactUrl = { text: [{ text: `\n${localize.url}: `, style: ['b', 'small'] }, { text: spec.info.contact.url, style: ['small', 'blue'], link: spec.info.contact.url }] };
      }
      if (spec.info.termsOfService) {
        termsOfService = { text: [{ text: `\n${localize.termsOfService}: `, style: ['b', 'small'] }, { text: spec.info.termsOfService, style: ['small', 'blue'], link: spec.info.termsOfService }] };
      }
      contactDef = [
        { text: localize.contact, style: ['p', 'b', 'topMargin3'] },
        {
          text: [
            contactName,
            contactEmail,
            contactUrl,
            termsOfService,
          ],
        },
      ];
    }

    let specInfDescrMarkDef;
    if (spec.info.description) {
      specInfDescrMarkDef = {
        stack: markdownToPdfmake(spec.info.description),
        style: ['topMargin3'],
      };
    } else {
      specInfDescrMarkDef = '';
    }

    content = [
      { image: 'data:image/png;base64,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', style: ['right'], width: 150 },
      { text: bookTitle || localize.apiReference, style: ['h2', 'primary', 'right', 'b', 'topMargin1'] },
      (spec.info.title ? { text: spec.info.title, style: ['title', 'right'] } : ''),
      (spec.info.version ? { text: `${localize.apiVersion}: ${spec.info.version}`, style: ['p', 'b', 'right', 'alternate'] } : ''),
      specInfDescrMarkDef,
      ...contactDef,
      { text: '', pageBreak: 'after' },
    ];
  } else {
    content = [
      { text: bookTitle || localize.apiReference, style: ['h1', 'bold', 'primary', 'right', 'topMargin1'] },
      { text: '', pageBreak: 'after' },
    ];
  }
  return content;
}

// Security Def
export function getSecurityDef(spec, localize) {
  const content = [];
  if (spec.securitySchemes) {
    content.push({ text: localize.securityAndAuthentication, style: ['h3', 'b', 'primary', 'right', 'topMargin3'] });
    content.push({ text: localize.securitySchemes, style: ['b', 'tableMargin'] });
    const tableContent = [
      [{ text: localize.key, style: ['small', 'b'] }, { text: localize.type, style: ['small', 'b'] }, { text: localize.description, style: ['small', 'b'] }],
    ];
    for (const key in spec.securitySchemes) {
      tableContent.push([
        key,
        spec.securitySchemes[key].type + (spec.securitySchemes[key].scheme ? (`, ${spec.securitySchemes[key].scheme}`) : '') + (spec.securitySchemes[key].bearerFormat ? (`, ${spec.securitySchemes[key].bearerFormat}`) : ''),
        spec.securitySchemes[key].description ? spec.securitySchemes[key].description : '',
      ]);
    }

    content.push({
      table: {
        headerRows: 1,
        body: tableContent,
      },
      layout: rowLinesTableLayout,
      style: 'tableMargin',
      pageBreak: 'after',
    });
  }
  return content;
}

// Parameter Table
function getParameterTableDef(parameters, paramType, localize, includeExample = false) {
  // let filteredParams= parameters ? parameters.filter(param => param.in === paramType):[];
  if (parameters === undefined || parameters.length === 0) {
    return;
  }
  const tableContent = [
    [
      { text: localize.name, style: ['sub', 'b', 'alternate'] },
      { text: localize.type, style: ['sub', 'b', 'alternate'] },
      { text: includeExample ? localize.example : '', style: ['sub', 'b', 'alternate'] },
      { text: localize.description, style: ['sub', 'b', 'alternate'] },
    ],
  ];
  if (paramType === 'FORM DATA') {
    for (const paramName in parameters) {
      const param = parameters[paramName];
      let { type } = param;
      const format = param.format === 'binary' ? '(binary)' : '';
      if (type === 'array') {
        type = `array of ${param.items.type}`;
      }
      tableContent.push([
        { text: paramName, style: ['small', 'mono'] },
        { text: type + format, style: ['small', 'mono'] },
        { text: includeExample ? (param.example ? param.example : (param.examples && param.examples[0] ? param.examples[0] : '')) : '', style: ['small'], margin: [0, 2, 0, 0] },
        { text: param.description, style: ['small'], margin: [0, 2, 0, 0] },
      ]);
    }
  } else {
    parameters.map((param) => {
      const paramSchema = getTypeInfo(param.schema);
      tableContent.push([
        {
          text: [
            { text: param.required ? '*' : '', style: ['small', 'b', 'red', 'mono'] },
            { text: param.name, style: ['small', 'mono'] },
            (paramSchema.deprecated ? { text: `\n${localize.deprecated}`, style: ['small', 'red', 'b'] } : ''),
          ],
        },
        {
          stack: [
            { text: `${paramSchema.type === 'array' ? paramSchema.arrayType : (paramSchema.format ? paramSchema.format : paramSchema.type)}`, style: ['small', 'mono'] },
            (paramSchema.constrain ? { text: paramSchema.constrain, style: ['small', 'gray'] } : ''),
            (paramSchema.allowedValues ? {
              text: [
                { text: `${localize.allowed}: `, style: ['b', 'sub'] },
                { text: paramSchema.allowedValues, style: ['small', 'lightGray'] },
              ],
            } : ''
            ),
            (paramSchema.pattern ? { text: `${localize.pattern}: ${paramSchema.pattern}`, style: ['small', 'gray'] } : ''),
          ],
        },
        { text: includeExample ? (param.example ? param.example : (param.examples && param.examples[0] ? param.examples[0] : '')) : '', style: ['small'], margin: [0, 2, 0, 0] },
        { text: param.description, style: ['small'], margin: [0, 2, 0, 0] },
      ]);
    });
  }

  return [
    { text: `${paramType} ${localize.parameters}`.toUpperCase(), style: ['small', 'b'], margin: [0, 10, 0, 0] },
    {
      table: {
        headerRows: 1,
        dontBreakRows: true,
        widths: ['auto', 'auto', includeExample ? 'auto' : 0, '*'],
        body: tableContent,
      },
      layout: rowLinesTableLayout,
      style: 'tableMargin',
    },
  ];
}

// Request Body Def
function getRequestBodyDef(requestBody, schemaStyle, localize) {
  if (!requestBody) {
    return;
  }
  const content = [];
  let formParamDef;
  for (const contentType in requestBody.content) {
    const contentTypeObj = requestBody.content[contentType];
    const requestBodyDef = [
      { text: `${localize.requestBody} - ${contentType}`, margin: [0, 10, 0, 0], style: ['small', 'b'] },
    ];

    if ((contentType.includes('form') || contentType.includes('multipart-form')) && contentTypeObj.schema) {
      formParamDef = getParameterTableDef(contentTypeObj.schema.properties, 'FORM DATA', localize);
      content.push(formParamDef);
    } else if (contentType.includes('json') || contentType.includes('xml')) {
      let origSchema = requestBody.content[contentType].schema;
      if (origSchema) {
        origSchema = JSON.parse(JSON.stringify(origSchema));
        const schemaInObjectNotaion = schemaInObjectNotation(origSchema);

        if (schemaStyle === 'object') {
          let treeDef;
          if (schemaInObjectNotaion['::type'] && schemaInObjectNotaion['::type'] === 'array') {
            treeDef = objectToTree(schemaInObjectNotaion['::props'], localize, 'array');
          } else {
            treeDef = objectToTree(schemaInObjectNotaion, localize);
          }
          requestBodyDef.push(treeDef);
        } else {
          // if Schema Style is Tree
          let schemaTableTreeDef;
          if (schemaInObjectNotaion['::type'] && schemaInObjectNotaion['::type'] === 'array') {
            schemaTableTreeDef = objectToTableTree(schemaInObjectNotaion['::prop'], localize, 'array');
          } else {
            schemaTableTreeDef = objectToTableTree(schemaInObjectNotaion, localize);
          }
          if (schemaTableTreeDef && schemaTableTreeDef.length > 0 && Array.isArray(schemaTableTreeDef[0]) && schemaTableTreeDef[0].length > 0) {
            schemaTableTreeDef.unshift([
              { text: localize.name, style: ['sub', 'b', 'alternate'] },
              { text: localize.type, style: ['sub', 'b', 'alternate'] },
              { text: localize.description, style: ['sub', 'b', 'alternate'] },
            ]);

            requestBodyDef.push({
              table: {
                headerRows: 1,
                body: schemaTableTreeDef,
              },
              layout: rowLinesTableLayout,
              margin: [0, 3, 0, 0],
            });
          }
        }
      }
      content.push(requestBodyDef);
    }
  }
  return content;
}

// Response Def
function getResponseDef(responses, schemaStyle, localize) {
  const respDef = [];
  for (const statusCode in responses) {
    const allResponseDefs = [];
    for (const contentType in responses[statusCode].content) {
      const responseDef = [
        { text: `${localize.responseModel} - ${contentType}`, margin: [10, 10, 0, 0], style: ['small', 'b'] },
      ];

      let origSchema = responses[statusCode].content[contentType].schema;
      if (origSchema) {
        origSchema = JSON.parse(JSON.stringify(origSchema));
        const schemaInObjectNotaion = schemaInObjectNotation(origSchema);
        if (schemaStyle === 'object') {
          let schemaTreeDef;
          if (schemaInObjectNotaion['::type'] && schemaInObjectNotaion['::type'] === 'array') {
            schemaTreeDef = objectToTree(schemaInObjectNotaion['::props'], localize, 'array');
          } else {
            schemaTreeDef = objectToTree(schemaInObjectNotaion, localize);
          }
          if (Array.isArray(schemaTreeDef) && schemaTreeDef.length > 0) {
            schemaTreeDef[0].margin = [10, 5, 0, 0];
            responseDef.push(schemaTreeDef);
          }
        } else {
          // If Schema style is Table-Tree
          let schemaTableTreeDef;
          let rootObjectType;
          if (schemaInObjectNotaion['::type'] && schemaInObjectNotaion['::type'] === 'array') {
            schemaTableTreeDef = objectToTableTree(schemaInObjectNotaion['::props'], localize);
            rootObjectType = [{ text: 'ARRAY OF OBJECT WITH BELOW STRUCTURE', style: ['sub', 'b', 'alternate'], colSpan: 3 }];
          } else {
            schemaTableTreeDef = objectToTableTree(schemaInObjectNotaion, localize);
            rootObjectType = [{ text: 'OBJECT WITH BELOW STRUCTURE', style: ['sub', 'b', 'alternate'], colSpan: 3 }];
          }
          if (schemaTableTreeDef && schemaTableTreeDef.length > 0 && Array.isArray(schemaTableTreeDef[0]) && schemaTableTreeDef[0].length > 0) {
            schemaTableTreeDef.unshift(rootObjectType);
            schemaTableTreeDef.unshift([
              { text: localize.name, style: ['sub', 'b', 'alternate'] },
              { text: localize.type, style: ['sub', 'b', 'alternate'] },
              { text: localize.description, style: ['sub', 'b', 'alternate'] },
            ]);

            responseDef.push({
              table: {
                headerRows: 1,
                body: schemaTableTreeDef,
                dontBreakRows: true,
              },
              layout: rowLinesTableLayout,
              margin: [10, 3, 0, 0],
            });
          }
        }
      }
      allResponseDefs.push(responseDef);
    }
    respDef.push({
      text: [
        { text: `${localize.statusCode} - ${statusCode}: `, style: ['small', 'b'] },
        { text: responses[statusCode].description, style: ['small'] },
      ],
      margin: [0, 10, 0, 0],
    });
    if (allResponseDefs.length > 0) {
      respDef.push(allResponseDefs);
    }
  }
  return respDef;
}

// API details def
export function getApiDef(spec, filterPath, schemaStyle, localize, includeExample, includeApiList) {
  const content = [{ text: localize.api, style: ['h2', 'b'] }];
  let tagSeq = 0;

  spec.tags.map((tag) => {
    const operationContent = [];
    let pathSeq = 0;

    for (let j = 0; j < tag.paths.length; j++) {
      const path = tag.paths[j];
      if (filterPath.trim() !== '') {
        if (path.path.includes(filterPath) === false) {
          continue;
        }
      }
      pathSeq += 1;
      operationContent.push({
        text: `${tagSeq + 1}.${pathSeq} ${path.method.toUpperCase()} ${path.path}`,
        style: ['topMargin3', 'mono', 'p', 'primary', 'b'],
        tocItem: true,
        tocStyle: ['small', 'blue', 'mono'],
        tocNumberStyle: ['small', 'blue', 'mono'],
      });
      operationContent.push({ text: '', style: ['topMarginRegular'] });

      let pathSummaryMarkDef; let pathDescrMarkDef;
      if (path.summary) {
        pathSummaryMarkDef = {
          stack: markdownToPdfmake(path.summary),
          style: ['primary', 'b'],
        };
        operationContent.push(pathSummaryMarkDef);
      }
      if (path.description && path.description.trim() !== path.summary.trim()) {
        pathDescrMarkDef = {
          stack: markdownToPdfmake(path.description),
        };
        operationContent.push(pathDescrMarkDef);
      }

      // Generate Request Defs
      const requestSetDef = [];
      const pathParams = path.parameters ? path.parameters.filter((param) => param.in === 'path') : null;
      const queryParams = path.parameters ? path.parameters.filter((param) => param.in === 'query') : null;
      const headerParams = path.parameters ? path.parameters.filter((param) => param.in === 'header') : null;
      const cookieParams = path.parameters ? path.parameters.filter((param) => param.in === 'cookie') : null;

      const pathParamTableDef = getParameterTableDef(pathParams, 'path', localize, includeExample);
      const queryParamTableDef = getParameterTableDef(queryParams, 'query', localize, includeExample);
      const requestBodyTableDefs = getRequestBodyDef(path.requestBody, schemaStyle, localize, includeExample);
      const headerParamTableDef = getParameterTableDef(headerParams, 'header', localize, includeExample);
      const cookieParamTableDef = getParameterTableDef(cookieParams, 'cookie', localize, includeExample);
      operationContent.push({ text: localize.request, style: ['p', 'b', 'alternate'], margin: [0, 10, 0, 0] });
      if (pathParamTableDef || queryParamTableDef || headerParamTableDef || cookieParamTableDef || requestBodyTableDefs) {
        if (pathParamTableDef) {
          requestSetDef.push(pathParamTableDef);
        }
        if (queryParamTableDef) {
          requestSetDef.push(queryParamTableDef);
        }
        if (requestBodyTableDefs) {
          requestBodyTableDefs.map((v) => {
            requestSetDef.push(v);
          });
        }
        if (headerParamTableDef) {
          requestSetDef.push(headerParamTableDef);
        }
        if (cookieParamTableDef) {
          requestSetDef.push(cookieParamTableDef);
        }
      } else {
        requestSetDef.push({ text: localize.noRequestParameters, style: ['small', 'gray'], margin: [0, 5, 0, 0] });
      }
      if (requestSetDef && requestSetDef.length > 0) {
        operationContent.push({
          stack: requestSetDef,
          margin: [10, 0, 0, 0],
        });
      }

      // Generate Response Defs
      operationContent.push({ text: localize.response, style: ['p', 'b', 'alternate'], margin: [0, 10, 0, 0] });
      const respDef = getResponseDef(path.responses, schemaStyle, localize);
      if (respDef && respDef.length > 0) {
        operationContent.push({
          stack: respDef,
          margin: [10, 5, 0, 5],
        });
      }

      // End of Operation - Line (Except the last content)
      if (j === tag.paths.length - 1) {
        operationContent.push({
          canvas: [{
            type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 35, y2: 5, lineWidth: 0.5, lineColor: '#cccccc',
          }],
        });
      }
    }

    if (pathSeq > 0) {
      tagSeq += 1;
      let tagDescrMarkDef;
      if (tag.description) {
        tagDescrMarkDef = {
          stack: markdownToPdfmake(tag.description),
          style: ['topMarginRegular'],
        };
      } else {
        tagDescrMarkDef = { text: '' };
      }

      content.push(
        {
          text: `${tagSeq}. ${tag.name.toUpperCase()}`,
          style: ['h2', 'b', 'primary', 'tableMargin'],
          tocItem: true,
          tocStyle: ['small', 'b'],
          tocMargin: [0, 10, 0, 0],
        },
        tagDescrMarkDef,
        operationContent,
        { text: '', pageBreak: 'after' },
      );
    }
  });

  // Remove last page break if api list not included
  if (!includeApiList) {
    content.pop();
  }

  return content;
}


// API List Def
export function getApiListDef(spec, sectionHeading, localize) {
  const content = [{ text: sectionHeading, style: ['h3', 'b'], pageBreak: 'none' }];
  spec.tags.map((tag, i) => {
    const tableContent = [
      [{ text: localize.method, style: ['small', 'b'] }, { text: localize.api, style: ['small', 'b'] }],
    ];

    tag.paths.map((path) => {
      tableContent.push([
        { text: path.method, style: ['small', 'mono', 'right'] },
        {
          margin: [0, 0, 0, 2],
          stack: [
            { text: path.path, style: ['small', 'mono'] },
            { text: path.summary, style: ['small', 'gray'] },
          ],

        },
      ]);
    });

    content.push(
      { text: tag.name, style: ['h6', 'b', 'primary', 'tableMargin'], pageBreak: i === 0 ? 'none' : 'after' },
      { text: tag.description, style: ['p'] },
      {
        table: {
          headerRows: 1,
          dontBreakRows: true,
          widths: ['auto', '*'],
          body: tableContent,
        },
        layout: rowLinesTableLayout,
        style: 'tableMargin',
      },
    );
  });

  return content;
}
