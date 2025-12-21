import type { Dispatch, SetStateAction } from "react";
import type { GameState, RoleId } from "../types/game";
import {
  calculateTotalSlots,
  getRoleSlotCount,
} from "../logic/roleSlotCalculations";

/**
 * Hook that provides role selection and management operations
 * Handles all role-related state mutations during setup phase
 */
export const useRoleManager = (
  _gameState: GameState,
  setGameState: Dispatch<SetStateAction<GameState>>,
) => {
  const toggleRole = (roleId: RoleId) => {
    setGameState((prev) => {
      // Roles that can have multiple instances
      const multiSelectRoles: RoleId[] = ["villager", "simple-werewolf"];

      if (multiSelectRoles.includes(roleId)) {
        // Check current count of this role
        const currentCount = prev.setup.selectedRoles.filter(
          (id) => id === roleId,
        ).length;

        // Check maximum limits
        const maxLimits: Record<string, number> = {
          villager: 9,
          "simple-werewolf": 4,
        };
        const maxLimit = maxLimits[roleId];

        if (maxLimit && currentCount >= maxLimit) {
          // Already at maximum, don't add more
          return prev;
        }

        // Check if adding this role would exceed player count
        const currentTotalSlots = calculateTotalSlots(prev.setup.selectedRoles);
        if (currentTotalSlots + 1 > prev.setup.playerCount) {
          // Would exceed player count
          return prev;
        }

        // For multi-select roles, add another instance
        const selectedRoles = [...prev.setup.selectedRoles, roleId];
        return {
          ...prev,
          setup: {
            ...prev.setup,
            selectedRoles,
          },
        };
      } else {
        // For single-instance roles, toggle on/off
        const isCurrentlySelected = prev.setup.selectedRoles.includes(roleId);

        if (isCurrentlySelected) {
          // Remove the role
          const selectedRoles = prev.setup.selectedRoles.filter(
            (id) => id !== roleId,
          );
          return {
            ...prev,
            setup: {
              ...prev.setup,
              selectedRoles,
            },
          };
        } else {
          // Check if adding this role would exceed player count
          const currentTotalSlots = calculateTotalSlots(
            prev.setup.selectedRoles,
          );
          const newRoleSlots = getRoleSlotCount(roleId);
          if (currentTotalSlots + newRoleSlots > prev.setup.playerCount) {
            // Would exceed player count
            return prev;
          }

          // Add the role
          const selectedRoles = [...prev.setup.selectedRoles, roleId];
          return {
            ...prev,
            setup: {
              ...prev.setup,
              selectedRoles,
            },
          };
        }
      }
    });
  };

  const removeRole = (roleId: RoleId, index?: number) => {
    setGameState((prev) => {
      let selectedRoles;
      if (index !== undefined) {
        // Remove specific instance at index
        selectedRoles = prev.setup.selectedRoles.filter((_, i) => i !== index);
      } else {
        // Remove first instance of this role
        const roleIndex = prev.setup.selectedRoles.indexOf(roleId);
        if (roleIndex >= 0) {
          selectedRoles = prev.setup.selectedRoles.filter(
            (_, i) => i !== roleIndex,
          );
        } else {
          selectedRoles = prev.setup.selectedRoles;
        }
      }

      return {
        ...prev,
        setup: {
          ...prev.setup,
          selectedRoles,
        },
      };
    });
  };

  const setSelectedRoles = (roles: RoleId[]) => {
    setGameState((prev) => ({
      ...prev,
      setup: {
        ...prev.setup,
        selectedRoles: roles,
      },
    }));
  };

  const setUnusedRoles = (
    role1: RoleId | undefined,
    role2: RoleId | undefined,
  ) => {
    setGameState((prev) => ({
      ...prev,
      setup: {
        ...prev.setup,
        unusedRoles: role1 && role2 ? [role1, role2] : undefined,
      },
    }));
  };

  const setAutoNarratorMode = (enabled: boolean) => {
    setGameState((prev) => ({
      ...prev,
      setup: {
        ...prev.setup,
        autoNarratorMode: enabled,
      },
    }));
  };

  /**
   * Shuffle and randomly assign roles to players (for auto-narrator mode)
   * Builds a deck of role cards based on selectedRoles, shuffles them, and assigns to players
   */
  const shuffleAndAssignRoles = () => {
    setGameState((prev) => {
      const roleCards: RoleId[] = [];

      // Build deck of role cards based on selectedRoles
      prev.setup.selectedRoles.forEach((roleId) => {
        const count = getRoleSlotCount(roleId);
        for (let i = 0; i < count; i++) {
          roleCards.push(roleId);
        }
      });

      // Shuffle roles using Fisher-Yates algorithm
      const shuffled = [...roleCards];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // Assign to players
      return {
        ...prev,
        players: prev.players.map((player, index) => ({
          ...player,
          assignedRole: shuffled[index],
        })),
      };
    });
  };

  return {
    toggleRole,
    removeRole,
    setSelectedRoles,
    setUnusedRoles,
    setAutoNarratorMode,
    shuffleAndAssignRoles,
  };
};
