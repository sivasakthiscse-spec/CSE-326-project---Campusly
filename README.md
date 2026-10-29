# Campusly — Campus Event Management & Registration Portal

Student-facing event discovery UI for the CA1 project. Built with plain HTML, CSS, and JavaScript.

## Run locally

Open `index.html` in a browser. No build step or dependencies are required. For a local web server, run `python -m http.server 8000` from this directory and open `http://localhost:8000`.

## Student browser features

- Responsive event listing with search and category filters.
- Event detail dialog with date, venue, eligibility, and remaining seats.
- Empty search results, full event state, keyboard access, and reduced-motion support.
- Sample event data in `app.js` to support the UI demo.

## Team integration

The event browser currently reads the `events` array in `app.js`. When the shared data layer is ready, replace that sample source with the team event service. The **Continue to register** button dispatches an `event-registration-request` browser event with `{ eventId }` in `detail`; the registration module can listen for that event or replace the button handler with a shared route. Displayed capacity is demo data and must be read from the shared registration store for a real multi-user system.

## Deployment

This is a static front end and can be published with GitHub Pages. GitHub Pages does not provide shared storage for live registration limits; connect an appropriate backend before claiming cross-user live seat enforcement.
