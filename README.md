# Pic Lounge
## _A vibrant and engaging social media application_



Piclounge is a vibrant and engaging social media application that allows users to connect, share, and discover captivating visual content. Powered by React.js and Node.js, Piclounge provides an immersive and intuitive user experience.

- Amazing media sharing experience

## Features

- User authentication with email verification.
- Media Sharing with less amount of processing time.
- Responsive for all Screen size.
- Chating feature included.

## Tech

Pic Lounge using number of tech to power the functionality:

- ![React JS](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) - A powerfull javascript framework, used to build web-applications!
- ![Express JS](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) - Another javascript framework used to build server using nodejs environment.
- ![Mongo DB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) - A document based database.


## Run on Local Machine

Pic Lounge requires [Node.js](https://nodejs.org/) v18+ to run.
You will find two root folder in the repository. Client and Server, as it's name both contains different type of code.


### `Run Server`

**Prerequisite**
- Application specific google password
- An Imagekit account

1. Create a `.env` in root of server folder and add following Variable.



```bash
PORT=8080
EMAIL_PASSWORD=<GOOGLE_APPLICATION_SPECIFIC_PASSWORD>
IMAGEKIT_PUBLIC_KEY=<YOUR_IMAGEkIT_PUBLIC_KEY>
IMAGEKIT_PRIVATE_KEY=<YOUR_IMAGEKIT_PRIVATE_KEY>
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/<IMAGEKIT_ENDPOINT>
JWT_SECRET_KEY=<YOUR_JWT_SCERET_KEY>
DB_URL=<YOUR_MONGO_DB_URL>
```

2. Navigate to ```./server/controller/authenticationController.js``` and replace ```piclounge.developer@gmail.com``` with your email at line number 13 and 87.



Install the dependencies and devDependencies and start the server.
```sh
cd server
npm install 
npm start
```

### `Run Client`

Before we open our terminal to start the client lets change few fileds in following files.

- In ```client\src\components\profile\ProfileImageUploader.jsx``` at line number 20, 21 and in ```client\src\components\home\ImageUploader.jsx``` at line 15 and 16,  change it with your Imagekit publickey and urlendpoint.


Install Yarn to your local mashine (NOTE:- if you already have yarn installed you can skip this step.)

```sh
npm install --global yarn
```

Install the dependencies and devDependencies and start the client.

```sh
cd client
yarn install
yarn start
```


## `Access the application`
- Open any browser and hit `http://localhost:3000`




## License

MIT License

Copyright (c) 2023 Rohan Mourya

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.





## Thank You..