import { expect as _expect } from 'chai';
const expect = _expect;

describe('Sample Test with Assertions', function() {
  it('should check if true is indeed true', function() {
    expect(true).to.be.true;
  });

  it('should check if an array contains certain values', function() {
    const arr = [1, 2, 3, 4, 5];
    expect(arr).to.include(2);
    expect(arr).to.not.include(7);
  });
});
