# Component Documentation

## Navbar.tsx

The `Navbar` component provides the main navigation for the Dytto website. It features:

-   **Responsive Design:** Adapts its layout for desktop and mobile views.
-   **Dynamic Navigation:**
    -   On the `/api` page, it displays section links for 'Platform', 'API', 'Use Cases', and 'Pricing'.
    -   On the homepage (`/`), it displays section links for 'Features' and 'Products'.
    -   On other pages, it does not display section-specific navigation.
-   **Page Navigation:** Always displays links to main pages: 'App' (homepage), 'API', 'Feedback', 'Blog', 'Login', and 'Waitlist', conditionally hiding the link to the current page.
-   **Theme Toggle:** Allows users to switch between light and dark modes.
-   **Dynamic Call-to-Action (CTA) Button:** The text of the main action button changes based on the current page:
    -   `/api`: "Get API Key"
    -   `/waitlist`: "Join Waitlist"
    -   `/feedback`: "Submit Feedback"
    -   `/blog` (or any path starting with `/blog`): "Subscribe"
    -   Other pages: "Download App"
-   **Smooth Scrolling:** Section navigation links (`#platform`, `#api`, etc.) trigger smooth scrolling to the respective sections on the page.
-   **Framer Motion Animations:** Incorporates subtle animations for menu transitions and button interactions.
