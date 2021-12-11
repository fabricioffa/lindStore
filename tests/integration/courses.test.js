const request = require('supertest');
const Course = require('../../src/models/Course');
const { app, conn } = require('../../server');

describe('api/courses', () => {
  let agent;

  beforeEach(() => (agent = request.agent(app)));

  afterAll(async () => {
    conn && (await conn.close());
  });

  describe('GET /', () => {
    it('should return all courses if there are courses ', async () => {
      await Course.create({
        name: 'aname',
        imgSrc: 'imgSrc',
        imgAlt: 'imgAlt',
        price: 15,
      });

      const res = await agent.get('/api/courses');

      expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({ name: 'aname' })]));
    });

    it('should return an empty array and 404 if there are no courses ', async () => {
      await Course.deleteMany({});

      const res = await agent.get('/api/courses');

      expect(res.body).toStrictEqual([]);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    afterEach(async () => await Course.deleteMany({}));

    test.each([
      { imgSrc: 'imgSrc', imgAlt: 'imgAlt', price: 15 },
      { name: 'aname', imgAlt: 'imgAlt', price: 15 },
      { name: 'aname', imgSrc: 'imgSrc', price: 15 },
      { name: 'aname', imgSrc: 'imgSrc', imgAlt: 'imgAlt' },
    ])('given the payload is %p it should return 400', async (payload) => {
      const res = await agent.post('/api/courses').send(Object.assign(payload));

      expect(res.status).toBe(400);
    });

    test.each([{ name: 'name' }, { name: 'a'.repeat(256) }, { name: 12 }, { name: null }])(
      'given the name is %p it should return 400',
      async (payload) => {
        const res = await agent
          .post('/api/courses')
          .send(Object.assign(payload, { imgSrc: 'imgSrc', imgAlt: 'imgAlt', price: 15 }));

        expect(res.status).toBe(400);
      },
    );

    test.each([{ imgSrc: 'aaaa' }, { imgSrc: 'a'.repeat(256) }, { imgSrc: 12 }, { imgSrc: null }])(
      'given the imgSrc is %p it should return 400',
      async (payload) => {
        const res = await agent
          .post('/api/courses')
          .send(Object.assign(payload, { name: 'aname', imgAlt: 'imgAlt', price: 15 }));

        expect(res.status).toBe(400);
      },
    );

    test.each([{ imgAlt: 'aaaa' }, { imgAlt: 'a'.repeat(256) }, { imgAlt: 12 }, { imgAlt: null }])(
      'given the imgAlt is %p it should return 400',
      async (payload) => {
        const res = await agent
          .post('/api/courses')
          .send(Object.assign(payload, { name: 'aname', imgSrc: 'imgSrc', price: 15 }));

        expect(res.status).toBe(400);
      },
    );

    test.each([{ price: 'a' }, { price: 9 }, { price: 3001 }, { price: -1 }, { price: null }])(
      'given the price is %p it should return 400',
      async (payload) => {
        const res = await agent
          .post('/api/courses')
          .send(Object.assign(payload, { name: 'aname', imgAlt: 'imgAlt', price: 15 }));

        expect(res.status).toBe(400);
      },
    );

    it('should not permit creating multiples courses with the same name', async () => {
      const payload = {
        name: 'aname',
        imgSrc: 'imgSrc',
        imgAlt: 'imgAlt',
        price: 15,
      };

      await Course.create(payload);

      const res = await agent.post('/api/courses').send(payload);

      expect(res.status).toBe(400);
    });
  });
});
