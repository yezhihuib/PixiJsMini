import { Bodies,Composite } from "matter-js";
import { Graphics } from "@tbminiapp/pixi-miniprogram-engine";

//弹性
const restitution = 0.3;
//摩擦力
const friction = 0.01;
const frictionAir = 0.001;
const frictionStatic = 0.5;

const applyBodyConfig = (body) => {
  body.restitution = restitution;
  body.friction = friction;
  body.frictionAir = frictionAir;
  body.frictionStatic = frictionStatic;
  return body;
}

export class GameGraphics {

  body;

  display;

  displayStyle;

  update() {
    this.display.x = this.body.position.x;
    this.display.y = this.body.position.y;
    this.display.rotation = this.body.angle;
  }
}

export class GameRectangle extends GameGraphics {

  constructor(x, y, width, height, physicsOption, displayStyle) {
    super();
    const rectBody = Bodies.rectangle(x, y, width, height, physicsOption ? { ...physicsOption } : undefined);
    rectBody.property = this;
    this.body = applyBodyConfig(rectBody);
    const { color } = displayStyle;
    const rect = new Graphics();
    rect.beginFill(color);
    rect.drawRect(0, 0, width, height);
    rect.endFill();
    rect.pivot.x = width / 2;
    rect.pivot.y = height / 2;
    rect.x = x;
    rect.y = y;
    this.display = rect;
    this.style = displayStyle;
  }

}

export class GameCircle extends GameGraphics {

  radius;

  constructor(x, y, radius, physicsOption, displayStyle) {
    super();
    this.radius = radius;
    const circleBody = Bodies.circle(x, y, radius, physicsOption ? { ...physicsOption } : undefined);
    circleBody.property = this;
    this.body = applyBodyConfig(circleBody);
    const { color } = displayStyle;
    const circle = new Graphics();
    circle.beginFill(color);
    circle.drawCircle(0, 0, radius);
    circle.endFill();
    circle.pivot.x = 0;
    circle.pivot.y = 0;
    circle.x = x;
    circle.y = y;
    this.display = circle;
    this.style = displayStyle;
  }

  modifyStyle(x, y, newRadius,newColor) {
    const color = newColor ? newColor : this.displayStyle.color;
    const radius = newRadius ? newRadius : this.radius;
    this.display.clear();
    this.display.beginFill(color);
    this.display.drawCircle(0, 0, radius);
    this.display.endFill();
    this.display.x = x;
    this.display.y = y;
  }

  removeSelf(stage,world){
    stage.removeChild(this.display);
    Composite.remove(world,this.body);
  }
}