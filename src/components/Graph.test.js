import React from 'react';
import { mount } from 'enzyme';

import Graph from './Graph';

describe('<Graph/>', () => {
  it('creates a mlvisjs-graph without data', () => {
    const wrapper = mount(<Graph />);
    // TODO: not totally happy with this assertion, but works for now
    expect(wrapper.text()).toMatch('Enable Physics');
  });

  it('creates a mlvisjs-graph with empty data', () => {
    const wrapper = mount(<Graph data={{ nodes: [], edges: [] }} />);
    // TODO: not totally happy with this assertion, but works for now
    expect(wrapper.text()).toMatch('Enable Physics');
  });

  // TODO: test updates
});
