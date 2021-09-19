/* eslint-disable no-console */

import { register } from "register-service-worker";

// Workbox is being configured beind the scene by pwa plugin
// https://developers.google.com/web/tools/workbox
if (process.env.NODE_ENV === "production") {
  // Register service-worker file to let browser know we want to run background task
  register(`${process.env.BASE_URL}service-worker.js`, {
    // Lifecycle methods
    ready() {
      // When the service worker is ready (safe to configure service worker)
      console.log(
        "App is being served from cache by a service worker.\n" +
          "For more details, visit https://goo.gl/AFskqB"
      );
    },

    registered() {
      // When the service worker is registered for the first time on a user's device, only runs ONCE
      console.log("Service worker has been registered.");
    },

    cached() {
      // Runs when a file is cached
      // By default, workbox will try to cache static files, not network requests
      console.log("Content has been cached for offline use.");
    },

    updatefound() {
      // Runs when a file updated to a newer version than what's in the cache, can run logic before workbox fetches the updated file
      console.log("New content is downloading.");
    },

    updated() {
      // Runs when a file has been updated
      console.log("New content is available; please refresh.");
    },

    offline() {
      // Runs when the user goes offline, can use this to cancel/delay requests
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    },

    error(error) {
      // Runs when there's a error registering the service worker
      console.error("Error during service worker registration:", error);
    },
  });
}
