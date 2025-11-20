# Future Enhancements & Feature Roadmap

This document tracks planned improvements and feature requests for the Miller's Hollow Narrator app.

## 🎯 Priority Features

### High Priority

#### 1. Multi-Card Role Handling
**Status**: Partially Complete (metadata added)  
**Remaining Work**:
- [ ] Update game state to properly count roles with multiple cards
  - Three Brothers should count as 3 slots, not 1
  - Two Sisters should count as 2 slots, not 1
- [ ] Add quantity selectors for variable roles
  - Villagers (up to 9)
  - Simple Werewolves (up to 4)
- [ ] Update role selection validation to account for actual card counts
- [ ] Display card count badges on role buttons (e.g., "×3", "×2")

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

## 🎨 Enhancement Category B: Better Visual Design

**Status**: Not Started  
**Priority**: Medium

### Planned Improvements
- [ ] **Colour Enhancements**
  - Gradient backgrounds for role cards
  - Team-colored borders (blue for village, red for werewolf, purple for special)
  - Hover effects with colour transitions
  
- [ ] **Card Layouts**
  - Box shadows and depth for 3D card effect
  - Flip animations when selecting roles
  - Card hover lift effect
  
- [ ] **Animations**
  - Smooth phase transitions (fade/slide)
  - Role card entrance animations
  - Progress bar pulse during speaking
  - Moon phase animation during night
  
- [ ] **Thematic Elements**
  - Moon phase indicator (new moon → full moon over game progression)
  - Werewolf silhouette imagery
  - Village/forest background illustrations
  - Dawn/dusk colour gradients for phase transitions
  
- [ ] **Micro-interactions**
  - Button press feedback
  - Loading spinners
  - Success/error toast notifications
  - Confetti on game end

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
