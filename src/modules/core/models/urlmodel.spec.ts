import { UrlModel } from './url.model';

const testVariables = {
  validSimpleUrl: 'http://testurl.com',
  validComplexUrl: 'https://testurl.com:8080/path1/:id/path2?a=1&b=2&c={a:1}&d={"a":1,"b":"s"}',
  malformedUrl: 'abcdefghijklmopqrstuvwxyz'
};

describe('UrlModel', () => {

  let component: UrlModel;

  it('should create UrlModel empty instance', () => {
    const expected = { protocol: 'http', host: '', port: null, path: '', pathParams: {}, queryParams: {} };
    component = new UrlModel();
    expect(component).toEqual(expected);
  });

  it('should create UrlModel instance with a complex URL as input', () => {
    const expected = {
      protocol: 'https',
      host: 'testurl.com',
      port: 8080,
      path: 'path1/:id/path2',
      pathParams: {},
      queryParams: { a: '1', b: '2', c: '{a:1}', d: { a: 1, b: 's'} }
    };
    component = new UrlModel(testVariables.validComplexUrl);
    expect(component).toEqual(expected);
  });

  it('should create UrlModel instance with default values with a malformed URL as input', () => {
    const expected = { protocol: 'http', host: '', port: null, path: '', pathParams: {}, queryParams: {} };
    component = new UrlModel(testVariables.malformedUrl);
    expect(component).toEqual(expected);
  });

  it('should set protocol', () => {
    const expected = 'https';
    component = new UrlModel().setProtocol('https');
    expect((component as any).protocol).toBe(expected);
  });

  it('should set default protocol with invalid protocol', () => {
    const expected = 'http';
    component = new UrlModel().setProtocol('abcd');
    expect((component as any).protocol).toBe(expected);
  });

  it('should set empty host with empty host as input', () => {
    const expected = '';
    component = new UrlModel().setHost('');
    expect((component as any).host).toBe('');
  });

  it('should set host (without any start and end slash)', () => {
    const expected = 'testurl.com';
    component = new UrlModel().setHost('testurl.com');
    expect((component as any).host).toBe(expected);
  });

  it('should set empty port with empty port as input', () => {
    const expected = '';
    component = new UrlModel().setPort(null as any);
    expect((component as any).port).toBe(null);
  });

  it('should set port', () => {
    const expected = 8080;
    component = new UrlModel().setPort(8080);
    expect((component as any).port).toBe(expected);
  });

  it('should set path (without any start and end slash)', () => {
    const expected = 'path1/:id/path2';
    component = new UrlModel().setPath('/path1/:id/path2/');
    expect((component as any).path).toBe(expected);
  });

  it('should set path params', () => {
    const expected = { a: '1', b: '2', c: '3' };
    component = new UrlModel().setPathParams({ a: '1', b: '2', c: '3' });
    expect((component as any).pathParams).toEqual(expected);
  });

  it('should set query params', () => {
    const expected = { a: '1', b: '2', c: '3' };
    component = new UrlModel().setQueryParams({ a: '1', b: '2', c: '3' });
    expect((component as any).queryParams).toEqual(expected);
  });

  it('should return a valid url with a simple url as input', () => {
    const expected = 'http://testurl.com';
    component = new UrlModel(testVariables.validSimpleUrl);
    expect(component.buildUrl()).toBe(expected);
  });

  it('should return a valid url with a simple url as input', () => {
    const expected = 'https://testurl.com:8080/path1/abc/path2?a=1&b=2&c=%7Ba:1%7D&d=%7B%22a%22:1,%22b%22:%22s%22%7D';
    component = new UrlModel(testVariables.validComplexUrl).setPathParams({ id: 'abc' });
    expect(component.buildUrl()).toBe(expected);
  });


});
