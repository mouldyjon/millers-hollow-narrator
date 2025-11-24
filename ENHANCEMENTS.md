# Future Enhancements & Feature Roadmap

This document tracks planned improvements and feature requests for the Miller's Hollow Narrator app.

## 🎯 High Priority - To Do

### 1. Role Card Visual Redesign
**Status**: Not Started  
**Priority**: High  
**Effort**: Medium-High | **Impact**: High

**Why**: Makes setup phase more engaging and intuitive, transforms role selection from a list into an interactive card game experience.

**Work Required**:
- [ ] Design card-based layout system (grid instead of list)
- [ ] Create visual icons/illustrations for each role
- [ ] Implement card flip animations when selecting/deselecting
- [ ] Add hover effects (lift, brighten, glow)
- [ ] Enhance team colour prominence (blue for village, red for werewolf, purple for solo)
- [ ] Add subtle shadows and depth effects
- [ ] Implement quantity badges for multi-card roles (villager, simple werewolf)
- [ ] Create selected state with border glow
- [ ] Ensure responsive grid layout (mobile, tablet, desktop)
- [ ] Add card shuffle animation on initial load

**Design Notes**:
- Inspiration from card games and One Night Ultimate Werewolf
- Cards should feel tactile and satisfying to interact with
- Clear visual feedback for all states (unselected, selected, disabled)

### 2. Setup Validation & Warnings
**Status**: Partially Complete  
**Priority**: High  
**Effort**: Low | **Impact**: Medium

**Why**: Prevents narrator errors before game starts, educates new narrators about balanced setups, reduces frustration from unbalanced games.

**Completed** (via Auto-Generator Modal):
- [x] Real-time balance validation in role generator
- [x] Warning banners for common issues:
  - [x] "No investigative role - village will struggle to find werewolves"
  - [x] "Too many werewolves (>35%) - game unbalanced"
  - [x] "Too few werewolves (<20%) - village will dominate"
  - [x] "No werewolves selected - game cannot proceed"
  - [x] Role count mismatch warnings
- [x] Create severity levels (warnings displayed with amber theme)
- [x] Block "Use These Roles" button on critical errors
- [x] Werewolf percentage display (20-35% target)
- [x] Live distribution preview (Village/Werewolf/Solo counts)

**Still To Do** (for manual setup validation):
- [ ] Real-time validation during manual role selection (not just in generator)
- [ ] Show warnings on main setup screen when manually selecting roles
- [ ] Highlight recommended roles in green on setup screen
- [ ] Show role synergies (e.g., "Cupid works well with larger games")
- [ ] Add "Why?" tooltips explaining warnings
- [ ] Warn if no protective roles (8+ players)
- [ ] Warn about unused special mechanics
- [ ] Allow override with confirmation on warnings

**Validation Rules Implemented**:
- ✅ Must have at least 1 werewolf
- ✅ Should have 20-35% werewolves
- ✅ Should have at least 1 investigative role (6+ players)
- ⏳ Warn if no protective roles (8+ players) - To Do
- ⏳ Warn about unused special mechanics - To Do

### 3. Better Visual Design (One Night Ultimate Werewolf Style)
**Status**: Not Started  
**Priority**: High  
**Inspiration**: One Night Ultimate Werewolf Android app + Miller's Hollow board game art

#### Design System Overhaul

