# Miller's Hollow Narrator

A Progressive Web App (PWA) for narrating games of **Werewolves of Miller's Hollow - Best of Edition**. This narrator app guides game masters through night phases, manages player tracking, and provides detailed action checklists for all 28 character roles.

## 🎮 About the Game

Werewolves of Miller's Hollow is a social deduction party game where players are secretly assigned roles as either villagers trying to identify werewolves, or werewolves trying to eliminate villagers. The game alternates between night phases (where special roles perform secret actions) and day phases (where players discuss and vote to eliminate suspects).

## ✨ Features

### Core Functionality
- **Complete Role Support** - All 28 characters from the Best of Edition:
  - Village Team (14 roles): Villagers, Seer, Witch, Hunter, Cupid, Two Sisters, Three Brothers, and more
  - Werewolf Team (4 roles): Simple Werewolves, Big Bad Wolf, White Werewolf, Cursed Wolf-Father
  - Special Roles (4 roles): Angel, Prejudiced Manipulator, Wild Child, Wolf-Hound
  
- **Interactive Setup Screen**
  - Player count selector (8-30 players)
  - Visual role selection organised by team
  - Real-time validation of role count vs player count
  
- **Night Phase Narrator**
  - Text-to-speech narration using Web Speech API
  - Proper role wake order (different for first night vs subsequent nights)
  - Role-specific state tracking (Witch potions, Wolf-Father infection, etc.)
  - Progress tracking through each night

- **Enhanced Role Guidance**
  - Detailed action checklists for each role
  - Step-by-step narrator prompts
  - Important actions highlighted
  
- **Player Management**
  - Track all players (alive/dead status)
  - Add notes for each player (suspicions, claims, etc.)
  - Record revealed roles
  - Eliminate/revive players
  
- **Game Event Log**
  - Chronological history of all game events
  - Filter by event type (elimination, role action, voting, special)
  - Timestamp tracking

- **Day Phase Timer**
  - Configurable discussion timer (3, 5, 7, or 10 minutes)
  - Visual circular progress indicator
  - Play/pause/reset controls
  - Helpful reminders of day phase actions

### Progressive Web App
- **Offline Support** - Works without internet after first load
- **Installable** - Add to home screen on mobile devices
- **Dark Theme** - Optimised for playing in low-light conditions
- **Responsive Design** - Works on phones, tablets, and desktops

## 🛠️ Tech Stack

- **Framework**: React 19.2 with TypeScript
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **PWA**: Service Worker + Web App Manifest
- **Development Environment**: DevBox
- **State Management**: React Hooks (custom `useGameState` hook)

## 📋 Architecture

### Project Structure
```
src/
├── components/          # React components
│   ├── SetupScreen.tsx      # Role selection and game setup
│   ├── NightPhase.tsx       # Night phase narrator with TTS
│   ├── DayPhase.tsx         # Day phase timer
│   ├── PlayerList.tsx       # Player tracking sidebar
│   ├── EventLog.tsx         # Game history log
│   └── RoleActionGuide.tsx  # Narrator action checklists
├── hooks/               # Custom React hooks
│   └── useGameState.ts      # Central game state management
├── data/                # Static game data
│   └── roles.ts             # All 28 role definitions
├── types/               # TypeScript type definitions
│   └── game.ts              # Game state, roles, players interfaces
└── main.tsx            # App entry point + PWA registration
```

### Key Design Decisions

**State Management**: Uses a centralised `useGameState` hook with reducer-like pattern for predictable state updates. All game state lives in a single object passed down through props.

**Role System**: Roles are defined with metadata including:
- Night order (when they wake up)
- Team affiliation (village/werewolf/solo)
- Limited use tracking (one-time abilities)
- Card quantities (for roles with multiple cards)

**Night Phase Logic**: 
- Different wake orders for first night vs subsequent nights
- Conditional role waking (e.g., White Werewolf only every other night)
- State tracking for role abilities (potions used, infections, etc.)

**Text-to-Speech**: Uses browser's native Web Speech API with customised narration text for each role.

## 🚀 Getting Started

### Prerequisites
- [DevBox](https://www.jetpack.io/devbox) (recommended)
- OR Node.js 22+ and npm

### Installation

#### With DevBox (Recommended)
```bash
# Clone the repository
git clone https://github.com/mouldyjon/millers-hollow-narrator.git
cd millers-hollow-narrator

# Start devbox shell (automatically installs dependencies)
devbox shell

# Run development server
npm run dev
```

#### Without DevBox
```bash
# Clone the repository
git clone https://github.com/mouldyjon/millers-hollow-narrator.git
cd millers-hollow-narrator

# Install dependencies
npm install
npm install -D @tailwindcss/postcss tailwindcss@latest postcss autoprefixer

# Run development server
npm run dev
```

### Building for Production
```bash
npm run build
npm run preview  # Preview production build locally
```

## 📱 Installation as PWA

1. Open the app in a browser (Chrome, Safari, Edge)
2. Look for "Install" or "Add to Home Screen" option
3. Follow browser prompts to install
4. App will work offline after installation

**Note**: PWA icons need to be added to `/public` directory:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

See `/public/ICONS_README.md` for details.

## 🎯 Usage

1. **Setup**: Select player count and choose roles for the game
2. **Start Game**: Begin the first night phase
3. **Night Phase**: 
   - Click "Speak" to hear narrator instructions
   - Follow the role action checklist
   - Use sidebar to track player status and notes
   - Click "Next" to move to next role
4. **Day Phase**: 
   - Start discussion timer
   - Players discuss and vote
   - Record eliminations and revelations
5. **Continue**: Cycle through nights and days until game ends

## 🔮 Future Enhancements

- **Quantity Selectors**: Add/remove multiple Villagers and Werewolves
- **Interactive Checklists**: Check off completed narrator actions
- **Role Reveal Modal**: Prompt for role when eliminating players
- **Dawn Phase**: Special role actions at sunrise (Hunter, Bear Tamer)
- **Sound Effects**: Audio cues for phase transitions
- **Game Statistics**: Track game history and statistics
- **Multiple Languages**: Internationalisation support

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgements

- Game design by Hervé Marly and Philippe des Pallières
- Published by Asmodee Editions
- This is a fan-made digital narrator tool, not affiliated with the official game publishers

---

**Enjoy narrating your games of Miller's Hollow!** 🌙🐺
