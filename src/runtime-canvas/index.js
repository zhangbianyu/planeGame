import { createRenderer } from "@vue/runtime-core";
import { Container, Texture, Sprite } from "pixi.js";

const renderer = createRenderer({
  createElement(type) {
    let element;
    switch (type) {
      case "Container":
        element = new Container();
        break;
      case "Sprite":
        element = new Sprite();
        break;
    }
    return element;
  },
  setElementText(node, text) {
    const cText = new Text(text);
    node.addChild(cText);
  },
  createText(text) {
    return new Text(text);
  },
  insert(el, parent) {
    parent.addChild(el);
  },
  patchProp(el, key, prevValue, nextValue) {
    switch (key) {
      case "texture":
        el.texture = Texture.from(nextValue);
        break;
      case "onClick":
        el.on("pointertap", nextValue);
        break;
      case "on":
        Object.keys(nextValue).forEach((eventName) => {
          const callback = nextValue[eventName];
          el.on(eventName, callback);
        });
        break;
      default:
        el[key] = nextValue;
    }
  },
  // 处理注释
  createComment() {},
  // 获取父节点
  parentNode() {},
  // 获取兄弟节点
  nextSibling() {},
  // 删除节点
  remove(el) {
    const parent = el.parent;
    if (parent) {
      parent.removeChild(el);
    }
  },
});

export function createApp(rootComponent) {
  return renderer.createApp(rootComponent);
}
