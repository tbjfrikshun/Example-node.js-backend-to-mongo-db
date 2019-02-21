const Joi = require('joi');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const {Rental} = require('../models/rental');
const {Movie} = require('../models/movie');
const express = require('express');
const router = express.Router();

function validateReturn(req) {
  const schema = {
      customerId: Joi.objectId().required(),
      movieId: Joi.objectId().required()
  };
  return Joi.validate(req, schema);
}

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
  const rentalInDb = await Rental.lookup(req.body.customerId,
                                     req.body.movieId);
  
  if(!rentalInDb) return res.status(404).send('Rental not found');

  if(rentalInDb.dateReturned)
    return res.status(400).send('Return already processed');
  
  rentalInDb.return();
  await rentalInDb.save();

  await Movie.update( { _id: req.body.movieId }, {
    $inc: { numberInStock: 1 }
  });

  return res.send(rentalInDb);  
});


module.exports = router; 