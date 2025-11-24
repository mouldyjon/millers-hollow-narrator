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

interface SetupScreenProps {
  playerCount: number;
  selectedRoles: RoleId[];
  onPlayerCountChange: (count: number) => void;
  onToggleRole: (roleId: RoleId) => void;
  onRemoveRole: (roleId: RoleId) => void;
  onSetRoles: (roles: RoleId[]) => void;
  onStartGame: () => void;
}

export const SetupScreen = ({
  playerCount,
  selectedRoles,
  onPlayerCountChange,
  onToggleRole,
  onRemoveRole,
  onSetRoles,
  onStartGame,
}: SetupScreenProps) => {
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);

  const handleGeneratedRoles = (generatedRoles: RoleId[]) => {
    onSetRoles(generatedRoles);
    setShowGeneratorModal(false);
  };
  const getRoleCount = (roleId: RoleId): number => {
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
    (r) => r.team === "village",
  );
  const werewolfTeamRoles = Object.values(roles).filter(
    (r) => r.team === "werewolf",
  );
  const soloTeamRoles = Object.values(roles).filter((r) => r.team === "solo");

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
              onClick={() => onPlayerCountChange(Math.max(5, playerCount - 1))}
              className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg font-semibold"
            >
              -
            </button>
            <span className="text-3xl font-bold w-16 text-center">
              {playerCount}
            </span>
            <button
              onClick={() => onPlayerCountChange(Math.min(30, playerCount + 1))}
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
                    onClick={() => !isMultiSelect && onToggleRole(role.id)}
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
                      {/* Role Icon Placeholder - Using first letter as icon */}
                      <div
                        className={`
                        w-full aspect-square rounded-lg mb-3
                        flex items-center justify-center
                        text-5xl font-bold font-header
                        transition-all duration-300
                        ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-700 text-blue-300 group-hover:bg-blue-600 group-hover:text-white"
                        }
                      `}
                      >
                        {role.name.charAt(0)}
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
                              if (selectedCount > 0) onRemoveRole(role.id);
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
                              onToggleRole(role.id);
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
                    onClick={() => !isMultiSelect && onToggleRole(role.id)}
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
                      {/* Role Icon Placeholder */}
                      <div
                        className={`
                        w-full aspect-square rounded-lg mb-3
                        flex items-center justify-center
                        text-5xl font-bold font-header
                        transition-all duration-300
                        ${
                          isSelected
                            ? "bg-red-600 text-white"
                            : "bg-slate-700 text-red-300 group-hover:bg-red-600 group-hover:text-white"
                        }
                      `}
                      >
                        {role.name.charAt(0)}
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
                              if (selectedCount > 0) onRemoveRole(role.id);
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
                              onToggleRole(role.id);
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
              {soloTeamRoles.map((role) => {
                const selectedCount = getSelectedCount(role.id);
                const isSelected = selectedCount > 0;

                return (
                  <div
                    key={role.id}
                    onClick={() => onToggleRole(role.id)}
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
                      {/* Role Icon Placeholder */}
                      <div
                        className={`
                        w-full aspect-square rounded-lg mb-3
                        flex items-center justify-center
                        text-5xl font-bold font-header
                        transition-all duration-300
                        ${
                          isSelected
                            ? "bg-purple-600 text-white"
                            : "bg-slate-700 text-purple-300 group-hover:bg-purple-600 group-hover:text-white"
                        }
                      `}
                      >
                        {role.name.charAt(0)}
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

        {/* Start Game Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={onStartGame}
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
          onConfirm={handleGeneratedRoles}
          onClose={() => setShowGeneratorModal(false)}
        />
      )}
    </div>
  );
};
