import { defineComponent, h } from "@vue/runtime-core";
import endBtn from "../../assets/endBtn.png";
import { PAGE } from "./index";

export default defineComponent({
  props: ["onNextPage"],
  setup(props) {
    const handleGoToGame = () => {
      props.onNextPage(PAGE.game);
    };
    return {
      handleGoToGame,
    };
  },
  render(ctx) {
    return h("Container", [
      h("Sprite", {
        texture: endBtn,
        x: 215,
        y: 400,
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
