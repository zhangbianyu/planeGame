import TWEEN from "@tweenjs/tween.js";
import {
  defineComponent,
  h,
  reactive,
  onMounted,
  onUnmounted,
} from "@vue/runtime-core";
import Map from "../components/Map";
import Plane, { PlaneInfo } from "../components/Plane";
import EnemyPlane, { EnemyPlaneInfo } from "../components/EnemyPlane";
import Bullet, { SelfBulletInfo, EnemyBulletInfo } from "../components/Bullet";
import { game } from "../Game";
import { hitTestObject } from "../utils";
import { stage } from "../config";
import { moveEnemyPlane } from "../moveEnemyPlane";
import { moveBullets } from "../moveBullets";
import { useKeyboardMove } from "../use";
import { PAGE } from "./index";

export default defineComponent({
  props: ["onNextPage"],
  setup(props) {
    // 我方飞机
    const selfPlane = useSelfPlane({
      x: stage.width / 2 - 60,
      y: stage.height,
      speed: 7,
    });
    // 敌方飞机
    const enemyPlanes = useEnemyPlanes();
    // 己方子弹逻辑
    const {
      selfBullets,
      createSelfBullet,
      destorySelfBullet,
    } = useSelfBullets();
    // 敌方子弹
    const {
      enemyPlaneBullets,
      createEnemyPlaneBullet,
    } = useEnemyPlaneBullets();

    // 战斗逻辑
    useFighting({
      selfPlane,
      selfBullets,
      enemyPlanes,
      enemyPlaneBullets,
      gameOverCallback() {
        props.onNextPage(PAGE.end);
      },
    });

    return {
      selfPlane,
      enemyPlanes,
      selfBullets,
      createSelfBullet,
      destorySelfBullet,
      enemyPlaneBullets,
      createEnemyPlaneBullet,
    };
  },
  render(ctx) {
    // 遍历创建子弹
    const createBullets = (info) => {
      return h(Bullet, {
        key: "Bullet" + info.id,
        x: info.x,
        y: info.y,
        id: info.id,
        dir: info.dir,
        width: info.width,
        height: info.height,
        rotation: info.rotation,
        onDestroy({ id }) {
          ctx.destorySelfBullet(id);
        },
      });
    };

    // 遍历创建敌方飞机
    const createEnemyPlanes = (info, index) => {
      return h(EnemyPlane, {
        key: "EnemyPlane" + index,
        x: info.x,
        y: info.y,
        width: info.width,
        height: info.height,
        onAttack({ x, y }) {
          ctx.createEnemyPlaneBullet(x, y);
        },
      });
    };

    // 创建己方飞机
    const createSelfPlane = () => {
      return h(Plane, {
        x: ctx.selfPlane.x,
        y: ctx.selfPlane.y,
        speed: ctx.selfPlane.speed,
        onAttack({ x, y }) {
          ctx.createSelfBullet(x, y);
        },
      });
    };

    return h("Container", [
      h(Map),
      createSelfPlane(),
      ...ctx.selfBullets.map(createBullets),
      ...ctx.enemyPlaneBullets.map(createBullets),
      ...ctx.enemyPlanes.map(createEnemyPlanes),
    ]);
  },
});

let hashCode = 0;
const createHashCode = () => {
  return hashCode++;
};

