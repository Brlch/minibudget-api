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

    // Test for POST a new user
    it('should POST a new user', (done) => {
        const user = {
            username: "testUser",
            password: "testPass123"  // In a real-world scenario, send a hashed password
        };
        chai.request(app)
            .post('/users')
            .send(user)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('username', user.username);
                createdUserId = res.body.id;
                done();
            });
    });

    // Test for GET a user by ID
    it('should GET the created user by ID', (done) => {
        chai.request(app)
            .get(`/users/${createdUserId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('username', 'testUser');
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
            .end((err, res) => {
                expect(res).to.have.status(200);
                // Optionally, add another request here to ensure the user no longer exists
                done();
            });
    });
});
