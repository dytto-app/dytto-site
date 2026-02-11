# Dytto Site

This repository contains the Dytto marketing and developer site.

## Project Setup

To set up the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-org/dytto-site.git
    cd dytto-site
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The site will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

## Blog Page Functionality

The blog page (`/blog`) is designed to work even without a full Supabase backend configuration.

-   **Demo Mode:** If the `VITE_SUPABASE_URL` environment variable is not set, the blog page will automatically display a set of sample blog posts. This allows for local development and demonstration of the blog's UI and features without requiring a live Supabase instance. A "Demo mode" notice will be displayed on the page.

-   **Full Functionality:** To enable full blog functionality, including dynamic content fetching and API updates, you need to configure your Supabase project and set the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables. Refer to the Supabase documentation for detailed setup instructions.

## Analytics Tracking

This project incorporates an enhanced analytics utility (`src/utils/analytics.ts`) to comprehensively track user interactions and engagement on the landing page. This utility provides insights into:

-   **Page Load Performance:** Tracks metrics like page load time and First Contentful Paint.
-   **Scroll Depth:** Monitors how far users scroll down the page (at 25%, 50%, 75%, and 90% intervals).
-   **Exit Intent:** Detects when users are about to leave the page.
-   **Button Clicks:** Records clicks on various interactive elements with contextual information.
-   **Form Interactions:** Tracks the start, completion, and abandonment of forms (e.g., waitlist signup).
-   **Feature Interactions:** Monitors views and interactions with specific UI components and features.
-   **Call to Action (CTA) Effectiveness:** Measures engagement with CTAs.
-   **Media Interactions:** Tracks plays, pauses, and completions of videos or other media.
-   **Error Tracking:** Logs technical errors for debugging and performance monitoring.

The analytics system also captures UTM parameters for improved attribution and calculates session duration.

## Site Structure and Key Pages

The Dytto site is organized into several key pages, each serving a specific purpose:

-   **Home (`/`)**: The main landing page, showcasing Dytto's features and offerings.
-   **API Landing Page (`/api`)**: Dedicated page for developers, detailing Dytto's API.
-   **App Landing Page (`/app`)**: Information specific to the Dytto application.
-   **Blog (`/blog`)**: Features articles and updates from Dytto.
-   **Documentation (`/docs`)**: Comprehensive guides and references.
-   **Feedback (`/feedback`)**: Page for users to submit feedback.
-   **Login (`/login`)**: User authentication page.
-   **API Keys (`/settings/api-keys`)**: User settings for managing API keys.
-   **Philosophy Dashboard (`/demo`)**: A demonstration or philosophical overview.
-   **Privacy Policy (`/privacy`)**: Details Dytto's data collection, usage, and user rights.
-   **Waitlist (`/waitlist`)**: Page for users to sign up for early access.

## Available Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the application for production.
-   `npm run lint`: Lints the project files.
-   `npm run preview`: Previews the production build locally.
