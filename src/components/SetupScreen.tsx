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

        {/* Role Selection */}
        <div className="space-y-6">
          {/* Village Team */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">
              Village Team
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {villageTeamRoles.map((role) => {
                const selectedCount = getSelectedCount(role.id);
                const isMultiSelect = isMultiSelectRole(role.id);
                const isRecommended = recommendedRoles.includes(role.id);

                return (
                  <div
                    key={role.id}
                    className={`p-4 rounded-lg transition-all ${
                      selectedCount > 0
                        ? "bg-blue-600"
                        : isRecommended
                          ? "bg-slate-700 border-2 border-green-500 shadow-lg shadow-green-500/20"
                          : "bg-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <div className="font-semibold flex items-center gap-2">
                          {role.name}
                          {getRoleCount(role.id) > 1 && !isMultiSelect && (
                            <span className="text-xs bg-slate-900 px-2 py-1 rounded">
                              ×{getRoleCount(role.id)}
                            </span>
                          )}
                          {isRecommended && selectedCount === 0 && (
                            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded font-semibold">
                              Recommended
                            </span>
                          )}
                        </div>
                      </div>
                      {isMultiSelect ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (selectedCount > 0) onRemoveRole(role.id);
                            }}
                            disabled={selectedCount === 0}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="min-w-[2ch] text-center font-bold">
                            {selectedCount}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleRole(role.id);
                            }}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-900"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onToggleRole(role.id)}
                          className="text-sm underline"
                        >
                          {selectedCount > 0 ? "Remove" : "Add"}
                        </button>
                      )}
                    </div>
                    <div className="text-xs text-slate-300">
                      {role.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Werewolf Team */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-red-400">
              Werewolf Team
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {werewolfTeamRoles.map((role) => {
                const selectedCount = getSelectedCount(role.id);
                const isMultiSelect = isMultiSelectRole(role.id);
                const isRecommended = recommendedRoles.includes(role.id);

                return (
                  <div
                    key={role.id}
                    className={`p-4 rounded-lg transition-all ${
                      selectedCount > 0
                        ? "bg-red-600"
                        : isRecommended
                          ? "bg-slate-700 border-2 border-green-500 shadow-lg shadow-green-500/20"
                          : "bg-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <div className="font-semibold flex items-center gap-2">
                          {role.name}
                          {isRecommended && selectedCount === 0 && (
                            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded font-semibold">
                              Recommended
                            </span>
                          )}
                        </div>
                      </div>
                      {isMultiSelect ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (selectedCount > 0) onRemoveRole(role.id);
                            }}
                            disabled={selectedCount === 0}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="min-w-[2ch] text-center font-bold">
                            {selectedCount}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleRole(role.id);
                            }}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-900"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onToggleRole(role.id)}
                          className="text-sm underline"
                        >
                          {selectedCount > 0 ? "Remove" : "Add"}
                        </button>
                      )}
                    </div>
                    <div className="text-xs text-slate-300">
                      {role.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Solo Team */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-purple-400">
              Special Roles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {soloTeamRoles.map((role) => {
                const selectedCount = getSelectedCount(role.id);

                return (
                  <div
                    key={role.id}
                    className={`p-4 rounded-lg transition-colors ${
                      selectedCount > 0 ? "bg-purple-600" : "bg-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <div className="font-semibold">{role.name}</div>
                      </div>
                      <button
                        onClick={() => onToggleRole(role.id)}
                        className="text-sm underline"
                      >
                        {selectedCount > 0 ? "Remove" : "Add"}
                      </button>
                    </div>
                    <div className="text-xs text-slate-300">
                      {role.description}
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