**Colour Palette & Backgrounds**
- [ ] Textured dark blue background with weathered/grunge texture overlay
- [ ] Dark blue-grey base (#2c3e50 range)
- [ ] Subtle vignette effect at edges
- [ ] Parchment/aged paper texture

**Typography**
- [ ] "ONE NIGHT" style header (golden/tan serif font)
- [ ] Clean sans-serif for body text (off-white/cream)
- [ ] Yellow/gold text for role names and important info
- [ ] High contrast white for timer numbers

**Role Cards Redesign**
- [ ] Illustrated character art for each role
- [ ] Rounded corners with subtle border
- [ ] Card frame/border design
- [ ] Slight 3D depth with shadow
- [ ] Semi-transparent dark overlay for unselected cards
- [ ] Grid of role cards layout
- [ ] Hover effect: brighten/lift card
- [ ] Selected state: full brightness + border glow
- [ ] Quantity badge in corner for multi-card roles
- [ ] Large centred character card during night phase
- [ ] Atmospheric background matching role theme

**Buttons**
- [ ] Primary buttons: Rounded pill shape, dark grey/charcoal background
- [ ] White text, bold, uppercase
- [ ] Subtle inner shadow and press effect
- [ ] Thin light grey outline
- [ ] Secondary buttons with same style

**Timer Display**
- [ ] Massive white numbers (like 04:56)
- [ ] "VOTE NOW" / "TIME" header text above
- [ ] "REMAINING BEFORE VOTE" subtext
- [ ] Pulse animation when < 30 seconds

**Thematic Elements**
- [ ] Werewolf silhouette art (from box art)
- [ ] Medieval/rustic theming
- [ ] Moon phases for night progression
- [ ] Claw marks or scratch effects
- [ ] Weathered/vintage look
- [ ] Dark foggy forest background option
- [ ] Lantern light effects
- [ ] Gothic/medieval UI elements

**Animations**
- [ ] Flip animation when revealing roles
- [ ] Slide-in for role cards during night
- [ ] Fade transitions between phases
- [ ] Card shuffle animation on setup
- [ ] Fade to black between phases
- [ ] Moon/sun rising animations
- [ ] Smooth cross-fades throughout

## 🎨 Medium Priority - To Do

### 1. Quick Action Buttons During Night
**Status**: Not Started  
**Priority**: Medium-High  
**Effort**: Medium | **Impact**: High

**Why**: Reduces modal fatigue, speeds up gameplay, makes the narrator experience smoother and less clicking-heavy.

**Work Required**:
- [ ] Implement floating action buttons for common tasks during night phase
- [ ] Add quick-toggle checkboxes for narrator actions (without opening modals)
- [ ] Implement swipe gestures for mobile (swipe left to mark dead, swipe right to add note)
- [ ] Add keyboard shortcuts for power users:
  - `Space` - Mark current action complete
  - `N` - Next role
  - `E` - Mark player eliminated
  - `R` - Reveal role
  - `?` - Show keyboard shortcuts
- [ ] Create context menu on player cards (right-click/long-press)
- [ ] Add quick-access player selector (type number to highlight player)
- [ ] Implement undo/redo for recent actions
- [ ] Show floating "Recent Actions" panel with undo buttons
- [ ] Add gesture hints on first use
- [ ] Ensure accessibility (keyboard navigation, screen reader support)

**UX Improvements**:
- Reduce clicks from 3-4 to 1-2 for common actions
- Less modal interruption = smoother flow
- Power users can navigate without touching mouse
- Mobile users get native-feeling gestures

### 2. Night Phase Voice Narration
**Status**: Not Started  
**Priority**: Medium  
**Effort**: Medium | **Impact**: Very High (when implemented)

**Why**: Transforms narrator experience from reading a screen to truly guiding the game. Allows narrator to watch players instead of reading instructions. Makes app feel professional and polished.

**Note**: Skipped for now - will be implemented in a future phase.

**Work Required**:
- [ ] Implement Web Speech API for Text-to-Speech
- [ ] Add "Speak" button next to each role instruction
- [ ] Create auto-advance mode with configurable timing
- [ ] Add voice settings:
  - Voice selection (male/female, language)
  - Speed control (0.5x to 2x)
  - Volume control
  - Pitch adjustment
- [ ] Implement auto-play mode:
  - Automatically read instructions
  - Auto-advance after configurable delay (5s, 10s, 15s)
  - Pause/resume controls
- [ ] Add narration script preview
- [ ] Create fallback for browsers without TTS support
- [ ] Add visual indicator when speaking (pulsing icon)
- [ ] Implement "quiet mode" toggle (text only, no speech)
- [ ] Save narrator preferences (voice, speed, auto-play)
- [ ] Test across browsers (Chrome, Safari, Firefox)

**Narration Flow**:
1. Click "Begin Night" → Auto-narrate "Close your eyes..."
2. Auto-advance through each role with timing
3. Visual + audio feedback for current role
4. Narrator can manually skip/pause/replay
5. Ends with "Morning comes..." transition

**Browser Compatibility**:
- Chrome/Edge: Full support
- Safari: Partial support (limited voices)
- Firefox: Good support
- Mobile: Test iOS/Android separately

### Player & Event Tracking Enhancements
- [ ] Quick filters for event log (eliminations only, role actions only, etc.)
- [ ] Export game log to text file
- [ ] Player search/filter in player list
- [ ] Colour-code players by suspected team
- [ ] Undo/redo for player status changes

### Role Guidance System
- [ ] Quick Reference System
  - Modal with full role descriptions
  - Search roles by name
  - Filter roles by team
  - Print-friendly role reference sheet
- [ ] Show all active role states in sidebar summary
- [ ] Track Thief's chosen role
- [ ] Narrator Prompts
  - "Did the Witch save the victim?" yes/no buttons
  - "Who did the Seer investigate?" player selector
  - Auto-log these actions to event log
  - Validate required actions before progressing

### Technical Improvements

**Code Quality**
- [ ] Add unit tests for game state logic
- [ ] Add E2E tests for critical user flows
- [ ] Improve TypeScript type safety
- [ ] Add error boundary components
- [ ] Implement proper error logging

**Performance**
- [ ] Optimise re-renders with React.memo
- [ ] Implement virtual scrolling for player list (30+ players)
- [ ] Lazy load role definitions
- [ ] Cache TTS utterances

**PWA Enhancements**
- [ ] Add proper app icons (192px, 512px)
- [ ] Implement update notification when new version available
- [ ] Add offline indicator
- [ ] Cache game state to localStorage
- [ ] Add "Resume Game" feature

### Accessibility & Internationalisation

**Accessibility**
- [ ] Keyboard navigation support
- [ ] ARIA labels for screen readers
- [ ] High contrast mode option
- [ ] Adjustable font sizes
- [ ] Focus indicators

**Internationalisation**
- [ ] Extract all text to translation files
- [ ] Add French language support (original game language)
- [ ] Add Spanish language support
- [ ] Add German language support
- [ ] Language selector in settings

## 📊 Low Priority - To Do

### Advanced Features

**Game Management**
- [ ] Save/load game state
- [ ] Multiple concurrent games
- [ ] Game templates (preset role combinations)
- [ ] Custom role creation

**Statistics**
- [ ] Win rate by team
- [ ] Most/least played roles
- [ ] Average game duration
- [ ] Player performance tracking (if named players)

**Social Features**
- [ ] Share game log via URL
- [ ] Export game summary to social media
- [ ] QR code for easy game joining
- [ ] Multi-device sync (host on one device, view on another)

### Documentation
- [ ] Video tutorial/walkthrough
- [ ] Beginner's guide to the game
- [ ] Narrator tips and best practices
- [ ] Troubleshooting guide
- [ ] Contributing guidelines
- [ ] API documentation for custom extensions

### Known Issues
- [ ] TTS doesn't work in all browsers (add fallback text display)
- [ ] Service worker cache invalidation on app update
- [ ] Timer continues in background on mobile (pause on tab switch)
- [ ] Role order edge cases with optional roles

---

## ✅ Completed Features

### Phase Transition Animations ✅
**Status**: Completed (2025-11-21)  
**Priority**: High  
**Effort**: Low-Medium | **Impact**: Medium-High

**Why**: Creates atmosphere, builds tension, and provides natural breaks between game phases. Reduces cognitive load by clearly separating game states.

**Work Completed**:
- [x] Implement smooth animated transitions between major phases
- [x] Create "Night falls..." animation with moon icon and glow effects
- [x] Create "Dawn breaks..." animation with sunrise icon
- [x] Add floating particle effects for atmosphere
- [x] Implement smooth easing and timing functions
- [x] Ensure transitions don't block game flow (skippable via Space/Enter/Escape/Click)
- [x] Test performance on mobile devices
- [x] Optimise UX flow by removing redundant Day transition

**Implementation Details**:
- Created `PhaseTransition.tsx` component with two transition types (Night, Dawn)
- Beautiful gradient backgrounds (night: deep indigo, dawn: amber/orange)
- Animated floating icons with scale, rotation, and glow effects
- 30 floating particles for atmospheric effect
- Duration: 3.5 seconds (provides reading time for narrator)
- Skip options: Space/Enter/Escape keys or click anywhere
- Uses `requestAnimationFrame` for smooth 60fps animations
- Easing functions for natural motion

**UX Decision**:
- Removed Day transition: Dawn → Day happens without transition for better flow
- Reasoning: Dawn and Day are conceptually the same phase (village awake), and another transition after role reveals felt redundant
- Final flow: Night (roles act) → **[Dawn transition]** → Dawn (reveal deaths) → Day (discussion) → **[Night transition]** → repeat

**Files Modified**:
- `src/components/PhaseTransition.tsx` (new)
- `src/App.tsx` (integrated transitions)

---

### Phase 2 Enhancements ✅ (2025-11-25)

#### Win Condition Detection ✅
**Status**: Completed

**Implemented**:
- [x] Automatic win detection at end of Day and Dawn phases
- [x] Village wins when all werewolves eliminated
- [x] Werewolves win when all villagers eliminated
- [x] Victory announcement modal with team-specific theming
- [x] Proper handling of multi-instance roles (Villagers, Sisters, Brothers)
- [x] Wolf-Hound team allegiance properly counted in win totals
- [x] Cursed Wolf-Father infected player counted as werewolf

**Implementation Details**:
- Created `VictoryAnnouncement.tsx` component with beautiful victory modals
- Added `checkWinCondition()` function in useGameState hook
- Counts total roles in setup vs revealed dead roles
- Handles edge cases: Wolf-Hound team switch, infected players
- Team-specific victory themes (blue for Village, red for Werewolves)

**Files Modified**:
- `src/hooks/useGameState.ts` (win detection logic)
- `src/components/VictoryAnnouncement.tsx` (new)
- `src/components/DawnPhase.tsx` (victory check)
- `src/components/DayPhase.tsx` (victory check)

#### Role Filtering Improvements ✅
**Status**: Completed

**Implemented**:
- [x] Already-revealed roles filtered from role selection modal
- [x] Multi-instance role counting (multiple Villagers, Werewolves)
- [x] Multi-player role support (Two Sisters = 2, Three Brothers = 3)
- [x] Eliminated players' roles hidden from night sequence
- [x] Infected players filtered from their original role night actions

**Implementation Details**:
- Count revealed roles vs total role instances
- Filter roles where all instances have been revealed
- Check if players with revealed roles are still alive
- Special handling for Sisters/Brothers (multi-player roles)
- Infected players excluded from non-werewolf roles

**Files Modified**:
- `src/components/RoleRevealModal.tsx` (role counting logic)
- `src/components/NightPhase.tsx` (role filtering)

#### Player Status At-a-Glance ✅
**Status**: Completed

**Implemented**:
- [x] Visual status icons system (alive, dead, revealed, infected)
- [x] Colour-coded team indicators when role revealed (blue/red/purple borders)
- [x] Quick filter buttons (all, alive, dead, revealed)
- [x] Player count summary banner
- [x] Orange "🦠 INFECTED" badge for Cursed Wolf-Father victims
- [x] Compact card view with clear iconography
- [x] Mobile-friendly responsive design

**Files Modified**:
- `src/components/PlayerList.tsx` (enhanced UI)
- `src/components/NightPhase.tsx` (pass infected player prop)
- `src/components/DayPhase.tsx` (pass infected player prop)

---

### Setup & Role Selection ✅

#### Auto-Generate Balanced Role Setup ✅
- [x] Created role generation algorithm based on player count
- [x] Implemented balanced role distributions:
  - 5 players: 1 werewolf, rest village
  - 6-8 players: 2 werewolves, investigative + protective roles
  - 9-12 players: 3 werewolves, investigative + protective + social roles
  - 13-16 players: 4 werewolves, varied role mix
  - 17-20 players: 5 werewolves, full role variety
- [x] Maintains 25-30% werewolf ratio across all player counts
- [x] Guarantees at least one investigative role (Seer, Fox, or Bear Tamer)
- [x] Balances power roles appropriately
- [x] Added prominent "Auto-Generate Balanced Setup" button on setup screen
- [x] Implemented "Regenerate" option for different random setups
- [x] Created RoleGeneratorModal with:
  - Live distribution preview (Village/Werewolf/Solo counts)
  - Werewolf percentage display
  - Role breakdown with quantities
  - Validation warnings with helpful context
  - Beautiful amber-themed UI
- [x] Manual adjustment capability preserved after generation
- [x] Tested with player counts from 5-20 players

**Implementation Details**:
- `src/utils/roleGenerator.ts`: Core algorithm and validation
- `src/components/RoleGeneratorModal.tsx`: Modal UI component
- Integration in `src/components/SetupScreen.tsx`
- All setups validated for balance and playability

### Core Gameplay Features ✅

#### Multi-Card Role Handling ✅
- [x] Update game state to properly count roles with multiple cards
  - Three Brothers counts as 3 slots
  - Two Sisters counts as 2 slots
- [x] Add quantity selectors for variable roles
  - Villagers (up to 9)
  - Simple Werewolves (up to 4)
- [x] Update role selection validation to account for actual card counts
- [x] Display +/- controls for multi-select roles
- [x] Show Add/Remove buttons for single-select roles

#### Interactive Narrator Checklists ✅
- [x] Make narrator action items checkable (tick boxes)
- [x] Persist checked state during the current night
- [x] Track per role per night using completedActions state
- [x] Visual feedback with green checkmarks and strikethrough text
- [x] Hover effects for better UX

#### Role Reveal on Player Elimination ✅
- [x] Create modal/dialogue when player is eliminated
- [x] Role selector modal showing all game roles grouped by team
- [x] Automatically mark player as dead and record revealed role
- [x] Track both revealed role name and actual role ID
- [x] Add elimination to event log with format "Player X (Role) was eliminated"

#### Elimination Consequence System ✅
- [x] Comprehensive consequence checking system
- [x] Chain eliminations:
  - Cupid's Lovers: Other lover dies of heartbreak
  - Knight with Rusty Sword: Right-hand neighbour is struck
- [x] Interactive death abilities:
  - Hunter: Select target for dying shot
  - Supports recursive chains (Hunter shoots Hunter)
- [x] Informational alerts:
  - Two Sisters/Three Brothers: Sibling notifications
  - Wild Child: Transformation when role model dies
- [x] All chain eliminations require role revelation
- [x] Proper modal flow to prevent UI blocking
- [x] Full event logging for all eliminations

#### Dawn Phase Implementation ✅
- [x] Add new "dawn" phase between night and day
- [x] Role reveal modals for all players eliminated during the night
- [x] Sequential role reveals with cascade elimination handling
- [x] Special role announcements at dawn:
  - Bear Tamer: Narrator reminder if role in game and not revealed as dead
  - Knight with Rusty Sword: Neighbour elimination handled at dawn
  - Sheriff: Announcement if Sheriff was revealed as dead
- [x] Transition automatically to day phase after dawn
- [x] All elimination consequences (lovers, hunter, etc.) trigger at dawn

#### Role-Specific Features ✅

**Wolf-Hound Team Toggle**
- [x] Visual toggle buttons for Village/Werewolf allegiance
- [x] Appears for all players when Wolf-Hound is in game
- [x] Icons for each team choice

**Cupid Lovers Selection**
- [x] Interactive modal for selecting two lovers
- [x] Shows current lovers if already selected
- [x] Visual heart icons and pink theming
- [x] Event logging when lovers selected

**Wild Child Role Model Selection**
- [x] Modal for selecting role model on first night
- [x] Shows current role model if already selected
- [x] Purple theming
- [x] Event logging
- [x] Transformation handled in elimination consequences

**Werewolf Victim Selection with Guidance**
- [x] Detailed voting rules and guidance modal
- [x] Separate modals for Simple Werewolves, Big Bad Wolf, White Werewolf
- [x] Victims actually eliminated when selected
- [x] Buttons disabled after selection
- [x] Flags reset each night

**Witch Potion Functionality**
- [x] Fixed mutual exclusivity (only one potion per night)
- [x] Healing potion revives dead player
- [x] Healing potion cancels role reveal at dawn
- [x] Death potion kills living player
- [x] Player selection modals
- [x] Event logging

**Cursed Wolf-Father Silent Infection ✅** (2025-11-25)
- [x] Player selection modal for choosing victim to infect
- [x] Infected player tracked in game state
- [x] Silent conversion: player becomes werewolf, keeps original role card
- [x] Infected player loses ALL original role abilities immediately
- [x] Filtered from their original role's night sequence
- [x] Wakes with werewolves, included in werewolf narration
- [x] Prominent orange "🦠 INFECTED" badge in player list
- [x] Comprehensive narrator notifications and guidance
- [x] Infected player counted as werewolf in win condition
- [x] Properly subtracted from village team count
- [x] Event logging for infection action
- [x] Modal guidance on discreet player notification
- [x] Alert banner during werewolf phase with instructions

**Actor Role Guidance**
- [x] Comprehensive narrator instructions
- [x] Guidance for selecting 3 role cards at setup
- [x] Instructions for using one power per night

#### Day Phase Enhancements ✅
- [x] Player list available during day phase
- [x] Same sidebar layout as night phase
- [x] Toggleable sidebar with player list and event log
- [x] Full player management during voting
- [x] Role reveals and cascade eliminations work during day

### Player & Event Tracking ✅
- [x] Player list with status (alive/dead)
- [x] Event log showing game history
- [x] Note-taking area for each player
- [x] Role reveal tracking
- [x] Collapsible sidebar

### Advanced State Tracking ✅
- [x] Record Cupid's lover choices (Player X & Y)
- [x] Track Wild Child's role model
- [x] Track Wolf-Hound's team choice (per player)

### Role Guidance ✅
- [x] Detailed action cards for each role
- [x] Narrator action checklists
- [x] Track role-specific state (Witch potions, Wolf-Father infection, etc.)

---

## How to Contribute

To work on any of these enhancements:

1. Create a new branch: `git checkout -b feature/enhancement-name`
2. Mark the item as in progress by changing `[ ]` to `[🚧]`
3. Implement the feature with tests
4. Update this document when complete: `[ ]` → `[x]`
5. Submit a pull request

## Priority Guide

- **High Priority**: Core gameplay improvements, bug fixes
- **Medium Priority**: UX enhancements, visual polish
- **Low Priority**: Nice-to-have features, advanced functionality

Last Updated: 2025-11-25
