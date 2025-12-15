# Future Enhancements & Feature Roadmap

This document tracks planned improvements and feature requests for the Miller's Hollow Narrator app.

## 🎯 High Priority - To Do

### 1. Complex Role Implementations

#### Prejudiced Manipulator
**Status**: Partially Complete  
**Priority**: High  
**Effort**: Medium | **Impact**: High

**Role Description**: 
The Prejudiced Manipulator is a solo role that divides the village into two groups and wins if their target group is completely eliminated.

**Official Rules** (based on research):
- The Prejudiced Manipulator mentally divides all players into two groups (A and B)
- The groups can be based on any criteria (e.g., physical position, gender, clothing colour, etc.)
- They choose which group to eliminate (the target group)
- They win if the target group is completely eliminated (all members dead)
- If the Prejudiced Manipulator dies, the game continues normally (village vs werewolves)
- Can change target group if circumstances change (e.g., becoming Prejudiced Manipulator from Devoted Servant)

**Completed Implementation**:

**State Management**:
- [x] Added `prejudicedManipulatorGroup?: "A" | "B"` to Player interface
- [x] Added `prejudicedManipulatorTargetGroup?: "A" | "B"` to GameState
- [x] Created `setPlayerPrejudicedManipulatorGroup(playerNumber, group)` function
- [x] Created `setPrejudicedManipulatorTargetGroup(group)` function

**Setup Screen UI**:
- [x] Group assignment section appears when prejudiced-manipulator is selected
- [x] Target group selection (A or B buttons with purple highlighting)
- [x] Player group assignment grid:
  - [x] Each player has Group A / Group B toggle buttons
  - [x] Visual distinction: Group A = blue, Group B = red
  - [x] Checkmark when player assigned to group
- [x] Group summary showing count and player names in each group
- [x] Clean, intuitive UI using existing design system

**Remaining Work**:

**Win Condition Detection**:
- [ ] Add check in `checkWinCondition()`:
  - [ ] Get all players in target group
  - [ ] Check if all players in target group are dead
  - [ ] If yes and Prejudiced Manipulator is alive → Manipulator wins
  - [ ] If Prejudiced Manipulator is dead, ignore this win condition
  - [ ] Ensure this check happens BEFORE village/werewolf victory checks
- [ ] Update VictoryAnnouncement component for Prejudiced Manipulator victory
  - [ ] Add "Prejudiced Manipulator Wins!" message
  - [ ] Show which group was eliminated
  - [ ] Purple/solo themed victory screen

**In-Game UI**:
- [ ] Display group membership in PlayerList (narrator only view):
  - [ ] Show badge with "Group A" or "Group B" on each player
  - [ ] Only visible when Prejudiced Manipulator is in game
  - [ ] Similar styling to existing role badges
- [ ] Add group status panel showing alive/dead counts per group:
  - [ ] Could be in sidebar or collapsible panel
  - [ ] Show: "Group A: 3 alive / 2 dead" 
  - [ ] Show: "Group B: 2 alive / 3 dead"
  - [ ] Highlight target group
- [ ] Add RoleNarratorGuide note for Prejudiced Manipulator (if needed)

**Edge Cases to Handle**:
- [ ] What if Prejudiced Manipulator is in Cupid's lovers pair?
  - [ ] Can they still win solo or do they win with lover?
- [ ] What if Prejudiced Manipulator becomes infected by Cursed Wolf-Father?
  - [ ] Do they become werewolf and lose solo win condition?
- [ ] Handle group reassignment if role transfers (Devoted Servant scenario)
- [ ] Prevent game from ending in village/werewolf victory if Manipulator can still win
  - [ ] Add check: "if Manipulator alive and target group not eliminated, game continues"

**Validation**:
- [ ] Warn if not all players assigned to groups during setup
- [ ] Warn if target group not selected
- [ ] Consider adding "Quick Assign" button to randomly split players 50/50

