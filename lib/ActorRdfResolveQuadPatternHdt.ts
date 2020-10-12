import {ActorRdfResolveQuadPatternSource, IActionRdfResolveQuadPattern,
  IActorRdfResolveQuadPatternOutput, IQuadSource} from "@comunica/bus-rdf-resolve-quad-pattern";
import {ActionContext, IActorArgs, IActorTest} from "@comunica/core";
import * as HDT from "hdt";
import * as RDF from "rdf-js";
import {HdtQuadSource} from "./HdtQuadSource";

/**
 * A comunica HDT RDF Resolve Quad Pattern Actor.
 */
export class ActorRdfResolveQuadPatternHdt extends ActorRdfResolveQuadPatternSource
 implements IActorRdfResolveQuadPatternHdtArgs {

  public readonly hdtFiles?: string[];
  public hdtDocuments: {[file: string]: Promise<HDT.Document>} = {};
  public closed: boolean = false;

  protected shouldClose: boolean;
  protected queries: number = 0;

  constructor(args: IActorRdfResolveQuadPatternHdtArgs) {
    super(args);
  }

  public initializeHdt(hdtFile: string): Promise<HDT.Document> {
    return this.hdtDocuments[hdtFile] = HDT.fromFile(hdtFile);
  }

  public async initialize(): Promise<any> {
    (this.hdtFiles || []).forEach((hdtFile) => this.initializeHdt(hdtFile));
    return null;
  }

  public async deinitialize(): Promise<any> {
    process.on('exit', () => this.safeClose());
    process.on('SIGINT', () => this.safeClose());
    return null;
  }

  public close() {
    if (this.closed) {
      throw new Error('This actor can only be closed once.');
    }
    if (!this.queries) {
      this.shouldClose = false;
      Object.keys(this.hdtDocuments).forEach(async (hdtFile) => (await this.hdtDocuments[hdtFile]).close());
      this.closed = true;
    } else {
      this.shouldClose = true;
    }
  }

  public async test(action: IActionRdfResolveQuadPattern): Promise<IActorTest> {
    if (!this.hasContextSingleSourceOfType('hdtFile', action.context)) {
      throw new Error(this.name + ' requires a single source with a hdtFile to be present in the context.');
    }
    return true;
  }

  protected safeClose() {
    if (!this.closed) {
      this.close();
    }
  }

  protected async getSource(context: ActionContext): Promise<IQuadSource> {
    const hdtFile: string = (<any> this.getContextSource(context)).value;
    if (!this.hdtDocuments[hdtFile]) {
      await this.initializeHdt(hdtFile);
    }
    return new HdtQuadSource(await this.hdtDocuments[hdtFile]);
  }

  protected async getOutput(source: IQuadSource, pattern: RDF.Quad, context: ActionContext)
  : Promise<IActorRdfResolveQuadPatternOutput> {
    // Attach totalItems to the output
    this.queries++;
    const output: IActorRdfResolveQuadPatternOutput = await super.getOutput(source, pattern, context);
    output.data.on('end', () => {
      this.queries--;
      if (this.shouldClose) {
        this.close();
      }
    });
    return output;
  }

}

export interface IActorRdfResolveQuadPatternHdtArgs
  extends IActorArgs<IActionRdfResolveQuadPattern, IActorTest, IActorRdfResolveQuadPatternOutput> {
  /**
   * The HDT files to preload.
   */
  hdtFiles?: string[];
}
