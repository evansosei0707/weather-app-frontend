# Weather App

A beautiful weather application built with Next.js that displays current weather conditions for popular cities around the world, complete with dynamic city background images.

## Features

- 🌤️ Real-time weather data for popular cities
- 🏙️ Dynamic city background images from Unsplash
- 📱 Responsive design with beautiful UI
- 🌡️ Detailed weather information including temperature, humidity, wind speed, and more
- 🌅 Sunrise and sunset times

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Unsplash API (Optional)

To enable dynamic city background images, you'll need to set up an Unsplash API key:

1. Visit [Unsplash Developers](https://unsplash.com/developers)
2. Create a free account or sign in
3. Create a new application
4. Copy your Access Key
5. Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

6. Add your Unsplash access key to `.env.local`:

```
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_actual_access_key_here
```

**Note:** The app will work without the Unsplash API key, but will use placeholder images instead of real city photos.

### 3. Run the Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
