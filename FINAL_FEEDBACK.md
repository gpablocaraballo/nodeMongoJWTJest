### Strong points:
    A postman collection with the main endpoint is included in the project.
    He used a mongo collection for blocked publishers, but in comments and the video, he mentioned that in a real scenario he would use roles and permissions.
    The postman collection is organized in steps to make the testing easier.
    He used Jest for testing and in-memory Mongo database. All tests passed.
    The code style is consistent.
    All the messages sent in responses are standardized in a constants file.
    The JWT implementation is correct.
    Most of the functionality requested works as expected. The only one that doesn't is the response as XML feature that uses a different header. He explained the reason for that approach.

### To Improve:

    All the tests are in a single file.
    There isn't a service layer, and business logic is handled by controllers mostly.
    Errors are handled in controllers, there isn't a middleware to catch exceptions and send response status based on exceptions.
    There aren't custom exceptions for errors like not found, input validation, authorization, etc.
    Successful delete sends 200 instead of 204
    Admin, Auth, and User controller endpoints sometimes respond 400 for generic errors when it should be 500.
    A conflict response status should be sent when the username is taken, instead of a bad request.
    The endpoints routes contain verbs like list, remove, update, publish. The REST interface does not follow the Richardson model.
    There isn't a specific format for the responses, for example, in one case a 404 includes error:true and in other doesn't (Admin controller lines 73 & 89)
    He uses /user/publish and unpublish to create/delete books, instead of doing these operations directly in the books resource.
    The data returned from books comes directly from mongo and includes the versioning field ("__v") Formatted data would be desirable.
    The API is not returning JSON or XML based on the Content-type header, instead, he is using Accept. He mentioned the following about it: "If you use Content-Type then on post verb cant use payload application/x-www-form-urlencoded".
    For the tests, he used an approach based on mock data in a js file, a pattern like test factories or object mother would be desirable.
    There are a lot of things going on each test. For example, if we take the last test, each individual one should be a different test. It brings easier to understand tests and makes it easier to identify why a test fails:
    For example:
    describe("When a user is deleted")  
    it("it should successfully delete it if the requester is a SuperAdmin")  
    it("it should fail if a user tries to remove itself")  
    it("it should fail if the requester doesn't have permissions to delete other users")  
    it("it should failed if the user doesn't exist")
    He placed a lot of comments on the test but if the tests are correctly written as described above, there is no need to comment on anything in the code since the test is already self-explanatory. Having said that, this is something that it's pretty easy to learn. The tests cases seem to be ok and that's the most important thing.

### Recommendations:

    Use the Richardson model for REST APIs, it will help you when it comes to the routes definition and status (https://martinfowler.com/articles/richardsonMaturityModel.html)
    There are different standards for REST API responses format based on JSON, you can use one or mention as a comment that you would use it in a real scenario. For example JSend, OData, HAL, Json API.