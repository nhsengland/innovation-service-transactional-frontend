import { JoinArrayPipe } from './join-array.pipe';

describe('shared / pipes / JoinArrayPipe', () => {
  const pipe = new JoinArrayPipe();
  const input = ['item 1', 'item 2', 'item 3'];

  it('should return a string separated by ", " by default', () => {
    const result = pipe.transform(input);
    expect(result).toBe('item 1, item 2, item 3');
  });

  it('should return a string separated by " | " if passed', () => {
    const result = pipe.transform(input, ' | ');
    expect(result).toBe('item 1 | item 2 | item 3');
  });
});
