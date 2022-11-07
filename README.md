# metrics-automation-reporter - M.A.R.

## About
This project has been created to get information from management tools, for instance the Jira, and return some metrics.

## Setup

### Install node modules
- Install all node dependencies:
```
npm i
```

### Set the env variables
- Configure the environment variables (process.env) with the following:
```
  - JIRA_AUTHENTICATION="{{ your jira password }}"
  - JIRA_BASE_URL=" {{ your jira base url}} "
```

### Run the application
- From the root, run the main.js file:
```
- node main.js
- 11/05/2022 13:04:28 'App listening on port 3000'
```

## Index path
Access in your browser:

`http://localhost:3000`

It will show the path to the github Readme.

## Sprint Metrics path

Access in your browser:

`http://localhost:3000/sprint?sprintNumber=123`

Response Example:
```
{
  total: 30,
  bugs: [
    {
      key: 'JIRA-1234',
      summary: 'Error "Something went wrong!" appears when User tries to access.',
      status: 'Closed',
      assignee: 'Jonh Doe',
      timeSpent: 1,
      aggregateTimeSpent: 0,
      developmentPhase: 'UAT',
      storyPoints: null,
      issueType: 'Empty',
      timeEstimated: 0
    },
    {
      ...
    },
  ],
  total: 30,
  UAT: { qty: 21, sumTimeSpent: 25.750000000000007, qtyCanceled: 0 },
  PROD: { qty: 6, sumTimeSpent: 8.166666666666668, qtyCanceled: 0 },
  QA: { qty: 3, sumTimeSpent: 3.25, qtyCanceled: 0 },
  totalSpentBugs: 37.16666666666667
}
{
  aggregateTimeSpent: 165.41666666666669,
  timeEstimated: 108,
  rework: '22.47',
  workRatio: 20.25,
  velocity: 13,
  productivity: 12.724358974358976
}


```

## Story Metrics path

Access in your browser:
`http://localhost:3000/story?storyTicket=JIRA-123`

Response Example:
```
{
  'Sub-Specification': { qty: 1, sumTimeEstimated: 0 },
  'Sub-Test': { qty: 1, sumTimeEstimated: 0 },
  'Sub-Deployment': { qty: 4, sumTimeEstimated: 0 },
  'Sub-Bug': { qty: 1, sumTimeEstimated: 0 },
  'Sub-Development': { qty: 6, sumTimeEstimated: 19 },
  'Sub-Agile Activities': { qty: 1, sumTimeEstimated: 12 },
  'Sub-Authoring': { qty: 1, sumTimeEstimated: 14 },
  'Sub-Question': { qty: 1, sumTimeEstimated: 0 },
  'Sub-Infrastructure': { qty: 1, sumTimeEstimated: 24 },
  totalEstimated: 69
}
```

## Project Architecture

```
- handlers -> Files to connect with the management tools.
- routes -> Files to be served as the http routes.
- services -> Files with the logic necessary to prepare and then handle the requests.
- utils -> Utility files, such as the logger.
- main.js -> Main entry point for the application
```
