const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator'); //validator library

// Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      // Built-in validators
      maxlength: [40, 'A name must have less than or equal to 40 characters'],
      minlength: [10, 'A name must have more than or equal to 40 characters'],
      // isAplha is not accepting spaces too, so we won't be uisng it.. just keep it as reference
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour should have a difficulty'],
      // Built-in validators
      // enum-enumerated type i.e., with only specific values
      // enum is only for strings
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      // Built-in validators
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      // Custom validator
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation only.
          return val < this.price; // 100 < 200, then true
          // for false, it returns a validation error
        },
        // ({VALUE}) is from mongoose
        message: 'Discount price ({VALUE}) should be below the regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour nust have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // to permanently hide this from the output
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// To convert duration of days to weeks
// There is no point in storing the duration both in days and weeks in the database.
// Therefore, we are processing that through code using VIRTUAL PROPERTIES
// When we want to use this keyword, we need to use normal regular function
// In this case, we need to this, as this indicates the current document
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE -- runs before or after .save() and .create()
//pre middleware that runs before the actual event, in this case save event
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// for reference
// // just to check two pre middlewares with next
// tourSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE -- runs before or after a query execution
// To execute this query for all the commands that start with find
// this points to current query
tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// AGGREGATE MIDDLEWARE -- (tour stats)
// this points to current aggregation object
// unshift to add at the beginning of array, shift to add the end of array
// pipeline function gives the array
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

//Creating a model from schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// For types of middlewares in mongoose -- document, query, aggregate, model middlewares
// Document middleware - middleware that acts on currently processed document.
