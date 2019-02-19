const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

let server;


describe('/api/genres', () => {
    beforeEach( () => { server = require('../../index');  });
    afterEach(async () => { 
        await Genre.remove({});
        server.close();
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1'},
                { name: 'genre2'}
            ]);

            const res = await request(server).get('/api/genres');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });
    describe('GET /:id', () => {
        it('should return a genre if valid id is passed and it exists', async () => {
            const genre = new Genre( { name: 'genre1'});
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });
        it('should return a 404 if id passed is not valid', async () => {
            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);
        });
        it('should return a 404 if genre with valid id does not exist', async () => {
            const genre = new Genre( { name: 'genre1'});

            const res = await request(server).get('/api/genres/' + genre._id);

            expect(res.status).toBe(404);
        });
    });
    describe('POST /', () => {
        // Define the happy path, and then in each test, we change
        // on parameter that clearly aligns with the name of the 
        // test.
        let token;
        let name;

        const exec = async () => {
            return await request(server)
            .post('/api/genres')
            .set('X-auth-token', token)
            .send({ name }); //ES5 and earlier { name : name }
        }
        
        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1'
        });
        
        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });
        it('should return 400 if genre is less than 5 characters', async () => {
            name = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });
        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });
        it('should save the genre if it is valid', async () => {  
            await exec();

            const genre = await Genre.find({ name: 'genre1' });

            expect(genre).not.toBeNull();
        });
        it('should return the genre if it is valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
    describe('PUT /:id', () => {
        // Define the happy path, and then in each test, we change
        // on parameter that clearly aligns with the name of the 
        // test.
        let token;
        let name;
        let genre;
        let id;

        const exec = async () => {
            return await request(server)
            .put('/api/genres/' + id)
            .set('X-auth-token', token)
            .send({ name }); //ES5 and earlier { name : name }
        }
        
        beforeEach( async () => {
          // Before each test we need to create a genre and 
          // put it in the database.      
            name = 'genre1';
            genre = new Genre({ name });
            await genre.save();
      
            token = new User().generateAuthToken();     
            id = genre._id; 
        });
        
        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });
        it('should return 400 if genre is less than 5 characters', async () => {
            name = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });
        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });
        it('should return 404 if id is invalid', async () => {
            id = 1;
            console.log(genre);
      
            const res = await exec();
      
            expect(res.status).toBe(404);
        });   
        it('should return 404 if genre with the given id was not found', async () => {  
            id = mongoose.Types.ObjectId().toHexString();
            name = 'genre2'

            const res = await exec();

            expect(res.status).toBe(404);
        });
        it('should update the genre if input is valid', async () => {
            name = 'genre2'
            await exec();

            const updatedGenre = await Genre.findById(genre._id);

            expect(updatedGenre.name).toBe(name);
        });
        it('should return the updated genre if it is valid', async () => {
            name = 'genre2'
            const res = await exec();
      
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', name);
          });
    });
    describe('DELETE /:id', () => {
        // Define the happy path, and then in each test, we change
        // on parameter that clearly aligns with the name of the 
        // test.
        let token;
        let id;
        let genre;

        const exec = async () => {
            return await request(server)
            .delete('/api/genres/' + id)
            .set('X-auth-token', token)
            .send(); //ES5 and earlier { name : name }
        }
        
        beforeEach( async () => {
            // Before each test we need to create a genre and 
            // put it in the database.      
            genre = new Genre({ name: 'genre1' });
            await genre.save();
            
            id = genre._id; 
            token = new User({ isAdmin: true }).generateAuthToken(); 
        });
        
        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });
        it('should return 403 when user is not admin', async () => {
            token = new User( { isAdmin: false } ).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403);
        });
        it('should return 404 if id is invalid', async () => {
            id = 1; 
            
            const res = await exec();
      
            expect(res.status).toBe(404);
        });
        it('should return 404 if no genre with the given id was found', async () => {  
            id = mongoose.Types.ObjectId().toHexString();
            
            const res = await exec();

            expect(res.status).toBe(404);
        });
        it('should delete the genre if input is valid', async () => {
            await exec();
      
            const genreInDb = await Genre.findById(id);
      
            expect(genreInDb).toBeNull();
        });      
        it('should return the removed genre', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
});