import { BodenartPipe } from './bodenart.pipe';

describe('BodenartPipe', () => {
    let pipe: BodenartPipe;

    beforeEach(() => {
        pipe = new BodenartPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return the correct value', () => {
        expect(pipe.transform('S')).toEqual('Sand');
        expect(pipe.transform('L,T')).toEqual('Lehm und Ton');
        expect(pipe.transform('L/T')).toEqual('Lehm auf Ton');
        expect(pipe.transform('L+T')).toEqual('Lehm mit Ton');
        expect(pipe.transform('LT')).toEqual('Schwerer Lehm');
        expect(pipe.transform('MoS')).toEqual('Moor, Sand');
        expect(pipe.transform('lSg')).toEqual('Lehmiger Sand mit starkem Steingehalt');
        expect(pipe.transform('S+LT')).toEqual('Sand mit schwerem Lehm');
    });

    it('should return undefined when there is no appropriate entry', () => {
        expect(pipe.transform('0')).toEqual('');
        expect(pipe.transform('test')).toEqual('');
        expect(pipe.transform('te,st')).toEqual('');
        expect(pipe.transform(',MoS,S')).toEqual('');
        expect(pipe.transform('S+T,L')).toEqual('');
    });
});
