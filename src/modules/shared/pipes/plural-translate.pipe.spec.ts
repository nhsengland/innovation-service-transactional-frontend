import { PluralTranslatePipe } from './plural-translate.pipe';

describe('Shared/Pipes/PluralTranslatePipe', () => {

  const pipe = new PluralTranslatePipe();

  it('should return NONE key with undefined number', () => {
    expect(pipe.transform('translation.key')).toBe('translation.key.none');
  });

  it('should return NONE key with null number', () => {
    expect(pipe.transform('translation.key', null)).toBe('translation.key.none');
  });

  it('should return NONE key with 0 items', () => {
    expect(pipe.transform('translation.key', 0)).toBe('translation.key.none');
  });


  it('should return NONE key with 1 item', () => {
    expect(pipe.transform('translation.key', 1)).toBe('translation.key.singular');
  });


  it('should return NONE key with more than 1 items', () => {
    expect(pipe.transform('translation.key', 2)).toBe('translation.key.plural');
  });

});
