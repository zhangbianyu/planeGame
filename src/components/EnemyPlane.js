// 敌方飞机
import {
  defineComponent,
  h,
  ref,
  watch,
  onMounted,
  onUnmounted,
} from "@vue/runtime-core";
import planeImg from "../../assets/enemy.png";

export const EnemyPlaneInfo = {
  width: 128,
  height: 128,
  life: 3,
};

export default defineComponent({
  props: ["x", "y"],
  setup(props, ctx) {
    const x = ref(props.x);
    const y = ref(props.y);

    watch(props, (newValue) => {
      x.value = newValue.x;
      y.value = newValue.y;
    });

    useAttack(ctx, x, y);

    return { x, y };
  },
  render(ctx) {
    return h("Sprite", {
      x: ctx.x,
      y: ctx.y,
      texture: planeImg,
    });
  },
});

const useAttack = (ctx, x, y) => {
  // 发射子弹
  const attackInterval = 2000;
  let intervalId;
  onMounted(() => {
    intervalId = setInterval(() => {
      ctx.emit("attack", {
        x: x.value + 64,
        y: y.value + 64,
      });
    }, attackInterval);
  });

  onUnmounted(() => {
    clearInterval(intervalId);
  });
};
