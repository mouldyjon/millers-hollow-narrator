# Future Enhancements & Feature Roadmap

This document tracks planned improvements and feature requests for the Miller's Hollow Narrator app.

## 🎯 Priority Features

### High Priority

#### 1. Auto-Generate Balanced Role Setup
**Status**: Not Started  
**Priority**: High  
**Work Required**:
- [ ] Create role generation algorithm based on player count
- [ ] Define recommended role distributions:
  - 8-10 players: 2 werewolves, 1-2 special roles, rest villagers
  - 11-15 players: 3 werewolves, 2-3 special roles, rest villagers
  - 16-20 players: 4 werewolves, 3-4 special roles, rest villagers
  - 21+ players: 5+ werewolves, 4-5 special roles, rest villagers
- [ ] Ensure minimum 2 werewolf roles always included
- [ ] Balance power roles (Seer, Witch, etc.) appropriately
- [ ] Add "Generate Roles" button on setup screen
- [ ] Add "Regenerate" option to get different random setup
- [ ] Option to save/load custom presets
- [ ] Display role distribution preview before applying

**Game Balance Guidelines**:
- Werewolf ratio: ~25-30% of total players
- Always include at least one Seer or investigative role
- Mix simple and complex roles for variety
- Avoid too many one-shot abilities in small games

#### 2. Multi-Card Role Handling
**Status**: Completed ✅  
**Completed Work**:
- [x] Update game state to properly count roles with multiple cards
  - Three Brothers counts as 3 slots ✅
  - Two Sisters counts as 2 slots ✅
- [x] Add quantity selectors for variable roles
  - Villagers (up to 9) ✅
  - Simple Werewolves (up to 4) ✅
- [x] Update role selection validation to account for actual card counts ✅
- [x] Display +/- controls for multi-select roles ✅
- [x] Show Add/Remove buttons for single-select roles ✅

#### 3. Interactive Narrator Checklists
**Status**: Completed ✅  
**Completed Work**:
- [x] Make narrator action items checkable (tick boxes) ✅
- [x] Persist checked state during the current night ✅
- [x] Track per role per night using completedActions state ✅
- [x] Visual feedback with green checkmarks and strikethrough text ✅
- [x] Hover effects for better UX ✅

#### 4. Role Reveal on Player Elimination
**Status**: Completed ✅  
**Completed Work**:
- [x] Create modal/dialog when player is eliminated ✅
- [x] Role selector modal showing all game roles grouped by team ✅
- [x] Automatically mark player as dead and record revealed role ✅
- [x] Track both revealed role name and actual role ID ✅
- [x] Add elimination to event log with format "Player X (Role) was eliminated" ✅

#### 5. Elimination Consequence System
**Status**: Completed ✅  
**Completed Work**:
- [x] Comprehensive consequence checking system ✅
- [x] Chain eliminations:
  - Cupid's Lovers: Other lover dies of heartbreak ✅
  - Knight with Rusty Sword: Right-hand neighbour is struck ✅
- [x] Interactive death abilities:
  - Hunter: Select target for dying shot ✅
  - Supports recursive chains (Hunter shoots Hunter) ✅
- [x] Informational alerts:
  - Two Sisters/Three Brothers: Sibling notifications ✅
  - Wild Child: Transformation when role model dies ✅
- [x] All chain eliminations require role revelation ✅
- [x] Proper modal flow to prevent UI blocking ✅
- [x] Full event logging for all eliminations ✅

#### 6. Dawn Phase Implementation
**Status**: Completed ✅  
**Completed Work**:
- [x] Add new "dawn" phase between night and day ✅
- [x] Role reveal modals for all players eliminated during the night ✅
- [x] Sequential role reveals with cascade elimination handling ✅
- [x] Special role announcements at dawn:
  - Bear Tamer: Narrator reminder if role in game and not revealed as dead ✅
  - Knight with Rusty Sword: Neighbour elimination handled at dawn ✅
  - Sheriff: Announcement if Sheriff was revealed as dead ✅
- [x] Transition automatically to day phase after dawn ✅
- [x] All elimination consequences (lovers, hunter, etc.) trigger at dawn ✅

#### 7. Role-Specific Features
**Status**: Completed ✅  
**Completed Work**:
- [x] Wolf-Hound Team Toggle
  - Visual toggle buttons for Village/Werewolf allegiance ✅
  - Appears for all players when Wolf-Hound is in game ✅
  - Icons for each team choice ✅
