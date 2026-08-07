# Lumina

Lumina is a hackathon-oriented women-safety platform built as a full-stack React + Express application. It combines safe-route planning, community incident reporting, heatmap visualization, lightweight auth, and editorial-style UI to present safety information in a clear, demo-friendly way.

The project is intentionally self-contained:
- The frontend uses mocked but realistic data flows and a local API service layer.
- The backend uses `lowdb` with a JSON file as its persistent store.
- Route scoring, complaint handling, spam checks, and heatmap generation are deterministic enough for demos, but still dynamic enough to feel realistic.

## What the app does

Lumina provides six major user-facing experiences:

1. Home page with platform overview and CTA cards.
2. Find Route page that compares a direct route with a safer alternate route.
3. Complaint page for reporting incidents on a map.
4. Heatmap page for visualizing risk zones, police support points, and safe havens.
5. How It Works page that explains the scoring and reporting logic.
6. About Us page with the founder profile and contact form.

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Leaflet for maps
- leaflet.heat for heatmap rendering
- lucide-react for icons

### Backend
- Node.js
- Express
- cors
- lowdb
- JSON file storage (`server/data/db.json`)

### Development / Packaging
- Vite dev server for the frontend
- Node watch mode for the backend
- Static asset serving through Vite's `public/` directory

## Repository Structure

```text
index.html
package.json
postcss.config.js
tailwind.config.js
vite.config.js
public/
server/
  db.js
  index.js
  package.json
  data/
    db.json
src/
  App.jsx
  index.css
  main.jsx
  components/
    AuthModal.jsx
    Footer.jsx
    Header.jsx
    LocationInput.jsx
    MapComponent.jsx
  context/
    AuthContext.jsx
    LanguageContext.jsx
    ThemeContext.jsx
  pages/
    AboutUs.jsx
    Complaint.jsx
    FindRoute.jsx
    Heatmap.jsx
    Home.jsx
    HowItWorks.jsx
  services/
    api.js
```

## How the App Is Wired Together

### App shell
`src/App.jsx` is the root application shell. It:
- Wraps the app in `ThemeProvider`, `LanguageProvider`, and `AuthProvider`.
- Tracks the currently active tab in local state.
- Renders the `Header`, active page, `Footer`, and `AuthModal`.

This means the app behaves like a single-page experience with tabbed sections instead of route-based navigation.

### Shared state
- `ThemeContext` controls light/dark mode.
- `LanguageContext` provides labels and UI copy for the editorial interface.
- `AuthContext` stores the logged-in user and modal state, and exposes `login`, `signup`, `logout`, and `openAuthModal`.

### Frontend API layer
`src/services/api.js` is the main client-side integration point. It:
- Resolves route locations.
- Calculates route safety scores.
- Fetches complaints, heatmap points, and reviews.
- Submits complaints.
- Exposes mock auth helpers.
- Contains the mock AI severity classifier.

### Backend API
`server/index.js` exposes the actual Express endpoints. It handles:
- Complaint listing
- Complaint submission
- Complaint upvotes
- Heatmap data
- Reviews
- Route safety scoring
- Login and signup mock endpoints

### Persistent data
`server/db.js` initializes `lowdb` with a seeded JSON database. The seed data lives in `server/data/db.json` and is used to bootstrap the app with realistic community reports, heatmap points, and reviews.

## Running the Project

### Prerequisites
- Node.js 18+ recommended
- npm

### Install dependencies
Install frontend dependencies from the project root:

```bash
npm install
```

Then install backend dependencies in the server folder if needed:

```bash
cd server
npm install
```

### Start the frontend
From the project root:

```bash
npm run dev
```

### Start the backend
From the `server` folder:

```bash
npm run dev
```

The backend runs on `http://localhost:5000` by default.
The frontend runs on the Vite dev port, typically `http://localhost:5173` or the next available port if that one is busy.

### Build the frontend
From the project root:

