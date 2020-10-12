import { BufferedIterator } from 'asynciterator';
// eslint-disable-next-line import/namespace
import type * as HDT from 'hdt';
import type * as RDF from 'rdf-js';

export class HdtIterator extends BufferedIterator<RDF.Quad> {
  protected readonly hdtDocument: HDT.Document;
  protected readonly subject?: RDF.Term;
  protected readonly predicate?: RDF.Term;
  protected readonly object?: RDF.Term;

  protected position: number;

  public constructor(
    hdtDocument: HDT.Document,
    subject?: RDF.Term,
    predicate?: RDF.Term,
    object?: RDF.Term,
    options?: any,
  ) {
    super(options || { autoStart: false });
    this.hdtDocument = hdtDocument;
    this.subject = subject;
    this.predicate = predicate;
    this.object = object;
    this.position = options && options.offset || 0;

    this.hdtDocument.countTriples(this.subject, this.predicate, this.object)
      .then((searchResult: HDT.SearchResult) => {
        this.setProperty('metadata', { totalItems: searchResult.totalCount });
      })
      .catch(error => this.destroy(error));
  }

  public _read(count: number, done: () => void): void {
    if ((<any> this.hdtDocument).closed) {
      this.close();
      return done();
    }
    this.hdtDocument.searchTriples(this.subject, this.predicate, this.object, { offset: this.position, limit: count })
      .then((searchResult: HDT.SearchResult) => {
        searchResult.triples.forEach(t => this._push(t));
        if (searchResult.triples.length < count) {
          this.close();
        }
        done();
      })
      .catch(error => {
        this.emit('error', error);
        return done();
      });
    this.position += count;
  }
}
