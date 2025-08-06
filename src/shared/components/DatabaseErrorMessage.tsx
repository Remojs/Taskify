import { AlertTriangle, Calendar, Database, X } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui";
import { Button } from "@/shared/components/ui";

interface DatabaseErrorMessageProps {
  isVisible: boolean;
  onClose: () => void;
  error?: string;
}

export function DatabaseErrorMessage({ isVisible, onClose, error }: DatabaseErrorMessageProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 shadow-2xl animate-in zoom-in-95 duration-300">
        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200">
                Base de datos pausada
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-100 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-900/50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <p className="text-amber-700 dark:text-amber-300">
              No se pudo conectar con la base de datos. Las tareas guardadas no están disponibles temporalmente.
            </p>
            
            {/* Features available */}
            <div className="bg-amber-100/50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Funcionalidad disponible:
                </span>
              </div>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                <li>• Crear tareas en Google Calendar</li>
                <li>• Sincronización con tu calendario</li>
                <li>• Vista previa de tareas</li>
              </ul>
            </div>

            {/* Features unavailable */}
            <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                  Temporalmente no disponible:
                </span>
              </div>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                <li>• Guardar tareas permanentemente</li>
                <li>• Ver historial de tareas</li>
                <li>• Sincronización con base de datos</li>
              </ul>
            </div>

            {/* Error details (if any) */}
            {error && (
              <details className="text-xs text-amber-600 dark:text-amber-400">
                <summary className="cursor-pointer hover:text-amber-700 dark:hover:text-amber-300">
                  Detalles técnicos
                </summary>
                <div className="mt-2 p-2 bg-amber-100 dark:bg-amber-900/30 rounded text-amber-800 dark:text-amber-200 font-mono">
                  {error}
                </div>
              </details>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={onClose}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
            >
              Entendido
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
