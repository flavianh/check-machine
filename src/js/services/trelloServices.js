import request from 'superagent'

const key = '300140c4a5500bad38c27a4844d7355c';

export function getUserId(token) {
    return new Promise((resolve, reject) => {
        request
        .get(`https://api.trello.com/1/tokens/${token}`)
        .query({
            key,
            token,
        })
        .end((err, res) => {
            if (err) {
                reject(err);
            }
            resolve(JSON.parse(res.text)['idMember']);
        });
    })
}

export function getBoards(token, userId) {
    return new Promise((resolve, reject) => {
        request
        .get(`https://api.trello.com/1//members/${userId}/boards`)
        .query({
            key,
            token,
        })
        .end((err, res) => {
            if (err) {
                reject(err);
            }
            resolve(JSON.parse(res.text));
        });
    })
}

export function getLists(token, boardId) {
    if (boardId === undefined) {
        return new Promise((resolve) => resolve([]))
    }
    return new Promise((resolve, reject) => {
        request
        .get(`https://api.trello.com/1//boards/${boardId}/lists`)
        .query({
            key,
            token,
        })
        .end((err, res) => {
            if (err) {
                reject(err);
            }
            resolve(JSON.parse(res.text));
        });
    })
}

export function createCard(token, listId, name, due) {
    return new Promise((resolve, reject) => {
        request
        .post('https://api.trello.com/1/cards')
        .query({
            key,
            token,
            name: name,
            pos: 'top',
            idList: listId,
            due
        })
        .end((err, res) => {
            if (err) {
                reject(err);
            }
            resolve(JSON.parse(res.text));
        });
    })
}

export default {getUserId, getBoards, getLists, createCard}