```bash
npm run build
```

## Database Structure

The backend uses `lowdb` with a single JSON file at `server/data/db.json`.

### Top-level shape

```json
{
  "complaints": [],
  "heatmaps": [],
  "reviews": [],
  "rate_limits": {},
  "spam_logs": []
}
```

### `complaints`
Array of community reports.

Each complaint record typically contains:
- `id`
- `location`
- `lat`
- `lng`
- `category`
- `severity`
- `description`
- `advice`
- `timestamp`
- `upvotes`
- `status`
- `userId`
- `aiAssessed` when the report was auto-classified
- `imageProof` in client-side/local storage flows

Example:

```json
{
  "id": "cmp-101",
  "location": "Hauz Khas Village Entry Alley, New Delhi",
  "lat": 28.5528,
  "lng": 77.2039,
  "category": "Poor Lighting",
  "severity": "High",
  "description": "Streetlights along the rear pedestrian exit near the park have been non-functional for 3 weeks. Very dark after 8 PM.",
  "advice": "Take the main avenue path near the main gate. Avoid the unlit park side walkway at night.",
  "timestamp": "2026-08-05T21:15:00.000Z",
  "upvotes": 42,
  "status": "Verified",
  "userId": "user-system-seed"
}
```

### `heatmaps`
Array of risk points used by the heatmap view.

Each entry contains:
- `lat`
- `lng`
- `intensity` from `0.0` to `1.0`
- `zone`
- `riskLevel`

Example:

```json
{
  "lat": 28.5708,
  "lng": 77.3261,
  "intensity": 0.95,
  "zone": "Noida Sec 18 Rear Service Lane",
  "riskLevel": "Critical Risk"
}
```

### `reviews`
Array of testimonial cards used on the home page.

Each item contains:
- `id`
- `name`
- `role`
- `avatar`
- `rating`
- `text`
- `date`

### `rate_limits`
Object keyed by user ID.

Example:

```json
{
  "usr-123": {
    "count": 2,
    "date": "2026-08-07"
  }
}
```

This is used to cap complaints per day.

### `spam_logs`
Array of spam or abuse detections.

Each log usually includes:
- `userId`
- `clientIp`
- `timestamp`
- `reason`
- `attemptedText`
- `blocked`

## Backend API Endpoints

### `GET /api/complaints`
Returns the complaint feed.

Optional query params:
- `category`
- `severity`

Response shape:

```json
{
  "success": true,
  "count": 5,
  "complaints": []
}
```

### `POST /api/complaints`
Creates a new complaint.

Required fields:
- `location`
- `lat`
- `lng`
- `category`
- `description`
- `userId`

Optional fields:
- `severity`
- `advice`
- `aiAssessed`

The backend now rejects unauthenticated submissions with a `401` response and a `requiresAuth` flag.

### `POST /api/complaints/:id/upvote`
Increments the complaint upvote count.

If a complaint reaches enough upvotes, the backend can promote its status to `Verified`.

### `GET /api/heatmap`
Returns all heatmap points from the JSON database.

### `GET /api/reviews`
Returns the testimonial data.

### `POST /api/route-safety`
Calculates route comparison data on the backend.

This endpoint mirrors the frontend safety model and is useful if you want to move route scoring server-side later.

### `POST /api/auth/login`
Mock login endpoint used by the auth modal.

### `POST /api/auth/signup`
Mock signup endpoint used by the auth modal.

## Route Safety Scoring

The route safety engine compares a direct route with an alternate safer route. The scoring is intentionally lightweight, deterministic, and hackathon-friendly.

There are two layers:
- location resolution
- route scoring

### 1. Location resolution
The app tries these steps:
1. Match against the built-in NCR location database.
2. Use OpenStreetMap Nominatim for geocoding.
3. Fall back to a Delhi-centered coordinate if nothing matches.

### 2. Distance formula
The app uses the Haversine formula to calculate route distance in kilometers.

