const {
  Types: { ObjectId },
} = require('mongoose');
const request = require('supertest');
const Course = require('../../src/models/Course');
const { app, conn } = require('../../server');

describe('api/courses', () => {
  let agent;
  const payload = {
    name: 'aname',
    imgSrc: 'imgSrc',
    imgAlt: 'imgAlt',
    price: 15,
    description: 'description',
  };

  beforeEach(() => (agent = request.agent(app)));

  afterAll(async () => {
    conn && (await conn.close());
  });

  describe('GET /', () => {
    it('should return an empty array and 404 if there are no courses ', async () => {
      await Course.deleteMany({});

      const res = await agent.get('/api/courses');

      expect(res.body).toStrictEqual([]);
      expect(res.status).toBe(404);
    });

    it('should return all courses if there are courses ', async () => {
      await Course.create(payload);

      const res = await agent.get('/api/courses');

      expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({ name: 'aname' })]));
    });
  });

  describe('POST /', () => {
    afterEach(async () => await Course.deleteMany({}));

    test.each([
      { imgSrc: 'imgSrc', imgAlt: 'imgAlt', price: 15, description: 'description' },
      { name: 'aname', imgAlt: 'imgAlt', price: 15, description: 'description' },
      { name: 'aname', imgAlt: 'imgAlt', price: 15, description: 'description' },
      { name: 'aname', imgSrc: 'imgSrc', price: 15, description: 'description' },
      { name: 'aname', imgSrc: 'imgSrc', imgAlt: 'imgAlt', description: 'description' },
      { name: 'aname', imgSrc: 'imgSrc', imgAlt: 'imgAlt', price: 15 },
    ])('given the payload is %p it should return 400', async (payload) => {
      const res = await agent.post('/api/courses').send(payload);

      expect(res.status).toBe(400);
    });

    test.each([{ name: 'name' }, { name: 'a'.repeat(256) }, { name: 12 }, { name: null }])(
      'given the name is %p it should return 400',
      async (payload) => {
        const res = await agent
          .post('/api/courses')
          .send(Object.assign(payload, { imgSrc: 'imgSrc', imgAlt: 'imgAlt', price: 15, description: 'description' }));

        expect(res.status).toBe(400);
      },
    );

    test.each([{ imgSrc: 'aaaa' }, { imgSrc: 'a'.repeat(256) }, { imgSrc: 12 }, { imgSrc: null }])(
      'given the imgSrc is %p it should return 400',
      async (payload) => {
        const res = await agent
          .post('/api/courses')
          .send(Object.assign(payload, { name: 'aname', imgAlt: 'imgAlt', price: 15, description: 'description' }));

        expect(res.status).toBe(400);
      },
    );

    test.each([{ imgAlt: 'aaaa' }, { imgAlt: 'a'.repeat(256) }, { imgAlt: 12 }, { imgAlt: null }])(
      'given the imgAlt is %p it should return 400',
      async (payload) => {
        const res = await agent
          .post('/api/courses')
          .send(Object.assign(payload, { name: 'aname', imgSrc: 'imgSrc', price: 15, description: 'description' }));

        expect(res.status).toBe(400);
      },
    );

    test.each([{ description: 'aaaa' }, { description: 'a'.repeat(1201) }, { description: 12 }, { description: null }])(
      'given the description is %p it should return 400',
      async (payload) => {
        const res = await agent
          .post('/api/courses')
          .send(Object.assign(payload, { name: 'aname', imgSrc: 'imgSrc', price: 15, imgAlt: 'imgAlt' }));

        expect(res.status).toBe(400);
      },
    );

    test.each([{ price: 'a' }, { price: 9 }, { price: 3001 }, { price: -1 }, { price: null }])(
      'given the price is %p it should return 400',
      async (payload) => {
        const res = await agent
          .post('/api/courses')
          .send(Object.assign(payload, { name: 'aname', imgAlt: 'imgAlt', price: 15, description: 'description' }));

        expect(res.status).toBe(400);
      },
    );

    it('should not permit creating multiples courses with the same name', async () => {
      await Course.create(payload);

      const res = await agent.post('/api/courses').send(payload);

      expect(res.status).toBe(400);
    });

    it('should return the course if the data is valid', async () => {
      const res = await agent.post('/api/courses').send(payload);

      expect(res.body).toEqual(
        expect.objectContaining({
          name: 'aname',
          imgSrc: 'imgSrc',
          imgAlt: 'imgAlt',
          price: 15,
          description: 'description',
          _id: expect.any(String),
        }),
      );
    });
  });

  describe('PUT /', () => {
    let course;

    beforeEach(async () => (course = await Course.create(payload)));

    afterEach(async () => await Course.deleteMany({}));

    it('should not accept a wrongly formatted id', async () => {
      const res = await agent.put('/api/courses/1234');

      expect(res.status).toBe(400);
    });

    it('should return 404 if id does not matches', async () => {
      const id = ObjectId();

      const res = await agent.put('/api/courses/' + id).send({ name: 'aname' });

      expect(res.status).toBe(404);
    });

    test.each([{ name: 'name' }, { name: 'a'.repeat(256) }, { name: 12 }, { name: null }])(
      'given the name is %p it should return 400',
      async (payload) => {
        const res = await agent.put('/api/courses/' + course._id).send(payload);

        expect(res.status).toBe(400);
      },
    );

    test.each([{ imgSrc: 'img' }, { imgSrc: 'a'.repeat(256) }, { imgSrc: 12 }, { imgSrc: null }])(
      'given the imgSrc is %p it should return 400',
      async (payload) => {
        const res = await agent.put('/api/courses/' + course._id).send(payload);

        expect(res.status).toBe(400);
      },
    );

    test.each([{ imgAlt: 'img' }, { imgAlt: 'a'.repeat(256) }, { imgAlt: 12 }, { imgAlt: null }])(
      'given the imgAlt is %p it should return 400',
      async (payload) => {
        const res = await agent.put('/api/courses/' + course._id).send(payload);

        expect(res.status).toBe(400);
      },
    );

    test.each([{ price: 'a' }, { price: 9 }, { price: 3001 }, { price: -1 }, { price: null }])(
      'given the price is %p it should return 400',
      async (payload) => {
        const res = await agent.put('/api/courses/' + course._id).send(payload);

        expect(res.status).toBe(400);
      },
    );

    test.each([{ description: 'aaaa' }, { description: 'a'.repeat(1201) }, { description: 12 }, { description: null }])(
      'given the description is %p it should return 400',
      async (payload) => {
        const res = await agent.post('/api/courses').send(payload);

        expect(res.status).toBe(400);
      },
    );

    it('should return the modified course', async () => {
      const res = await agent.put('/api/courses/' + course._id).send({ name: 'newName' });

      const courseUpdated = await Course.findById(course._id);
      expect(res.body.name).toBe(courseUpdated.name);
    });
  });

  describe('DELETE /', () => {
    let course;

    beforeEach(async () => (course = await Course.create(payload)));

    afterEach(async () => await Course.deleteMany({}));

    it('should not accept a wrongly formatted id', async () => {
      const res = await agent.delete('/api/courses/1234');

      expect(res.status).toBe(400);
    });

    it('should return 404 if id does not matches', async () => {
      const id = ObjectId();

      const res = await agent.delete('/api/courses/' + id);

      expect(res.status).toBe(404);
    });

    it('should delete the course if id matches', async () => {
      const res = await agent.delete('/api/courses/' + course._id);

      expect(await Course.exists({ _id: course._id })).toBe(false);
    });

    it('should return the deleted course if id matches', async () => {
      const res = await agent.delete('/api/courses/' + course._id);

      expect(res.body).toEqual(
        expect.objectContaining({
          name: 'aname',
          imgSrc: 'imgSrc',
          imgAlt: 'imgAlt',
          price: 15,
          description: 'description',
          _id: course._id.toString(),
        }),
      );
    });
  });

  describe('GET /:id', () => {
    let course;

    beforeEach(async () => (course = await Course.create(payload)));

    afterEach(async () => await Course.deleteMany({}));

    it('should not accept a wrongly formatted id', async () => {
      const res = await agent.get('/api/courses/1234');

      expect(res.status).toBe(400);
    });

    it('should return 404 if id does not matches', async () => {
      const id = ObjectId();

      const res = await agent.get('/api/courses/' + id);

      expect(res.status).toBe(404);
    });

    it('should return course if id matches', async () => {
      const res = await agent.get('/api/courses/' + course._id);

      expect(res.body).toEqual(
        expect.objectContaining({
          name: 'aname',
          imgSrc: 'imgSrc',
          imgAlt: 'imgAlt',
          price: 15,
          description: 'description',
          _id: course._id.toString(),
        }),
      );
    });
  });
});
