import { Router } from "vue-router";
import nProgress from "nprogress";

export default (router: Router): void => {
  router.beforeEach((to, from) => {
    nProgress.start();
  });

  router.afterEach(() => {
    nProgress.done();
  });
};
