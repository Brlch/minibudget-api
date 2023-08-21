import { Sequelize } from 'sequelize';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';

const { expect } = chai;
chai.use(chaiHttp);

const sequelize = new Sequelize('minibudget', 'postgres', 'root', {
    host: 'localhost',
    dialect: 'postgres'
});

let userId;
let transactionId;
let token;

describe('Transactions API', () => {
    before(async () => {
        await sequelize.authenticate();

        // Register a user for the tests
        const uniqueUsername = 'testuser' + Date.now();
        const userResponse = await chai.request(app).post('/users').send({
            username: uniqueUsername,
            password: "password123"
        });
        userId = userResponse.body.id;

        // Login with the user's credentials to get the JWT token
        const loginResponse = await chai.request(app).post('/auth/login').send({
            username: uniqueUsername,
            password: "password123"
        });
        token = loginResponse.body.token;  // save the token for later use
    });

    after(async () => {
        // Cleanup: Delete the test user and associated transactions
        await chai.request(app).delete(`/users/${userId}`);
    });

    it('should POST a new transaction', (done) => {
        const transaction = {
            date: "2023-08-09T15:45:00.000Z",
            amount: 100,
            type: 'income',
            description: 'Test income',
            userId: userId // Link the transaction to the user
        };
        chai.request(app)
            .post('/transactions')
            .set('Authorization', `Bearer ${token}`)
            .send(transaction)
            .end((err, res) => {
                transactionId = res.body.id;
                expect(res).to.have.status(201);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('date');
                expect(res.body).to.have.property('amount');
                expect(res.body).to.have.property('userId', userId);
                done();
            });
    });

    it('should UPDATE the created transaction', (done) => {
        const updatedTransaction = {
            amount: 200,
            description: 'Updated Test income'
        };
        chai.request(app)
            .put(`/transactions/${transactionId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedTransaction)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message', 'Transaction updated successfully');
                done();
            });
    });

    it('should GET all transactions', (done) => {
        chai.request(app)
            .get('/transactions')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                done();
            });
    });

    it('should GET all transactions for a user', (done) => {
        chai.request(app)
            .get(`/transactions/user/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                res.body.forEach(transaction => {
                    expect(transaction.userId).to.equal(userId);
                });
                done();
            });
    });

    it('should DELETE the updated transaction', (done) => {
        chai.request(app)
            .delete(`/transactions/${transactionId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message', 'Transaction deleted successfully');
                done();
            });
    });

 
});
