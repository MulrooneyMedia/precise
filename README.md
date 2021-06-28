# Precise frontend developer test

## Introduction and prep
This project is a skeleton where you will later add work according to a TODO list that we will publish at the start of the test. For now, familiarise yourself with the project structure and check everything runs. You don't want to be fixing Node during the test time!

### Environment setup
Assuming you already have Node installed, run these at the project root:

`npm install`  
Start the servers and Sass compiler: `npm run dev`  
Stop: `ctrl/cmd + C`

The project runs from /public/index.html. At its simplest you can write all code inside the public folder (index.html, styles.css and app.js).  
In case you want to write Sass instead of plain CSS, we have included a compiler in the `dev` script.

### Checks
You should see a simple page at http://localhost:8080 and a small json file at http://localhost:3000/check  
If you think you will use Sass, make a small change to /source/styles/styles.scss and check it builds and displays (the `dev` script must be running).

### Expectations
- We are looking for beautiful, production-ready code.
- It is more important for us to see what you can do with JS than any CSS so don't spend time making things look nice unless you have completed all other tasks.
- You can assume code should only need to work in modern browsers. We will be testing in Chrome.
- We have included jQuery on the page for convenience if you like it but don't feel you have to use it.
- You may approach the tasks in any order you like.
- Write any comments in the code as you normally would.
- We will also be assessing how you work with Git so when the test is started be careful to commit discrete work with descriptive messages.

## TODO
The list of things we want to see will be published in /public/todo.md at the start of the test and will be magically displayed on the app.

## Duration
The test will last for 90 minutes. After that time is up, your access to this repository will be removed so be sure to push your commits at the end.  
There is more than 90 minutes' work in this test so don't worry that you don't get to the end.
