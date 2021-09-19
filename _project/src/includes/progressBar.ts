import { Router } from "vue-router";
import nProgress from "nprogress";

export default (router: Router): void => {
  router.beforeEach((to, from, next) => {
    nProgress.start();
    next();
  });

  router.afterEach(() => {
    nProgress.done();
  });
};
