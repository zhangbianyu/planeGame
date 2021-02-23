// 我方飞机
import { defineComponent, h } from "@vue/runtime-core";
import planeImg from "../../assets/plane.png";

export const PlaneInfo = {
  width: 128,
  height: 128,
};

export default defineComponent({
  props: ["x", "y"],
  setup(props, { emit }) {
    window.addEventListener("keydown", (e) => {
      // 按下空格发射子弹
      if (e.code === "Space") {
        emit("attack", {
          x: props.x + 48,
          y: props.y - 20,
        });
      }
    });
  },
  render(ctx) {
    return h("Container", { x: ctx.x, y: ctx.y }, [
      h("Sprite", { texture: planeImg }),
    ]);
  },
});
