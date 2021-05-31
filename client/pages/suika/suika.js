import { Texture, Sprite, Text, Point } from "@tbminiapp/pixi-miniprogram-engine";
import { Engine, Runner, Bodies, Composite, Events } from "matter-js";
import { GameRectangle, GameCircle } from "/modules/gameGraphics";
import { circleMap, FruitCircle } from "/modules/fruitCircle";

const canvasWidth = 750;
const canvasHeight = 1100;

const createWorldContainer = (width, height, color) => {
  const rectLeft = new GameRectangle(-20, height / 2, 40, height, { isStatic: true }, { color });
  const rectRight = new GameRectangle(20 + width, height / 2, 40, height, { isStatic: true }, { color });
  const rectBottom = new GameRectangle(width / 2, height + 20, width + 80, 40, { isStatic: true }, { color });
  return [rectLeft, rectRight, rectBottom];
}




Page({
  // 供pixi渲染的canvas
  canvas: null,
  context: null,
  // pixi Application
  pixiApplication: null,
  pixiOptions: null,
  engine: null,
  graphicsObjects: [],
  canvasWidth: 750,
  canvasHeight: 1200,
  circleType: 0,
  nextCircle: null,

  needRemoveObjs: [],

  data: {
    appOptions: {
      // 手动指定application的尺寸
      width: canvasWidth,
      height: canvasHeight,
      // 全屏-以窗口宽高作为application的尺寸，当设置此选项后，手动设置的width\height会失效
      //isFullScreen: true,
      // application是否背景透明
      // transparent: true,
      // 背景颜色
      backgroundColor: 0x00000,
      // 是否强制用2d上下文渲染，如果为false,则优先使用webgl渲染
      forceCanvas: false,
      transparent: true,
    },
    stopText: "游戏暂停",
  },
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
  },
  onPixiCanvasError(e) {
    console.log(e);
  },
  onPixiCanvasDidUnmount(e) {
    this.canvas = null;
    this.context = null;
    this.pixiApplication = null;
  },
  addWorldBounds(items) {
    const { stage } = this.pixiApplication;
    this.worldBounds = items;
    Composite.add(this.engine.world, items.map(item => item.body));
    items.forEach((graphics) => {
      stage.addChild(graphics.display);
    })
  },
  addGraphicsToWorld(items) {
    const { stage } = this.pixiApplication;
    this.graphicsObjects = this.graphicsObjects.concat(items);
    Composite.add(this.engine.world, items.map(item => item.body));
    items.forEach((graphics) => {
      stage.addChild(graphics.display);
    })
  },
  addOrReplaceNextCircle() {
    this.circleType = Math.floor(Math.random() * 4);
    const { stage } = this.pixiApplication;
    const { color, radius } = circleMap[this.circleType];
    if (this.nextCircle) {
      this.nextCircle.modifyStyle(canvasWidth / 2, radius + 10, radius, color);
    } else {
      const nextCircle = new GameCircle(canvasWidth / 2, radius + 10, radius, undefined, { color });
      this.nextCircle = nextCircle;
    }
    this.nextCircle.display.name = "nextCircle";
    stage.addChild(this.nextCircle.display);
  },
  onAppInit(e) {
    const { canvas, context, options, application } = e
    console.log('onAppInit', e);
    this.canvas = canvas;
    this.context = context;
    this.pixiApplication = application;
    this.pixiOptions = options;
    const { stage } = application;
    this.engine = Engine.create({
      gravity: { x: 0, y: 2 }
    });
    const worldContainers = createWorldContainer(canvasWidth, canvasHeight - 40, 0x646464);
    this.addWorldBounds(worldContainers);

    this.addRandomCircle(300, 0);

    application.renderer.plugins.interaction.on("touchstart", (event) => {
      console.log(event);
      this.addRandomCircle(event.data.global.x, event.data.global.y);
    })

    //根据物理引擎数据渲染页面
    application.ticker.add((delta) => {
      Engine.update(this.engine, 16.66);
      this.graphicsObjects.forEach(graphics => {
        graphics.update();
      });
    });

    Events.on(this.engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      pairs.forEach((pair) => {
        const propertyA = pair.bodyA.property;
        const propertyB = pair.bodyB.property;
        if (propertyA && propertyB && !pair.bodyA.isStatic && !pair.bodyB.isStatic) {
          //合成大西瓜
          if (propertyA.circleType === propertyB.circleType && propertyA.circleType < 5) {
            const newX = Math.floor((propertyA.body.position.x + propertyB.body.position.x) / 2);
            const newY = Math.floor((propertyA.body.position.y + propertyB.body.position.y) / 2);
            const newFruit = new FruitCircle(newX, newY, propertyA.circleType + 1);
            propertyA.removeSelf(stage, this.engine.world);
            propertyB.removeSelf(stage, this.engine.world);
            this.graphicsObjects = this.graphicsObjects.filter((item) => item !== propertyA && item !== propertyB);
            this.addGraphicsToWorld([newFruit]);
          }
        }
      })
    });
  },
  onReady() {

  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'Demo-Application',
      desc: 'Demo-Application',
      path: 'pages/application/index',
    };
  },
  handleGamePause() {
    if (!this.appStop) {
      this.pixiApplication.ticker.stop();
      this.setData({ stopText: "游戏继续" });
    }
    else {
      this.pixiApplication.ticker.start();
      this.setData({ stopText: "游戏暂停" });
    }
    this.appStop = !!this.appStop ^ true;
  },
  handleRestart() {
    this.pixiApplication.stage.removeChildren();
    Composite.clear(this.engine.world, false);
    const worldContainers = createWorldContainer(canvasWidth, canvasHeight - 40, 0x646464);
    this.addWorldBounds(worldContainers);
    this.addRandomCircle(300, 0);
  },
  addRandomCircle(x, y) {
    const circleA = new FruitCircle(x, y, this.circleType !== undefined ? this.circleType : 1);
    this.addGraphicsToWorld([circleA]);
    this.addOrReplaceNextCircle();
  },
  onTouchHandle(event) {
    const interaction = this.pixiApplication.renderer.plugins.interaction;
    let point = new Point();
    if (event.touches.length > 0) {
      interaction.mapPositionToPoint(point, event.touches[0].x, event.touches[0].y);
      this.addRandomCircle(point.x, point.y);
    }
  }
});
