import React from 'react';
import isEqual from 'lodash.isequal';

import 'vis/dist/vis.css';
import vis from 'vis';

import ContextMenu from './ContextMenu';
import { runInThisContext } from 'vm';

/*
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
*/

const defaultChartOptions = {
  nodes: {
    font: {
      strokeWidth: 0,
      size: 30,
      background: '#f4f4f4'
    },
    size: 40,
    margin: 20,
    shape: 'circle'
    // shape: 'circularImage'
  },
  edges: {
    font: {
      size: 10,
      align: 'bottom'
    },
    width: 3,
    color: {
      inherit: 'both'
    }
  },
  layout: {
    randomSeed: 2
  },
  physics: {
    enabled: true,
    forceAtlas2Based: {
      gravitationalConstant: -50,
      centralGravity: 0.01,
      springConstant: 0.08,
      springLength: 100,
      damping: 0.4,
      avoidOverlap: 1
    },
    solver: 'forceAtlas2Based'
  }
};

const defaultOrbOptions = {
  type: 'text',
  size: 20,
  padding: 4,
  textColor: '#222',
  startPos(node, orb) {
    return [
      node.x + node.baseSize - orb.size / 2,
      node.y - node.baseSize + orb.size / 2
    ];
  },
  endPos(node, orb) {
    return [
      node.x + node.baseSize - orb.size / 2,
      node.y - node.baseSize + orb.size / 2
    ];
  },
  color: 'rgb(0, 220, 240)'
};

function drawBackground(ctx, orb, startPos, endPos) {
  ctx.strokeStyle = orb.color;
  ctx.lineWidth = orb.size + orb.padding;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(...startPos);
  ctx.lineTo(...endPos);
  ctx.stroke();
  ctx.fill();
}

function drawOrbs(ctx, node, rawNode) {
  for (let orb of rawNode.orbs) {
    orb = Object.assign({}, defaultOrbOptions, orb);
    const startPos = orb.startPos(node, orb);
    let image;
    if (orb.type === 'icon') {
      image = new Image(orb.size * 0.75, orb.size * 0.75);
      image.src = orb.icon;
      drawBackground(ctx, orb, startPos, startPos);
      ctx.fillStyle = orb.textColor;
      ctx.drawImage(
        image,
        startPos[0] - size / 2,
        startPos[1] - size / 2,
        orb.size,
        orb.size
      );
      ctx.fill();
    } else if (orb.type === 'text') {
      ctx.font = `bold ${orb.size}px sans-serif`;
      const width = ctx.measureText(orb.label).width;
      const endPos = [startPos[0] + width, startPos[1]];
      drawBackground(ctx, orb, startPos, endPos);
      ctx.fillStyle = orb.textColor;
      ctx.textBaseline = 'bottom';
      ctx.fillText(orb.label, startPos[0], startPos[1] + orb.size / 2 + 1);
      ctx.fill();
    }
  }
}

// TODO: add ErrorBoundary
class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.networkElem = React.createRef();
    this.state = {
      contextMenu: null,
      shadowData: {
        nodes: props.nodes,
        edges: props.edges
      }
    };
    this.createGraph = this.createGraph.bind(this);
    this.setupDefaultChartEvents = this.setupDefaultChartEvents.bind(this);
  }

  componentDidMount() {
    this.createGraph();
  }

  mergedOptions() {
    return Object.assign(defaultChartOptions, this.props.options);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.data, this.props.data)) {
      this.state.network.setData({
        nodes: this.props.data.nodes,
        edges: this.props.data.edges
      });
    }
    if (!isEqual(prevProps.options, this.props.options)) {
      if (this.state.network) {
        this.state.network.setOptions(this.mergedOptions());
      }
    }
  }

  setupDefaultChartEvents(network) {
    // default is noop
    let setContextMenu = () => {};
    const closeContextMenu = () => this.setState({ contextMenu: null });
    if (Array.isArray(this.props.contextMenuActions)) {
      setContextMenu = (node, nodeData, coordinates) => {
        if (node !== null) {
          this.setState({
            contextMenu: (
              <ContextMenu
                coordinates={coordinates}
                data={{ network, node, nodeData }}
                close={closeContextMenu}
                actions={this.props.contextMenuActions}
              />
            )
          });
        } else {
          closeContextMenu();
        }
      };
    }
    network.on('afterDrawing', ctx => {
      for (let id in network.body.nodes) {
        if (network.body.nodes.hasOwnProperty(id)) {
          const node = network.body.nodes[id];
          const rawNode = network.body.data.nodes._data[id];
          if (rawNode) {
            if (rawNode.orbs) {
              drawOrbs(ctx, node, rawNode);
            } else if (rawNode.group) {
              const group = this.props.options.groups[rawNode.group];
              if (group && group.orbs) {
                drawOrbs(ctx, Object.assign({}, group, node));
              }
            }
          }
        }
      }
    });
    ['zoom', 'click'].forEach(name => {
      network.on(name, () => {
        if (this.state.contextMenu !== null) {
          this.setState({
            contextMenu: null
          });
        }
      });
    });
    network.on('oncontext', params => {
      params.event.preventDefault();
      network.stopSimulation();
      const coordinates = params.pointer.DOM;
      const targetNodeId = network.getNodeAt(coordinates);
      if (targetNodeId) {
        const node = network.body.nodes[targetNodeId];
        const nodeData = network.body.data.nodes._data[targetNodeId];
        setContextMenu(node, nodeData, coordinates);
      } else {
        setContextMenu(null);
      }
      /*
      let targetNode;
      if (targetNodeId) {
        targetNode = nodesSet.get(targetNodeId);
      }
      if (targetNode) {
        setNodeDropdown({ coordinates, targetNode });
      }
      */
    });
  }

  createGraph() {
    // TODO: consider using vis.DataSet for data https://visjs.org/docs/data/dataset.html
    const network = new vis.Network(
      this.networkElem.current,
      this.props.data,
      this.mergedOptions()
    );
    this.setState({
      network
    });
    this.setupDefaultChartEvents(network);
    if (this.props.getNetwork) {
      this.props.getNetwork(network);
    }
    /* TOOD: Replace this with plain vis.js
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
    */
  }

  render() {
    return (
      <div ref={this.networkElem} style={this.props.chartStyle}>
        {this.state.contextMenu}
      </div>
    );
  }
}

Graph.defaultProps = {
  data: {
    nodes: [],
    edges: []
  },
  chartStyle: {
    width: '100%',
    height: '600px',
    border: '1px solid #C0C0C0',
    position: 'relative'
  }
};

export default Graph;
