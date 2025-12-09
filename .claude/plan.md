# Plan: Decompose useGameState "God Hook"

## Current State Analysis

### The Problem
`useGameState.ts` is 917 lines and handles too many responsibilities:
1. State persistence (localStorage read/write)
2. Player management (names, notes, alive/dead status)
3. Role management (selection, assignment, validation)
4. Game phase management (setup, night, dawn, day)
5. Night phase logic (role actions, potions, infections)
6. Win condition checking
7. Elimination consequence handling
8. Event logging

This violates Single Responsibility Principle and makes:
- Testing difficult (no unit tests exist)
- Debugging complex
- Performance potentially problematic (all state changes trigger all consumers)
- Code navigation and maintenance hard

### Current Architecture
```
GameStateProvider (context)
  └── useGameState() [917 lines]
        ├── Returns 30+ functions
        └── Manages entire GameState object

Components consume via useGameContext()
```

## Proposed Decomposition Strategy

### Option A: Multiple Specialized Hooks (Recommended)
Split by domain responsibility while keeping a single state source.

```
useGameState (core - 200 lines)
  ├── useGamePersistence (50 lines) - localStorage
  ├── usePlayerManager (150 lines) - player CRUD ops
  ├── useRoleManager (100 lines) - role selection/assignment
  ├── usePhaseManager (80 lines) - phase transitions
  ├── useNightActions (150 lines) - role-specific night actions
  └── Pure functions extracted:
        ├── gameRules.ts - win conditions (100 lines)
        └── eliminationRules.ts - cascade logic (80 lines)
```

**Pros:**
- Gradual migration possible
- Single source of truth maintained
- Each hook testable independently
- Clear responsibility boundaries
- Follows existing `useNarrationAudio` pattern

**Cons:**
- Still passes full state between hooks
- More files to navigate initially

### Option B: Split Context (Alternative)
Create multiple contexts for different domains.

```
GameStateProvider
  ├── PlayerContext
  ├── RoleContext
  ├── PhaseContext
  └── NightContext
```

**Pros:**
- Reduces re-render scope
- Better performance isolation

**Cons:**
- Complex provider nesting
- Shared state coordination harder
- Breaking change for all consumers
- Over-engineering for 20-player max game

### Option C: Reducer Pattern (Alternative)
Convert to useReducer with action creators.

**Pros:**
- Centralized state transitions
- Time-travel debugging possible
- Common React pattern

**Cons:**
- Large rewrite required
- More boilerplate
- Doesn't solve the "too many responsibilities" issue

## Recommended Approach: Option A (Incremental Decomposition)

### Phase 1: Extract Pure Functions (Low Risk)
Move stateless logic to separate files:

1. **Create `src/logic/winConditions.ts`**
   - Extract `checkWinCondition` logic
   - Make it a pure function: `checkWinCondition(gameState): WinResult`
   - Easy to unit test
   - **Lines saved:** ~110

2. **Create `src/logic/eliminationConsequences.ts`**
   - Extract `checkEliminationConsequences` logic
   - Pure function: `checkEliminationConsequences(player, gameState): ConsequenceResult`
   - **Lines saved:** ~80

3. **Create `src/logic/roleSlotCalculations.ts`**
   - Extract `getRoleSlots`, `calculateTotalSlots` (duplicate from roleGenerator)
   - Share logic between validation and state management
   - **Lines saved:** ~20

**Result after Phase 1:** 707 lines (down from 917)

### Phase 2: Extract State Persistence (Medium Risk)
Create `src/hooks/useGamePersistence.ts`:

```typescript
export const useGamePersistence = (initialState: GameState) => {
  const [state, setState] = useState<GameState>(loadSavedState);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);
  
  return [state, setState] as const;
};
```

- Also extract player name caching logic
- **Lines saved:** ~50

**Result after Phase 2:** 657 lines

### Phase 3: Extract Player Management (Medium Risk)
Create `src/hooks/usePlayerManager.ts`:

```typescript
export const usePlayerManager = (
  players: Player[],
  setGameState: SetState<GameState>
) => {
  return {
    setPlayerName,
    togglePlayerAlive,
    updatePlayerNotes,
    setPlayerRevealedRole,
    setPlayerAssignedRole,
    setPlayerWolfHoundTeam,
    setPlayerPrejudicedManipulatorGroup,
  };
};
```

- All player-specific mutations
- **Lines saved:** ~150

**Result after Phase 3:** 507 lines

### Phase 4: Extract Night Actions (Medium Risk)
Create `src/hooks/useNightActions.ts`:

```typescript
export const useNightActions = (
  gameState: GameState,
  setGameState: SetState<GameState>
) => {
  return {
    useWitchHealingPotion,
    useWitchDeathPotion,
    useCursedWolfFatherInfection,
    selectWerewolfVictim,
    setCupidLovers,
    setWildChildRoleModel,
    setWolfHoundTeam,
    setThiefChosenRole,
    toggleActionComplete,
  };
};
```

