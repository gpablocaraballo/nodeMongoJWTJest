const user = {
  darthVaderPayload: {
    username: 'anakin',
    password: 'Aa1234567;',
    pseudonym: '_Darth Vader_',
  },
  superAdminPayload: {
    username: 'superadmin',
    password: 'Aa1234567;',
    pseudonym: '_ISeeAll_',
  },    
  validPayload: {
    username: 'user1',
    password: 'Aa1234567;',
    pseudonym: 'some pseudonym',
  },
  secondValidPayload: {
    username: 'user2',
    password: 'Aa1234567;',
    pseudonym: 'some pseudonym',
  },    
  invalidPasswPayload: {
    username: 'user1',
    password: ':(',
    pseudonym: 'some pseudonym',
  },
  unCompletedPayload: {
    username: 'user1',
    pseudonym: 'some pseudonym',
  },
  unknowUserPayload: {
    username: 'not found',
    password: 'not found',
  }
};
const book = {
  validPayload: {
    title: 'css for dummies',
    description: 'Some book desc;',
    cover: 'https://m.media-amazon.com/images/I/41gr3r3FSWL.jpg',
    price: 30,
  },
  secondValidPayload: {
    title: 'html for dummies',
    description: 'Some cheap book;',
    cover: 'https://m.media-amazon.com/images/I/41gr3r3FSWL.jpg',
    price: 30,
  }, 
  thirdValidPayload: {
    title: '(put your book here) for dummies',
    description: 'Some... book;',
    cover: 'https://m.media-amazon.com/images/I/41gr3r3FSWL.jpg',
    price: 30,
  },    
  wrongPricePayload: {
    title: 'css for dummies',
    description: 'Some book desc;',
    cover: 'https://m.media-amazon.com/images/I/41gr3r3FSWL.jpg',
    price: 'hello',
  },
  unCompletedPayload: {
  },
};
module.exports = { user, book};
