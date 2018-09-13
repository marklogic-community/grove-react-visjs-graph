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

  fetchData(uris) {
    if (this.props.fetchData) {
      return this.props.fetchData(uris);
    }
    return fetch(
      new URL(
        '/v1/resources/visjs?rs:subjects=' + uris,
        document.baseURI
      ).toString(),
      {
        credentials: 'same-origin'
      }
    );
  }

  updateNodesAndEdges(uris) {
    this.fetchData(uris)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network error getting graph data');
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
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error(error);
        return { nodes: [], edges: [] };
      });
  }

  componentDidMount() {
    this.updateNodesAndEdges(this.props.startingUris);
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
  startingUris: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchData: PropTypes.func
};

export default GraphContainer;