- [x] Cupid Lovers Selection
  - Interactive modal for selecting two lovers ✅
  - Shows current lovers if already selected ✅
  - Visual heart icons and pink theming ✅
  - Event logging when lovers selected ✅
- [x] Wild Child Role Model Selection
  - Modal for selecting role model on first night ✅
  - Shows current role model if already selected ✅
  - Purple theming ✅
  - Event logging ✅
  - Transformation handled in elimination consequences ✅
- [x] Werewolf Victim Selection with Guidance
  - Detailed voting rules and guidance modal ✅
  - Separate modals for Simple Werewolves, Big Bad Wolf, White Werewolf ✅
  - Victims actually eliminated when selected ✅
  - Buttons disabled after selection ✅
  - Flags reset each night ✅
- [x] Witch Potion Functionality
  - Fixed mutual exclusivity (only one potion per night) ✅
  - Healing potion revives dead player ✅
  - Death potion kills living player ✅
  - Player selection modals ✅
  - Event logging ✅
- [x] Actor Role Guidance
  - Comprehensive narrator instructions ✅
  - Guidance for selecting 3 role cards at setup ✅
  - Instructions for using one power per night ✅

#### 8. Day Phase Enhancements
**Status**: Completed ✅  
**Completed Work**:
- [x] Player list available during day phase ✅
- [x] Same sidebar layout as night phase ✅
- [x] Toggleable sidebar with player list and event log ✅
- [x] Full player management during voting ✅
- [x] Role reveals and cascade eliminations work during day ✅

## 🎨 Enhancement Category A: Player & Event Tracking

### Completed ✅
- [x] Player list with status (alive/dead)
- [x] Event log showing game history
- [x] Note-taking area for each player
- [x] Role reveal tracking
- [x] Collapsible sidebar

### Remaining
- [ ] Quick filters for event log (eliminations only, role actions only, etc.)
- [ ] Export game log to text file
- [ ] Player search/filter in player list
- [ ] Color-code players by suspected team
- [ ] Undo/redo for player status changes

## 🎨 Enhancement Category B: Better Visual Design (One Night Ultimate Werewolf Style)

**Status**: Not Started  
**Priority**: High  
**Inspiration**: One Night Ultimate Werewolf Android app + Miller's Hollow board game art

### Design System Overhaul

