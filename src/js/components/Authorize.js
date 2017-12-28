import React from 'react';
import Button from 'material-ui/Button';
import styled from 'styled-components';
import storageGet from '../services/storage'

import _ from 'lodash'
import '../lib/trello'

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

class Authorize extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
    };
  }

  authorize() {
    window.Trello.authorize({
      type: 'redirect',
      name: 'Check Machine',
      scope: {
        read: true,
        write: true
      },
      expiration: 'never',
      error: () => {
        console.warn('Error during Trello authorization');
      }
    });
  }

  async componentWillMount() {
    if (_.startsWith(window.location.hash, '#token=')) {
      let token = _.split(window.location.hash, '=', 2)[1]
      this.setState({
        isAuthenticated: true,
      });
      window.Trello.setToken(token);
      chrome.storage.sync.set({
          trello_token: token,
      });
    } else {
      const token = await storageGet('trello_token')
      this.setState({
        isAuthenticated: !_.isEmpty(token),
      });
      window.Trello.setToken(token);
    }
  }

  render() {
    if (!this.state.isAuthenticated) {
        return (
            <StyledContainer>
              <Button onClick={this.authorize} raised color="primary">
                Connect To Trello
              </Button>
            </StyledContainer>
          );
    } else {
        return (
            <div>
              <p>Hello, you are connected</p>
            </div>
          )
    }
  }
}

export default Authorize;