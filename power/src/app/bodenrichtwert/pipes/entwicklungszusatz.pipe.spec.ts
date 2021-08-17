import { EntwicklungszusatzPipe } from './entwicklungszusatz.pipe';

describe('EntwicklungszusatzPipe', () => {
    let pipe: EntwicklungszusatzPipe;

    beforeEach(() => {
        pipe = new EntwicklungszusatzPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return the correct value', () => {
        expect(pipe.transform('SU')).toEqual('Sanierungsunbeeinflusster Bodenrichtwert, ohne Berücksichtigung der rechtlichen und tatsächlichen Neuordnung');
    });
});