#### Colour Palette & Backgrounds
- [ ] **Textured Dark Blue Background**
  - Weathered/grunge texture overlay (like screenshots)
  - Dark blue-grey base (#2c3e50 range)
  - Subtle vignette effect at edges
  - Parchment/aged paper texture
  
- [ ] **Typography**
  - "ONE NIGHT" style header (golden/tan serif font)
  - Clean sans-serif for body text (off-white/cream)
  - Yellow/gold text for role names and important info
  - High contrast white for timer numbers

#### Role Cards Redesign
- [ ] **Card Style**
  - Illustrated character art for each role (inspired by Miller's Hollow box art)
  - Rounded corners with subtle border
  - Card frame/border design
  - Slight 3D depth with shadow
  - Semi-transparent dark overlay for unselected cards
  
- [ ] **Card Grid Layout**
  - Grid of role cards (like setup screen screenshot)
  - Hover effect: brighten/lift card
  - Selected state: full brightness + border glow
  - Quantity badge in corner for multi-card roles
  
- [ ] **Role Display During Night**
  - Large centered character card (like werewolf screenshot)
  - Role name in bold above/on card
  - Role instructions in yellow text below card
  - Atmospheric background matching role theme

#### Buttons
- [ ] **Primary Buttons** (PLAY, STOP, PAUSE style)
  - Rounded pill shape
  - Dark grey/charcoal background (#1a1a1a - #2a2a2a)
  - White text, bold, uppercase
  - Subtle inner shadow
  - Press effect: darker + slight scale
  - Border: thin light grey outline
  
- [ ] **Secondary Buttons**
  - Same style but slightly smaller
  - Consistent rounded pill design throughout app

#### Timer Display
- [ ] **Large Countdown Style**
  - Massive white numbers (like 04:56 screenshot)
  - "VOTE NOW" / "TIME" header text above
  - "REMAINING BEFORE VOTE" subtext
  - Center of screen, highly visible
  - Pulse animation when < 30 seconds
  
#### Thematic Elements
- [ ] **Miller's Hollow Aesthetic**
  - Werewolf silhouette art (from box art)
  - Medieval/rustic theming
  - Moon phases for night progression
  - Claw marks or scratch effects
  - Weathered/vintage look
  
- [ ] **Atmospheric Touches**
  - Dark foggy forest background option
  - Lantern light effects
  - Gothic/medieval UI elements
  - Aged parchment for text areas

#### Animations
- [ ] **Card Interactions**
  - Flip animation when revealing roles
  - Slide-in for role cards during night
  - Fade transitions between phases
  - Card shuffle animation on setup
  
- [ ] **Phase Transitions**
  - Fade to black between phases
  - Moon rising animation for night start
  - Sun rising animation for day start
  - Smooth cross-fades throughout

#### Component-Specific Updates

**Setup Screen**
- [ ] Replace current role buttons with illustrated role cards in grid
- [ ] Add textured background
- [ ] Style "PLAY" button to match reference
- [ ] Add role count badge overlay on cards

**Night Phase**
- [ ] Center large role card with character illustration
- [ ] Background darkens around card focus
- [ ] Role instructions in yellow below card
- [ ] STOP/PAUSE buttons at bottom in pill style

**Day Phase**  
- [ ] Huge centered timer display
- [ ] "VOTE NOW" header styling
- [ ] Textured background continues
- [ ] Minimal UI, timer is focus

**Sidebar**
- [ ] Semi-transparent dark overlay
- [ ] Weathered paper texture for content areas
- [ ] Gothic-style section dividers

## 🎮 Enhancement Category C: Role Guidance System

### Completed ✅
- [x] Detailed action cards for each role
- [x] Narrator action checklists
- [x] Track role-specific state (Witch potions, Wolf-Father infection, etc.)

### Remaining
- [ ] **Quick Reference System**
  - Modal with full role descriptions
  - Search roles by name
  - Filter roles by team
  - Print-friendly role reference sheet
  
- [x] **Advanced State Tracking** ✅
  - [x] Record Cupid's lover choices (Player X & Y) ✅
  - [x] Track Wild Child's role model ✅
  - [x] Track Wolf-Hound's team choice (per player) ✅
  - [ ] Track Thief's chosen role
  - [ ] Show all active role states in sidebar summary
  
- [ ] **Narrator Prompts**
  - "Did the Witch save the victim?" yes/no buttons
  - "Who did the Seer investigate?" player selector
  - Auto-log these actions to event log
  - Validate required actions before progressing

## 🔧 Technical Improvements

### Code Quality
- [ ] Add unit tests for game state logic
- [ ] Add E2E tests for critical user flows
- [ ] Improve TypeScript type safety
- [ ] Add error boundary components
- [ ] Implement proper error logging

### Performance
- [ ] Optimize re-renders with React.memo
- [ ] Implement virtual scrolling for player list (30+ players)
- [ ] Lazy load role definitions
- [ ] Cache TTS utterances

### PWA Enhancements
- [ ] Add proper app icons (192px, 512px)
- [ ] Implement update notification when new version available
- [ ] Add offline indicator
- [ ] Cache game state to localStorage
- [ ] Add "Resume Game" feature

## 🌍 Accessibility & I18n

### Accessibility
- [ ] Keyboard navigation support
- [ ] ARIA labels for screen readers
- [ ] High contrast mode option
- [ ] Adjustable font sizes
- [ ] Focus indicators

### Internationalization
- [ ] Extract all text to translation files
- [ ] Add French language support (original game language)
- [ ] Add Spanish language support
- [ ] Add German language support
- [ ] Language selector in settings

## 📊 Advanced Features

### Game Management
- [ ] Save/load game state
- [ ] Multiple concurrent games
- [ ] Game templates (preset role combinations)
- [ ] Custom role creation

### Statistics
- [ ] Win rate by team
- [ ] Most/least played roles
- [ ] Average game duration
- [ ] Player performance tracking (if named players)

### Social Features
- [ ] Share game log via URL
- [ ] Export game summary to social media
- [ ] QR code for easy game joining
- [ ] Multi-device sync (host on one device, view on another)

## 📝 Documentation

- [ ] Video tutorial/walkthrough
- [ ] Beginner's guide to the game
- [ ] Narrator tips and best practices
- [ ] Troubleshooting guide
- [ ] Contributing guidelines
- [ ] API documentation for custom extensions

## 🐛 Known Issues

### Bug Fixes Needed
- [ ] TTS doesn't work in all browsers (add fallback text display)
- [ ] Service worker cache invalidation on app update
- [ ] Timer continues in background on mobile (pause on tab switch)
- [ ] Role order edge cases with optional roles

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
