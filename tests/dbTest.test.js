import { expect as _expect } from 'chai';
import sequelize from './testDbConnection.js';
const expect = _expect;



describe('Database Connection Test', function() {
  it('should connect to the database successfully', function(done) {
    sequelize.authenticate()
      .then(() => {
        expect(true).to.be.true; // If this callback is reached, the promise resolved, so the connection was successful
        done();
      })
      .catch(err => {
        done(err); // Passing an error to done will make the test fail with the given error message
      });
  });
});
