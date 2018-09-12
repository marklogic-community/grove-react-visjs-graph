/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import GraphContainer from './GraphContainer';

describe('<GraphContainer/>', () => {
  it('works', () => {
    expect(shallow(<GraphContainer />).length).toEqual(1);
  });
});
