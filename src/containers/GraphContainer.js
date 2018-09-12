import React from 'react';
import PropTypes from 'prop-types';
import Graph from '../components/Graph';
require('isomorphic-fetch');

class GraphContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        nodes: [],
        edges: []
      }
    };
    this.events = {
      doubleClick: params => {
        const nodeURI = params.nodes[0];
        this.updateNodesAndEdges([nodeURI]);
      }
    };
  }

  updateNodesAndEdges(uris) {
    fetch(
      new URL(
        '/v1/resources/visjs?rs:subjects=' + uris,
        document.baseURI
      ).toString(),
      {
        credentials: 'same-origin'
      }
    )
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => {
            // eslint-disable-next-line no-console
            console.error('Error getting graph data:', error); // throw new Error(error.message);
            return { nodes: [], edges: [] };
          });
        }
        return response.json();
      })
      .then(newData => {
        this.setState(prevState => ({
          data: {
            nodes: [].concat(prevState.data.nodes, newData.nodes),
            edges: [].concat(prevState.data.edges, newData.edges)
          }
        }));
      });
  }

  componentDidMount() {
    this.updateNodesAndEdges(this.props.originalUris);
  }

  render() {
    return (
      <Graph
        options={this.props.options}
        data={this.state.data}
        events={this.events}
      />
    );
  }
}

GraphContainer.propTypes = {
  originalUris: PropTypes.arrayOf(PropTypes.string)
};

export default GraphContainer;
