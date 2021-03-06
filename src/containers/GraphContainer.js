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
    this.events = Object.assign(
      {
        doubleClick: params => {
          const nodeURI = params.nodes[0];
          if (nodeURI) {
            this.updateNodesAndEdges([nodeURI]);
          }
        }
      },
      props.events
    );
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
    ).then(response => {
      if (!response.ok) {
        throw new Error('Network error getting graph data');
      }
      return response.json();
    });
  }

  updateNodesAndEdges(uris) {
    if (!uris) {
      return;
    }
    this.fetchData(uris)
      .then(newData => {
        this.setState(prevState => ({
          data: {
            nodes: [].concat(prevState.data.nodes, newData.nodes),
            edges: [].concat(prevState.data.edges, newData.edges)
          }
        }));
      })
      .catch(error => {
        console.error(error); // eslint-disable-line no-console
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
        layout={this.props.layout}
        physics={this.props.physics}
      />
    );
  }
}

GraphContainer.propTypes = {
  startingUris: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchData: PropTypes.func,
  events: PropTypes.object,
  options: PropTypes.object,
  layout: PropTypes.string,
  physics: PropTypes.oneOfType([PropTypes.string, PropTypes.boolean])
};

export default GraphContainer;
