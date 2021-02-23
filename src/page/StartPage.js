import { defineComponent, h } from "@vue/runtime-core";
import startPage from "../../assets/start.png";
import startBtn from "../../assets/startBtn.png";
import { PAGE } from "./index";

export default defineComponent({
  props: ["onNextPage"],
  // 第二个参数提供了一个上下文对象 Context
  setup(props,ctx) {
    const handleGoToGame = () => {
      props.onNextPage(PAGE.game);
    };
    return {
      handleGoToGame,
    };
  },
  render(ctx) {
    return h("Container", [
      h("Sprite", { texture: startPage, key: "1" }),
      h("Sprite", {
        texture: startBtn,
        x: 266,
        y: 750,
        key: "2",
        on: {
          pointertap: ctx.handleGoToGame,
        },
        interactive: true,
        buttonMode: true,
      }),
    ]);
  },
});
