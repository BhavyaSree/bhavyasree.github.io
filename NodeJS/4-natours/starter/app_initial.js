const fs = require('fs');
const express = require('express');


// Express() add express methods to variable app
const app = express();

// middleware between request and response.
app.use(express.json())

// //routing means how application responds to certain client requests, for certail url and for certain http methods used for request
// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message :'Hello from the server side!', app:'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))
// route handler for GET request
app.get('/api/v1/tours', (req, res) => {
  res
    .status(200)
    .json({
      status: 'success', 
      results: tours.length,
      data: {tours: tours}
    });
});

// variables in the url are called parameters
// ? represents optional parameter
app.get('/api/v1/tours/:id/', (req, res) => {
  console.log(req.params);

  // Id is like string, so to convert string to number
  const id = req.params.id * 1
  // // To check whether id is available or not and assign the status code as per its presence
  // if(id>tours.length){
  //   return res
  //             .status(404)
  //             .json({
  //               status: 'fail',
  //               message: 'Invalid Id'
  //             });
  // }

  const tour = tours.find(el => el.id === id)

  if(!tour){
    return res
              .status(404)
              .json({
                status: 'fail',
                message: 'Invalid Id'
              });
  }

  res
    .status(200)
    .json({
      status: 'success',
      data: {tour}
    });
});


// route handler for POST request  -- Generally, req will have data in this case. Express doesn't put the data in request. For this, we need a middleware
// On using middleware, the data will be available on the body of req.
app.post('/api/v1/tours', (req, res) => {
  //console.log(req.body);

  const newId = tours[tours.length-1].id + 1;
  const newTour = Object.assign({ id: newId}, req.body);

  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
      res.status(201)
         .json({
           status: 'success',
           data: {tour: newTour}
         });
  });

});

// to update data
// with put, we receive the entire new object with the updated properties.
// With patch, we receive only updated properties on object
app.patch('/api/v1/tours/:id', (req,res) => {
  if(req.params.id * 1 > tours.length){
    return res
              .status(404)
              .json({
                status: 'fail',
                message: 'Invalid Id'
              });
  }
  res
      .status(200)
      .json({
        status: 'success',
        data: {
          tour: '<updated tour here..>'
        }
      });
});

app.delete('/api/v1/tours/:id', (req,res) => {
  if(req.params.id * 1 > tours.length){
    return res
              .status(404)
              .json({
                status: 'fail',
                message: 'Invalid Id'
              });
  }
  res
      .status(204)
      .json({
        status: 'success',
        data: null
      });
});



// to start a server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});



