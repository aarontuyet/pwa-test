(() => {
  if (!("serviceWorker" in navigator)) return;

  const controlledAtLoad = Boolean(navigator.serviceWorker.controller);
  let refreshing = false;

  if (controlledAtLoad) {
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("./sw.js", {
        scope: "./",
        updateViaCache: "none"
      });

      await registration.update();
    } catch (error) {
      console.error("PWA service worker registration failed:", error);
    }
  });
})();
