import { useEffect, useState } from "react";

export const usePWAUpdate = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const handleServiceWorkerUpdate = async () => {
      try {
        const reg = await navigator.serviceWorker.ready;
        setRegistration(reg);

        // Check for updates periodically
        const checkForUpdates = async () => {
          const newReg = await navigator.serviceWorker.getRegistration();
          if (newReg) {
            await newReg.update();
          }
        };

        // Check immediately and then every hour
        checkForUpdates();
        const interval = setInterval(checkForUpdates, 60 * 60 * 1000);

        // Listen for new service worker
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "activated") {
                setUpdateAvailable(true);
              }
            });
          }
        });

        return () => clearInterval(interval);
      } catch (error) {
        console.error("Service Worker error:", error);
      }
    };

    handleServiceWorkerUpdate();
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    }
  };

  const dismissUpdate = () => {
    setUpdateAvailable(false);
  };

  return {
    updateAvailable,
    handleUpdate,
    dismissUpdate,
  };
};
