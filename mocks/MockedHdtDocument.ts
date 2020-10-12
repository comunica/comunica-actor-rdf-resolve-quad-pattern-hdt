import * as RDF from "rdf-js";
import * as HDT from "hdt";
import {Document, SearchLiteralsOpts, SearchLiteralsResult, SearchResult, SearchTermsOpts} from "hdt";
import {DataFactory} from "rdf-data-factory";

export class MockedHdtDocument implements HDT.Document  {

  public closed: boolean = false;

  private readonly triples: RDF.BaseQuad[];
  private error: Error = null;

  constructor(triples: RDF.BaseQuad[]) {
    this.triples = triples;
  }

  protected static triplesMatch(a: RDF.BaseQuad, b: RDF.BaseQuad): boolean {
    return MockedHdtDocument.termsMatch(a.subject, b.subject)
      && MockedHdtDocument.termsMatch(a.predicate, b.predicate)
      && MockedHdtDocument.termsMatch(a.object, b.object);
  }

  protected static termsMatch(a: RDF.Term, b: RDF.Term): boolean {
    return !a || a.termType === 'Variable' || !b || b.termType === 'Variable' || a.equals(b);
  }

  public async searchTriples(subject: RDF.Term, predicate: RDF.Term, object: RDF.Term,
                             options: {[id: string]: any}): Promise<HDT.SearchResult> {
    if (this.error) {
      throw this.error;
    }
    const tripleIn = new DataFactory<RDF.BaseQuad>().quad(subject, predicate, object);
    const offset = options.offset || 0;
    const limit = Math.min(options.limit, this.triples.length);
    let i = 0;
    const triples = [];
    for (const triple of this.triples) {
      if (MockedHdtDocument.triplesMatch(tripleIn, triple)) {
        if (i >= offset && i < offset + limit) {
          triples.push(triple);
        }
        i++;
      }
    }
    return { triples, totalCount: i, hasExactCount: true };
  }

  public async countTriples(subject?: RDF.Term, predicate?: RDF.Term, object?: RDF.Term): Promise<SearchResult> {
    if (this.error) {
      throw this.error;
    }
    const tripleIn = new DataFactory<RDF.BaseQuad>().quad(subject, predicate, object);
    let i = 0;
    for (const triple of this.triples) {
      if (MockedHdtDocument.triplesMatch(tripleIn, triple)) {
        i++;
      }
    }
    return { triples: [], totalCount: i, hasExactCount: true };
  }

  public async searchLiterals(substring: string, opts?: SearchLiteralsOpts): Promise<SearchLiteralsResult> {
    return null;
  }

  public searchTerms(opts?: SearchTermsOpts): Promise<string[]> {
    return null;
  }

  public async close(): Promise<void> {
    this.closed = true;
  }

  public setError(error: Error) {
    this.error = error;
  }

  public async readHeader(): Promise<string> {
    return null;
  }

  public async changeHeader(triples: string, outputFile: string): Promise<Document> {
    return null;
  }

}
