const jwt = require('jsonwebtoken');
const {User, validateUser} = require('../../../models/user');
const config = require('config');
const mongoose = require('mongoose');

describe ('user.generateAuthToken', () => {
    // mockFunction.mockReturnValue(1);
    // mockFunction.mockResolvedValue(1);//async
    // mockFunction.mockRejectedValue(new Error('...'));//async
    // const result = await mockFunction();
    
    it('should return a valid JWT', () => {
        const payload = { 
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };

        const user = new User(payload);
        validateUser(user);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        
        expect(decoded).toMatchObject(payload); 
    });

});
