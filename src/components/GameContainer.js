import { h, ref, computed } from "@vue/runtime-core";
import { PAGE, getPageComponent } from "../page";

export default {
  setup() {
    // 默认是开始界面
    const currentPageName = ref(PAGE.start);
    const currentPage = computed(() => {
      return getPageComponent(currentPageName.value);
    });

    const handleNextPage = (nextPage) => {
      currentPageName.value = nextPage;
    };

    return { currentPage, handleNextPage };
  },
  render(ctx) {
    return h("Container", [
      h(ctx.currentPage, {
        onNextPage: ctx.handleNextPage,
      }),
    ]);
  },
};
