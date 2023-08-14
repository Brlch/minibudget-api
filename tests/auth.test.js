import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';

const { expect } = chai;
chai.use(chaiHttp);

let testUserId;

describe('Authentication API', () => {
    before(async () => {
        // Create a unique username for the test user
        const uniqueUsername = 'testuser' + Date.now();

        // Create a user for the tests
        const userResponse = await chai.request(app).post('/users').send({
            username: uniqueUsername,
            password: 'password123'
        });
        testUserId = userResponse.body.id;
    });

    after(async () => {
        // Cleanup: Delete the test user
        await chai.request(app).delete(`/users/${testUserId}`);
    });

    it('should login a user and return a token', (done) => {
        const userCredentials = {
            username: testUserId,  // Use the unique username set in the before block
            password: 'password123'
        };

        chai.request(app)
            .post('auth/login')
            .send(userCredentials)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('token');
                done();
            });
    });

    // You can add more tests, like testing with wrong credentials, etc.
});
