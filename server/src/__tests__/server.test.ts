const request = require('supertest');

const serverApp = require('../app');

describe('Server', () => {
    describe('Server.ts', () => {
        test('Initial load', () => {
            return request(serverApp).get('/initial-load').expect(200);
        });
        test('Filter with empty payload', () => {
            return request(serverApp)
                .post('/filter')
                .type('json')
                .send({})
                .set('Accept', /application\/json/)
                .expect(200);
        });
        test('Filter with payload', () => {
            const filter = {
                name: 'react',
                sortby: 'alfabet',
                withWebsite: 'false',
                isPrivate: 'false',
                isArchived: 'false'
            };
            return request(serverApp)
                .post('/filter')
                .type('json')
                .send({ nameFilter: filter, packFilter: [] })
                .set('Accept', /application\/json/)
                .expect(200);
        });
    });
});
