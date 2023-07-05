# Full-Stack E-Commerce + Dashboard & CMS: Nextjs 13 App Router, React, Tailwind, Prisma, MySQL

![](https://res.cloudinary.com/dhcedk2iy/image/upload/v1688552769/dashboard-demo_if3su5.png)

For Demo, use [Stripe Testing Cards](https://stripe.com/docs/testing)

Live Demo: [Store](https://ecommerce-store-eight-ashy.vercel.app/)

Live Demo: [Dashboard](https://ecommerce-admin-hazel.vercel.app/7f240395-413a-4a38-9537-53a9eded7422)

Visit Store Repo: [Store](https://github.com/tarek-elmasri/ecommerce-store)

## Key Features

- Admin dashboard is serving as CMS, Admin and API.
- Create and multiple stores them within single Dashboard.
- Authentication with [Clerk](https://clerk.com).
- Integration with [Stripe](https://stripe.com) payments and webhooks.
- Image uploads with [Cloudinary](https://cloudinary.com).
- Styles with [Shadcn UI](https://ui.shadcn.com).
- Utilize latest Nextjs 13 App Router.

## Prerequisites

Node v14.x

## Getting Started

### Install Packages

```bash
git clone git@github.com:tarek-elmasri/ecommerce-admin.git

cd ecommerce-admin

npm install
```

### Setup .env file

```bash
DATABASE_URL=

# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Clerk Authentication callback urls
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Cloudinary cloud preset
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

# Stripe Secret Key
STRIPE_SECRET_KEY=

# Stripe Webhook Secret
STRIPE_WEBHOOK_SECRET=


# FrontEnd Store For Stripe Callbacks
FRONTEND_URL=


```

### Connect to database and push Prisma

```bash
npx prisma generate
npx prisma push

```

### Setting Stripe Webhook

- In Stripe console, create new endpoint webhook.
- Endpoint URL = <ADMIN_DASHBOARD_URL>/api/webhook.
- Add "checkout.sessions.completed" Event.

### Start App

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
