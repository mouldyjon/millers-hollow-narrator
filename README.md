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
  - Player count selector (5-20 players)
  - **Auto-Generate Balanced Setup** - AI-powered role distribution algorithm
  - Visual role selection organised by team with medieval aesthetic
  - Quantity selectors for Villagers (up to 9) and Simple Werewolves (up to 4)
  - Multi-card role support (Three Brothers = 3 slots, Two Sisters = 2 slots)
  - Real-time validation with warnings for unbalanced setups
  - Beautiful role generator modal with live distribution preview
  
- **Night Phase Narrator**
  - Text-to-speech narration using Web Speech API
  - Proper role wake order (different for first night vs subsequent nights)
  - Role-specific state tracking (Witch potions, Wolf-Father infection, etc.)
  - Progress tracking through each night

- **Enhanced Role Guidance**
  - Detailed action checklists for each role
  - Interactive checkboxes to track completed actions
  - Per-role, per-night completion state tracking
  - Step-by-step narrator prompts with visual feedback
  - Important actions highlighted
  
- **Player Management**
  - Track all players (alive/dead status)
  - Role reveal modal when eliminating players
  - Track both revealed and actual role for each player
  - Add notes for each player (suspicions, claims, etc.)
  - Eliminate/revive players with full role tracking
  
- **Dawn Phase**
  - Sequential role reveals for all players eliminated during night
  - Special announcements (Bear Tamer, Sheriff death)
  - Chain elimination handling with modal flow
  - Automatic win condition detection

- **Elimination Consequence System**
  - Automatic chain eliminations:
    - Cupid's Lovers die together
    - Knight's Rusty Sword strikes right-hand neighbour
  - Interactive death abilities:
    - Hunter selects dying shot target
    - Supports recursive consequence chains
  - Informational alerts:
    - Sibling notifications (Two Sisters/Three Brothers)
    - Wild Child transformation when role model dies
  
- **Win Condition Detection**
  - Automatic victory detection at Dawn and Day phases
  - Village wins when all werewolves eliminated
  - Werewolves win when all villagers eliminated
  - Beautiful victory announcement modals with team-specific theming
  - Handles Wolf-Hound team allegiance and infected players
  
- **Game Event Log**
  - Chronological history of all game events
  - Automatic logging of all eliminations with role information
  - Adapts theme to match time of day (light during day, dark during night)
  - Timestamp and night number tracking
  - Collapsible sidebar for easy access

- **Day Phase Timer**
  - Configurable discussion timer (3, 5, 7, or 10 minutes)
  - Massive circular progress indicator
  - Play/pause/reset controls
  - Helpful reminders of day phase actions
  - Player list and event log available during discussion

- **Phase Transitions**
  - Smooth animated transitions between Night and Dawn
  - Floating particles and atmospheric effects
  - Skippable with keyboard or click (Space/Enter/Escape)
  - Builds tension and provides natural breaks

