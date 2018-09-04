# MarkLogic Grove React Visjs Graph

This library provides React components providing an interactive graph
visualization of nodes and edges. It is a wrapper for the [vanilla JS
ml-visjs-graph.js library](https://github.com/grtjn/ml-visjs-graph.js), which
itself is based on the [VisJS Network library](http://visjs.org/docs/network/).

The library is part of the MarkLogic Grove project, but could work in any React application.

## Installation

First, add the `grove-react-visjs-graph` dependency via npm:

    npm install --save https://project.marklogic.com/repo/scm/~pmcelwee/grove-react-visjs-graph.git

Then, in your application, import the `GraphContainer` and start to use it:

```javascript
```

## Defaults

### Data source

NOTE: Expect to see updates to this section soon, to include a richer middle-tier endpoint and an improved implementation.

By default, this library expects to access a MarkLogic REST endpoint at `/v1/resources/visjs`. It provides an `rs:subjects` array parameter to this endpoint, and expect to receive back the Visjs-style serialization of nodes and edges.

A usable example of such an endpoint is available in the [mlpm-visjs-graph repository](https://github.com/patrickmcelwee/mlpm-visjs-graph). You will need to install [visjs.xqy](https://github.com/patrickmcelwee/mlpm-visjs-graph/blob/master/visjs.xqy) as a REST resource and [visjs-lib.xqy](https://github.com/patrickmcelwee/mlpm-visjs-graph/blob/master/visjs-lib.xqy) as a server-side javascript module. You can customize the behavior by editing these files directly, particularly the SPARQL queries in visjs-lib.xqy.

## Customization

### Data source

TODO

### Events

TODO

### Display options

TODO
