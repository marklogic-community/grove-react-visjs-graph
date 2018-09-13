# MarkLogic Grove React Visjs Graph

This library provides React components providing an interactive graph
visualization of nodes and edges. It is a wrapper for the [vanilla JS
ml-visjs-graph.js library](https://github.com/grtjn/ml-visjs-graph.js), which
itself is based on the [VisJS Network library](http://visjs.org/docs/network/).

The library is part of the MarkLogic Grove project, but could work in any React application.

## QuickStart

First, add the `grove-react-visjs-graph` dependency via npm. (In a Grove Project, you will want to do this inside the `ui` directory.)

    npm install --save git+https://project.marklogic.com/repo/scm/~pmcelwee/grove-react-visjs-graph.git

Then, in your application, import the `GraphContainer` and start to use it.

```javascript
// ... other imports ...
import { GraphContainer } from 'grove-react-visjs-graph';

// ...
// ... other stuff in the parent component
  <GraphContainer />
// ...
```

The `GraphContainer` is a convenience container, which attempts to fetch graph data and pass it down to the more generic `Graph` component. The follow section describes the default behavior of the `GraphContainer` and how to customize it.

However, you may also choose not to use the `GraphContainer` at all, but instead to use your own container together with the more generic `Graph` component. There is a section on using the `Graph` component further below.

## `GraphContainer`

### `GraphContainer` Defaults

#### Data Source
 
The provided `GraphContainer` calls a backend service, providing subject IRIs as a parameter. By default, it expects to access a MarkLogic REST endpoint at `/v1/resources/visjs`. It provides an `rs:subjects` array parameter to this endpoint, and expects to receive back the Visjs-style serialization of nodes and edges.

A usable example of such an endpoint is available in the [mlpm-visjs-graph repository](https://github.com/patrickmcelwee/mlpm-visjs-graph). You will need to install [visjs.xqy](https://github.com/patrickmcelwee/mlpm-visjs-graph/blob/master/visjs.xqy) as a REST resource and [visjs-lib.xqy](https://github.com/patrickmcelwee/mlpm-visjs-graph/blob/master/visjs-lib.xqy) as a server-side javascript module. You can customize the behavior by editing these files directly, particularly the SPARQL queries in visjs-lib.xqy.

#### Events

The provided `GraphContainer` also sets up a single doubleClick event, which fetches nodes and edges for the node that was double-clicked and adds them to the graph.

### `GraphContainer` Customization

### Data Source

To change the basic behavior pass in fetchData function, which takes an array of IRIs as its only argument and returns a Visjs-style serialization of nodes and edges.

### Events

TODO

### Display options

TODO: add physics on-off, physics solver and layout as props to Graph
 
## `Graph` Component

Instead of using the provided `GraphContainer`, you can use the lower-level `Graph` component instead, which gives you more control on how to fetch data to initialize the graph and to update it. See the `GraphContainer` itself for an example of how to use it.

It takes props similar to the `GraphContainer` for events and display options.

In addition, it takes a `data` prop, which is additive. Any new data gets added to the existing visjs graph.
