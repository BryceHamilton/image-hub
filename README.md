# Image Hub

A RESTful API serving Images with Express, Node, AWS S3, Mongoose, and authentication with JWT <br> Deployed on Heroku, and Okteto with Docker and Kubernetes

Serving from Heroku at: https://image-hub101.herokuapp.com/images <br>
Serving from Okteto at: <s>image-hub-brycehamilton.cloud.okteto.net/images</s> [DOWN]

## Usage

Visit the Client app: https://image-hub101.netlify.app <br>
(fetching from https://image-hub101.herokuapp.com/images)

Existing Users:

- username: a | password: a
- username: b | password: b
- username: c | password: c

### Browse all Public Images - `/`

![Home](./assets/screenshots/home-page.png)

### Login or Signup - `/login`

![Login](./assets/screenshots/login.png)

### View Public/Private Images on Profile - `/profile`

![Profile](./assets/screenshots/profile.png)

### Upload one or many Images (Private by default) - `/upload`

![Upload](./assets/screenshots/upload.png)

### Delete one or selected Images

![Delete](./assets/screenshots/delete.png)

See source code for the Client app: https://github.com/BryceHamilton/image-hub-client

### Thank you!
Yes, this is essentially a GUI for an S3 Bucket full of farm animals photos, please enjoy
