# LST-Front

Page: [https://ilyahalsky.github.io/LST-Front/](https://ilyahalsky.github.io/LST-Front/)

## API Configuration

This application is configured to communicate with a backend server. The configuration mechanism supports both local development and production deployments.

### Local Development

For local development, the application uses a proxy configured in `vite.config.ts`. This proxy forwards API requests to a local backend server running at `http://localhost:8000`.

No additional configuration is needed for local development.

### Production Deployment

For production deployments, the application can be configured to use a specific backend server URL by setting the `VITE_API_BASE_URL` environment variable.

If `VITE_API_BASE_URL` is not set, the application will use relative URLs, which assumes that the backend is served from the same domain as the frontend.

#### Example Configuration

1. Create a `.env` file in the project root (you can copy from `.env.example`)
2. Set the `VITE_API_BASE_URL` variable to your backend server URL:

```
VITE_API_BASE_URL=https://api.example.com
```

3. Build the application:

```
npm run build
```

The built application will use the configured backend server URL for API requests.