- All night-phase role actions
- **Lines saved:** ~150

**Result after Phase 4:** 357 lines

### Phase 5: Extract Role Management (Low-Medium Risk)
Create `src/hooks/useRoleManager.ts`:

```typescript
export const useRoleManager = (
  setup: GameSetup,
  setGameState: SetState<GameState>
) => {
  return {
    toggleRole,
    removeRole,
    setSelectedRoles,
    setUnusedRoles,
  };
};
```

- Role selection logic
- **Lines saved:** ~100

**Result after Phase 5:** 257 lines

### Phase 6: Extract Phase Management (Low Risk)
Create `src/hooks/usePhaseManager.ts`:

```typescript
export const usePhaseManager = (
  gameState: GameState,
  setGameState: SetState<GameState>
) => {
  return {
    startGame,
    startNight,
    startDawn,
    startDay,
    nextNightStep,
    setPhase,
  };
};
```

- Phase transition logic
- **Lines saved:** ~80

**Final Result:** ~177 lines in core `useGameState`

## Final Architecture

```
src/
├── hooks/
│   ├── useGameState.ts (177 lines) - Orchestrator
│   ├── useGamePersistence.ts (50 lines)
│   ├── usePlayerManager.ts (150 lines)
│   ├── useRoleManager.ts (100 lines)
│   ├── usePhaseManager.ts (80 lines)
│   ├── useNightActions.ts (150 lines)
│   └── useNarrationAudio.ts (exists)
├── logic/
│   ├── winConditions.ts (110 lines) - Pure
│   ├── eliminationConsequences.ts (80 lines) - Pure
│   └── roleSlotCalculations.ts (20 lines) - Pure
└── contexts/
    └── GameStateContext.tsx (no change)
```

## Migration Strategy

1. **Create new files** with extracted logic
2. **Import and use** in `useGameState` (keep old code commented)
3. **Test thoroughly** in dev
4. **Remove old code** once verified
5. **No component changes required** - API stays the same

## Testing Strategy (Post-Decomposition)

Once decomposed, add tests:

```typescript
// src/logic/__tests__/winConditions.test.ts
describe('checkWinCondition', () => {
  it('detects Angel win when eliminated first night', () => {
    const mockState = createMockGameState({
      roles: ['angel'],
      nightNumber: 1,
      players: [{ actualRole: 'angel', isAlive: false }]
    });
    
    const result = checkWinCondition(mockState);
    expect(result.hasWinner).toBe(true);
    expect(result.winner).toBe('solo');
  });
});
```

## Risk Assessment

| Phase | Risk Level | Reason | Mitigation |
|-------|-----------|--------|------------|
| 1 (Pure functions) | Low | No state changes | Extensive manual testing |
| 2 (Persistence) | Medium | localStorage edge cases | Test reset/load scenarios |
| 3 (Players) | Medium | Many interconnected mutations | Test each function individually |
| 4 (Night actions) | Medium | Complex role interactions | Test with multiple roles |
| 5 (Roles) | Low-Medium | Relatively isolated | Test role selection flows |
| 6 (Phases) | Low | Simple transitions | Test phase progression |

## Questions for Clarification

1. **Testing Framework:** Should we add Vitest as part of this work, or decompose first and add tests later?
   - Recommendation: Add Vitest first, write tests for pure functions as we extract them

2. **Breaking Changes:** Are we okay with temporarily having duplicate code during migration?
   - Recommendation: Yes, keep old code commented out until verified

3. **Performance:** Should we add React.memo or useMemo optimizations while refactoring?
   - Recommendation: No, premature optimization - only if profiling shows issues

4. **Context Splitting:** Do we want to split the context later for performance?
   - Recommendation: No, not needed for a 20-player game. Only if we see actual re-render issues.

## Timeline Estimate

- **Phase 1 (Pure functions):** 2-3 hours
- **Phase 2 (Persistence):** 1-2 hours  
- **Phase 3 (Players):** 2-3 hours
- **Phase 4 (Night actions):** 2-3 hours
- **Phase 5 (Roles):** 1-2 hours
- **Phase 6 (Phases):** 1 hour

**Total:** 9-14 hours of focused work

Can be done incrementally over multiple sessions, each phase is independently committable.

## Success Criteria

- ✅ Core `useGameState` under 200 lines
- ✅ Each hook/module has single responsibility
- ✅ Pure functions extracted and testable
- ✅ No component changes required
- ✅ All existing functionality works
- ✅ Build passes with no TypeScript errors
- ✅ Can add unit tests for critical logic

## Next Steps

If this plan is approved, we'll start with **Phase 1** (extracting pure functions) as it's:
- Lowest risk
- Immediately testable
- Doesn't require changing component APIs
- Provides quick wins (110+ lines reduced)
