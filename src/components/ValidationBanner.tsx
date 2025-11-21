import { AlertTriangle, Info, XCircle, Lightbulb } from "lucide-react";
import type { ValidationMessage } from "../utils/setupValidation";

interface ValidationBannerProps {
  messages: ValidationMessage[];
}

export const ValidationBanner = ({ messages }: ValidationBannerProps) => {
  if (messages.length === 0) return null;

  const errors = messages.filter((m) => m.severity === "error");
  const warnings = messages.filter((m) => m.severity === "warning");
  const infos = messages.filter((m) => m.severity === "info");

  return (
    <div className="space-y-3">
      {/* Errors */}
      {errors.map((msg, i) => (
        <div
          key={`error-${i}`}
          className="bg-red-900/30 border-2 border-red-700/50 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-red-300">{msg.message}</div>
              {msg.suggestion && (
                <div className="text-sm text-red-200 mt-1">{msg.suggestion}</div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Warnings */}
      {warnings.map((msg, i) => (
        <div
          key={`warning-${i}`}
          className="bg-amber-900/30 border-2 border-amber-700/50 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-amber-300">{msg.message}</div>
              {msg.suggestion && (
                <div className="text-sm text-amber-200 mt-1">
                  {msg.suggestion}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Info */}
      {infos.map((msg, i) => (
        <div
          key={`info-${i}`}
          className="bg-blue-900/30 border-2 border-blue-700/50 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-blue-300">{msg.message}</div>
              {msg.suggestion && (
                <div className="text-sm text-blue-200 mt-1">{msg.suggestion}</div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Success state (no issues) */}
      {messages.length === 0 && (
        <div className="bg-green-900/30 border-2 border-green-700/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-green-300">
                Balanced setup
              </div>
              <div className="text-sm text-green-200 mt-1">
                Role distribution looks good - ready to start!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
