const request = require('supertest');
const { app, server } = require('../src/app');

describe('Health Check API', () => {
  afterAll((done) => {
    // Close the server and any other open handles after tests finish
    server.close(done);
  });

  it('should return 200 and status OK on GET /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('status', 'OK');
  });
});
