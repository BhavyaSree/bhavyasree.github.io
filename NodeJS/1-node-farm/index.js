const fs = require('fs');
// for network capabailities and to build http server
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

/////////////////////////////////////////////////////////////////////////////////////////////////////////
////// FILES

// Blocking, Synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8') ;
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut)

// console.log("File Written!");

// Non-Blocking, Asynchronous way
//fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//  if(err) return console.log('ERROR!');
//  fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//   console.log(data2);
//      fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//        console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`,'utf-8', err => {
//          console.log("Your file has been written!");
//        });
//    });
//  });
//});

//console.log("will read file!");

/////////////////////////////////////////////////////////////////////////////////////////////////////////
////// SERVER

// we use sybchronous, as this code will be only executed once.
//./ indicates where script is running, __dirname indicates while current file located
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
// We can place slugs in package json and call them for url

const server = http.createServer((req, res) => {
  //console.log(req.url);
  //console.log(url.parse(req.url, true));
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  }

  // Product page
  else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }

  // API
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  }

  // Not Found
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'Hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Lstening to request on port 8000');
});
