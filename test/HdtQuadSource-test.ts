import {DataFactory} from "rdf-data-factory";
import {HdtIterator} from "../lib/HdtIterator";
import {HdtQuadSource} from "../lib/HdtQuadSource";
import {MockedHdtDocument} from "../mocks/MockedHdtDocument";

const DF = new DataFactory();

describe('HdtQuadSource', () => {
  let hdtDocument;

  beforeEach(() => {
    hdtDocument = new MockedHdtDocument([]);
  });

  describe('The HdtQuadSource module', () => {
    it('should be a function', () => {
      expect(HdtQuadSource).toBeInstanceOf(Function);
    });

    it('should be a HdtQuadSource constructor', () => {
      expect(new HdtQuadSource(hdtDocument)).toBeInstanceOf(HdtQuadSource);
    });

    it('should be a HdtQuadSource constructor with optional bufferSize argument', () => {
      expect(new HdtQuadSource(hdtDocument, 10)).toBeInstanceOf(HdtQuadSource);
    });
  });

  describe('A HdtQuadSource instance', () => {
    let source: HdtQuadSource;

    beforeEach(() => {
      source = new HdtQuadSource(hdtDocument, 10);
    });

    it('should throw an error when queried on the non-default graph', () => {
      return expect(() => source.match(null, null, null, DF.namedNode('http://ex.org'))).toThrow();
    });

    it('should return a HdtIterator', () => {
      return expect(source.match(DF.variable('v'), DF.variable('v'), DF.variable('v'), DF.defaultGraph()))
        .toBeInstanceOf(HdtIterator);
    });
  });
});
