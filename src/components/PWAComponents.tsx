import { usePWAInstall } from "@/hooks/use-pwa-install";
import { usePWAUpdate } from "@/hooks/use-pwa-update";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Download, RefreshCw } from "lucide-react";

export const PWAInstallPrompt = () => {
  const { showPrompt, handleInstallClick, handleDismiss, canInstall } = usePWAInstall();

  if (!showPrompt || !canInstall) {
    return null;
  }

  return (
    <AlertDialog open={showPrompt} onOpenChange={handleDismiss}>
      <AlertDialogContent>
        <AlertDialogTitle>Install KaloriWater</AlertDialogTitle>
        <AlertDialogDescription>
          Install KaloriWater as an app on your device for faster access and offline support.
        </AlertDialogDescription>
        <div className="flex gap-3">
          <AlertDialogCancel onClick={handleDismiss}>Not now</AlertDialogCancel>
          <AlertDialogAction onClick={handleInstallClick} className="gap-2">
            <Download className="h-4 w-4" />
            Install
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const PWAUpdatePrompt = () => {
  const { updateAvailable, handleUpdate, dismissUpdate } = usePWAUpdate();

  if (!updateAvailable) {
    return null;
  }

  return (
    <AlertDialog open={updateAvailable} onOpenChange={dismissUpdate}>
      <AlertDialogContent>
        <AlertDialogTitle>Update Available</AlertDialogTitle>
        <AlertDialogDescription>
          A new version of KaloriWater is available. Restart the app to get the latest features and improvements.
        </AlertDialogDescription>
        <div className="flex gap-3">
          <AlertDialogCancel onClick={dismissUpdate}>Later</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdate} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Update Now
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
