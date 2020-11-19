import { VerfahrensartPipe } from './verfahrensart.pipe';

describe('VerfahrensartPipe', () => {
    let pipe: VerfahrensartPipe;

    beforeEach(() => {
        pipe = new VerfahrensartPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return the correct value', () => {
        expect(pipe.transform('San')).toEqual('Sanierungsgebiet');
    });

    it('should return undefined when there is no appropriate entry', () => {
        expect(pipe.transform('NULL')).toEqual(undefined);
    });
});
