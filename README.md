# Cloudinary SaaS

A SaaS web application built with Next.js, TypeScript, and Cloudinary for uploading and managing media.

## Features

- Upload videos and supported media to Cloudinary
- Video upload form with title and description
- File-size validation (100 MB maximum in the current upload form)
- Upload status and success/error messages
- Responsive user interface
- API routes for handling media uploads
- Authentication powered by Clerk
- PostgreSQL database powered by Neon

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI:** React and Tailwind CSS
- **Media Storage:** Cloudinary
- **Database:** Neon (serverless PostgreSQL)
- **Authentication:** Clerk
- **HTTP Requests:** Axios

## Getting Started

### Prerequisites

- Node.js
- npm
- A Cloudinary account
- A Neon database
- A Clerk application

### Installation

Clone the repository and install dependencies:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_PROJECT_DIRECTORY
npm install
```

### Environment Variables

Create a `.env.local` file in the project root and configure the variables required by your application.

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

DATABASE_URL=your_neon_database_url

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

Use the exact environment variable names required by your code. Your Clerk setup may require additional configuration.

**Security:** Never commit `.env.local` or real API credentials to GitHub. Keep secret keys on the server and never expose them through `NEXT_PUBLIC_` variables.

### Run Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

Check the production build:

```bash
npm run build
```

To run the production build locally:

```bash
npm run start
```

## Deployment

This application can be deployed using Vercel.

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add the required environment variables in Vercel project settings.
4. Deploy the application.
5. Test authentication, database operations, and media uploads on the deployed website.

Configure environment variables separately for Preview and Production environments as needed.

## Project Structure

A typical Next.js App Router structure:

```text
.
├── app/
│   └── api/
│       └── video-upload/
│           └── route.ts
├── components/
├── public/
├── .gitignore
├── package.json
└── README.md
```

Your actual project structure may differ.

## Notes

- Validate uploaded files on both the client and server.
- For large media uploads, consider direct browser-to-Cloudinary uploads or asynchronous processing.
- Ensure authentication and authorization are enforced on protected API routes.
- Configure your Neon database connection and Clerk authentication correctly in production.

## License

No license has been specified yet. Add a license if you intend to distribute this project publicly.