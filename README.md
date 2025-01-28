# CPU_USAGE_BACKEND

API to extract performance information for an AWS instance and display the CPU usage over time

## Getting started

Ensure you have npm and node.js installed

```bash
npm -v
node -v

```

Clone project
```bash
git clone https://github.com/yael84324/cpu_usage_backend.git

```

Navigate to the project directory
```bash
cd cpu_usage_backend

```

Install dependencies
```bash
npm i

```

Create .env file with the following environment variables
```
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_REGION=your-aws-region
PORT=3000

```

Run the project
```bash
npm start

```

The API should run on port 3000 now

## Run tests

```bash
npm run test

```