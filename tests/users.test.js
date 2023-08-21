import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';
import { Sequelize } from 'sequelize';

const { expect } = chai;
chai.use(chaiHttp);

const sequelize = new Sequelize('minibudget', 'postgres', 'root', {
    host: 'localhost',
    dialect: 'postgres'
});


describe('Users API', () => {

    beforeEach(async () => {
        sequelize.authenticate();
        // Set up database state, e.g., add test data
    });

    let createdUserId;  // Store the ID of the created user for subsequent tests
    let testUsername;   // Store the username for later tests
    let token;
    // Test for POST a new user
    it('should POST a new user', (done) => {
        testUsername = "testUser" + Date.now();  // Make username unique/dynamic
        const user = {
            username: testUsername,
            password: "testPass123"
        };
        chai.request(app)
            .post('/users')
            .send(user)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('username', testUsername); // Use the dynamic username here
                createdUserId = res.body.id;
                done();
            });
    });

    it('should Login a new user', (done) => {
        const userCredentials = {  // these are login credentials
            username: testUsername,  // this should already be defined and created from the previous registration test
            password: "testPass123"
        };
        chai.request(app)
            .post('/auth/login')  // I'm assuming this is the correct endpoint
            .send(userCredentials)
            .end((err, res) => {
                expect(res).to.have.status(200); // 200 OK is the typical response for successful login
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('token');  // expect a token in response
    
                token = res.body.token;  // save the token for later use in other tests
    
                done();
            });
    });

    // Test for GET a user by ID
    it('should GET the created user by ID', (done) => {
        chai.request(app)
            .get(`/users/${createdUserId}`)
            .set('Authorization', `Bearer ${token}`)  // add the token to the request headers
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('username', testUsername);
                done();
            });
    });

    // Test for UPDATE user details
    it('should UPDATE the created user\'s details', (done) => {
        const updatedData = {
            username: "updatedUser"
        };
        chai.request(app)
            .put(`/users/${createdUserId}`)
            .set('Authorization', `Bearer ${token}`)  // add the token to the request headers
            .send(updatedData)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message', 'User updated successfully');
                done();
            });
    });


    // Test for DELETE the created user
    it('should DELETE the created user', (done) => {
        chai.request(app)
            .delete(`/users/${createdUserId}`)
            .set('Authorization', `Bearer ${token}`)  // add the token to the request headers
            .end((err, res) => {
                expect(res).to.have.status(200);
                // Optionally, add another request here to ensure the user no longer exists
                done();
            });
    });
});
