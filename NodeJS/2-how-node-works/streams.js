const fs = require('fs');
// Other way of creating new server
const server = require('http').createServer();

server.on('request',(req,res)=>{
  //solution 1  - This can be good for local applications but not for production.
  // fs.readFile('./starter/test-file.txt',(err,data) => {
  //   if(err) console.log('error');
  //   res.end(data);
  // });

//   //Solution2 - using streams
//   const readable = fs.createReadStream('./starter/test-file.txt')
//   // When there is new piece of data to comsume, readable stream emits the data event. so, we can listen to that event
//   readable.on('data', chunk => {
//     res.write(chunk);
//   });
//   //when all the data is read. end event
//   readable.on('end', () => {
//     console.log('end event');
//     res.end();
//   });
//   //error event
//   readable.on('error',err =>{
//     console.log(err);
//     res.statusCode = 500 ;
//     res.end('File not found!')
//   })
// 

// Solution3
// Readable stream is much much faster than sending the result as response writeable stream to the network.
// This problem is back pressure. 
  const readable = fs.createReadStream('./starter/test-file.txt');
  readable.pipe(res);
  //readableSource.pipe(writeableDest)  - works as this

});

server.listen(8000,'127.0.0.1',()=>{
  console.log('Listening...');
});