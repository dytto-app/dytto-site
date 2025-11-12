# Component Documentation

## Navbar.tsx

The `Navbar` component provides the main navigation for the Dytto website. It features:

-   **Responsive Design:** Adapts its layout for desktop and mobile views.
-   **Dynamic Navigation:**
    -   On the `/api` page, it displays section links for 'Platform', 'API', 'Use Cases', and 'Pricing'.
    -   On the homepage (`/`), it displays section links for 'Features' and 'Products'.
    -   On other pages, it does not display section-specific navigation.
-   **Page Navigation:** Always displays links to main pages: 'App' (homepage), 'API', 'Feedback', 'Blog', and 'Waitlist', conditionally hiding the link to the current page.
-   **Theme Toggle:** Allows users to switch between light and dark modes.
-   **Dynamic Call-to-Action (CTA) Button:** The text of the main action button changes based on the current page, managed by the `getCTAText` function:
    -   `/api`: "Get API Key"
    -   `/waitlist`: "Join Waitlist"
    -   `/feedback`: "Submit Feedback"
    -   `/blog`: "Subscribe"
    -   `/philosophy`: "View Demo"
    -   Other pages: "Download App"
-   **Smooth Scrolling:** Section navigation links (`#platform`, `#api`, etc.) trigger smooth scrolling to the respective sections on the page.
    -   **Framer Motion Animations:** Incorporates subtle animations for menu transitions and button interactions.
-   **Layout and Styling Enhancements:**
    -   Desktop navigation now uses absolute positioning for the logo and CTA to ensure central alignment of navigation links.
    -   Mobile navigation has been improved to include the logo and site title.
    -   `whiteSpace: 'nowrap'` has been added to navigation items and the CTA button to prevent text wrapping.
    -   The CTA button's `minWidth` has been increased for better visual balance.
-   **Type Safety:** Explicit type assertions (e.g., `e.target as HTMLButtonElement`) have been added to event handlers for improved type safety.
