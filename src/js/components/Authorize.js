import React from 'react';
import Button from 'material-ui/Button';
import styled from 'styled-components';

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

    const isAuthenticated =
      window.localStorage.getItem('user_trello_token') !== null;

    this.state = {
      isAuthenticated,
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

  componentWillMount() {
    if (this.state.isAuthenticated) {
      const token = window.localStorage.getItem('user_trello_token');
      window.Trello.setToken(token);
    } else if (_.startsWith(window.location.hash, '#token=')) {
      let token = _.split(window.location.hash, '=', 2)[1]
      this.setState({
        isAuthenticated: true
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