#### Exact formula
Let:
- `R = 6371` km
- `lat1`, `lng1` = origin coordinates
- `lat2`, `lng2` = destination coordinates

Convert differences to radians:

```text
dLat = (lat2 - lat1) * pi / 180
dLng = (lng2 - lng1) * pi / 180
```

Then compute:

```text
a = sin^2(dLat / 2) + cos(lat1 * pi / 180) * cos(lat2 * pi / 180) * sin^2(dLng / 2)
```

Final distance:

```text
distanceKm = R * 2 * atan2(sqrt(a), sqrt(1 - a))
```

### 3. Route path construction
The app generates two path types:
- `buildDirectPath(s, e)`: a mostly straight route with a slight midpoint deviation.
- `buildSafePath(s, e)`: a safer detour path with a few corridor offsets.

These are visual route shapes for the map, not real navigation engine routes.

### 4. Dynamic route metrics
To avoid the same numbers appearing for every route, the app uses a deterministic seed derived from the route coordinates.

#### Seed generation
The seed is built from rounded coordinates:

```text
seed = "lat1,lng1|lat2,lng2"
```

Then it is hashed with an FNV-style integer hash:

```text
hash = 2166136261
for each character:
  hash = hash XOR charCode
  hash = hash * 16777619
```

A simple seeded random value is then produced with:

```text
random = sin(seed) * 10000
fraction = random - floor(random)
```

This gives a consistent pseudo-random number for the same route, while changing across different routes.

### 5. Safety score formula
The current route scoring formula is:

```text
nearby = number of complaints within ~5 km of the route midpoint
withProof = subset of nearby complaints that include image proof

densityPenalty = nearby * 0.35 + withProof * 0.18 + directDistanceKm * 0.08
primaryScore = clamp(8.6 - densityPenalty + seededRandom(seed) * 0.9, 3.9, 9.4)
safeScore = clamp(primaryScore + 1.8 + seededRandom(seed + 7) * 0.7, 6.2, 9.9)
```

Where:
- `clamp(value, min, max)` limits the result into a fixed range.
- `primaryScore` is the direct route score.
- `safeScore` is the recommended safe corridor score.

### 6. Route metric formulas
The route page displays three sub-metrics that are dynamically derived:

#### Illumination

```text
lightingScore = clamp(56 + lightingRand * 34 - directDistanceKm * 1.2, 38, 98)
```

Rendered as a percentage.

#### CCTV coverage

```text
cctvCoverage = clamp(49 + cctvRand * 37 - nearbyIncidents * 2.5, 35, 97)
```

Rendered as a percentage.

#### PCR van distance

```text
pcrDistanceKm = 0.4 + patrolRand * 2.1 + directDistanceKm * 0.07
```

The safe corridor version is shown as a slightly better value:

```text
safePcrDistanceKm = max(0.3, pcrDistanceKm - 0.6)
```

### 7. ETA formulas
The estimated time of arrival is derived from distance at an assumed 25 km/h urban travel speed.

```text
directEta = max(5, round((directDistanceKm / 25) * 60))
safeEta = max(6, round((safeDistanceKm / 25) * 60))
```

### 8. Route disclaimers
The UI explicitly states:

> Direct Route displays a straight-line baseline for comparison. Navigation routing is planned for future scope.

This is important because the direct route is a comparison baseline, not a live turn-by-turn navigation system.

## Complaint Submission Logic

The complaint workflow is designed to feel smart without depending on a real AI model.

### Login enforcement
The complaint form now checks whether a user is logged in before submission.
- If no user is present, the auth modal opens.
- The submission is blocked until login completes.

### Mock AI severity scoring
The manual severity dropdown was replaced with a keyword-based severity assessor.

#### Exact keyword logic
The classifier reads the complaint description and assigns severity in this order:

1. `Critical`
   - Keywords / patterns include: `weapon`, `knife`, `gun`, `followed`, `stalker`, `stalking`, `assault`, `attack`, `threatened`, `kidnap`, `harass`, `groped`, `molested`, `danger`, `critical`
