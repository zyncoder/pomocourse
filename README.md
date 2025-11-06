# Pomodoro Course Completion Scheduler

This is a Progressive Web App that schedules and delivers Pomodoro notifications to complete a 64-hour course, complete with gamification features.

## Project Structure

This project is built with React and Vite. All source code is located in the `src/` directory.

- `src/components`: React components for different UI views.
- `src/hooks`: Custom React hooks for state management.
- `src/services`: Business logic (e.g., schedule generation).
- `src/types.ts`: TypeScript type definitions.
- `src/constants.ts`: Application-wide constants.
- `public/`: Static assets are placed here.

## Local Development

1.  **Install dependencies:**
    ```sh
    npm install
    ```

2.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or the next available port).

## Building for Production

To create a production-ready build of the app:

```sh
npm run build
```

This will generate a `dist/` directory containing the optimized, static assets.

## Deployment to Cloudflare Pages

This project is pre-configured for easy deployment to [Cloudflare Pages](https://pages.cloudflare.com/).

### Using the Cloudflare Dashboard

1.  Push your code to a GitHub or GitLab repository.
2.  In the Cloudflare dashboard, create a new Pages project and connect it to your repository.
3.  Use the following build settings:
    - **Framework preset:** `Vite`
    - **Build command:** `npm run build`
    - **Build output directory:** `dist`
4.  Deploy your site.

### Using Wrangler CLI

1.  Log in to Wrangler:
    ```sh
    npx wrangler login
    ```
2.  Deploy the project with a single command from the project root:
    ```sh
    npm run deploy
    ```
This uses the `wrangler.toml` file to deploy the contents of the `dist` directory.
