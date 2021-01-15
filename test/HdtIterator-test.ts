import { DataFactory } from 'rdf-data-factory';
import { HdtIterator } from '../lib/HdtIterator';
import { MockedHdtDocument } from '../mocks/MockedHdtDocument';

const arrayifyStream = require('arrayify-stream');
const quad = require('rdf-quad');

const DF = new DataFactory();

describe('HdtIterator', () => {
  let hdtDocument: any;

  beforeEach(() => {
    hdtDocument = new MockedHdtDocument([
      quad('s1', 'p1', 'o1'),
      quad('s1', 'p1', 'o2'),
      quad('s1', 'p2', 'o1'),
      quad('s1', 'p2', 'o2'),
      quad('s2', 'p1', 'o1'),
      quad('s2', 'p1', 'o2'),
      quad('s2', 'p2', 'o1'),
      quad('s2', 'p2', 'o2'),
    ]);
  });

  it('should be instantiatable', () => {
    return expect(() => new HdtIterator(hdtDocument,
      DF.namedNode('s1'),
      DF.namedNode('p1'),
      DF.namedNode('o1'),
      { offset: 0, limit: 10 })).not.toThrow();
  });

  it('should return the correct stream for ? ? ?', async() => {
    expect(await arrayifyStream(new HdtIterator(hdtDocument,
      DF.variable('s'),
      DF.variable('p'),
      DF.variable('o'),
      {})))
      .toEqual([
        quad('s1', 'p1', 'o1'),
        quad('s1', 'p1', 'o2'),
        quad('s1', 'p2', 'o1'),
        quad('s1', 'p2', 'o2'),
        quad('s2', 'p1', 'o1'),
        quad('s2', 'p1', 'o2'),
        quad('s2', 'p2', 'o1'),
        quad('s2', 'p2', 'o2'),
      ]);
  });

  it('should return the correct stream for ? ? ? with offset 3', async() => {
    expect(await arrayifyStream(new HdtIterator(hdtDocument,
      DF.variable('s'),
      DF.variable('p'),
      DF.variable('o'),
      { offset: 3 })))
      .toEqual([
        quad('s1', 'p2', 'o2'),
        quad('s2', 'p1', 'o1'),
        quad('s2', 'p1', 'o2'),
        quad('s2', 'p2', 'o1'),
        quad('s2', 'p2', 'o2'),
      ]);
  });

  it('should return the correct stream for ? ? ? with offset 7', async() => {
    expect(await arrayifyStream(new HdtIterator(hdtDocument,
      DF.variable('s'),
      DF.variable('p'),
      DF.variable('o'),
      { offset: 7 })))
      .toEqual([
        quad('s2', 'p2', 'o2'),
      ]);
  });

  it('should return the correct stream for ? ? ? with offset 8', async() => {
    expect(await arrayifyStream(new HdtIterator(hdtDocument,
      DF.variable('s'),
      DF.variable('p'),
      DF.variable('o'),
      { offset: 8 })))
      .toEqual([]);
  });

  it('should return the correct stream for ? ? ? with offset 9', async() => {
    expect(await arrayifyStream(new HdtIterator(hdtDocument,
      DF.variable('s'),
      DF.variable('p'),
      DF.variable('o'),
      { offset: 9 })))
      .toEqual([]);
  });

  it('should return the correct stream for s1 ? ?', async() => {
    expect(await arrayifyStream(new HdtIterator(hdtDocument,
      DF.namedNode('s1'),
      DF.variable('p'),
      DF.variable('o'),
      {})))
      .toEqual([
        quad('s1', 'p1', 'o1'),
        quad('s1', 'p1', 'o2'),
        quad('s1', 'p2', 'o1'),
        quad('s1', 'p2', 'o2'),
      ]);
  });

  it('should return the correct stream for ? p1 ?', async() => {
    expect(await arrayifyStream(new HdtIterator(hdtDocument,
      DF.variable('s'),
      DF.namedNode('p1'),
      DF.variable('o'),
      {})))
      .toEqual([
        quad('s1', 'p1', 'o1'),
        quad('s1', 'p1', 'o2'),
        quad('s2', 'p1', 'o1'),
        quad('s2', 'p1', 'o2'),
      ]);
  });

  it('should return the correct stream for s1 p1 ?', async() => {
    expect(await arrayifyStream(new HdtIterator(hdtDocument,
      DF.namedNode('s1'),
      DF.namedNode('p1'),
      DF.variable('o'),
      {})))
      .toEqual([
        quad('s1', 'p1', 'o1'),
        quad('s1', 'p1', 'o2'),
      ]);
  });

  it('should return the correct stream for ? p1 o1', async() => {
    expect(await arrayifyStream(new HdtIterator(hdtDocument,
      DF.variable('s'),
      DF.namedNode('p1'),
      DF.namedNode('o1'),
      {})))
      .toEqual([
        quad('s1', 'p1', 'o1'),
        quad('s2', 'p1', 'o1'),
      ]);
  });

  it('should return the correct stream for s1 p1 o1', async() => {
    expect(await arrayifyStream(new HdtIterator(hdtDocument,
      DF.namedNode('s1'),
      DF.namedNode('p1'),
      DF.namedNode('o1'),
      {})))
      .toEqual([
        quad('s1', 'p1', 'o1'),
      ]);
  });

  it('should not return anything when the document is closed', async() => {
    hdtDocument.close();
    expect(await arrayifyStream(new HdtIterator(hdtDocument,
      DF.variable('s'),
      DF.variable('p'),
      DF.variable('o'),
      {})))
      .toEqual([]);
  });

  it('should resolve to an error if the document emits an error', async() => {
    const e = new Error('HdtIterator-test');
    hdtDocument.setError(e);
    await expect(arrayifyStream(new HdtIterator(hdtDocument,
      DF.variable('s'),
      DF.variable('p'),
      DF.variable('o'),
      {})))
      .rejects.toBe(e);
  });

  it('should expose the metadata property', async done => {
    const it = new HdtIterator(hdtDocument, DF.variable('s'), DF.variable('p'), DF.variable('o'));
    it.getProperty('metadata', metadata => {
      expect(metadata).toEqual({ totalItems: 8 });
      done();
    });
  });
});
