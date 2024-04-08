# Kanban Board

The Kanban application is a web-based project management tool designed to facilitate task management and track project progress. Users can create workspace and project boards, and organize tasks and subtasks within these boards.

The application features a user-friendly interface with drag-and-drop functionality for easy task management. It also includes features for real-time collaboration, task assignment, due dates, and progress tracking.


## Live Site
[https://kanban-track.vercel.app/](https://kanban-track.vercel.app/)

## Views
<img width="1280" alt="Screenshot 2024-04-08 at 10 26 51" src="https://github.com/sandygudie/Kanban/assets/54219127/3a1bc34c-3faf-4e4a-b5ab-f098d6dc3419">

![image](https://github.com/sandygudie/Kanban-App/assets/54219127/3edd0818-9867-4573-893d-1aaf0e561097)


<br/>

## Installation

1. Clone this repository into your local machine:
```
git clone https://github.com/sandygudie/Kanban-App.git
```
2. Install dependencies 
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

## Features
Users are able to:

- View the optimal layout for the app depending on their device's screen size.
- See hover states for all interactive elements on the page.
- Create, read, update, and delete boards and tasks.
- Receive form validations when trying to create/edit boards and tasks.
- Mark subtasks as complete and move tasks between columns.
- Hide/show the board sidebar.
- Toggle the theme between light/dark modes.
- To drag and drop tasks to change their status and re-order them in a column.
- Keep track of any changes, even after refreshing the browser.

## Technologies Used
The application is built with 
* Vite ReactJS
* Redux Toolkit
* Redux RTK
* TypeScript
* TailwindCSS
* Formik
* Yup
* Ant Design
* Cypress
* Eslint and Prettier
* Docker Compose
* GitHub Action
* Vercel


## Deployment pipeline(CI/CD)
 - From GitHub Actions to Vercel
 - From GitHub Actions to Dockerhub

