
const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();

// In order to change the thread pool size
process.env.UV_THREADPOOL_SIZE = 1;
// Based on this size, the time taken by crypto operation differs


setTimeout(() => console.log("Timer 1 finished"),0);
setImmediate(() => console.log("Immediate one finished"));

fs.readFile('test-file.txt', () =>{
  console.log('I/O Finished')
  console.log('---------------')

  setTimeout(() => console.log("Timer 2 finished"),0);
  setTimeout(() => console.log("Timer 3 finished"),3000);
  setImmediate(() => console.log("Immediate 2 finished"));


  process.nextTick(() => console.log('Process next tick'));
// as we have four threads in thread pool, all four activities take approximately same time.

  // sync version of the function
  // This blocks the operation and all callbacks occurs after this occurs
  crypto.pbkdf2Sync('password','salt', 100000, 1024, 'sha512');
    console.log(Date.now() -start, "password encrypted");

  crypto.pbkdf2('password','salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() -start, "password encrypted");
  });

  crypto.pbkdf2('password','salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() -start, "password encrypted");
  });

  crypto.pbkdf2('password','salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() -start, "password encrypted");
  });
});

console.log("Hello from the top level code");