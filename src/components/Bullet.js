import { defineComponent, h, watch, ref } from "@vue/runtime-core";
import selfBulletImg from "../../assets/bullet.png";
import enemyBulletImg from "../../assets/enemybullet.png";

// 己方子弹
export const SelfBulletInfo = {
  width: 32,
  height: 32,
  rotation: 0,
  dir: -1,
};

// 敌方子弹
export const EnemyBulletInfo = {
  width: 32,
  height: 32,
  rotation: 0,
  dir: 1,
};

export default defineComponent({
  props: ["x", "y", "id", "rotation", "dir"],
  setup(props) {
    const x = ref(props.x);
    const y = ref(props.y);

    watch(props, (newProps) => {
      x.value = newProps.x;
      y.value = newProps.y;
    });

    return {
      x,
      y,
      rotation: props.rotation,
      dir: props.dir,
    };
  },
  render(ctx) {
    return h("Sprite", {
      x: ctx.x,
      y: ctx.y,
      rotation: ctx.rotation,
      texture: ctx.dir === 1 ? enemyBulletImg : selfBulletImg,
    });
  },
});
