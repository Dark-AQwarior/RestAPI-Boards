# RestAPI-Boards

> This is a RestAPI Project which uses NodeJS, Express and SQLite3.

![RestAPI](https://www.mindinventory.com/blog/wp-content/uploads/2021/09/rest-api-model-1.png)

Use `npm start` in the main folder of the project where `index.js` file exists to start the project successfully.

## Routes in RestAPI-Boards

> `GET/boards` : Just a hello message \n
> `POST/boards/register` : Register a new user for logging in to test authentication. \n
> `POST/boards/login` : Logging in the user registered in the above route. \n
> `POST/boards` : Insert data into databse through response.body raw json format. \n
> `PUT/boards/:id` : Update the state field in the database through the :id in the parameters of the URL. \n
> `POST/boards/articles/:pageNumber` : To find the <pageNumber> list of top articles based on the number of comments in desc order. \n
