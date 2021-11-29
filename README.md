# node + mongodb + auth jwt + integration testing
Nodejs example working with mongoose, jwt for auth and jest for testing. 
This project are using mongodb-memory-server for integration test. 
Also i used supertest and tools like nodemon.

### INSTRUCTIONS STEPS 📋

_1 . Clone the github repo_

```
git clone https://github.com/gpablocaraballo/nodeMongoJWTJest.git
```

_2 . Enter inside the directory app_

```
cd nodeMongoJWTJest
```

_3 . Install the dependencies_

```
npm install
```

_4 . start the app_

```
npm run dev
``` 

_5 . for testing_

```
npm run test
``` 

### ENDPOINTS 📋

_1 . Register an user_

```
POST http://localhost:8080/user/register -> body:{username, password, pseudonym}
```

_2 . Login_

```
POST http://localhost:8080/auth/login -> body:{username, password}
```

_3 . User detail_

```
GET http://localhost:8080/user/detail -> header Authorization: token
```

_4 . Update pseudonym_

```
PATCH http://localhost:8080/user/update -> header Authorization: token -- body:{pseudonym}
``` 

_5 . User publish book_

```
POST http://localhost:8080/user/publish -> header Authorization: token -- body:{title, description, price, cover}
``` 

_6 . User unpublish book_

```
DELETE http://localhost:8080/user/unpublish/:bookId -> header Authorization: token
``` 

_7 . List of books_

```
GET http://localhost:8080/book/list?q=someName
``` 

_8 . Book detail_

```
GET http://localhost:8080/book/detail?id={BookId}
``` 

### SUPER ADMIN ENDPOINTS 📋

_9 . User list_

```
GET http://localhost:8080/admin/list -> header Authorization: token
``` 

_10 . Blocked users list_

```
GET http://localhost:8080/admin/blockedpublishers -> header Authorization: token
``` 

_11 . Block author_

```
POST http://localhost:8080/admin/blockauthor/{userId} -> header Authorization: token
``` 

_12 . Delete user_

```
DELETE http://localhost:8080/admin/remove/61a084af23c88528b0cd29f2 -> header Authorization: token
``` 

### OTHERS - COMMENTS - FAQS

_Cloud mongoDb: This demo is working with a cloud data base, you can check the conection info in .env 
and also in libs/config.js)_

_Models: This demo use this models schemas: Book (author reference an user), User and BlockedPublishers for blocked users list, you can find the models in /models/ _

_Authorization and permissions: The login store jwt for auth, also there are some actions that only can perform a superAdmin user with the flag set true_

_TESTING: You can try some testing stuff using jest, simple run -> npm run test_
_Database for testing: For testing i use mongodb-memory-server jest and supertest to consume the endpoints_

_TESTING files: Inside src/__tests__/index.test.js_

_POSTMAN: Inside this project there is a postman file, you can import that file into POSTMAN app.
The file name is: ChallengePostman.postman_collection.json_

_SCRIPTS ENVIRONMENTS VARIABLES: Needed mainly in windows also this project use cross-env package_