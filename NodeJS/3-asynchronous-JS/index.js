const fs = require('fs');
const superagent = require('superagent');

// This is to return a promise
const readFilePro = file => {
  return new Promise((resolve,reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('I could not find that file');
      resolve(data);  // data is the value that promise returns

    });
  });
};

const writeFilePro = (file,data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, err => {
      if (err) reject ('could not return the file');
      resolve('success');
    });
  });
};

// fs.readFile(`${__dirname}/starter/dog.txt`, (err,data) => {
//   console.log(`Breed: ${data}`);

//   // Using superagent npm module to fetch data from API
//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .end((err,res) => {
//       if(err) return console.log(err);
//       console.log(res.body.message);

//       fs.writeFile('./starter/dog-img.txt', res.body.message, err => {
//         if(err) return console.log(err);
//         console.log('Random dog image saved to file');
//     });
//   });
// });

// nested callbacks will become difficult for understanding and maintenance. 
// This is called callback Hell.

// we will promises to make our code easier to understand and to maintain.

//superagent library has support for promises out of the box. So, we can consume them
// For Node functions, coming from node packages like read file, we have to build the promises.
// Promise basically implements the concept of future value.

// In beginning promise is a pending promise, when it gets data, it is a resolved promise
// Resolved promise doesn't mean sucess, that can be error too..

// Consuming promises
// fs.readFile(`${__dirname}/starter/dog.txt`, (err,data) => {
//   console.log(`Breed: ${data}`);

//   // Using superagent npm module to fetch data from API
//   superagent
//     // In this case, get method returns a promise
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     // For a fulfilled promise
//     .then(res => { 
//       if(err) return console.log(err);
//       console.log(res.body.message);

//       fs.writeFile('./starter/dog-img.txt', res.body.message, err => {
//         if(err) return console.log(err);
//         console.log('Random dog image saved to file');
//       });
//   })
//   // catching the error in fulfilled promise, if any
//   .catch(err => {
//     console.log(err.message);
//   })
// });
/*
// Building promises
// readFilePro function returning the promise
readFilePro(`${__dirname}/starter/dog.txt`)
  .then(data => {
    console.log(`Breed: ${data}`);
    return superagent .get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then(res => { 
    console.log(res.body.message);
    return writeFilePro('./starter/dog-img.txt',res.body.message)
  })
  .then(() => {
    console.log('Random dog image saved to file!')
  })
  .catch(err => {
    console.log(err.message);
  });
*/

// Async/Await
// We can only use await once inside async function
// const getDogPic = async () => {
//   try {
//     // we await for file read
//     // once the file is read, then the data is stored in constant data.
//     const data = await readFilePro(`${__dirname}/starter/dog.txt`);
//     console.log(`Breed: ${data}`);

//     const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//     console.log(res.body.message);

//     await writeFilePro('./starter/dog-img.txt',res.body.message);
//     console.log('Random dog image saved to file!');
//   }
//   catch (err) {
//     console.log(err);
//   }
// };

// getDogPic();


// To unnderstand how async function works, just adding console logs
const getDogPic = async () => {
  try {
    // we await for file read
    // once the file is read, then the data is stored in constant data.
    const data = await readFilePro(`${__dirname}/starter/dog.txt`);
    console.log(`Breed: ${data}`);

    /*const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    console.log(res.body.message);*/
    // run multiple promises at the same time
    const res1Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    const res2Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    const res3Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);

    const all = await Promise.all([res1Pro,res2Pro,res3Pro]);
    const imgs = all.map( el => el.body.message);
    console.log(imgs);

    //await writeFilePro('./starter/dog-img.txt',res.body.message);
    await writeFilePro('./starter/dog-img.txt',imgs.join('\n'));
    console.log('Random dog image saved to file!');
  }
  catch (err) {
    console.log(err);
    throw(err);
  }
  return '2. Ready'
};

(async () => {
  try {
    console.log('1. will get dog pics!');
    const x = await getDogPic();
    console.log(x);
    console.log('3. Done getting dog pics!');
  }
  catch(err) {
    console.log('ERROR');
  }
})();

/*
console.log('1. will get dog pics!');
// async function returns the promise automatically
getDogPic().then (x =>{
  console.log(x);
  console.log('3. Done getting dog pics!');
}).catch(err => {
  console.log('ERROR');
})
*/
