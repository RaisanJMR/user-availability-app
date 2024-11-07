# User Availability Checker

A simple demo Next.js application for checking and managing user availability using Redis as the data store.

## Features

- Allows users to view and manage availability
- Stores availability data in Redis for fast access
- Responsive and minimal UI built with Next.js

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or above)
- A [Redis Cloud](https://redis.com/try-free/) account or a local Redis instance

## Getting Started

### 1. Clone the Repository

First, clone this repository to your local machine:

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2.  Install Dependencies
Install the required packages using npm:
```bash
npm install
```
### 3. Set Up Environment Variables
Create a ```.env``` file in the root directory of the project and add your Redis configuration:

```bash
NEXT_PUBLIC_REDIS_HOST=your_redis_host
NEXT_PUBLIC_REDIS_PORT=your_redis_port
NEXT_PUBLIC_REDIS_PASSWORD=your_redis_password
```
### 4. Run the Application

Start the development server:
```
npm run dev
```

### 5. Deployed link

to view live version - [click here](https://user-availability-j0m85n7k0-jmrs-projects.vercel.app/)


