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

## Supabase Configuration

To enable user authentication and API key management, you need to configure your Supabase project.

1.  **Create a Supabase Project:** If you don't have one, create a new project on [Supabase](https://supabase.com/).
2.  **Get API Keys:** From your Supabase project settings, find your `Project URL` and `Anon Key`.
3.  **Environment Variables:** Create a `.env` file in the project root with the following variables:
    ```
    VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
    VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    ```
    Replace `"YOUR_SUPABASE_URL"` and `"YOUR_SUPABASE_ANON_KEY"` with your actual Supabase project URL and anon key.
4.  **Enable Email Authentication:** In your Supabase project, navigate to Authentication -> Providers and ensure 'Email' is enabled.

---

## New Features

### User Authentication & API Key Management

This update introduces user authentication powered by Supabase and a dedicated page for managing API keys for third-party agents.

-   **/login**: Access the login and signup page to authenticate with your Dytto account.
-   **/settings/api-keys**: After logging in, navigate to this page to create, view, and revoke API keys. These keys can be scoped and set with expiration dates for enhanced security.

---

## Blog Page Functionality

The blog page (`/blog`) is designed to work even without a full Supabase backend configuration.

-   **Demo Mode:** If the `VITE_SUPABASE_URL` environment variable is not set, the blog page will automatically display a set of sample blog posts. This allows for local development and demonstration of the blog's UI and features without requiring a live Supabase instance. A "Demo mode" notice will be displayed on the page.

-   **Full Functionality:** To enable full blog functionality, *as well as user authentication and API key management*, you need to configure your Supabase project and set the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables. Refer to the *Supabase Configuration section above and* the Supabase documentation for detailed setup instructions.

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

## Available Scripts

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the application for production.
-   `npm run lint`: Lints the project files.
-   `npm run preview`: Previews the production build locally.
