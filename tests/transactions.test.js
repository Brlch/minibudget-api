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

describe('Transactions API', () => {
    before(async () => {
        await sequelize.authenticate();

        // Create a user for the tests
        const uniqueUsername = 'testuser' + Date.now();
        const userResponse = await chai.request(app).post('/users').send({
            username: uniqueUsername,
            password: "password123"
        });
        userId = userResponse.body.id;
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
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                done();
            });
    });

    it('should GET all transactions for a user', (done) => {
        chai.request(app)
            .get(`/transactions/user/${userId}`)
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
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message', 'Transaction deleted successfully');
                done();
            });
    });

 
});
