import { HyphenatePipe } from './hyphenate.pipe';

describe('Bodenrichtwert.Pipes.HyphenatePipe', () => {
  let pipe: HyphenatePipe;

  beforeEach(() => {
    pipe = new HyphenatePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should hyphenate a string', () => {
    expect(pipe.transform('Wohnung')).toEqual('Woh\u00ADnung');
  });

  it('should do nothing if the string is empty', () => {
    expect(pipe.transform('')).toEqual('');
  });
});
