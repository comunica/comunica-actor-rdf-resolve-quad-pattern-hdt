# Comunica HDT RDF Resolve Quad Pattern Actor

[![npm version](https://badge.fury.io/js/%40comunica%2Factor-rdf-resolve-quad-pattern-hdt.svg)](https://www.npmjs.com/package/@comunica/actor-rdf-resolve-quad-pattern-hdt)
[![Build Status](https://travis-ci.org/comunica/comunica-actor-rdf-resolve-quad-pattern-hdt.svg?branch=master)](https://travis-ci.org/comunica/comunica-actor-rdf-resolve-quad-pattern-hdt)
[![Coverage Status](https://coveralls.io/repos/github/comunica/comunica-actor-rdf-resolve-quad-pattern-hdt/badge.svg?branch=master)](https://coveralls.io/github/comunica/comunica-actor-rdf-resolve-quad-pattern-hdt?branch=master)

An [RDF Resolve Quad Pattern](https://github.com/comunica/comunica/tree/master/packages/bus-rdf-resolve-quad-pattern) actor that handles [HDT files](http://www.rdfhdt.org/).

This module is part of the [Comunica framework](https://github.com/comunica/comunica),
and should only be used by [developers that want to build their own query engine](https://comunica.dev/docs/modify/).

[Click here if you just want to query HDT files with Comunica](https://comunica.dev/docs/query/advanced/hdt/).

## Install

This package requires GCC 4.9 or higher to be available so that [HDT](http://www.rdfhdt.org/) can be compiled.

```bash
$ yarn add @comunica/actor-rdf-resolve-quad-pattern-hdt
```

## Configure

After installing, this package can be added to your engine's configuration as follows:
```text
{
  "@context": [
    ...
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/actor-rdf-resolve-quad-pattern-hdt/^1.0.0/components/context.jsonld"  
  ],
  "actors": [
    ...
    {
      "@id": "config-sets:resolve-rdfjs.json#myRdfHdtQuadPatternResolver",
      "@type": "ActorRdfResolveQuadPatternHdt"
    }
  ]
}
```
