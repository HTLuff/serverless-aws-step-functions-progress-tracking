<!-- PROJECT LOGO -->
<br />
<div align="center">
    <h1 align="center">Serverless Framework AWS Step Functions Progress Tracking</h1>
    <img src="https://github.com/HTLuff/serverless-aws-step-functions-progress-tracking/blob/main/diagram.png?raw=true" alt="Logo" style="width: 100%" height="600">
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

<p align="left">This project creates an AWS Step Functions workflow, which mocks a mutli-step ordering process, and demonstrates how clients can monitor the progress via Amazon API Gateway Websocket. This project is a Serverless Framework implementation of [this blog post](https://aws.amazon.com/blogs/compute/implementing-reactive-progress-tracking-for-aws-step-functions/) by Alexey Paramonov, Solutions Architect, ISV and Maximilian Schellhorn, Solutions Architect ISV</p>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- Serverless Framework
- Node 16.x
- React

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

- Create AWS Account in case you do not have it yet or log in to an existing one
- An IAM user or a Role with sufficient permissions to deploy and manage AWS resources
- AWS CLI installed and configured
- Git Installed
- Serverless Framework installed
- NodeJS for changing AWS Lambda functions' code
- NPM for changing the frontend code (React)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

1. Git clone into new folder
2. Run `cd server`
3. Run `npm install`
4. Run `npm run deploy` or `serverless deploy` (this is currently configured to use `npx` in the package.json file)
5. The WSS: endpoint will be outputted after the deployment script has finished
6. Run `cd ../client` and `npm run start`
7. Input the WSS: endpoint into the input box
8. Click "Send Order" button to begin step function workflow

![Project Screengrab](https://github.com/HTLuff/serverless-aws-step-functions-progress-tracking/blob/main/blog_frontend_overview.gif?raw=true)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
