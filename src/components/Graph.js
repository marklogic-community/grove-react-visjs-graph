import React from 'react';
import isEqual from 'lodash.isequal';

import * as mlvisjs from 'ml-visjs-graph';
import 'vis/dist/vis.css';
import 'ml-visjs-graph/dist/ml-visjs-graph.js.css';

const template = `
  <div class="row mlvisjs-graph default-style">
    <div class="col-md-12 graph-controls">
      <form class="form-inline">
        <div class="checkbox physics-enabled">
          <label>
            <input type="checkbox" name="physicsEnabled" checked>
            <span class="checkbox-material"><span class="check"></span></span>
            Enable Physics
          </label>
        </div>
        <div class="form-group layout">
          <label class="sr-only" class="form-control" for="layout"> Layout: </label>
          <select name="layout">
            <option value="standard">Standard</option>
            <option value="hierarchyTop">Hierarchy - Top</option>
            <option value="hierarchyBottom">Hierarchy - Bottom</option>
            <option value="hierarchyLeft">Hierarchy - Left</option>
            <option value="hierarchyRight">Hierarchy - Right</option>
          </select>
        </div>
      </form>
    </div>
    <vis-network class="col-md-12"></vis-network>
  </div>
`;

// TODO: add ErrorBoundary
class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
  }

  componentDidMount() {
    this.createGraph();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.data, this.props.data)) {
      this.mlVisjsGraph.network.setData(
        this.props.data.nodes,
        null,
        this.props.data.edges,
        null
      );
    }
  }

  createGraph() {
    this.mlVisjsGraph = new mlvisjs.Graph(
      this.container.current,
      null, // templateUri
      {
        get: () => template // templateCache
      },
      graph => {
        if (this.props.data) {
          graph.network.setData(
            this.props.data.nodes,
            null,
            this.props.data.edges,
            null
          );
        }

        if (this.props.events) {
          graph.network.setEvents(this.props.events);
        }

        if (this.props.options) {
          graph.network.setOptions(this.props.options);
        }

        if (this.props.layout) {
          graph.setLayout(this.props.layout);
        }

        if (this.props.physics !== undefined) {
          graph.setPhysics(this.props.physics);
        }
      }
    );
  }

  render() {
    return <div ref={this.container} />;
  }
}

export default Graph;