2. `Moderate`
   - Keywords / patterns include: `dark`, `unlit`, `shadow`, `alone`, `late night`, `followed`, `loitering`, `suspicious`, `unsafe`, `catcall`, `catcalling`, `staring`, `no light`, `dim`, `isolated`, `empty street`, `problem`, `issue`, `concern`, `difficult`, `delay`, `wait`, `problematic`, `inconvenient`
3. `Low`
   - Keywords / patterns include: `crowded`, `busy`, `camera`, `cctv`, `guard`, `patrol`, `lit`, `well lit`, `lighting`, `safe`, `nothing serious`, `minor`, `small issue`, `okay`, `fine`, `normal`, `no issue`, `transport`, `cab`, `auto`, `bus`, `ride`, `commute`
4. Fallback
   - If the description is empty, severity defaults to `Low`
   - If no category is matched, severity also defaults to `Low`

### AI-Assessed badge
When a complaint is submitted or displayed, the UI shows an `AI-Assessed` badge so it is clear the severity was generated automatically from the text. The badge updates as the description changes, so users can immediately see how the wording influences the result before submitting.

### Complaint anti-spam rules
The backend rejects reports that are:
- too short
- repetitive
- duplicate of an existing complaint
- submitted after rate limit exhaustion

The submitted complaint is stored with `aiAssessed: true` so the feed and the moderation pipeline can distinguish it from manually curated seed records.

## Geocoding Fallback Behavior

When the user clicks the map to choose a complaint location:
- The app first checks nearby known landmarks.
- It then tries reverse geocoding via Nominatim.
- If Nominatim fails or returns nothing useful, the app falls back to:

```text
Unnamed area, City Map
```

This avoids showing raw coordinates like `28.603, 77.261` in the UI.

## UI and Design Notes

The project intentionally uses a polished, editorial visual language:
- serif headings for the safety narrative
- rounded cards and borders for the data panels
- high-contrast route and heatmap colors
- badges and helper copy for readability in a hackathon demo setting

### About Us imagery
The large hero image in the about section uses a stock Unsplash image for the editorial section, while the founder card uses the copied local portrait asset at:

```text
public/shagun-chaudhary.jpeg
```

The founder profile image for Shagun Chaudhary is intentionally preserved.

## How Data Flows Through the App

### Find Route
1. User enters origin and destination.
2. `calculateRouteSafety()` resolves coordinates.
3. The app computes distance, seed, pseudo-random modifiers, and nearby incident density.
4. The UI renders both the direct route and the safer alternate route.
5. Route cards display dynamic illumination, CCTV, and PCR distance metrics.

### Complaint
1. User selects a location on the map or uses autocomplete.
2. Description is typed into the form.
3. The app computes mock AI severity from the description.
4. If the user is logged out, the auth modal opens.
5. If logged in, the complaint is sent to the backend and cached locally for instant UI feedback.

### Heatmap
1. Heatmap points are fetched from the backend or fallback data.
2. Leaflet heatmap layers render with gradient intensity.
3. Risk circles and labels give contextual detail.
4. Layer toggles let the user hide or reveal heat zones, police support, and safe havens.

## Notes for Hackathon Use

This codebase is ready for a live demo because it is:
- visually coherent
- self-contained
- deterministic enough for repeatable presentations
- backed by realistic mock data
- easy to extend after the hackathon

If you want to push it further after the event, the next natural upgrades would be:
- real geocoding and routing APIs
- authenticated backend sessions or JWT verification
- a real AI model for severity classification
- live incident moderation workflows
- role-based admin moderation views

## License / Data Disclaimer

This project uses mock data, local JSON persistence, and demonstration-oriented heuristics. It is not a production-grade safety routing engine, and the route scores should be presented as advisory demo values rather than authoritative safety guarantees.
