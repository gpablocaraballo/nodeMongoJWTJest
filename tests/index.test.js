const supertest = require('supertest');
const { server } = require('../challenge-api');
const db = require('./db');
const { user, book } = require('./mocks');
const { MESSAGES } = require( '../libs/constants' );
const User   = require( '../models/user' );
const BlockedPublishers = require( '../models/blockedPublishers');
const api = supertest(server);

/* eslint-env jest */

jest.setTimeout(6000); 

let publishedBooks = [];
let deletedBook;
let userToken;
let superAdminToken;
let darthVaderToken; // pseudonym = anakin
const contentTypeJsonRegex = /application\/json/;
const contentTypeXmlRegex = /xml/;
const acceptsXml = 'application/xml';

// Setup connection to the database
beforeAll(async () => {
  await db.connect();
  // add _Darth Vader_ user for testing
  await api.post('/user/register').send(user.darthVaderPayload);
  const darthVaderUser = await User.findOne ({ 'username' : user.darthVaderPayload.username });

  //  we save the _Darth Vader_ token
  const darthVaderResponse = await api.post('/auth/login')
    .send(user.darthVaderPayload);
  darthVaderToken = darthVaderResponse.body.token; 

  // also we put Darth Vader into the blocked publisher list, so he cant publish books (Bonus)
  const blockedUser = new BlockedPublishers();
  blockedUser.author = User.getObjectId(darthVaderUser._id);
  await blockedUser.save();

  //  add a super admin user to play with
  await api.post('/user/register')
    .send(user.superAdminPayload); // we use it later :)
  // also we set superAdmin: true for this user.
  await User.findOneAndUpdate({ username: user.superAdminPayload.username },{ superAdmin: true });
  // we save the superAdmin token
  const superAdminResponse = await api.post('/auth/login')
    .send(user.superAdminPayload);
  superAdminToken = superAdminResponse.body.token;   
  
});
// beforeEach(async () => await db.clear());
afterAll(async () => {
  await db.close();
  server.close();
});

describe('some user actions to test' , () => {
  test('register fails because invalid fields', async () => {
    // check required fields
    let response = await api.post('/user/register')
      .expect(400)
      .expect('Content-Type', contentTypeJsonRegex);
    let data = response.body;
    expect(data.error).toBe(true);
        
    // check required password
    response = await api.post('/user/register')
      .send(user.unCompletedPayload)
      .expect(400)
      .expect('Content-Type', contentTypeJsonRegex);
    data = response.body;
    expect(data.errors.includes(MESSAGES.FIELDS_PASSWORD_REQ)).toBe(true);

    // check for invalid password
    response = await api.post('/user/register')
      .send(user.invalidPasswPayload)
      .expect(400)
      .expect('Content-Type', contentTypeJsonRegex);
    data = response.body;
    expect(data.errors.includes(MESSAGES.FIELDS_PASSWORD_REGEX_MESSAGE)).toBe(true);
  });

  test('register user successfully', async () => {
    await api.post('/user/register')
      .send(user.validPayload)
      .expect(200)
      .expect('Content-Type', contentTypeJsonRegex);

    // we register a second user
    await api.post('/user/register')
      .send(user.secondValidPayload)
      .expect(200)
      .expect('Content-Type', contentTypeJsonRegex);
  });
    
  test('login failed/user not found', async () => {        
    const response = await api.post('/auth/login')
      .send(user.unknowUserPayload)
      .expect(404)
      .expect('Content-Type', contentTypeJsonRegex);
    const data = response.body;
    expect(data.error).toBe(true);
    expect(data.msg).toBe(MESSAGES.USER_NOT_FOUND);
  });

  test('login success', async () => {        
    const response = await api.post('/auth/login')
      .send(user.validPayload)
      .expect(200)
      .expect('Content-Type', contentTypeJsonRegex);
    userToken = response.body.token;       
  });

  test('get authorization token fails', async () => {        
    await api.get('/user/detail')
      .set('Authorization', 'INVALID_TOKEN')
      .expect(401); // the token authorization was invalid or missing
  });

  test('get user detail successfully', async () => {        
    const response = await api.get('/user/detail')
      .set('Authorization', userToken)
      .expect(200)
      .expect('Content-Type', contentTypeJsonRegex);
    const data = response.body;
    expect(data.username).toBe(user.validPayload.username);
    expect(data.pseudonym).toBe(user.validPayload.pseudonym);
  });

  test('update user failed', async () => {        
    const response = await api.patch('/user/update')
      .set('Authorization', userToken)
      .send({}) // SEND EMPTY PSEUDONYM BUT IS REQUIRED
      .expect(400)
      .expect('Content-Type', contentTypeJsonRegex);
    const data = response.body;
    expect(data.msg).toBe(MESSAGES.FIELDS_PSEUDONYM_REQ); // PSEUDONYM IS REQUIRED
  });

  test('update user data successfully', async () => {
    await api.patch('/user/update')
      .set('Authorization', userToken)
      .send({pseudonym: user.validPayload.pseudonym})
      .expect(200);
  });

  test('publish fails with wrong price', async () => {
    const response = await api.post('/user/publish')
      .set('Authorization', userToken)
      .send(book.wrongPricePayload)
      .expect(400);
    const data = response.body;
    expect(data.errors.includes(MESSAGES.FIELDS_PRICE_REQ)).toBe(true);        
  });

  test('publish fails because required fields', async () => {
    const response = await api.post('/user/publish')
      .set('Authorization', userToken)
      .send(book.unCompletedPayload)
      .expect(400);
    const data = response.body;
    expect(data.errors.includes(MESSAGES.FIELDS_TITLE_REQ)).toBe(true);
    expect(data.errors.includes(MESSAGES.FIELDS_DESCRIPTION_REQ)).toBe(true);    
    expect(data.errors.includes(MESSAGES.FIELDS_COVER_REQ)).toBe(true);        
  });

  test('publish fails because you are _Darth Vader_ :P', async () => {
    const response = await api.post('/user/publish')
      .set('Authorization', darthVaderToken)
      .send(book.validPayload)
      .expect(403);
    const data = response.body;
    expect(data.msg).toBe(MESSAGES.BLOCKED_PUBLISHER_WARNING);
  });

  test('publish book success', async () => {
    let response = await api.post('/user/publish')
      .set('Authorization', userToken)
      .send(book.validPayload)
      .expect(200);
    let data = response.body;
    publishedBooks.push(data.book);

    // publish a second book
    response = await api.post('/user/publish')
      .set('Authorization', userToken)
      .send(book.secondValidPayload);
    data = response.body;
    publishedBooks.push(data.book);

    // publish a third book
    response = await api.post('/user/publish')
      .set('Authorization', userToken)
      .send(book.thirdValidPayload);
    data = response.body;
    publishedBooks.push(data.book);
  });

  test('unpublish book success', async () => {
    await api.delete(`/user/unpublish/${publishedBooks[publishedBooks.length - 1].id}`)
      .set('Authorization', userToken)
      .expect(200);
    deletedBook = publishedBooks[publishedBooks.length - 1];
  });

  test('unpublish unknown book', async () => {
    const response = await api.delete(`/user/unpublish/${publishedBooks[publishedBooks.length - 1].id}`)
      .set('Authorization', userToken)
      .expect(404);
    const data = response.body;
    expect(data.msg).toBe(MESSAGES.IS_YOUR_BOOK); // already we deleted this book
    publishedBooks.pop(); // delete last item from array (Deleted one)
  });    
});

