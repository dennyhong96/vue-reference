import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import store from "@/store";
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import Manage from "@/views/Manage.vue";

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
    path: "/:catchAll(.*)*", // Vue router try to match the catch-all route last, prioritize other matches
    redirect: {
      name: "Home", // Redirect to /home if 404
    },
  },

  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue"),
  // },
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
    !store.state.userLoggedIn
  ) {
    return next({ name: "Home" });
  }

  next();
});

export default router;
