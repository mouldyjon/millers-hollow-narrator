import { useState, useEffect } from "react";
import { X, RefreshCw, Sparkles, AlertTriangle } from "lucide-react";
import type { RoleId } from "../types/game";
import { roles } from "../data/roles";
import {
  generateBalancedRoles,
  analyseRoleDistribution,
  validateRoleBalance,
} from "../utils/roleGenerator";
import { Button } from "./ui";

interface RoleGeneratorModalProps {
  playerCount: number;
  onConfirm: (roles: RoleId[]) => void;
  onClose: () => void;
}

export const RoleGeneratorModal = ({
  playerCount,
  onConfirm,
  onClose,
}: RoleGeneratorModalProps) => {
  const [generatedRoles, setGeneratedRoles] = useState<RoleId[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate roles on mount
  useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Add small delay for visual feedback
    setTimeout(() => {
      const roles = generateBalancedRoles(playerCount);
      setGeneratedRoles(roles);
      setIsGenerating(false);
    }, 300);
  };

  const distribution = analyseRoleDistribution(generatedRoles);
  const validation = validateRoleBalance(generatedRoles, playerCount);

  // Group roles by name for display
  const roleGroups = generatedRoles.reduce(
    (acc, roleId) => {
      acc[roleId] = (acc[roleId] || 0) + 1;
      return acc;
    },
    {} as Record<RoleId, number>,
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-amber-100" />
            <h2 className="text-2xl font-bold text-amber-50 font-header">
              Auto-Generate Roles
            </h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-amber-100 hover:text-white"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Player Count Info */}
          <div className="mb-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Player Count:</span>
              <span className="text-xl font-bold text-amber-400">
                {playerCount}
              </span>
            </div>
          </div>

          {/* Distribution Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-700/50">
              <div className="text-blue-300 text-sm mb-1">Village Team</div>
              <div className="text-2xl font-bold text-blue-400">
                {distribution.villageRoles.length}
              </div>
            </div>
            <div className="p-4 bg-red-900/30 rounded-lg border border-red-700/50">
              <div className="text-red-300 text-sm mb-1">Werewolf Team</div>
              <div className="text-2xl font-bold text-red-400">
                {distribution.werewolfRoles.length}
              </div>
              <div className="text-xs text-red-300 mt-1">
                ({distribution.werewolfPercentage.toFixed(0)}%)
              </div>
            </div>
            <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-700/50">
              <div className="text-purple-300 text-sm mb-1">Solo Roles</div>
              <div className="text-2xl font-bold text-purple-400">
                {distribution.soloRoles.length}
              </div>
            </div>
          </div>

          {/* Validation Warnings */}
          {validation.warnings.length > 0 && (
            <div className="mb-6 p-4 bg-amber-900/30 rounded-lg border border-amber-700/50">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-amber-300 font-medium mb-2">
                    Balance Warnings:
                  </div>
                  <ul className="text-sm text-amber-200 space-y-1">
                    {validation.warnings.map((warning, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Role List */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-amber-400 mb-3 font-header">
              Generated Roles:
            </h3>
            <div className="space-y-2">
              {Object.entries(roleGroups)
                .sort(([, a], [, b]) => b - a) // Sort by quantity
                .map(([roleId, count]) => {
                  const role = roles[roleId as RoleId];
                  const teamColour =
                    role.team === "village"
                      ? "bg-blue-900/30 border-blue-700/50"
                      : role.team === "werewolf"
                        ? "bg-red-900/30 border-red-700/50"
                        : "bg-purple-900/30 border-purple-700/50";

                  return (
                    <div
                      key={roleId}
                      className={`p-3 rounded-lg border ${teamColour} flex items-center justify-between`}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-white">
                          {role.name}
                        </div>
                        <div className="text-sm text-slate-400">
                          {role.description}
                        </div>
                      </div>
                      {count > 1 && (
                        <div className="ml-4 px-3 py-1 bg-slate-700 rounded-full text-sm font-medium text-amber-400">
                          ×{count}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-700/50 px-6 py-4 flex items-center justify-between border-t border-slate-600">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            variant="secondary"
            size="md"
          >
            <RefreshCw
              className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`}
            />
            Regenerate
          </Button>
          <div className="flex gap-3">
            <Button onClick={onClose} variant="secondary" size="md">
              Cancel
            </Button>
            <Button
              onClick={() => onConfirm(generatedRoles)}
              disabled={!validation.valid}
              variant="gold"
              size="md"
            >
              Use These Roles
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
