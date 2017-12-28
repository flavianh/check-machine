import React from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import styled from 'styled-components';
import {storageGet} from '../services/storage'
import {getUserId, getBoards, getLists} from '../services/trelloServices'

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

  handleChange() {
    return event => {
      this.setState({ [event.target.name]: event.target.value });
    };
  }

  handleBoardChange() {
    return (event) => {
      const board = event.target.value
      getLists(this.state.token, board).then((lists) => {
        this.setState({ lists, board });
        chrome.storage.sync.set({
          board
        });
      })
    };
  }

  saveListBoard() {
    chrome.storage.sync.set({
      list: this.state.list
    });
    chrome.runtime.sendMessage({
        type: 'basic',
        iconUrl: 'icon-34.png',
        title: 'Trello board and list set',
        message: 'You can now automatically add commitments by selecting them'
    });
  }

  async componentWillMount() {
    let token
    if (_.startsWith(window.location.hash, '#token=')) {
      token = _.split(window.location.hash, '=', 2)[1]
    } else {
      token = await storageGet('token');
    }

    if (!_.isEmpty(token)) {
      window.Trello.setToken(token);
      const userId = await getUserId(token)
      const boards = await getBoards(token, userId);
      const board = await storageGet('board') || boards[0].id;
      const lists = await getLists(token, board)
      const list = await storageGet('list');
      this.setState({
        isAuthenticated: true,
        boards,
        lists,
        token,
        board,
        list,
      })
      chrome.storage.sync.set({
        token
      });
    } else {
      this.setState({
        isAuthenticated: false,
      });
    }
  }

  render() {
    if (_.isNull(this.state)) {
      return (
        <div></div>
      )
    }

    if (!this.state.isAuthenticated) {
        return (
            <StyledContainer>
              <Button onClick={this.authorize} raised color="primary">
                Connect To Trello
              </Button>
            </StyledContainer>
          );
    } else {
        const boards = this.state.boards || [];
        const lists = this.state.lists || [];
        return (
            <div>
              <TextField
                id="select-board"
                select
                label="Select your board"
                value={this.state.board}
                onChange={this.handleBoardChange()}
                SelectProps={{
                  native: true,
                }}
                margin="normal"
              >
                {boards.map(board => (
                  <option key={board.id} value={board.id}>
                    {board.name}
                  </option>
                ))}
              </TextField>
              <TextField
                id="select-list"
                select
                label="Select your list"
                value={this.state.list}
                name="list"
                onChange={this.handleChange()}
                SelectProps={{
                  native: true,
                }}
                margin="normal"
              >
                {lists.map(list => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </TextField>
              <Button onClick={this.saveListBoard.bind(this)} raised color="primary">
                Save
              </Button>
            </div>
          )
    }
  }
}

export default Authorize;