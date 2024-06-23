<p align="center">
  <img width=30% src="https://github.com/sandygudie/Kanban/assets/54219127/8715c416-f01b-4cf5-980d-154525d5ecf9" alt="Track logo"/>
</p>

<br/> 

## Overview 🗒
The Kanban application is a web-based project management tool designed to facilitate task management and track project progress. Users can create workspace and project boards, and organize tasks and subtasks within these boards.

The application features a user-friendly interface with drag-and-drop functionality for easy task management. It also includes features for real-time collaboration, task assignment, due dates, and progress tracking.

<br/>

## Technologies used 💻
The application is built using several technologies and tools
* **Frontend** : Vite ReactJS, TypeScript, TailwindCSS, Redux RTK, Ant Design, GSAP, Formik
* **[Backend](https://github.com/sandygudie/kanban-api)** : NodeJs ExpressJS, MongoDB, Nodemon, BycrptJs, JWT, Cors, EJS, Nodemailer 
* **[Chat Microservices](https://github.com/sandygudie/chat-microservice)** : NodeJs ExpressJS, MongoDB, Nodemon, Websocket
* **Formatting and code syntax** : ESlint, Prettier
* **Testing** : Cypress
* **Deployment** : Vercel, Render
* **CI/CD** : Docker Compose, GitHub Action

<br/>

## Site url 🌏
[https://kanban-track.vercel.app/](https://kanban-track.vercel.app/)

<br/>

## Views 🏞
<img width="1280" alt="Screenshot 2024-04-08 at 10 26 51" src="https://github.com/sandygudie/Kanban/assets/54219127/3a1bc34c-3faf-4e4a-b5ab-f098d6dc3419">

<img width="1276" alt="Screenshot 2024-04-08 at 15 08 08" src="https://github.com/sandygudie/Kanban/assets/54219127/c7aab631-b66a-4c11-8365-a8f14e6c4ba4">


<br/>

## Features 🚀

- Access to mutiple workspace and project boards.
- Invite members and join existing workspace for collaboration.
- Track task and project progress.
- Drag and drop tasks to change their status and re-order them in a column.
- Real time messaging and communication.
  
<br/>

## Installation 🛠
1. Clone this repository into your local machine.
```
git clone https://github.com/sandygudie/Kanban-App.git
```
2. Navigate to the project directory.
```
Cd Kanban
```
3. Install dependencies.
```
yarn install
```
3. Start the application by running the start script.
```
yarn run dev
```
4. Run test.
```
yarn run test
```

## Set up with docker image
```
docker pull sandy8169/kanban:latest
```

## Run as fullstack application with docker-compose
```
docker compose up
```

## Deployment pipeline(CI/CD) 🚀
- From GitHub Actions to Vercel.
- From GitHub Actions to Dockerhub.

