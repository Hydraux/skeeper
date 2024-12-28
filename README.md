This is a self-hosted score keeping application synced across multiple devices.

## Getting Started
Create a .env file with the variable `DABASE_URL` pointing to your postgres database.

Clone this repository and install dependencies with `npm install`

Initialize the ORM with `npm prisma db push`

Build with `npm run build`

Run with `npm run start` or, to run in the background, install pm2 with `npm install -g pm2` and start it using `pm2 start npm -- run start`