describe('test books endpoints' , () => {
  test('get book list', async () => {        
    const response = await api.get('/book/list')
      .expect(200)
      .expect('Content-Type', contentTypeJsonRegex);
    const data = response.body;
    expect(data.books.length).toBe(publishedBooks.length);
  });

  test('test book in xml content type', async () => {        
    await api.get('/book/list')
      .set('Accept', acceptsXml)
      .expect(200)
      .expect('Content-Type', contentTypeXmlRegex);
  });

  test('get correct book detail', async () => {        
    const response = await api.get(`/book/detail?id=${publishedBooks[0].id}`)
      .expect(200);
    const { book } = response.body;
    expect(book.title).toBe(publishedBooks[0].title);
  });

  test('not found book detail', async () => {        
    await api.get(`/book/detail?id=${deletedBook.id}`)
      .expect(404);
  });
});

describe('test admin endpoints' , () => {
  test('put an user to the blocked list', async () => {        
    const commonUser = await User.findOne ({ 'username' : user.validPayload.username });
    const superAdminUser = await User.findOne ({ 'username' : user.superAdminPayload.username });
    // we block a common user
    await api.post(`/admin/blockauthor/${commonUser._id}`)
      .set('Authorization', superAdminToken)
      .expect(200);

    // you cant block yourself
    let blockResponse = await api.post(`/admin/blockauthor/${superAdminUser._id}`)
      .set('Authorization', superAdminToken)
      .expect(403);    
    let data = blockResponse.body;
    expect(data.msg).toBe(MESSAGES.YOU_CANT_DO_THIS);  
        
    // also you cant perform this action if you are a regular user
    await api.post(`/admin/blockauthor/${commonUser._id}`)
      .set('Authorization', userToken)
      .expect(403);

    // you cant block twice the same user
    blockResponse = await api.post(`/admin/blockauthor/${commonUser._id}`)
      .set('Authorization', superAdminToken)
      .expect(403);
    data = blockResponse.body;
    expect(data.msg).toBe(MESSAGES.AUTHOR_ALREADY_BLOCKED);       
  });

  test('remove a regular user', async () => {        
    const commonUser = await User.findOne ({ 'username' : user.secondValidPayload.username });
    const superAdminUser = await User.findOne ({ 'username' : user.superAdminPayload.username });
    // we remove a common user
    await api.delete(`/admin/remove/${commonUser._id}`)
      .set('Authorization', superAdminToken)
      .expect(200);

    // you cant remove yourself
    let blockResponse = await api.delete(`/admin/remove/${superAdminUser._id}`)
      .set('Authorization', superAdminToken)
      .expect(403);    
    let data = blockResponse.body;
    expect(data.msg).toBe(MESSAGES.YOU_CANT_DO_THIS);  
        
    // also you cant perform this action if you are a regular user
    await api.delete(`/admin/remove/${commonUser._id}`)
      .set('Authorization', userToken)
      .expect(403);

    // you cant remove twice the same user
    blockResponse = await api.delete(`/admin/remove/${commonUser._id}`)
      .set('Authorization', superAdminToken)
      .expect(404);
    data = blockResponse.body;
    expect(data.msg).toBe(MESSAGES.USER_NOT_FOUND);
  });    
});