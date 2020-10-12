import {IQuadSource} from "@comunica/bus-rdf-resolve-quad-pattern";
import {AsyncIterator} from "asynciterator";
import * as HDT from "hdt";
import * as RDF from "rdf-js";
import {HdtIterator} from "./HdtIterator";

export class HdtQuadSource implements IQuadSource {

  protected bufferSize: number = 128;
  protected readonly hdtDocument: HDT.Document;

  constructor(hdtDocument: HDT.Document, bufferSize?: number) {
    this.hdtDocument = hdtDocument;
    if (bufferSize) {
      this.bufferSize = bufferSize;
    }
  }

  public match(subject: RDF.Term, predicate: RDF.Term, object: RDF.Term, graph: RDF.Term): AsyncIterator<RDF.Quad> {
    if (graph.termType !== 'DefaultGraph') {
      throw new Error("HdtQuadSource only supports triple pattern queries within the default graph.");
    }
    return new HdtIterator(this.hdtDocument, subject, predicate, object,
      { autoStart: false, maxBufferSize: this.bufferSize });
  }
}
