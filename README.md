# Capstone Project: Option 2

## Description
This application is a simple and basic Experiment Log Book application for Scientists to log experiments. 

The application allows the scientist to:
1. Create an account
2. Add a Title for the Experiment
3. Add a Description for the Experiment
4. Upload an image for the Experiment

## Purpose
This is the final project of the Cloud Developer program, meant to show learnings in serverless design.

## How to run the application
Important Note: At the time of the submission of the project (Dec 12, 2020), the serverless code has already been deployed. The configuration can be found in the `config.ts` file.

### Frontend


To run a client application, run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the Experiment Log Book application.

### Backend 

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```