### Medieval Design System 🏰
- **Atmospheric Aesthetics**
  - Cinzel medieval serif font for headers
  - Golden colour scheme (#fbbf24) for titles
  - Textured background with subtle vignette effect
  - Dark atmospheric theme for night phases
  - Light readable theme for day phases
  
- **Component Library**
  - Pill-shaped buttons with 6 variants (primary, secondary, danger, success, ghost, gold)
  - Team-specific card styling (blue for village, red for werewolf, purple for solo)
  - Consistent design tokens throughout
  - Adaptive day/night themes for sidebars

### Progressive Web App
- **Offline Support** - Works without internet after first load
- **Installable** - Add to home screen on mobile devices
- **Responsive Design** - Works on phones, tablets, and desktops
- **Theme Adaptation** - UI adapts to game phase (day/night)

## 🛠️ Tech Stack

- **Framework**: React 19.2 with TypeScript
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS v4 with custom @theme configuration
- **Typography**: Google Fonts (Cinzel + Inter)
- **Icons**: Lucide React
- **PWA**: Service Worker + Web App Manifest
- **Development Environment**: DevBox
- **State Management**: React Hooks (custom `useGameState` hook)
- **Design System**: Custom component library (Button, Card)

## 📋 Architecture

### Project Structure
```
src/
├── components/          # React components
│   ├── ui/                  # Design system components
│   │   ├── Button.tsx           # Reusable button with 6 variants
│   │   ├── Card.tsx             # Card container with team theming
│   │   └── index.ts             # Component exports
│   ├── SetupScreen.tsx      # Role selection and game setup
│   ├── NightPhase.tsx       # Night phase narrator with TTS
│   ├── DawnPhase.tsx        # Dawn phase with role reveals
│   ├── DayPhase.tsx         # Day phase timer and discussion
│   ├── PlayerList.tsx       # Player tracking sidebar (day/night themes)
│   ├── EventLog.tsx         # Game history log (day/night themes)
│   ├── RoleActionGuide.tsx  # Narrator action checklists
│   ├── PhaseTransition.tsx  # Animated phase transitions
│   ├── VictoryAnnouncement.tsx # Win condition modal
│   └── *Modal.tsx           # Various modals (role selection, etc.)
├── hooks/               # Custom React hooks
│   ├── useGameState.ts          # Central game state coordinator
│   ├── useGamePersistence.ts    # State persistence & localStorage
│   ├── usePlayerManager.ts      # Player-related operations
│   ├── useNightActions.ts       # Night phase action handlers
│   ├── useRoleManager.ts        # Role selection & management
│   └── usePhaseManager.ts       # Game phase transitions
├── logic/               # Pure business logic
│   ├── winConditions.ts         # Win condition checking
│   ├── eliminationConsequences.ts # Cascade elimination effects
│   └── roleSlotCalculations.ts  # Role slot utilities
├── data/                # Static game data
│   └── roles.ts             # All 28 role definitions
├── styles/              # Design system
│   └── designTokens.ts      # Colour palette, typography, spacing
├── types/               # TypeScript type definitions
│   └── game.ts              # Game state, roles, players interfaces
├── utils/               # Utility functions
│   └── roleGenerator.ts     # Balanced setup algorithm
├── index.css            # Tailwind configuration + global styles
└── main.tsx             # App entry point + PWA registration
```

### Key Design Decisions

**State Management**: Modular hook-based architecture following Single Responsibility Principle:
- `useGameState`: Coordinator hook that composes specialized sub-hooks
- `useGamePersistence`: Handles localStorage save/load and player name caching
- `usePlayerManager`: Player-related state operations (alive/dead, roles, notes)
- `useNightActions`: Night phase abilities (witch potions, werewolf victims, etc.)
- `useRoleManager`: Role selection and validation logic
- `usePhaseManager`: Game phase transitions and event logging
- Pure logic modules (`winConditions`, `eliminationConsequences`) for testability

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

1. **Setup**: 
   - Select player count (5-20)
   - Choose "Auto-Generate Balanced Setup" for AI-powered role selection
   - Or manually select roles from the organised list
   - Review validation warnings if any appear
   
2. **Start Game**: Begin the first night phase with animated transition

3. **Night Phase**: 
   - Click "Speak" to hear narrator instructions (optional)
   - Follow role-specific action checklists
   - Track player status and notes in the sidebar
   - Use modals for role actions (Witch potions, werewolf victims, etc.)
   - Check off completed actions
   - Click "Next" to progress through each role
   
4. **Dawn Phase**:
   - Reveal roles of eliminated players sequentially
   - Handle chain eliminations (lovers, hunter shots, etc.)
   - View special announcements (Bear Tamer, Sheriff death)
   - System checks for win conditions automatically
   
5. **Day Phase**: 
   - Configure and start discussion timer
   - Use light-themed sidebar for better readability
   - Players discuss and vote to eliminate
   - Record day eliminations with role reveals
   
6. **Continue**: Cycle through phases until victory condition is met
   - Smooth animated transitions between major phases
   - Victory announcement when game ends

## 🔮 Future Enhancements

See [ENHANCEMENTS.md](./ENHANCEMENTS.md) for the complete roadmap.

### Recently Completed ✅
- ✅ **Auto-Generate Balanced Role Setup** (Phase 2) - AI-powered algorithm creates balanced distributions
- ✅ **Dawn Phase** (Phase 2) - Role reveals and special announcements at sunrise
- ✅ **Win Condition Detection** (Phase 2) - Automatic victory detection with beautiful modals
- ✅ **Phase Transitions** (Phase 2) - Animated transitions with atmospheric effects
- ✅ **Medieval Design System** (Phase 3A) - Complete visual overhaul with Cinzel fonts and golden aesthetic
- ✅ **Day/Night Themes** (Phase 3A) - Adaptive UI that changes with game phase
- ✅ **Codebase Refactoring** (v0.1.0) - Decomposed 917-line God Hook into 6 specialized hooks following SRP
- ✅ **Critical Bug Fixes** (v0.1.0) - Fixed role slot validation, added missing Angel and Prejudiced Manipulator win conditions
- ✅ **Actor Roles** - Implemented Prejudiced Manipulator group assignment and Stuttering Judge double elimination

### Upcoming Features
- **Role Card Visual Redesign** (Phase 3B): Illustrated character art and card-based layout
- **Quick Action Buttons**: Reduce clicks with floating action buttons and keyboard shortcuts
- **Voice Narration**: Auto-play TTS mode with configurable timing
- **Sound Effects**: Audio cues for phase transitions and role actions
- **Game Statistics**: Track game history and win rates
- **Multiple Languages**: Internationalisation support (French, Spanish, German)

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
