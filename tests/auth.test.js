import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';
import sequelize from './testDbConnection.js';

const { expect } = chai;
chai.use(chaiHttp);

let testUserId;
let testUsername;



describe('Authentication API', () => {
    before(async () => {
        await sequelize.authenticate();
        // Create a unique username for the test user
        const uniqueUsername = 'testuser' + Date.now();

        // Create a user for the tests
        const userResponse = await chai.request(app).post('/users').send({
            username: uniqueUsername,
            password: 'password123'
        });
        testUsername = uniqueUsername;
        testUserId = userResponse.body.id;
    });

    after(async () => {
        // Cleanup: Delete the test user
        await chai.request(app).delete(`/users/${testUserId}`);
    });


    it('should login a user and return a token', (done) => {
        const userCredentials = {
            username: testUsername,  // Use the unique username set in the before block
            password: 'password123'
        };

        chai.request(app)
            .post('/auth/login')
            .send(userCredentials)
            .end((err, res) => {
                console.log("Test:");
                console.log(err);
                console.log(res);
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('token');
                done();
            });
    });

    it('should not login a non-existent user', (done) => {
        const userCredentials = {
            username: 'nonExistentUser',
            password: 'randomPassword'
        };

        chai.request(app)
            .post('/auth/login')
            .send(userCredentials)
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('error', 'Authentication failed. User not found.');
                done();
            });
    });

    it('should not login with an incorrect password', (done) => {
        const userCredentials = {
            username: testUsername,
            password: 'incorrectPassword'
        };

        chai.request(app)
            .post('/auth/login')
            .send(userCredentials)
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('error', 'Authentication failed. Password is incorrect.');
                done();
            });
    });

    it('should not login with missing credentials', (done) => {
        chai.request(app)
            .post('/auth/login')
            .send({})
            .end((err, res) => {
                expect(res).to.have.status(500); 
                done();
            });
    });
});
