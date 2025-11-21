# Future Enhancements & Feature Roadmap

This document tracks planned improvements and feature requests for the Miller's Hollow Narrator app.

## 🎯 High Priority - To Do

### 1. Better Visual Design (One Night Ultimate Werewolf Style)
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
- [ ] Large centered character card during night phase
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

### Core Gameplay Features

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
- [x] Death potion kills living player
- [x] Player selection modals
- [x] Event logging

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

Last Updated: 2025-11-21