// 战斗逻辑
function useFighting({
  selfPlane,
  selfBullets,
  enemyPlanes,
  enemyPlaneBullets,
  gameOverCallback,
}) {
  const handleTicker = () => {
    // 游戏主循环
    // 移动我方子弹
    moveBullets(selfBullets);
    // 敌军移动
    moveEnemyPlane(enemyPlanes);
    // 移动敌方子弹
    moveBullets(enemyPlaneBullets);

    // 遍历我方子弹是否碰到了敌方单位
    selfBullets.forEach((bullet, selfIndex) => {
      // 我方子弹是否碰到了敌方飞机
      enemyPlanes.forEach((enemyPlane, enemyPlaneIndex) => {
        const isIntersect = hitTestObject(bullet, enemyPlane);
        if (isIntersect) {
          selfBullets.splice(selfIndex, 1);

          // 敌方飞机扣血
          enemyPlane.life--;
          if (enemyPlane.life <= 0) {
            // 没血了就消除
            enemyPlanes.splice(enemyPlaneIndex, 1);
          }
        }
      });

      // 我方子弹是否碰到了敌方子弹
      enemyPlaneBullets.forEach((enemyBullet, enemyBulletIndex) => {
        const isIntersect = hitTestObject(bullet, enemyBullet);
        if (isIntersect) {
          selfBullets.splice(selfIndex, 1);
          enemyPlaneBullets.splice(enemyBulletIndex, 1);
        }
      });
    });

    // 碰撞敌方单位
    const hitSelfHandle = (enemyObject) => {
      const isIntersect = hitTestObject(selfPlane, enemyObject);
      if (isIntersect) {
        // 碰到我方飞机
        // 游戏结束
        // 跳转到结束页面
        gameOverCallback && gameOverCallback();
      }
    };

    // 碰到敌方子弹
    enemyPlaneBullets.forEach((enemyBullet) => {
      hitSelfHandle(enemyBullet);
    });

    // 碰到敌方飞机
    enemyPlanes.forEach((enemyPlane) => {
      hitSelfHandle(enemyPlane);
    });
  };

  onMounted(() => {
    game.ticker.add(handleTicker);
  });

  onUnmounted(() => {
    game.ticker.remove(handleTicker);
  });
}

// 我方子弹
function useSelfBullets() {
  const selfBullets = reactive([]);

  // 创建子弹
  const createSelfBullet = (x, y) => {
    const id = createHashCode();
    const width = SelfBulletInfo.width;
    const height = SelfBulletInfo.height;
    const rotation = SelfBulletInfo.rotation;
    const dir = SelfBulletInfo.dir;
    selfBullets.push({ x, y, id, width, height, rotation, dir });
  };

  //销毁子弹
  const destorySelfBullet = (id) => {
    const index = selfBullets.findIndex((info) => info.id == id);
    if (index != -1) {
      selfBullets.splice(index, 1);
    }
  };

  return {
    selfBullets,
    createSelfBullet,
    destorySelfBullet,
  };
}

// 我方飞机
const useSelfPlane = ({ x, y, speed }) => {
  const selfPlane = reactive({
    x,
    y,
    speed,
    width: PlaneInfo.width,
    height: PlaneInfo.height,
  });

  const { x: selfPlaneX, y: selfPlaneY } = useKeyboardMove({
    x: selfPlane.x,
    y: selfPlane.y,
    speed: selfPlane.speed,
  });

  // 缓动出场
  var tween = new TWEEN.Tween({
    x,
    y,
  })
    .to({ y: y - 250 }, 500)
    .start();
  tween.onUpdate((obj) => {
    selfPlane.x = obj.x;
    selfPlane.y = obj.y;
  });

  const handleTicker = () => {
    TWEEN.update();
  };

  onMounted(() => {
    game.ticker.add(handleTicker);
  });
  
  onUnmounted(() => {
    game.ticker.remove(handleTicker);
  });
  selfPlane.x = selfPlaneX;
  selfPlane.y = selfPlaneY;
  return selfPlane;
};

// 敌方飞机
function useEnemyPlanes() {
  const enemyPlanes = reactive([]);

  // 产生敌机
  const createEnemyPlaneData = (x) => {
    return {
      x: x,
      y: -200,
      width: EnemyPlaneInfo.width,
      height: EnemyPlaneInfo.height,
      life: EnemyPlaneInfo.life,
    };
  };

  setInterval(() => {
    const x = Math.floor(stage.width * Math.random());
    enemyPlanes.push(createEnemyPlaneData(x));
  }, 600);
  return enemyPlanes;
}

// 敌方子弹
const useEnemyPlaneBullets = () => {
  // 创建敌军子弹
  const enemyPlaneBullets = reactive([]);

  const createEnemyPlaneBullet = (x, y) => {
    const id = createHashCode();
    const width = EnemyBulletInfo.width;
    const height = EnemyBulletInfo.height;
    const rotation = EnemyBulletInfo.rotation;
    const dir = EnemyBulletInfo.dir;
    enemyPlaneBullets.push({ x, y, id, width, height, rotation, dir });
  };

  return {
    enemyPlaneBullets,
    createEnemyPlaneBullet,
  };
};
