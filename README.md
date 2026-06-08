# Math Odyssey: From Basics to Calculus

An interactive, premium-feeling math adventure game built with Next.js. Mathematics is deeply integrated into fun gameplay mechanics — from editing graphs in real-time to using trigonometry for aiming and derivatives for racing.

## Features Implemented (MVP)

- ✨ Stunning modern landing page with nickname input
- 🗺️ Beautiful world map with 6 progressive realms
- 🎮 **Fully working Marbleslides** mini-game (Canvas + realistic physics)
- 📱 Fully responsive design
- 🎨 Premium dark + vibrant UI

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### How to Play

1. Enter your nickname on the landing page → Click **Start Journey**
2. Explore the **World Map**
3. Click on **Function Valley** → Try **Marbleslides**
4. Edit the equation and launch marbles to collect stars!

## Project Structure

```
app/
├── page.tsx                 # Stunning landing page
├── layout.tsx
├── globals.css
├── world-map/
│   └── page.tsx            # Realm selection screen
└── game/
    └── marbleslides/
        └── page.tsx        # Fully functional interactive mini-game
```

## Roadmap & Next Steps

This is a high-quality foundation. You can continue building:

### Recommended Next Mini-Games:
- **Trig Archer** (Canvas projectile + angle input)
- **Derivative Racer**
- **Unit Circle Defense**
- **Integral Area Builder**

### Online Battle Rooms (Firebase)
The structure is ready. Add Firebase Realtime Database for:
- Create/Join room with 6-character code
- Real-time Marbleslides race
- Head-to-head Trig Archer battles

## Deploy to Vercel

1. Push code to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Deploy (zero config needed)

## Tech Stack

- Next.js 15 + TypeScript
- Tailwind CSS
- HTML5 Canvas (for all games)
- Framer Motion
- Firebase (prepared for realtime multiplayer)

---

**This project is ready for you to expand into a full-featured educational game.**

Would you like me to add more mini-games (Trig Archer, Derivative Racer, etc.) in the next iteration?
