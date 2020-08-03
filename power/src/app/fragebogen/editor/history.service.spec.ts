import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HistoryService } from './history.service';
import { StorageService } from './storage.service';

describe('Fragebogen.Editor.HistoryService', () => {
  let service: HistoryService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        StorageService
      ]
    });
    spyOn(console, 'log');
    service = TestBed.inject(HistoryService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.undoBuffer.length).toEqual(0);
  });

  it('should make history', () => {
    // add one element
    service.makeHistory({x: 0});
    expect(service.undoBuffer[0]).toEqual('{"x":0}');
    expect(service.undoBuffer.length).toEqual(1);

    // add second element
    service.makeHistory({x: 1}, false);
    expect(service.undoBuffer[1]).toEqual('{"x":1}');
    expect(service.undoBuffer.length).toEqual(2);

    // make array full
    service.makeHistory({x: 2});
    service.makeHistory({x: 3});
    service.makeHistory({x: 4});
    service.makeHistory({x: 5});
    service.makeHistory({x: 6});
    service.makeHistory({x: 7});
    service.makeHistory({x: 8});
    service.makeHistory({x: 9});
    expect(service.undoBuffer[9]).toEqual('{"x":9}');
    expect(service.undoBuffer.length).toEqual(10);

    // add one element too much, should delete first
    service.makeHistory({x: 10});
    expect(service.undoBuffer[0]).toEqual('{"x":1}');
    expect(service.undoBuffer[9]).toEqual('{"x":10}');
    expect(service.undoBuffer.length).toEqual(10);
  });

  it('should delete future', () => {
    // add future
    service.makeFuture({x: 0});
    expect(service.redoBuffer.length).toEqual(1);

    // add history, should delete future
    service.makeHistory({x: 0});

    // check future
    expect(service.redoBuffer.length).toEqual(0);
  });

  it('should make future', () => {
    // make array full
    service.makeFuture({x: 0});
    service.makeFuture({x: 1});
    service.makeFuture({x: 2});
    service.makeFuture({x: 3});
    service.makeFuture({x: 4});
    service.makeFuture({x: 5});
    service.makeFuture({x: 6});
    service.makeFuture({x: 7});
    service.makeFuture({x: 8});
    service.makeFuture({x: 9});
    expect(service.redoBuffer[0]).toEqual('{"x":0}');
    expect(service.redoBuffer[9]).toEqual('{"x":9}');
    expect(service.redoBuffer.length).toEqual(10);

    // add one element too much, should delete first
    service.makeFuture({x: 10});
    expect(service.redoBuffer[0]).toEqual('{"x":1}');
    expect(service.redoBuffer[9]).toEqual('{"x":10}');
    expect(service.redoBuffer.length).toEqual(10);
  });

  it('should not do anything', () => {
    // empty value
    service.makeFuture('');
    service.makeHistory(null);
    expect(service.redoBuffer.length).toEqual(0);
    expect(service.undoBuffer.length).toEqual(0);

    // no history or future
    expect(service.redoChanges()).toBeFalse();
    expect(service.undoChanges()).toBeFalse();
  });

  it('should reset service', () => {
    service.makeFuture({x: 0});
    service.makeHistory({x: 0});
    service.resetService();

    expect(service.redoBuffer.length).toEqual(0);
    expect(service.undoBuffer.length).toEqual(0);
  });

  it('should undo change', () => {
    service.storage.selectedPageID = 0;
    service.makeHistory({pages: [1]});

    // undo
    expect(service.undoChanges()).toBeTrue();
    expect(service.undoBuffer.length).toEqual(0);
    expect(service.storage.model).toEqual({pages: [1]});

    // page wont exists after undo
    service.storage.selectedPageID = 1;
    service.makeHistory({pages: [1]});

    // undo
    expect(service.undoChanges()).toBeTrue();
    expect(service.undoBuffer.length).toEqual(0);
    expect(service.storage.model).toEqual({pages: [1]});
    expect(service.storage.selectedPageID).toEqual(0);
  });

  it('should redo change', () => {
    service.storage.selectedPageID = 0;
    service.makeFuture({pages: [1]});

    // undo
    expect(service.redoChanges()).toBeTrue();
    expect(service.redoBuffer.length).toEqual(0);
    expect(service.storage.model).toEqual({pages: [1]});

    // page wont exists after undo
    service.storage.selectedPageID = 1;
    service.makeFuture({pages: [1]});

    // undo
    expect(service.redoChanges()).toBeTrue();
    expect(service.redoBuffer.length).toEqual(0);
    expect(service.storage.model).toEqual({pages: [1]});
    expect(service.storage.selectedPageID).toEqual(0);
  });
});
