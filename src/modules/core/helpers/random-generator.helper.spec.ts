import { RandomGeneratorHelper } from './random-generator.helper';

describe(`'random-generator.helper'`, () => {

  it(`should generate a 'random' value between 13 characters (unix timestamp len) and 16 characters`, () => {
    const sut = RandomGeneratorHelper.generateRandom();
    expect(sut.length >= 13 && sut.length <= 16);
  });

});
