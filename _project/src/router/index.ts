import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import store from "@/store";

// route level code-splitting, lazy-loaded when the route is visited.
const Home = () => import(/* webpackChunkName: "home" */ "@/views/Home.vue"); // this generates a separate chunk (home.[hash].js) for this route
const About = () => import(/* webpackChunkName: "about" */ "@/views/About.vue");

// Grouping frequently viewed together routes as a single chunk - assign the SAME chunk name
const Manage = () =>
  import(/* webpackChunkName: "groupedChunk" */ "@/views/Manage.vue");
const Song = () =>
  import(/* webpackChunkName: "groupedChunk" */ "@/views/Song.vue");

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/manage-music",
    // alias: "/manage", // alias is an addtional path to match the component, it does not redirect/pushState
    name: "Manage",
    component: Manage,
    meta: { requiresAuth: true }, // assign custom key values to route meta field

    // Local route guard, can also define this within the view component
    beforeEnter(to, from) {
      console.log("/manage-music beforeEnter", { to });
      console.log("/manage-music beforeEnter", { from });
    },
  },
  {
    path: "/manage",
    redirect: {
      name: "Manage", // Redirect from /manage (old path) to /manage-music (new path)
    },
  },
  {
    path: "/songs/:id",
    name: "Song",
    component: Song,
    meta: { preserveQuery: true },
  },
  {
    path: "/:catchAll(.*)*", // Vue router try to match the catch-all route last, prioritize other matches
    redirect: {
      name: "Home", // Redirect to /home if 404
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,

  // Set styles for active <router-link />
  // linkActiveClass: "text-yellow-500",
  // linkExactActiveClass: "text-yellow-500",

  scrollBehavior(to, from, savedPosition) {
    // Return a promise to delay the scroll, wait for route transition to finish
    return new Promise((resolve) => {
      setTimeout(() => {
        if (to.hash) resolve({ el: to.hash, behavior: "smooth" });
        if (savedPosition) resolve({ ...savedPosition, behavior: "smooth" });
        resolve({ top: 0, behavior: "smooth" });
      }, 500);
    });
  },
});

// Global route guards
// Global route guard ran first, than beforeEnter in the routes config, than beforeRouteEnter in the route component
router.beforeEach((to, from) => {
  // Redirect to home is route is protected but user is not logged in
  if (
    // to.matched.some((matchedRoute) => !!matchedRoute.meta.requiresAuth) &&
    // !store.state.auth.userLoggedIn
    to.meta.requiresAuth &&
    !store.state.auth.userLoggedIn
  ) {
    // return false; // return false to cancel the navigation
    return { name: "Home" }; // Redirect to home
  }
});

// Remove query from url when for new route
router.afterEach((to, from) => {
  if (!to.meta.preserveQuery) {
    if (Object.keys(to.query).length) {
      router.replace({ query: {} });
    }
  }
});

export default router;
