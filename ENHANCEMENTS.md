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

#### 2. Interactive Narrator Checklists
**Status**: Not Started  
**Work Required**:
- [ ] Make narrator action items checkable (tick boxes)
- [ ] Persist checked state during the current night
- [ ] Reset checkboxes when moving to next role
- [ ] Visual feedback when all actions completed
- [ ] Optional: Save checklist completion history

#### 3. Role Reveal on Player Elimination
**Status**: Not Started  
**Work Required**:
- [ ] Create modal/dialog when player is eliminated
- [ ] Role selector dropdown in elimination modal
- [ ] Automatically mark player as dead and record revealed role
- [ ] Add elimination to event log
- [ ] Handle special death effects:
  - Hunter: Prompt for who they shoot
  - Lovers: Automatically eliminate partner
  - Knight with Rusty Sword: Note infected werewolf

#### 4. Dawn Phase Implementation
**Status**: Not Started  
**Work Required**:
- [ ] Add new "dawn" phase between night and day
- [ ] Special role announcements at dawn:
  - Bear Tamer: Bear growls if adjacent to werewolf
  - Knight with Rusty Sword: Infected werewolf dies
  - Sheriff: Announcement if Sheriff died
- [ ] Transition automatically to day phase after dawn

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
  
- [ ] **Advanced State Tracking**
  - Record Cupid's lover choices (Player X & Y)
  - Track Wild Child's role model
  - Track Wolf-Hound's team choice
  - Track Thief's chosen role
  - Show all active role states in sidebar
  
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
