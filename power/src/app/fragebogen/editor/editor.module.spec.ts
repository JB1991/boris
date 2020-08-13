import { EditorModule } from './editor.module';

describe('Fragebogen.Editor.EditorModule', () => {
    let editorModule: EditorModule;

    beforeEach(() => {
        editorModule = new EditorModule();
    });

    it('should create an instance', () => {
        expect(editorModule).toBeTruthy();
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
