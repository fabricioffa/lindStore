const {
  Types: { ObjectId },
} = require('mongoose');
const request = require('supertest');
const Book = require('../../src/models/Book');
const { app, conn } = require('../../server');

describe('api/courses', () => {
  let agent;
  const payload = {
    name: 'aname',
    imgSrc: 'imgSrc',
    imgAlt: 'imgAlt',
    price: 15,
    pagesNumber: 123,
    description: 'description',
  };

  beforeEach(() => (agent = request.agent(app)));

  afterAll(async () => {
    conn && (await conn.close());
  });

  describe('GET /', () => {
    it('should return an empty array and 404 if there are no books ', async () => {
      await Book.deleteMany({});

      const res = await agent.get('/api/books');

      expect(res.body).toStrictEqual([]);
      expect(res.status).toBe(404);
    });

    it('should return all books if there are books ', async () => {
      await Book.create(payload);

      const res = await agent.get('/api/books');

      expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining(payload)]));
    });
  });

  describe('POST /', () => {
    afterEach(async () => await Book.deleteMany({}));

    test.each([
      {
        imgSrc: 'imgSrc',
        imgAlt: 'imgAlt',
        price: 15,
        pagesNumber: 123,
        description: 'description',
      },
      {
        name: 'aname',
        imgAlt: 'imgAlt',
        price: 15,
        pagesNumber: 123,
        description: 'description',
      },
      {
        name: 'aname',
        imgSrc: 'imgSrc',
        price: 15,
        pagesNumber: 123,
        description: 'description',
      },
      {
        name: 'aname',
        imgSrc: 'imgSrc',
        imgAlt: 'imgAlt',
        pagesNumber: 123,
        description: 'description',
      },
      {
        name: 'aname',
        imgSrc: 'imgSrc',
        imgAlt: 'imgAlt',
        price: 15,
        description: 'description',
      },
      {
        name: 'aname',
        imgSrc: 'imgSrc',
        imgAlt: 'imgAlt',
        price: 15,
        pagesNumber: 123,
      },
    ])('given the payload is %p it should return 400', async (payload) => {
      const res = await agent.post('/api/books').send(payload);

      expect(res.status).toBe(400);
    });

    test.each([{ name: 'name' }, { name: 'a'.repeat(256) }, { name: 12 }, { name: null }])(
      'given the name is %p it should return 400',
      async (payload) => {
        const res = await agent.post('/api/books').send(
          Object.assign(payload, {
            imgSrc: 'imgSrc',
            imgAlt: 'imgAlt',
            price: 15,
            description: 'description',
            pagesNumber: 123,
          }),
        );

        expect(res.status).toBe(400);
      },
    );

    test.each([{ imgSrc: 'aaaa' }, { imgSrc: 'a'.repeat(256) }, { imgSrc: 12 }, { imgSrc: null }])(
      'given the imgSrc is %p it should return 400',
      async (payload) => {
        const res = await agent.post('/api/books').send(
          Object.assign(payload, {
            name: 'aname',
            imgAlt: 'imgAlt',
            price: 15,
            description: 'description',
            pagesNumber: 123,
          }),
        );

        expect(res.status).toBe(400);
      },
    );

    test.each([{ imgAlt: 'aaaa' }, { imgAlt: 'a'.repeat(256) }, { imgAlt: 12 }, { imgAlt: null }])(
      'given the imgAlt is %p it should return 400',
      async (payload) => {
        const res = await agent.post('/api/books').send(
          Object.assign(payload, {
            name: 'aname',
            imgSrc: 'imgSrc',
            price: 15,
            description: 'description',
            pagesNumber: 123,
          }),
        );

        expect(res.status).toBe(400);
      },
    );

    test.each([{ description: 'aaaa' }, { description: 'a'.repeat(1201) }, { description: 12 }, { description: null }])(
      'given the description is %p it should return 400',
      async (payload) => {
        const res = await agent
          .post('/api/books')
          .send(
            Object.assign(payload, { name: 'aname', imgSrc: 'imgSrc', price: 15, imgAlt: 'imgAlt', pagesNumber: 123 }),
          );

        expect(res.status).toBe(400);
      },
    );

    test.each([{ price: 'a' }, { price: 9 }, { price: 3001 }, { price: -1 }, { price: null }])(
      'given the price is %p it should return 400',
      async (payload) => {
        const res = await agent.post('/api/books').send(
          Object.assign(payload, {
            name: 'aname',
            imgAlt: 'imgAlt',
            price: 15,
            description: 'description',
            pagesNumber: 123,
          }),
        );

        expect(res.status).toBe(400);
      },
    );

    test.each([
      { pagesNumber: 'a' },
      { pagesNumber: 9 },
      { pagesNumber: 3001 },
      { pagesNumber: -1 },
      { pagesNumber: null },
    ])('given the price is %p it should return 400', async (payload) => {
      const res = await agent.post('/api/books').send(
        Object.assign(payload, {
          name: 'aname',
          imgAlt: 'imgAlt',
          imgSrc: 'imgSrc',
          price: 15,
          description: 'description',
        }),
      );

      expect(res.status).toBe(400);
    });

    it('should not permit creating multiples books with the same name', async () => {
      await Book.create(payload);

      const res = await agent.post('/api/books').send(payload);

      expect(res.status).toBe(400);
    });

    it('should return the book if the data is valid', async () => {
      const res = await agent.post('/api/books').send(payload);

      expect(res.body).toEqual(
        expect.objectContaining({
          name: 'aname',
          imgSrc: 'imgSrc',
          imgAlt: 'imgAlt',
          price: 15,
          pagesNumber: 123,
          description: 'description',
          _id: expect.any(String),
        }),
      );
    });
  });

  describe('PUT /', () => {
    let book;

    beforeEach(async () => (book = await Book.create(payload)));

    afterEach(async () => await Book.deleteMany({}));

    it('should not accept a wrongly formatted id', async () => {
      const res = await agent.put('/api/books/1234');

      expect(res.status).toBe(400);
    });

    it('should return 404 if id does not matches', async () => {
      const id = ObjectId();

      const res = await agent.put('/api/books/' + id);

      expect(res.status).toBe(404);
    });

    test.each([{ name: 'name' }, { name: 'a'.repeat(256) }, { name: 12 }, { name: null }])(
      'given the name is %p it should return 400',
      async (payload) => {
        const res = await agent.put('/api/books/' + book._id).send(payload);

        expect(res.status).toBe(400);
      },
    );

    test.each([{ imgSrc: 'aaaa' }, { imgSrc: 'a'.repeat(256) }, { imgSrc: 12 }, { imgSrc: null }])(
      'given the imgSrc is %p it should return 400',
      async (payload) => {
        const res = await agent.put('/api/books/' + book._id).send(payload);

        expect(res.status).toBe(400);
      },
    );

    test.each([{ imgAlt: 'aaaa' }, { imgAlt: 'a'.repeat(256) }, { imgAlt: 12 }, { imgAlt: null }])(
      'given the imgAlt is %p it should return 400',
      async (payload) => {
        const res = await agent.put('/api/books/' + book._id).send(payload);

        expect(res.status).toBe(400);
      },
    );

    test.each([{ description: 'aaaa' }, { description: 'a'.repeat(1201) }, { description: 12 }, { description: null }])(
      'given the description is %p it should return 400',
      async (payload) => {
        const res = await agent.put('/api/books/' + book._id).send(payload);

        expect(res.status).toBe(400);
      },
    );

    test.each([{ price: 'a' }, { price: 9 }, { price: 3001 }, { price: -1 }, { price: null }])(
      'given the price is %p it should return 400',
      async (payload) => {
        const res = await agent.put('/api/books/' + book._id).send(payload);

        expect(res.status).toBe(400);
      },
    );

    test.each([
      { pagesNumber: 'a' },
      { pagesNumber: 9 },
      { pagesNumber: 3001 },
      { pagesNumber: -1 },
      { pagesNumber: null },
    ])('given the price is %p it should return 400', async (payload) => {
      const res = await agent.put('/api/books/' + book._id).send(payload);

      expect(res.status).toBe(400);
    });

    it('should return the modified book', async () => {
      const res = await agent.put('/api/books/' + book._id).send({ name: 'newName' });

      const bookUpdated = await Book.findById(book._id);
      expect(res.body.name).toBe(bookUpdated.name);
    });
  });

  describe('DELETE /', () => {
    let book;

    beforeEach(async () => (book = await Book.create(payload)));

    afterEach(async () => await Book.deleteMany({}));

    it('should not accept a wrongly formatted id', async () => {
      const res = await agent.delete('/api/books/1234');

      expect(res.status).toBe(400);
    });

    it('should return 404 if id does not matches', async () => {
      const id = ObjectId();

      const res = await agent.delete('/api/books/' + id);

      expect(res.status).toBe(404);
    });

    it('should delete the course if id matches', async () => {
      await agent.delete('/api/books/' + book._id);

      expect(await Book.exists({ _id: book._id })).toBe(false);
    });

    it('should return the deleted book if id matches', async () => {
      const res = await agent.delete('/api/books/' + book._id);

      expect(res.body).toEqual(
        expect.objectContaining({
          name: 'aname',
          imgSrc: 'imgSrc',
          imgAlt: 'imgAlt',
          price: 15,
          pagesNumber: 123,
          description: 'description',
          _id: book._id.toString(),
        }),
      );
    });
  });

  describe('GET /:id', () => {
    let book;

    beforeEach(async () => (book = await Book.create(payload)));

    afterEach(async () => await Book.deleteMany({}));

    it('should not accept a wrongly formatted id', async () => {
      const res = await agent.get('/api/books/1234');

      expect(res.status).toBe(400);
    });

    it('should return 404 if id does not matches', async () => {
      const id = ObjectId();

      const res = await agent.get('/api/books/' + id);

      expect(res.status).toBe(404);
    });

    it('should return book if id matches', async () => {
      const res = await agent.get('/api/books/' + book._id);

      expect(res.body).toEqual(
        expect.objectContaining({
          name: 'aname',
          imgSrc: 'imgSrc',
          imgAlt: 'imgAlt',
          price: 15,
          pagesNumber: 123,
          description: 'description',
          _id: book._id.toString(),
        }),
      );
    });
  });
});
