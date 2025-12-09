# Codebase Review & Recommendations

After a detailed review of the Miller's Hollow Narrator codebase, I have identified several key areas for improvement. The project is well-structured and uses modern stack choices (Vite, React 19, Tailwind v4), but as the features have grown, the core state management logic has become a bottleneck.

## 🚨 Critical Logic Fixes

### 1. Role Slot Calculation Discrepancy
**Severity:** High
**Location:** `src/utils/roleGenerator.ts` vs `src/hooks/useGameState.ts`

There is an inconsistency in how multi-player roles (like "Two Sisters" or "Three Brothers") are counted between the generator and the validation logic.

- **The Bug:** `validateRoleBalance` in `roleGenerator.ts` checks `selectedRoles.length !== playerCount`. However, `selectedRoles` is a list of Role IDs.
- **Why it matters:** If "Two Sisters" is selected, it occupies **1** slot in the `selectedRoles` array but requires **2** players. The current validation will incorrectly flag a valid setup as having a "count mismatch" because `length` (e.g., 7 roles) != `playerCount` (e.g., 8 players), even if the total slots match.
- **Fix:** Update `validateRoleBalance` to use the same `calculateTotalSlots` helper used in `generateBalancedRoles` and `useGameState`.

### 2. Win Condition Logic Gaps
**Severity:** Medium
**Location:** `src/hooks/useGameState.ts` (`checkWinCondition`)

The win condition logic interacts with complex role switching mechanics (Prejudiced Manipulator, Wolf-Hound, Infected Player).
- **Risk:** The sequencing of win checks is critical. For example, if the **Prejudiced Manipulator** achieves their goal in the same turn the Village eliminates the last Werewolf, the game might incorrectly declare a Village victory first if the implementation order isn't precise.
- **Recommendation:** Isolate `checkWinCondition` into a pure function that takes the state and returns a unified `VictoryResult` object to be handled by the UI. This makes it unit-testable.

## 🏗️ Architectural Improvements

### 1. Decompose `useGameState` ("God Hook")
**Impact:** High (Maintainability & Performance)
**Description:** `useGameState.ts` has grown to 900+ lines. It currently handles:
- State persistence (localStorage) -> **Extract to `usePersistentState`**
- Player management (names, notes) -> **Extract to `usePlayerManager`**
- Game Rules & Win Conditions -> **Extract to `gameRules.ts` (Pure functions)**
- Night Phase logic -> **Extract to `useNightPhaseLogic`**

**Proposed Structure:**
```typescript
// hooks/game/useGamePersistence.ts
// hooks/game/usePlayerFlow.ts
// hooks/game/useNightFlow.ts
// logic/winConditions.ts (Pure logic, easy to test)
```

### 2. Split Game Context
**Impact:** Medium (Performance)
**Description:** Currently, any update to `gameState` triggers a re-render for all components consuming `useGameContext`.
**Recommendation:** Split into:
- `GameStateContext`: For reading data (frequently changes)
- `GameDispatchContext`: For actions (stable references)
- `StaticGameContext`: For configuration (player count, selected roles - rarely changes)

## 🧪 Testing Strategy (Vital)

The codebase currently has **0 tests**. Given the complexity of the "social deduction" logic, this is risky. Prioritize these high-value tests:

### Immediate Priority (Unit Tests)
1.  **`src/utils/roleGenerator.ts`**:
    *   Test `generateBalancedRoles` respects player counts.
    *   Test `validateRoleBalance` correctly handles multi-slot roles (Sisters/Brothers).
2.  **`useGameState` Logic (refactored)**:
    *   Test "Hunter shoots Lover" cascade elimination.
    *   Test "Wolf-Hound" switching teams affecting win conditions.
    *   Test "White Werewolf" solo victory condition.

## 🎨 UI/UX Refinements

### 1. Audio Context Handling
**Location:** `src/components/NightPhase.tsx`
**Issue:** Browsers block auto-play. The current `useEffect` attempts to play audio might fail silently or warn in the console.
**Fix:** Implement a specific "Start Night" interaction button that explicitly initializes/resumes the `AudioContext` before the phase starts to ensure smoother narration.

### 2. Accessibility
- **Contrast:** The "atmospheric fog" overlays in Night Mode might reduce text contrast for visually impaired users. Ensure text maintains WCAG AA standard against the dynamic background.
- **Screen Readers:** The role cards use `div`s. Convert interactive cards to `<button>` or add `role="button"` and `tabIndex={0}` with proper `aria-label`s describing the role and its team.

## 📝 Next Steps Plan

1.  **Fix the Role Generator Bug**: Immediate logic fix to prevent invalid validation warnings.
2.  **Add Vitest**: Set up the test harness.
3.  **Refactor Win Logic**: Move `checkWinCondition` to a pure function and write tests for it.
4.  **Split `useGameState`**: Begin gradual extraction of sub-hooks.
