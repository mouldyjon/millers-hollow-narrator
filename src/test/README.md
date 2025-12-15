# Testing Guide

This directory contains the test setup for the Miller's Hollow Narrator application.

## Running Tests

```bash
# Run all tests in watch mode
npm run test

# Run all tests once
npm run test -- --run

# Run tests with coverage report
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## Test Structure

### Unit Tests (Logic)
Located in `src/logic/*.test.ts`:
- `winConditions.test.ts` - Win condition detection for all teams
- `eliminationConsequences.test.ts` - Cascade effects when players die
- `roleSlotCalculations.test.ts` - Role counting with multi-card roles

### Component Tests
Located in `src/components/**/*.test.tsx`:
- `Button.test.tsx` - Button component with all variants
- `Card.test.tsx` - Card component with team theming

## Coverage Goals

Current coverage targets:
- **Branches**: 70%+
- **Functions**: 70%+
- **Lines**: 70%+
- **Statements**: 70%+

Critical areas requiring 100% coverage:
- Win condition logic (`src/logic/winConditions.ts`)
- Elimination consequences (`src/logic/eliminationConsequences.ts`)
- Role slot calculations (`src/logic/roleSlotCalculations.ts`)

## Writing Tests

### Testing Game Logic

```typescript
import { describe, it, expect } from "vitest";
import { checkWinCondition } from "./winConditions";

describe("Win Conditions", () => {
  it("should detect village victory", () => {
    const state = createGameState({ /* ... */ });
    const result = checkWinCondition(state);
    
    expect(result.hasWinner).toBe(true);
    expect(result.winner).toBe("village");
  });
});
```

### Testing Components

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button Component", () => {
  it("should call onClick when clicked", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole("button"));
    
    expect(handleClick).toHaveBeenCalled();
  });
});
```

## Test Helpers

### `createGameState(overrides)`
Creates a basic game state for testing with sensible defaults. Override specific fields as needed.

### `createPlayers(count)`
Creates an array of players with sequential numbering, all alive by default.

## CI/CD Integration

Tests run automatically on:
- Every commit (when CI is configured)
- Pull requests
- Before deployment

Coverage reports are generated in `coverage/` directory:
- `coverage/index.html` - Interactive HTML report
- `coverage/coverage-final.json` - Machine-readable report
- `coverage/lcov.info` - LCOV format for integrations

## Best Practices

1. **Test behaviour, not implementation** - Focus on what the function does, not how
2. **Use descriptive test names** - Test names should explain the scenario
3. **Arrange-Act-Assert** - Structure tests clearly: set up, execute, verify
4. **Keep tests isolated** - Each test should be independent
5. **Mock external dependencies** - Don't rely on real APIs or browsers
6. **Test edge cases** - Empty arrays, null values, boundary conditions
7. **Test error paths** - Not just the happy path

## Common Test Scenarios

### Win Conditions
- ✅ Village wins when all werewolves dead
- ✅ Werewolves win when all villagers dead
- ✅ Angel solo victory on first elimination
- ✅ Prejudiced Manipulator solo victory
- ✅ White Werewolf solo victory
- ✅ Wolf-Hound team allegiance
- ✅ Infected player counting
- ✅ Multi-card role counting

### Elimination Consequences
- ✅ Lovers die together
- ✅ Knight's rusty sword kills neighbour
- ✅ Hunter's dying shot
- ✅ Wild Child transformation
- ✅ Sibling notifications
- ✅ Consequence priority order

### Component Interactions
- ✅ Button click handlers
- ✅ Button disabled states
- ✅ Button loading states
- ✅ Card hover effects
- ✅ Accessibility features

## Debugging Tests

```bash
# Run a specific test file
npm run test -- winConditions.test.ts

# Run tests matching a pattern
npm run test -- --grep "Angel"

# Run in debug mode
npm run test -- --inspect-brk
```

## Future Test Coverage

Still needed:
- Integration tests for full game flows
- Hook tests (`useGameState`, `usePlayerManager`, etc.)
- Modal component tests
- Phase component tests (Night, Dawn, Day)
- Setup validation tests
- Role generator algorithm tests
