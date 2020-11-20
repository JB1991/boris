import { ObjectIdPipe } from './object-id.pipe';

describe('Bodenrichtwert.Pipes.ObjectIdPipe', () => {
    let pipe: ObjectIdPipe;

    beforeEach(() => {
        pipe = new ObjectIdPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should transform "DENIBR4920UW0064" to "4920UW0064"', () => {
        expect(pipe.transform('DENIBR4920UW0064')).toEqual('4920UW0064');
    });

    it('should do nothing if the string is empty', () => {
        expect(pipe.transform('')).toEqual('');
    });

    it('should do nothing if the string is null', () => {
        expect(pipe.transform(null)).toEqual(null);
    });
});
