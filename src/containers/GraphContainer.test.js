/* eslint-env jest */
import React from 'react';
import { mount } from 'enzyme';
import GraphContainer from './GraphContainer';
import nock from 'nock';

describe('<GraphContainer/>', () => {
  it('calls backend API', () => {
    const mockCall = jest.fn();
    mockCall.mockReturnValue(Promise.resolve({ nodes: [], edges: [] }));
    mount(<GraphContainer startingUris={[]} fetchData={mockCall} />);
    expect(mockCall).toHaveBeenCalledWith([]);
  });

  describe('with default API', () => {
    afterEach(nock.cleanAll);

    it('handles a 401', () => {
      const scope = nock('http://localhost')
        .get(/visjs/)
        .reply(401, '<html></html>');
      expect(mount(<GraphContainer startingUris={[]} />).text()).toMatch(
        'Enable Physics'
      );
      expect(scope.isDone()).toBe(true);
    });
  });
});
