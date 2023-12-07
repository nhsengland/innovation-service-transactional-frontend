export class RandomGeneratorHelper {
  static generateRandom = () => `${+new Date()}${Math.floor(Math.random() * 1000 + 1)}`;
}
