// refactoring router and its handlers

const fs = require('fs');
const express = require('express');
// To build morgan middleware
// Morgan is HTTP request logger middleware
const morgan = require('morgan');

const app = express();

// 1.MIDDLEWARES
// To get the information about the request we did
app.use(morgan('dev'));

// express.json to get access for the request body on the request object
// use is used to add express.json() function to middleware stack
app.use(express.json());

// Defining new middleware
// This middleware will be applied every route, as we didn't specify any route
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  // next function is to move on to next middleware
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

// 2. ROUTE HANDLERS
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res
    .status(200)
    .json({
      status: 'success', 
      requestedAt: req.requestTime,
      results: tours.length,
      data: {tours: tours}
    });
}

const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1
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
}

const createTour = (req, res) => {
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
}

const updateTour = (req,res) => {
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
}

const deleteTour = (req,res) => {
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
}

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id/', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id',updateTour);
// app.delete('/api/v1/tours/:id',deleteTour);

// 3. ROUTES
app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour)

app
  .route('/api/v1/tours/:id/')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour)

// 4.SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
