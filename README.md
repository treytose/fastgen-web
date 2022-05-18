# Fastgen Web

## Getting Started
Install required packages
```
npm install
```

Install FastAPI requirements
```
# cd to fastgen-api and create a virtual environment
cd fastgen-api
python3.9 -m venv venv

# activate the environment and install the requirements
source ./venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

Run the NextJS app in development mode
```
npm run dev
```

Start the API
```
# in fastgen-api directory with the virtual environment activated
uvicorn app.main:app --port 8000
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
If the API is running and configured correctly, a green "Connected" icon on the top right of the navbar will appear

## Creating an API
To create a new FastAPI use the following steps:
  - Navigate to [http://localhost:3000/generate/api](http://localhost:3000/generate/api) or click "Create API" in the top navigation bar
  - Fill out the form choosing the desired API details, database connection settings, and python version
    <br>
    <small>(note: Some options are dependent on having the appropriate software installed on your server. e.g. selecting python3.6 requires you to have python3.6 available on your server)</small>
  -  Click "Create" and wait while the API is generated

## Connecting to an API  
  In order to access some FastgenWeb features such as automatic entity injection, you must first connected to an API that was created with Fastgen Web
  - Navigate to [http://localhost:3005/config](http://localhost:3005/config) or click "Connect to API" on the top navigation bar
  - Select an API from the provided list 
  - The selected API will appear in on the right of the top navigation bar

## Creating an API entity 
API entities can be created supporting automatic async CRUD operations, database table generation, permissions, logging, etc.
The generated entity code can be copy and pasted or automatically injected if you are connected to a Fastgen API

To create an entity
  - Navigate to [http://localhost:3005/generate/entity](http://localhost:3005/generate/entity) or click "Create Entity" in the top navigation bar
  - Enter an entity name
  - Click "Add Column" to add new entity details
  - Once your entity is ready either:
    * Click the "Inject Into API" button <br>
      or 
    * Copy and paste the generated code

# NextJS README

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
