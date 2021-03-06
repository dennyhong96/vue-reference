import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import store from "@/store";

// route level code-splitting
// this generates a separate chunk (home.[hash].js) for this route
// which is lazy-loaded when the route is visited.
const Home = () => import(/* webpackChunkName: "home" */ "@/views/Home.vue");
const About = () => import(/* webpackChunkName: "about" */ "@/views/About.vue");

// Grouping frequently viewed together routes as a single chunk - assign the same chunk name
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
    // beforeEnter(to, from, next) {
    //   console.log("/manage-music beforeEnter", { to });
    //   console.log("/manage-music beforeEnter", { from });
    //   next();
    // },
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
  linkExactActiveClass: "text-yellow-500", // Set styles for active <router-link />
  // linkActiveClass: "text-yellow-500",
});

// Global route guard
// Global route guard ran first, than beforeEnter in the routes config, than beforeRouteEnter in the route component
router.beforeEach((to, from, next) => {
  console.log("router.beforeEach()", { to });
  console.log("router.beforeEach()", { from });

  // Redirect to home is route is protected but user is not logged in
  if (
    to.matched.some((matchedRoute) => !!matchedRoute.meta.requiresAuth) &&
    !store.state.auth.userLoggedIn
  ) {
    return next({ name: "Home" });
  }

  next();
});

export default router;
