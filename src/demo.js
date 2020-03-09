import React from 'react';
import ReactDOM from 'react-dom';

import { Graph } from './index';

const dummyData = {
  nodes: [],
  edges: []
};

const numNodes = 10;

for (let i = 0; i < numNodes; i++) {
  dummyData.nodes.push({
    id: `node${i}`,
    label: `node ${i}`,
    orbs: [
      {
        label: 'hello'
      }
    ]
  });
}

function random(size, not) {
  const r = size => ~~(Math.random() * size);
  if (not === 0) {
    return r(size - 1) + 1;
  } else if (not === size - 1) {
    return r(size - 1);
  } else {
    const num = r(size - 1);
    return num >= not ? num + 1 : num;
  }
}

for (let i = 0; i < dummyData.nodes.length; i++) {
  dummyData.edges.push({
    from: `node${i}`,
    to: `node${random(dummyData.nodes.length, i)}`
  });
}

const actions = [
  {
    text: 'Hide node',
    type: 'node',
    action: ({ network, node, nodeData }) => {
      console.log(node, network)
      node.hidden = true;
      console.log(node, nodeData);
    }
  },
  {
    text: 'Do not click',
    type: 'all',
    action: () => {
      alert('You have been banned.');
    }
  },
  {
    text: 'Hide edge',
    type: 'edge',
    action: ({ network, edge, edgeData }) => {
      console.log(edge, edgeData);
    }
  }
];

class Demo extends React.Component {
  render() {
    return (
      <>
        <Graph data={dummyData} contextMenuActions={actions} />
      </>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('root'));
