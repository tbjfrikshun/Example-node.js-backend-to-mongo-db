const moment = require('moment');
const {Rental, validateRental} = require('../../models/rental');
const {Movie, validateMovie} = require('../../models/movie');
const {User} = require('../../models/user');
const request = require('supertest');
const mongoose = require('mongoose');


describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let movie;
    let rental;
    let token;
    
    beforeEach(async () => { 
        server = require('../../index');  
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: { name: '12345' },
            numberInStock: 10
        });
        validateMovie(movie);
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                genre: '12345',
                numberInStock: 10,
                dailyRentalRate: 2
            }
        });
        validateRental(rental);
        await rental.save();
    });
    afterEach(async () => { 
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
    });
    const exec = () => {
        return request(server)
        .post('/api/returns')
        .set('X-auth-token', token)
        .send({ customerId, movieId });
    }
    it('should return 401 unauthorized if client is not logged in', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });
    it('should return 400 bad request if customerId is not provided', async () => {
        customerId = '';

        const res = await exec();
        
        expect(res.status).toBe(400);
    });
    it('should return 400 bad request if movieId is not provided', async () => {
        movieId = '';

        const res = await exec();
        
        expect(res.status).toBe(400);
    });
    it('should return 404 not found if no rental for customerID, movieId found', async () => {
        await Rental.remove({});

        const res = await exec();
        
        expect(res.status).toBe(404);
    });
    it('should return 400 bad request if rental already processed', async () => {
        rental.dateReturned = new Date();
        await rental.save();
    
        const res = await exec();
        
        expect(res.status).toBe(400);
    });
    it('should Return 200 for valid request', async () => {
        const res = await exec();
       
        expect(res.status).toBe(200);
    });
    it('should set Rental return date correctly for valid request', async () => {
        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);
    });
    it('should calculate the rental fee correctly for valid request', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(14);
    });
    it('should bump up the stock in Movies by one for valid request', async () => {
        const res = await exec();

        const movieInDb = await Movie.findById(movie._id);
        expect(movieInDb.numberInStock)
            .toBe(movie.numberInStock + 1);
    });
    it('should return the rental in the body of the response ', async () => {
        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned', 
                'rentalFee', 'customer', 'movie']));
    });
});