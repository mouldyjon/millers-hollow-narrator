import { useState } from "react";
import { Users, Play, Plus, Minus, Sparkles } from "lucide-react";
import { roles } from "../data/roles";
import type { RoleId } from "../types/game";
import { RoleGeneratorModal } from "./RoleGeneratorModal";
import { ValidationBanner } from "./ValidationBanner";
import { Button } from "./ui";
import {
  validateSetup,
  getRecommendedRoles,
  canStartGame,
} from "../utils/setupValidation";
import { useGameContext } from "../contexts/GameStateContext";

interface SetupScreenProps {
  onStartGame?: () => void;
}

export const SetupScreen = ({ onStartGame }: SetupScreenProps = {}) => {
  const {
    gameState,
    setPlayerCount,
    setPlayerName,
    setPlayerAssignedRole,
    toggleRole,
    removeRole,
    setSelectedRoles,
    setUnusedRoles,
    setAutoNarratorMode,
    setPlayerPrejudicedManipulatorGroup,
    setPrejudicedManipulatorTargetGroup,
    startGame,
  } = useGameContext();

  const { playerCount, selectedRoles, unusedRoles } = gameState.setup;
  const { players } = gameState;
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [showOptionalRoles, setShowOptionalRoles] = useState(false);

  const handleStartGame = onStartGame || startGame;

  const handleGeneratedRoles = (generatedRoles: RoleId[]) => {
    setSelectedRoles(generatedRoles);
    setShowGeneratorModal(false);
  };
  const getRoleCount = (roleId: RoleId): number => {
    if (roleId === "sheriff") return 0; // Sheriff is not a card
    if (roleId === "two-sisters") return 2;
    if (roleId === "three-brothers") return 3;
    return 1;
  };

  const getSelectedCount = (roleId: RoleId): number => {
    return selectedRoles.filter((id) => id === roleId).length;
  };

  const isMultiSelectRole = (roleId: RoleId): boolean => {
    return roleId === "villager" || roleId === "simple-werewolf";
  };

  const totalRoleSlots = selectedRoles.reduce((sum, roleId) => {
    return sum + getRoleCount(roleId);
  }, 0);

  // Validation
  const validationMessages = validateSetup(selectedRoles, playerCount);
  const recommendedRoles = getRecommendedRoles(selectedRoles, playerCount);
  const isValidSetup = canStartGame(selectedRoles, playerCount);

  const villageTeamRoles = Object.values(roles).filter(
    (r) =>
      r.team === "village" &&
      r.id !== "sheriff" &&
      (showOptionalRoles || !r.isOptional),
  );
  const werewolfTeamRoles = Object.values(roles).filter(
    (r) => r.team === "werewolf" && (showOptionalRoles || !r.isOptional),
  );
  // Special roles: solo team + sheriff (sheriff always visible)
  const soloTeamRoles = Object.values(roles).filter(
    (r) => r.team === "solo" && (showOptionalRoles || !r.isOptional),
  );
  const sheriffRole = roles["sheriff"];
  const specialRoles = sheriffRole
    ? [sheriffRole, ...soloTeamRoles]
    : soloTeamRoles;

  // Role assignment helpers
  const showRoleAssignment = isValidSetup && totalRoleSlots === playerCount;

  const getRoleAssignmentCounts = () => {
    const counts: Partial<Record<RoleId, { total: number; assigned: number }>> =
      {};

    // Count total selected roles
    selectedRoles.forEach((roleId) => {
      const roleCount = getRoleCount(roleId);
      if (!counts[roleId]) {
        counts[roleId] = { total: roleCount, assigned: 0 };
      } else {
        counts[roleId].total += roleCount;
      }
    });

    // Count assigned roles
    players.forEach((player) => {
      if (player.assignedRole) {
        if (counts[player.assignedRole]) {
          counts[player.assignedRole]!.assigned += 1;
        }
      }
    });

    return counts;
  };

  const roleAssignmentCounts = getRoleAssignmentCounts();

  const canAssignRole = (roleId: RoleId) => {
    const count = roleAssignmentCounts[roleId];
    if (!count) return false;
    return count.assigned < count.total;
  };

  const getAvailableRolesForPlayer = (playerNumber: number) => {
    const player = players.find((p) => p.number === playerNumber);
    const currentRole = player?.assignedRole;

    return selectedRoles.filter((roleId, index, array) => {
      // Remove duplicates for display
      if (array.indexOf(roleId) !== index) return false;

      // If this is the player's current role, always show it
      if (roleId === currentRole) return true;

      // Otherwise check if role is available
      return canAssignRole(roleId);
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 font-header text-[var(--color-text-gold)]">
          Miller's Hollow Narrator
        </h1>
        <p className="text-center text-slate-400 mb-8 text-sm">
          A mystical guide for your werewolf games
        </p>

        {/* Player Count Selector */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-semibold">Player Count</h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPlayerCount(Math.max(5, playerCount - 1))}
              className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg font-semibold"
            >
              -
            </button>
            <span className="text-3xl font-bold w-16 text-center">
              {playerCount}
            </span>
            <button
              onClick={() => setPlayerCount(Math.min(30, playerCount + 1))}
              className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg font-semibold"
            >
              +
            </button>
            <div className="ml-auto text-sm">
              <span
                className={
                  totalRoleSlots === playerCount
                    ? "text-green-400"
                    : "text-orange-400"
                }
              >
                {totalRoleSlots} / {playerCount} roles selected
              </span>
            </div>
          </div>
        </div>

        {/* Player Names (Optional) */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-semibold">Player Names</h2>
            <span className="text-sm text-slate-400">(Optional)</span>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Add player names to make the game more personal. Leave blank to use
            "Player 1", "Player 2", etc.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {players.map((player) => (
              <div key={player.number} className="flex flex-col">
                <label className="text-xs text-slate-400 mb-1">
                  Player {player.number}
                </label>
                <input
                  type="text"
                  value={player.name || ""}
                  onChange={(e) => setPlayerName(player.number, e.target.value)}
                  placeholder={`Player ${player.number}`}
                  className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  maxLength={20}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Auto-Generate Button */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6 text-amber-100" />
                <h2 className="text-2xl font-semibold text-amber-50 font-header">
                  Auto-Generate Balanced Setup
                </h2>
              </div>
              <p className="text-amber-100 text-sm">
                Let the narrator assistant create a balanced role setup for you
                based on your player count.
              </p>
            </div>
            <Button
              onClick={() => setShowGeneratorModal(true)}
              variant="primary"
              size="md"
              className="ml-4 bg-white hover:bg-amber-50 !text-amber-700 border-white whitespace-nowrap"
            >
              <Sparkles className="w-5 h-5" />
              Generate Roles
            </Button>
          </div>
        </div>

        {/* Validation Messages */}
        {selectedRoles.length > 0 && (
          <ValidationBanner messages={validationMessages} />
        )}

        {/* Game Mode Options */}
        <div className="space-y-4 mb-6">
          {/* Optional Roles Toggle */}
          <div className="bg-slate-800 rounded-lg p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showOptionalRoles}
                onChange={(e) => setShowOptionalRoles(e.target.checked)}
                className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-800 cursor-pointer"
              />
              <div className="flex-1">
                <span className="text-lg font-semibold">
                  Show Optional Roles
                </span>
                <p className="text-sm text-slate-400">
                  Include advanced roles: Three Brothers, Prejudiced
                  Manipulator, Thief, Stuttering Judge, Actor, Devoted Servant
                </p>
              </div>
            </label>
          </div>

          {/* Auto-Narrator Mode Toggle */}
          <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 rounded-lg p-4 border border-purple-700/50">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={gameState.setup.autoNarratorMode || false}
                onChange={(e) => setAutoNarratorMode(e.target.checked)}
                className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 cursor-pointer"
              />
              <div className="flex-1">
                <span className="text-lg font-semibold text-purple-100">
                  🎮 Auto-Narrator Mode (Beta)
                </span>
                <p className="text-sm text-purple-200">
                  Automated gameplay where players interact directly with a
                  shared device. The game controls timing and flow
                  automatically.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Role Selection - Card Grid Layout */}
        <div className="space-y-8">
          {/* Village Team */}
          <div>
            <h3 className="text-3xl font-bold mb-6 text-blue-400 font-header">
              Village Team
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {villageTeamRoles.map((role) => {
                const selectedCount = getSelectedCount(role.id);
                const isMultiSelect = isMultiSelectRole(role.id);
                const isRecommended = recommendedRoles.includes(role.id);
                const isSelected = selectedCount > 0;

                return (
                  <div
                    key={role.id}
                    onClick={() => !isMultiSelect && toggleRole(role.id)}
                    className={`
                      relative group cursor-pointer
                      bg-gradient-to-br from-slate-800 to-slate-900
                      rounded-xl overflow-hidden
                      border-4 transition-all duration-300
                      ${
                        isSelected
                          ? "border-blue-400 shadow-xl shadow-blue-500/50 scale-105"
                          : isRecommended
                            ? "border-green-500 shadow-lg shadow-green-500/30"
                            : "border-slate-700 hover:border-blue-300 hover:shadow-lg hover:scale-105"
                      }
                      ${!isSelected ? "opacity-70 hover:opacity-100" : ""}
                    `}
                  >
                    {/* Quantity Badge (top-right corner) */}
                    {(isMultiSelect && selectedCount > 0) ||
                    (getRoleCount(role.id) > 1 && !isMultiSelect) ? (
                      <div className="absolute top-2 right-2 z-10 bg-slate-900 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm border-2 border-blue-400 shadow-lg">
                        ×{isMultiSelect ? selectedCount : getRoleCount(role.id)}
                      </div>
                    ) : null}

                    {/* Recommended Badge */}
                    {isRecommended && !isSelected && (
                      <div className="absolute top-2 left-2 z-10 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                        ★ Recommended
                      </div>
                    )}

                    {/* Card Content */}
                    <div className="p-4 flex flex-col h-full">
                      {/* Role Icon */}
                      <div className="w-full aspect-square rounded-lg mb-3 overflow-hidden">
                        <img
                          src={`/millers-hollow-narrator/images/roles/${role.id}.png`}
                          alt={role.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Role Name */}
                      <h4 className="text-sm font-bold text-center mb-2 leading-tight font-header text-blue-200">
                        {role.name}
                      </h4>

                      {/* Multi-select Controls */}
                      {isMultiSelect && (
                        <div className="flex items-center justify-center gap-2 mt-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (selectedCount > 0) removeRole(role.id);
                            }}
                            disabled={selectedCount === 0}
                            className="p-1.5 rounded-full bg-slate-700 hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="min-w-[3ch] text-center font-bold text-lg">
                            {selectedCount}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRole(role.id);
                            }}
                            className="p-1.5 rounded-full bg-slate-700 hover:bg-green-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Hover Tooltip with Description - only show for non-multi-select roles */}
                    {!isMultiSelect && (
                      <div className="absolute inset-0 bg-slate-900/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-center pointer-events-none">
                        <h4 className="text-sm font-bold mb-2 font-header text-blue-300">
                          {role.name}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {role.description}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Werewolf Team */}
          <div>
            <h3 className="text-3xl font-bold mb-6 text-red-400 font-header">
              Werewolf Team
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {werewolfTeamRoles.map((role) => {
                const selectedCount = getSelectedCount(role.id);
                const isMultiSelect = isMultiSelectRole(role.id);
                const isRecommended = recommendedRoles.includes(role.id);
                const isSelected = selectedCount > 0;

                return (
                  <div
                    key={role.id}
                    onClick={() => !isMultiSelect && toggleRole(role.id)}
                    className={`
                      relative group cursor-pointer
                      bg-gradient-to-br from-slate-800 to-slate-900
                      rounded-xl overflow-hidden
                      border-4 transition-all duration-300
                      ${
                        isSelected
                          ? "border-red-400 shadow-xl shadow-red-500/50 scale-105"
                          : isRecommended
                            ? "border-green-500 shadow-lg shadow-green-500/30"
                            : "border-slate-700 hover:border-red-300 hover:shadow-lg hover:scale-105"
                      }
                      ${!isSelected ? "opacity-70 hover:opacity-100" : ""}
                    `}
                  >
                    {/* Quantity Badge */}
                    {isMultiSelect && selectedCount > 0 && (
                      <div className="absolute top-2 right-2 z-10 bg-slate-900 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm border-2 border-red-400 shadow-lg">
                        ×{selectedCount}
                      </div>
                    )}

                    {/* Recommended Badge */}
                    {isRecommended && !isSelected && (
                      <div className="absolute top-2 left-2 z-10 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                        ★ Recommended
                      </div>
                    )}

                    {/* Card Content */}
                    <div className="p-4 flex flex-col h-full">
                      {/* Role Icon */}
                      <div className="w-full aspect-square rounded-lg mb-3 overflow-hidden">
                        <img
                          src={`/millers-hollow-narrator/images/roles/${role.id}.png`}
                          alt={role.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Role Name */}
                      <h4 className="text-sm font-bold text-center mb-2 leading-tight font-header text-red-200">
                        {role.name}
                      </h4>

                      {/* Multi-select Controls */}
                      {isMultiSelect && (
                        <div className="flex items-center justify-center gap-2 mt-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (selectedCount > 0) removeRole(role.id);
                            }}
                            disabled={selectedCount === 0}
                            className="p-1.5 rounded-full bg-slate-700 hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="min-w-[3ch] text-center font-bold text-lg">
                            {selectedCount}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRole(role.id);
                            }}
                            className="p-1.5 rounded-full bg-slate-700 hover:bg-green-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Hover Tooltip - only show for non-multi-select roles */}
                    {!isMultiSelect && (
                      <div className="absolute inset-0 bg-slate-900/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-center pointer-events-none">
                        <h4 className="text-sm font-bold mb-2 font-header text-red-300">
                          {role.name}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {role.description}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Solo Team */}
          <div>
            <h3 className="text-3xl font-bold mb-6 text-purple-400 font-header">
              Special Roles
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {specialRoles.map((role) => {
                const selectedCount = getSelectedCount(role.id);
                const isSelected = selectedCount > 0;

                return (
                  <div
                    key={role.id}
                    onClick={() => toggleRole(role.id)}
                    className={`
                      relative group cursor-pointer
                      bg-gradient-to-br from-slate-800 to-slate-900
                      rounded-xl overflow-hidden
                      border-4 transition-all duration-300
                      ${
                        isSelected
                          ? "border-purple-400 shadow-xl shadow-purple-500/50 scale-105"
                          : "border-slate-700 hover:border-purple-300 hover:shadow-lg hover:scale-105"
                      }
                      ${!isSelected ? "opacity-70 hover:opacity-100" : ""}
                    `}
                  >
                    {/* Card Content */}
                    <div className="p-4 flex flex-col h-full">
                      {/* Role Icon */}
                      <div className="w-full aspect-square rounded-lg mb-3 overflow-hidden">
                        <img
                          src={`/millers-hollow-narrator/images/roles/${role.id}.png`}
                          alt={role.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Role Name */}
                      <h4 className="text-sm font-bold text-center mb-2 leading-tight font-header text-purple-200">
                        {role.name}
                      </h4>
                    </div>

                    {/* Hover Tooltip */}
                    <div className="absolute inset-0 bg-slate-900/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-center pointer-events-none">
                      <h4 className="text-sm font-bold mb-2 font-header text-purple-300">
                        {role.name}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {role.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Unused Roles for Thief (Optional) */}
        {selectedRoles.includes("thief") && (
          <div className="bg-slate-800 rounded-lg p-6 mb-6 mt-6 border-2 border-purple-600/30">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-semibold">Thief's Unused Roles</h2>
              <span className="text-sm text-slate-400">
                (Required for Thief)
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Select 2 unused role cards for the Thief to choose from on the
              first night.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Unused Role 1 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Unused Role 1
                </label>
                <select
                  value={unusedRoles?.[0] || ""}
                  onChange={(e) =>
                    setUnusedRoles(
                      (e.target.value as RoleId) || undefined,
                      unusedRoles?.[1],
                    )
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a role...</option>
                  {Object.values(roles)
                    .filter(
                      (role) =>
                        role.id !== "thief" && role.id !== unusedRoles?.[1],
                    )
                    .map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name} ({role.team})
                      </option>
                    ))}
                </select>
              </div>

              {/* Unused Role 2 */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">
                  Unused Role 2
                </label>
                <select
                  value={unusedRoles?.[1] || ""}
                  onChange={(e) =>
                    setUnusedRoles(
                      unusedRoles?.[0],
                      (e.target.value as RoleId) || undefined,
                    )
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a role...</option>
                  {Object.values(roles)
                    .filter(
                      (role) =>
                        role.id !== "thief" && role.id !== unusedRoles?.[0],
                    )
                    .map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name} ({role.team})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {unusedRoles?.[0] && unusedRoles?.[1] && (
              <div className="mt-4 p-3 bg-purple-900/20 border border-purple-600/30 rounded text-sm text-purple-200">
                ✓ The Thief will choose between{" "}
                <strong>{roles[unusedRoles[0]].name}</strong> and{" "}
                <strong>{roles[unusedRoles[1]].name}</strong> on the first
                night.
              </div>
            )}
          </div>
        )}

        {/* Role Assignment (Optional) */}
        {showRoleAssignment && (
          <div className="bg-slate-800 rounded-lg p-6 mb-6 mt-6 border-2 border-green-600/30">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-semibold">
                Assign Roles to Players
              </h2>
              <span className="text-sm text-slate-400">(Optional)</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Assign roles to specific players. This enables automatic role
              reveals and positional checks (Fox, Bear Tamer). Leave unassigned
              to use manual selection during the game.
            </p>

            <div className="mb-4">
              <Button
                onClick={() => {
                  // Create array of all roles based on selectedRoles
                  const rolesToAssign: RoleId[] = [];
                  selectedRoles.forEach((roleId) => {
                    const count = getRoleCount(roleId);
                    for (let i = 0; i < count; i++) {
                      rolesToAssign.push(roleId);
                    }
                  });

                  // Shuffle the roles array
                  const shuffled = [...rolesToAssign].sort(
                    () => Math.random() - 0.5,
                  );

                  // Assign to players
                  players.forEach((player, index) => {
                    setPlayerAssignedRole(player.number, shuffled[index]);
                  });
                }}
                variant="secondary"
                size="md"
                className="bg-green-700 hover:bg-green-600"
              >
                🎲 Random Assign All Roles
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {players.map((player) => {
                const availableRoles = getAvailableRolesForPlayer(
                  player.number,
                );
                const hasAssignment = !!player.assignedRole;

                return (
                  <div
                    key={player.number}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                      hasAssignment
                        ? "bg-green-900/20 border-green-600/50"
                        : "bg-slate-700/50 border-slate-600"
                    }`}
                  >
                    <div className="flex-shrink-0 w-24">
                      <div className="font-medium text-sm">
                        {player.name || `Player ${player.number}`}
                      </div>
                      {player.name && (
                        <div className="text-xs text-slate-400">
                          Player {player.number}
                        </div>
                      )}
                    </div>
                    <select
                      value={player.assignedRole || ""}
                      onChange={(e) =>
                        setPlayerAssignedRole(
                          player.number,
                          e.target.value
                            ? (e.target.value as RoleId)
                            : undefined,
                        )
                      }
                      className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Unassigned</option>
                      {availableRoles.map((roleId) => {
                        const role = roles[roleId];
                        const count = roleAssignmentCounts[roleId];
                        const remaining = count
                          ? count.total - count.assigned
                          : 0;
                        const isPlayerCurrent = player.assignedRole === roleId;

                        return (
                          <option key={roleId} value={roleId}>
                            {role.name}
                            {count && count.total > 1 && !isPlayerCurrent
                              ? ` (${remaining} remaining)`
                              : ""}
                          </option>
                        );
                      })}
                    </select>
                    {hasAssignment && (
                      <div className="flex-shrink-0 text-green-400">✓</div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-sm text-slate-400 bg-slate-700/50 p-3 rounded">
              <strong>Tip:</strong> Role assignment is completely optional. If
              you skip this, you'll manually select roles when players are
              eliminated (as before).
            </div>
          </div>
        )}

        {/* Prejudiced Manipulator Group Assignment */}
        {selectedRoles.includes("prejudiced-manipulator") && (
          <div className="bg-slate-800 rounded-lg p-6 mb-6 border-2 border-purple-600/30">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-semibold">
                Prejudiced Manipulator - Group Assignment
              </h2>
              <span className="text-sm text-slate-400">(Required)</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Divide all players into two groups (A and B). The Prejudiced
              Manipulator wins if their target group is completely eliminated.
            </p>

            {/* Target Group Selection */}
            <div className="mb-6 p-4 bg-purple-900/20 border-2 border-purple-600/50 rounded-lg">
              <label className="block text-sm font-semibold mb-2 text-purple-200">
                Which group should the Prejudiced Manipulator eliminate?
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setPrejudicedManipulatorTargetGroup("A")}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                    gameState.prejudicedManipulatorTargetGroup === "A"
                      ? "bg-purple-600 text-white border-2 border-purple-400"
                      : "bg-slate-700 text-slate-300 border-2 border-slate-600 hover:bg-slate-600"
                  }`}
                >
                  Target Group A
                </button>
                <button
                  onClick={() => setPrejudicedManipulatorTargetGroup("B")}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all ${
                    gameState.prejudicedManipulatorTargetGroup === "B"
                      ? "bg-purple-600 text-white border-2 border-purple-400"
                      : "bg-slate-700 text-slate-300 border-2 border-slate-600 hover:bg-slate-600"
                  }`}
                >
                  Target Group B
                </button>
              </div>
            </div>

            {/* Player Group Assignment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {players.map((player) => (
                <div
                  key={player.number}
                  className="flex items-center gap-3 p-3 rounded-lg border-2 bg-slate-700/50 border-slate-600"
                >
                  <div className="flex-shrink-0 w-24">
                    <div className="font-medium text-sm">
                      {player.name || `Player ${player.number}`}
                    </div>
                    {player.name && (
                      <div className="text-xs text-slate-400">
                        Player {player.number}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 flex-1">
                    <button
                      onClick={() =>
                        setPlayerPrejudicedManipulatorGroup(player.number, "A")
                      }
                      className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition-all ${
                        player.prejudicedManipulatorGroup === "A"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                      }`}
                    >
                      Group A
                    </button>
                    <button
                      onClick={() =>
                        setPlayerPrejudicedManipulatorGroup(player.number, "B")
                      }
                      className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition-all ${
                        player.prejudicedManipulatorGroup === "B"
                          ? "bg-red-600 text-white"
                          : "bg-slate-600 text-slate-300 hover:bg-slate-500"
                      }`}
                    >
                      Group B
                    </button>
                  </div>
                  {player.prejudicedManipulatorGroup && (
                    <div className="flex-shrink-0 text-green-400">✓</div>
                  )}
                </div>
              ))}
            </div>

            {/* Group Summary */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-900/20 border-2 border-blue-600/50 rounded">
                <div className="font-semibold text-blue-200 mb-1">
                  Group A (
                  {
                    players.filter((p) => p.prejudicedManipulatorGroup === "A")
                      .length
                  }{" "}
                  players)
                </div>
                <div className="text-xs text-slate-400">
                  {players
                    .filter((p) => p.prejudicedManipulatorGroup === "A")
                    .map((p) => p.name || `Player ${p.number}`)
                    .join(", ") || "None assigned"}
                </div>
              </div>
              <div className="p-3 bg-red-900/20 border-2 border-red-600/50 rounded">
                <div className="font-semibold text-red-200 mb-1">
                  Group B (
                  {
                    players.filter((p) => p.prejudicedManipulatorGroup === "B")
                      .length
                  }{" "}
                  players)
                </div>
                <div className="text-xs text-slate-400">
                  {players
                    .filter((p) => p.prejudicedManipulatorGroup === "B")
                    .map((p) => p.name || `Player ${p.number}`)
                    .join(", ") || "None assigned"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Start Game Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleStartGame}
            disabled={!isValidSetup}
            variant="success"
            size="lg"
            className="text-xl"
          >
            <Play className="w-6 h-6" />
            Start Game
          </Button>
        </div>

        {!isValidSetup && totalRoleSlots !== playerCount && (
          <p className="text-center mt-4 text-orange-400">
            Please select exactly {playerCount} role slots to start the game
          </p>
        )}
      </div>

      {/* Role Generator Modal */}
      {showGeneratorModal && (
        <RoleGeneratorModal
          playerCount={playerCount}
          includeOptionalRoles={showOptionalRoles}
          onConfirm={handleGeneratedRoles}
          onClose={() => setShowGeneratorModal(false)}
        />
      )}
    </div>
  );
};
