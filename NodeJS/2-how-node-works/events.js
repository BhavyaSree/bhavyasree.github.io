const EventEmitter = require('events');
const http = require('http');

//After inherits the class, we build a object for the new class
//const myEmitter = new EventEmitter();

// Best practice to create a class that inherits from node listener.
class Sales extends EventEmitter{
  constructor(){
    super();

  }
}

const myEmitter = new Sales();

//Event listner for 'newSale' event
myEmitter.on('newSale',() => {
  console.log('There was a new sale!');
})

myEmitter.on('newSale',() => {
  console.log('One more listener for newSale');
})

// We can pass a parameter for event listener through emitter
myEmitter.on('newSale', stock => {
  console.log(`There are now ${stock} items left in stock`);
});

//emit is like if we are clicking on button
//emited the event with 9 as parameter
myEmitter.emit('newSale', 9);

//////////////////////////////////////////////////////////////////////////////////////////

const server = http.createServer();

server.on('request', (req,res) => {
  console.log('Request Received');
  console.log(req.url);
  res.end('Request Received');
});

server.on('request', (req,res) => {
  console.log('Another Request');
});

server.on('close', () => {
  console.log('Server Closed');
});

server.listen(8000, '127.0.0.1', ()=>{
  console.log('Waiting for the request');
});