**Testing Scenarios**:
- [ ] All of target group eliminated → Manipulator wins
- [ ] Manipulator dies → game continues normally
- [ ] Both groups have mixed village/werewolf → complex endgame
- [ ] Manipulator is last survivor → they lose (can't eliminate opposing group)
- [ ] Test with Cupid lovers including Manipulator
- [ ] Test with Manipulator infected by Cursed Wolf-Father

**References**:
- [The Werewolves of Miller's Hollow: Characters Rulebook](https://manuals.plus/m/ddc2209b9b0fc3b5b1bfe2126f2816b611aac1b90a55638e17f692a2db9ce161)
- [Werewolves Rules - UltraBoardGames](https://www.ultraboardgames.com/the-werewolves-of-millers-hollow/game-rules.php)

---

#### Actor
**Status**: Not Started  
**Priority**: High  
**Effort**: Medium-High | **Impact**: High

**Role Description**: 
The Actor can use powers from three pre-selected role cards each night, choosing one power per night to activate.

**Official Narration**:
> "Actor, wake up. Use one of your three available role powers."

**How It Works**:
- At game start, the narrator selects 3 role cards for the Actor to use
- These 3 roles are recorded in the Actor player's notes
- Each night, the Actor can use ONE of their 3 role powers
- The Actor chooses which role power they want to use that night
- The narrator performs that role's action as if the Actor were that role
- Some powers may be limited use (e.g., Witch potions run out after use)

**Implementation Requirements**:

**State Management**:
- [ ] Add `actorRoles?: [RoleId, RoleId, RoleId]` to GameState
- [ ] Add `actorPowerUsages?: Record<RoleId, number>` to track limited-use powers
- [ ] Create function `setActorRoles(role1, role2, role3)`
- [ ] Create function `recordActorPowerUse(roleId)`

**Setup Phase**:
- [ ] Add Actor role card selection UI in SetupScreen (similar to Thief unused roles)
- [ ] Show when Actor role is selected in setup
- [ ] Allow narrator to select 3 roles from available roles
- [ ] Display selected roles in setup summary
- [ ] Automatically populate Actor player's notes with the 3 role names

**Night Phase**:
- [ ] Add Actor to night order (flexible position, after role viewing)
- [ ] Create `ActorPowerSelectionModal` component:
  - [ ] Display the 3 available role powers
  - [ ] Show each role's description and current night action
  - [ ] Indicate if a power has limited uses remaining
  - [ ] Disable powers that are exhausted (e.g., Witch potions used up)
  - [ ] "Skip Turn" option if Actor doesn't want to use power
- [ ] When role selected, trigger that role's modal/action:
  - [ ] If Seer power → open victim selection
  - [ ] If Witch power → open potion selection (track potion usage separately)
  - [ ] If Guard power → open player protection
  - [ ] etc.

**Narrator Guide**:
- [ ] Add instructions in RoleNarratorGuide
- [ ] Show which 3 powers Actor has
- [ ] Display power usage history
- [ ] Indicate which powers are still available

**UI Components**:
- [ ] Role card selection interface (3 dropdowns or card picker)
- [ ] Power selection modal with role cards displayed
- [ ] Power usage tracking display
- [ ] Visual indicator of exhausted powers

**Limited-Use Power Tracking**:
- [ ] Track Witch potions separately for Actor (don't affect real Witch)
- [ ] Track any one-time-use powers
- [ ] Reset appropriate powers each night
- [ ] Disable powers that can't be used (e.g., Guard can't protect same player twice)

**Edge Cases to Handle**:
- [ ] What if Actor chooses Cupid power but lovers already selected?
- [ ] What if Actor chooses Wild Child but role model already set?
- [ ] Can Actor use investigative powers on themselves?
- [ ] What happens if Actor dies - do their powers disappear?
- [ ] Can Actor have same role as another player in game?
- [ ] How to handle role-specific game state (e.g., Witch potions vs Actor using Witch power)

**Validation**:
- [ ] Ensure 3 different roles selected for Actor
- [ ] Warn if Actor roles conflict with game state
- [ ] Prevent selecting roles that only work on first night (if past first night)

**Testing Scenarios**:
- [ ] Actor uses different power each night
- [ ] Actor exhausts limited-use power (Witch)
- [ ] Actor uses same power multiple nights in a row
- [ ] Actor dies mid-game
- [ ] Actor with 3 investigative roles vs 3 protective roles vs mixed

**Design Considerations**:
- Actor is extremely flexible and powerful - balance carefully
- Some role combinations may be too strong
- Consider limiting Actor to non-first-night-only roles
- May want to prevent certain role combinations (e.g., all werewolf roles)

---

### 2. Role Card Visual Redesign
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

### 3. Setup Validation & Warnings
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

### 4. Better Visual Design - Remaining Enhancements
**Status**: Phase 3A & 3B Complete, Future Enhancements Remain  
**Priority**: High  
**Inspiration**: One Night Ultimate Werewolf Android app + Miller's Hollow board game art

**Remaining Visual Enhancements** (Future Phase)

**Advanced Character Art Features**
- [ ] Large centred character card during night phase
- [ ] Werewolf silhouette art (from box art)
- [ ] Claw marks or scratch effects
- [ ] Weathered/vintage look
- [ ] Dark foggy forest background option
- [ ] Lantern light effects
- [ ] Gothic/medieval UI elements

**Advanced Animations**
- [ ] Flip animation when revealing roles
- [ ] Slide-in for role cards during night
- [ ] Card shuffle animation on setup
- [ ] Smooth cross-fades throughout

## 🎨 Medium Priority - To Do

### 1. Auto-Narrator Mode Implementation
**Status**: In Progress  
**Priority**: High  
**Effort**: Medium-Large | **Impact**: Very High

**Why**: Enables fully automated gameplay where players interact directly with a shared device, eliminating the need for a human narrator.

**Work Required**:
- [ ] Finish implementing night phase automation
  - [ ] Integrate SleepScreen and WakeUpPrompt components into NightPhase
  - [ ] Implement 4-second delay between role transitions
  - [ ] Add auto-advance logic after role actions complete
- [ ] Add role-specific action screens for player interaction
  - [ ] Simplified, player-facing UI for each role's actions
  - [ ] Touch-friendly buttons for selections
  - [ ] Clear "Done" confirmation buttons
- [ ] Implement sleep screen transitions
  - [ ] Dark screen with "Keep your eyes closed" message
  - [ ] Smooth fade in/out animations
  - [ ] 4-second countdown before next role
- [ ] Test the full automated flow
  - [ ] End-to-end testing of complete night phase
  - [ ] Ensure audio timing works correctly
  - [ ] Verify all role actions work in auto mode
- [ ] Day phase voting remains manual (as planned)

**Notes**:
- Phase 1 approach: single-device pass-and-play
- Future enhancement: multi-device networked gameplay

### 2. Additional Features & Enhancements

#### Sound Effects for Phase Transitions
**Status**: Not Started  
**Priority**: Medium  
**Effort**: Small | **Impact**: Medium

**Work Required**:
- [ ] Add sound effects for dawn/day/night transitions
- [ ] Implement volume controls specifically for sound effects
- [ ] Add subtle background ambience for each phase

#### Volume Controls Enhancement
**Status**: Not Started  
**Priority**: Medium  
**Effort**: Small | **Impact**: Medium

**Work Required**:
- [ ] Separate volume controls for narration vs sound effects
- [ ] Add mute/unmute quick toggle
- [ ] Persist volume preferences in localStorage

#### Player Name Customization
**Status**: Not Started  
**Priority**: Medium  
**Effort**: Small | **Impact**: Medium

**Work Required**:
- [ ] Add name input fields in setup screen
- [ ] Display custom names throughout game
- [ ] Persist player names in game state
- [ ] Option to import/export player lists

#### Role Distribution Statistics
**Status**: Not Started  
**Priority**: Low-Medium  
**Effort**: Medium | **Impact**: Low

**Work Required**:
- [ ] Track role distribution across games
- [ ] Show analytics on most/least played roles
- [ ] Display win rate statistics by role and team
- [ ] Export data as CSV or JSON

#### Game History & Replay
**Status**: Not Started  
**Priority**: Medium  
**Effort**: Medium | **Impact**: Medium

**Work Required**:
- [ ] Save completed games to history
- [ ] View past game summaries (players, roles, winner, duration)
- [ ] Replay game events chronologically
- [ ] Export game logs
- [ ] Search/filter game history

### 3. Add More Roles
**Status**: Not Started  
**Priority**: Low  
**Effort**: Small-Medium | **Impact**: Low-Medium

**Work Required**:
- [ ] Research additional roles from official expansions
- [ ] Implement role logic and state management
- [ ] Add role cards and descriptions
- [ ] Update win condition logic if needed
- [ ] Add tests for new roles

### 4. Improve Testing
**Status**: Partially Complete  
**Priority**: Medium  
**Effort**: Medium | **Impact**: High

**Completed**:
- [x] Unit tests for game logic (96 tests)
- [x] Component tests for UI components
- [x] Coverage reporting
- [x] CI/CD integration

**Work Required**:
- [ ] Add integration tests for complete game flows
- [ ] Test auto-narrator mode end-to-end
- [ ] Increase test coverage to 80%+
- [ ] Add visual regression testing
- [ ] Test accessibility compliance

### 5. UI/UX Improvements
**Status**: Not Started  
**Priority**: Medium  
**Effort**: Small-Medium | **Impact**: Medium

**Work Required**:
- [ ] Enhance mobile responsiveness
  - [ ] Optimize layout for small screens
  - [ ] Improve touch targets (minimum 44px)
  - [ ] Test on various device sizes
- [ ] Add animations and transitions
  - [ ] Smooth phase transitions
  - [ ] Role card animations
  - [ ] Button hover/click feedback
- [ ] Improve accessibility
  - [ ] WCAG 2.1 AA compliance
  - [ ] Keyboard navigation for all features
  - [ ] Screen reader optimisation
  - [ ] High contrast mode support
  - [ ] Focus indicators

### 6. Quick Action Buttons During Night
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

**Strategic Refactoring Roadmap**

#### Phase 2: Tech Stack Enhancements (1-2 weeks)
**Status**: Not Started  
**Priority**: Medium  
**Effort**: Low-Medium | **Impact**: Medium-High

**Why**: Address gaps in current tech stack to improve developer experience, code quality, and maintainability.

**Recommended Additions**:

1. **State Management: Zustand** (Optional)
   - [ ] Evaluate if Context re-renders are causing performance issues
   - [ ] Consider adding Zustand (~1KB) for better DevTools and simpler testing
   - **When to add**: If prop drilling becomes painful or performance degrades
   - **Benefits**: Time-travel debugging, no Context re-render issues, easier unit testing
   - **Decision**: Monitor performance first, add only if needed

2. **Component Library: shadcn/ui** (Recommended for Phase 3B)
   - [ ] Add shadcn/ui components for modal/dialog primitives
   - [ ] Replace custom modal implementations with Radix UI-based components
   - [ ] Utilise accessible form components for role setup
   - **When to add**: During Phase 3B role card visual redesign
   - **Benefits**: Copy-paste components (you own the code), built on Tailwind, accessible by default
   - **Install**: `npx shadcn-ui@latest init`

3. **Form Validation: Zod** (Optional)
   - [ ] Evaluate if current validation logic becomes unwieldy
   - [ ] Consider Zod for runtime validation with TypeScript inference
   - **When to add**: If setup validation gets more complex
   - **Benefits**: TypeScript-first, runtime validation, better error messages
   - **Decision**: Current validation is adequate; revisit if complexity increases

**What NOT to Add**:
- ❌ **Next.js/Remix** - Overkill for a PWA game narrator (no SSR needed)
- ❌ **Redux Toolkit** - Too heavy; Zustand is lighter if state management needed
- ❌ **Emotion/Styled Components** - Already using Tailwind; don't mix paradigms
- ❌ **Framer Motion** - Current transitions adequate; only add if animations get complex

---

#### Phase 3: Add Testing (2-3 weeks) ✅
**Status**: COMPLETED (2025-12-12)
**Priority**: HIGH - Critical Gap  
**Effort**: Medium-High | **Impact**: Very High

**Why**: Prevents regressions, enables confident refactoring, catches edge cases in complex game logic.

**Work Completed**:
- [x] Install testing dependencies:
  ```bash
  npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8
  ```
- [x] Configure Vitest in `vite.config.ts` with coverage settings
- [x] Write unit tests for game logic:
  - [x] Win condition detection (village, werewolves, White Werewolf solo)
  - [x] Elimination consequences (lovers, knight, hunter, siblings)
  - [x] Role counting with multi-instance roles
  - [x] Wolf-Hound team allegiance logic
  - [x] Cursed Wolf-Father infection tracking
  - [x] Multi-card roles (Two Sisters, Three Brothers)
  - [x] Angel and Prejudiced Manipulator solo victories
- [x] Write component tests:
  - [x] Button component with all variants and states
  - [x] Card component with team theming
- [x] Add test coverage reporting with HTML/JSON/LCOV output
- [x] Set coverage thresholds (70%+) and exclusions
- [x] Create test documentation (`src/test/README.md`)
- [x] Add GitHub Actions CI workflow for automated testing

**Test Files Created**:
- `src/logic/winConditions.test.ts` - 15 comprehensive win condition tests
- `src/logic/eliminationConsequences.test.ts` - 12 cascade elimination tests
- `src/logic/roleSlotCalculations.test.ts` - 8 role counting tests
- `src/components/ui/Button.test.tsx` - 18 button component tests
- `src/components/ui/Card.test.tsx` - 16 card component tests
- `src/test/setup.ts` - Global test configuration
- `.github/workflows/test.yml` - CI/CD automation

**Test Commands Available**:
- `npm run test` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate coverage report

**Still Needed** (Future Work):
- [ ] Integration tests for full game flows
- [ ] Hook tests (`useGameState`, `usePlayerManager`, etc.)
- [ ] Phase component tests (NightPhase, DawnPhase, DayPhase)
- [ ] Setup validation tests
- [ ] Modal interaction tests

**Test Structure**:
```typescript
// useGameState.test.ts
describe('Win Condition Detection', () => {
  it('should detect village victory when all werewolves dead', () => { ... });
  it('should detect White Werewolf solo victory', () => { ... });
  it('should count infected players as werewolves', () => { ... });
});
```

**Impact**: Confidence in refactoring, prevents regressions, documents expected behaviour, catches edge cases early.

---

#### Phase 4: Improve Error Handling (1 week)
**Status**: Not Started  
**Priority**: Medium  
**Effort**: Low-Medium | **Impact**: Medium

**Why**: localStorage corruption could lose entire game state. Prevents frustrating data loss for narrators mid-game.

**Work Required**:
- [ ] Add localStorage schema versioning
  - [ ] Add `version: 1` field to saved game state
  - [ ] Implement migration functions for future schema changes
- [ ] Implement fallback states for corrupted data
  - [ ] Try-catch around `localStorage.getItem`
  - [ ] Validate JSON structure before parsing
  - [ ] Fallback to empty game state if corrupted
  - [ ] Show user-friendly error message
- [ ] Add error boundary recovery UI
  - [ ] Enhance ErrorBoundary with "Reset Game" and "Restore Backup" options
  - [ ] Auto-save backup copy every phase transition
  - [ ] Allow manual restore from backup
- [ ] Add data integrity checks
  - [ ] Validate player count matches role count
  - [ ] Check for orphaned references (e.g., eliminated player in lovers)
  - [ ] Warn user if inconsistencies detected
- [ ] Implement auto-save confirmation
  - [ ] Visual indicator when state saved (toast notification)
  - [ ] Warning if localStorage quota exceeded

**Implementation**:
```typescript
const GAME_STATE_VERSION = 1;

const loadGameState = (): GameState | null => {
  try {
    const saved = localStorage.getItem('millers-hollow-game-state');
    if (!saved) return null;
    
    const parsed = JSON.parse(saved);
    if (parsed.version !== GAME_STATE_VERSION) {
      return migrateGameState(parsed);
    }
    return validateGameState(parsed) ? parsed : null;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
};
```

**Impact**: Prevents data loss, better user experience, graceful degradation on errors.

---

**Code Quality**
- [ ] Add unit tests for game state logic (see Phase 3)
- [ ] Add E2E tests for critical user flows (see Phase 3)
- [ ] Improve TypeScript type safety
- [ ] Add error boundary components (see Phase 4)
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

---

## ✅ Completed Features

### Phase 1: Fix State Management ✅ (Completed 2025-12-01)
**Status**: Completed  
**Priority**: High  
**Effort**: Medium | **Impact**: High

**Why**: Eliminates heavy prop drilling (20+ props to NightPhase), creates cleaner component APIs, improves maintainability.

**Work Completed**:
- [x] Extract game state into React Context API
  - [x] Create `src/contexts/GameStateContext.tsx`
  - [x] Implement `GameStateProvider` component wrapping `useGameState` hook
  - [x] Export `useGameContext` custom hook for consuming components
- [x] Refactor App.tsx to use Context Provider
  - [x] Wrap application with `<GameStateProvider>`
  - [x] Remove prop drilling from App.tsx
- [x] Update phase components to consume context
  - [x] SetupScreen: Replace 7 props with `useGameContext()` (100% reduction)
  - [x] DayPhase: Replace 10 props with `useGameContext()` (90% reduction)
  - [x] DawnPhase: Replace 8 props with `useGameContext()` (88% reduction)
  - [x] NightPhase: Replace 21 props with `useGameContext()` (95% reduction)
- [x] Test thoroughly to ensure no regressions
- [x] Bug fix: Role reveal modal for revived then re-eliminated players

**Example Implementation**:
```tsx
// GameStateContext.tsx
export const GameStateProvider = ({ children }) => {
  const gameState = useGameState();
  return <GameStateContext.Provider value={gameState}>{children}</GameStateContext.Provider>;
};

// NightPhase.tsx (before: 20+ props)
const { players, eliminatePlayer, addGameEvent } = useGameContext();
// After: Clean, no prop drilling
```

**Results Achieved**:
- ✅ **Total props eliminated**: 46 → 3 (93% reduction!)
- ✅ **App.tsx simplified**: From ~160 lines to ~100 lines
- ✅ **Zero prop drilling** across entire application
- ✅ **Consistent pattern** across all components
- ✅ All tests passing, app fully functional

**Impact**: Cleaner component APIs, easier testing, reduced coupling between App.tsx and child components.

---

### Phase 2: Decompose Large Components ✅ (Completed 2025-12-01)
**Status**: Completed  
**Priority**: High  
**Effort**: Medium-High | **Impact**: High

**Why**: NightPhase (~966 lines) was difficult to test and maintain. Breaking into focused sub-components improves code quality.

**Work Completed**:
- [x] Extract NightPhase sub-components:
  - [x] `NightProgressTracker.tsx` - Progress UI (~80 lines)
    - Moon phase indicator with cycling emoji
    - Night number display
    - Audio enable/disable toggle
    - Progress summary (Step X of Y)
  - [x] `RoleNarratorGuide.tsx` - Action checklist logic (~230 lines)
    - Role-specific action buttons (Cupid, Witch, Werewolves, etc.)
    - RoleActionGuide integration
    - Infected player alerts
    - Consolidated 170+ lines of conditional role UI
  - [x] `RoleModalOrchestrator.tsx` - Modal management (~170 lines)
    - Centralised modal state (5 modals)
    - Modal rendering logic
    - Modal callbacks and game event logging
    - Removed 100+ lines of modal JSX from NightPhase
- [x] Refactor NightPhase.tsx to orchestrate sub-components
- [x] All components have TypeScript interfaces
- [x] Verified build passes with no errors

**Final Architecture**:
```tsx
<NightPhase>
  <NightProgressTracker />
  {/* Role card display */}
  <RoleNarratorGuide />
  {/* Sidebar with PlayerList/EventLog/RoleReference */}
  {modalOrchestrator.renderModals()}
</NightPhase>
```

**Results Achieved**:
- **NightPhase reduced from ~966 lines to 654 lines** (32% reduction)
- Net addition of ~480 lines across 3 focused components
- Each component has clear, single responsibility
- Improved maintainability and testability
- All functionality preserved

**Impact**: Significantly improved code organization, easier to test components in isolation, clearer separation of concerns, better maintainability for future enhancements.

---

### Phase 3A: Core Design System ✅ (Completed 2025-11-25)
**Priority**: High  
**Inspiration**: One Night Ultimate Werewolf Android app + Miller's Hollow board game art

**Colour Palette & Backgrounds**
- [x] Textured dark blue background with weathered texture overlay
- [x] Dark blue-grey base (#1a2332 - deep dark blue-grey)
- [x] Subtle vignette effect at edges
- [x] CSS custom properties for theming

**Typography**
- [x] Cinzel medieval serif font for headers (from Google Fonts)
- [x] Inter clean sans-serif for body text
- [x] Golden text (#fbbf24) for role names and important headers
- [x] Consistent font-header utility class throughout

**Component Library**
- [x] Button component with 6 variants (primary, secondary, danger, success, ghost, gold)
- [x] Pill-shaped rounded-full design
- [x] 3 sizes (sm, md, lg)
- [x] Loading states with spinner
- [x] Card component with team-specific styling
- [x] Proper disabled and focus states

**Applied Throughout**
- [x] SetupScreen: Golden headers, mystical tagline, Button components
- [x] NightPhase: All headers with Cinzel font, all buttons converted
- [x] DawnPhase: Golden "Dawn" header, announcement titles
- [x] DayPhase: Cinzel headers, all button controls updated
- [x] All 7 modals: Headers with Cinzel font, Button components
- [x] Day/Night theme support for PlayerList and EventLog sidebars

**Files Created**:
- `src/styles/designTokens.ts` - Design system tokens
- `src/components/ui/Button.tsx` - Reusable button component
- `src/components/ui/Card.tsx` - Card container component
- `src/components/ui/index.ts` - Export barrel
- `src/index.css` - Updated with Tailwind v4 @theme configuration

**Day Phase Theme Enhancement**
- [x] PlayerList adapts to day/night theme (light backgrounds, better contrast during day)
- [x] EventLog adapts to day/night theme
- [x] Role reveal badges use light blue during day phase
- [x] All text colours optimised for readability in both themes

---

### Phase 3B: Visual Enhancements ✅ (Completed 2025-11-25)

**Timer Display**
- [x] Massive monospace numbers (text-9xl, like 04:56)
- [x] Dynamic header text ("VOTE NOW" / "TIME REMAINING" / "READY TO START")
- [x] Subtext explaining context
- [x] Pulse animation when < 30 seconds
- [x] Progress bar that turns red in final 30 seconds
- [x] Dark gradient background (slate-800 to slate-900) with border
- [x] Removed circular progress for cleaner ONUW aesthetic

**Role Cards Redesign**
- [x] Grid layout (2-5 columns responsive)
- [x] Card-based design with gradient backgrounds
- [x] Border design with team-specific colours (blue/red/purple)
- [x] Hover effects: scale-105, shadow glow, border colour change
- [x] Selected state: border glow, shadow effects, scale-up
- [x] Semi-transparent appearance for unselected cards (opacity-70)
- [x] Quantity badge in top-right corner for multi-card roles
- [x] Letter-based icon placeholders (first character of role name)
- [x] Hover tooltip with role descriptions (smart positioning for multi-select)
- [x] Interactive +/- controls for Villager and Simple Werewolf
- [x] Recommended role badges with green borders
- [x] Smooth transitions on all interactions (duration-300)

**Implementation Details**:
- Card grid uses responsive breakpoints: 2 (mobile), 3 (tablet), 4-5 (desktop)
- Touch-friendly button sizes (p-1.5, rounded-full)
- pointer-events-none on tooltips to prevent blocking controls
- Team-specific styling throughout (village blue, werewolf red, solo purple)
- Aspect-square icons maintain consistent card proportions

**Character Art & Theming** ✅ (Completed 2025-11-25)
- [x] Illustrated character art for all 24 roles (replaces letter placeholders)
- [x] 400x400px optimised PNG images (~180-290KB each, 6.5MB total)
- [x] Images integrated into role cards on setup screen
- [x] Proper image paths with base URL support
- [x] All role IDs match image filenames
- [x] Moon phases for night progression (cycles through 8 phases: 🌑🌒🌓🌔🌕🌖🌗🌘)
- [x] Moon phase indicator displayed in night phase header with name

---

### Phase Transition Animations ✅ (Completed 2025-11-21)
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

### Win Condition Detection ✅ (Completed 2025-11-25)
**Status**: Completed

**Implemented**:
- [x] Automatic win detection at end of Day and Dawn phases
- [x] Village wins when all werewolves eliminated
- [x] Werewolves win when all villagers eliminated
- [x] White Werewolf solo victory when last player alive
- [x] Victory announcement modal with team-specific theming
- [x] Proper handling of multi-instance roles (Villagers, Sisters, Brothers)
- [x] Wolf-Hound team allegiance properly counted in win totals
- [x] Cursed Wolf-Father infected player counted as werewolf

**Implementation Details**:
- Created `VictoryAnnouncement.tsx` component with beautiful victory modals
- Added `checkWinCondition()` function in useGameState hook
- Counts total roles in setup vs revealed dead roles
- Handles edge cases: Wolf-Hound team switch, infected players
- Team-specific victory themes (blue for Village, red for Werewolves, purple for Solo)
- Solo victory checked first before team victories

**Files Modified**:
- `src/hooks/useGameState.ts` (win detection logic)
- `src/components/VictoryAnnouncement.tsx` (new)
- `src/components/DawnPhase.tsx` (victory check)
- `src/components/DayPhase.tsx` (victory check)

---

### Role Filtering Improvements ✅ (Completed 2025-11-25)
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

---

### Player Status At-a-Glance ✅ (Completed 2025-11-25)
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

---

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

---

### Role-Specific Features ✅

**Wolf-Hound Team Toggle** ✅
- [x] Visual toggle buttons for Village/Werewolf allegiance
- [x] Appears for all players when Wolf-Hound is in game
- [x] Icons for each team choice

**Cupid Lovers Selection** ✅
- [x] Interactive modal for selecting two lovers
- [x] Shows current lovers if already selected
- [x] Visual heart icons and pink theming
- [x] Event logging when lovers selected

**Wild Child Role Model Selection** ✅
- [x] Modal for selecting role model on first night
- [x] Shows current role model if already selected
- [x] Purple theming
- [x] Event logging
- [x] Transformation handled in elimination consequences

**Werewolf Victim Selection with Guidance** ✅
- [x] Detailed voting rules and guidance modal
- [x] Separate modals for Simple Werewolves, Big Bad Wolf, White Werewolf
- [x] Victims actually eliminated when selected
- [x] Buttons disabled after selection
- [x] Flags reset each night

**White Werewolf Functionality** ✅ (Completed 2025-11-25)
- [x] Wakes every other night (nights 2, 4, 6, etc.)
- [x] Appears in night sequence on correct nights
- [x] Enhanced modal with detailed rules and narrator guidance
- [x] Can eliminate another werewolf (optional action)
- [x] Solo victory condition when last player alive
- [x] Fixed night number calculation for wake schedule
- [x] Fixed role filtering to include in night sequence

**Witch Potion Functionality** ✅
- [x] Fixed mutual exclusivity (only one potion per night)
- [x] Healing potion revives dead player
- [x] Healing potion cancels role reveal at dawn
- [x] Death potion kills living player
- [x] Player selection modals
- [x] Event logging

**Cursed Wolf-Father Silent Infection** ✅ (Completed 2025-11-25)
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

**Actor Role Guidance** ✅
- [x] Comprehensive narrator instructions
- [x] Guidance for selecting 3 role cards at setup
- [x] Instructions for using one power per night

---

### Day Phase Enhancements ✅
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
- [x] Tabbed sidebar with Players/Events/Roles views ✅ (Completed 2025-11-25)
- [x] Role Reference panel showing all selected roles ✅ (Completed 2025-11-25)
- [x] Roles grouped by team with descriptions and quantities ✅ (Completed 2025-11-25)
- [x] Day/night theme adaptation for sidebar tabs ✅ (Completed 2025-11-25)

### Advanced State Tracking ✅
- [x] Record Cupid's lover choices (Player X & Y)
- [x] Track Wild Child's role model
- [x] Track Wolf-Hound's team choice (per player)

### Role Guidance ✅
- [x] Detailed action cards for each role
- [x] Narrator action checklists
- [x] Track role-specific state (Witch potions, Wolf-Father infection, etc.)

---

### Recently Fixed (2025-11-25)
- [x] React Hooks order violation in DawnPhase component (Three Brothers elimination)
- [x] Bear Tamer elimination causing blank screen (auto-progress logic fixed)
- [x] White Werewolf not appearing in night sequence (role filtering fixed)
- [x] White Werewolf night schedule off-by-one error
- [x] White background borders on character card images (transparency added)

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

Last Updated: 2025-12-04
