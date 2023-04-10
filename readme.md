# Timer JS
This is a simple web application for people who forget or those who want to track their many responsibilities.
User can create countdown timers and put them in categories.
It was designed especially for handling recurring tasks and anniversaries.
Everything is processed in the browser – no data is sent to the server.

Primarily tested on Google Chrome and Google Chrome for Android.

Online: https://harag.cz/app/timer

## Milestones
- 2020-10-20: The first commit
- 2020-10-28: The first version, server-side rendered
- 2020-12-12: Client-side rendering, AJAX
- 2022-03-28: Major rewrite & public version released (without server side processing, DB, etc.)
- 2023-04-08: The codebase moved into *this* separate Git repository and migrated to Rollup.js

## Development

`npm install` to install dependencies.

`npm run build` builds the library to `dist`.

`npm run dev` builds the library, then keeps rebuilding it whenever the source files change using rollup-watch.

`npm test` builds the library, then tests it.
