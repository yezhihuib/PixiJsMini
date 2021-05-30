import { GameCircle } from "./gameGraphics";

export const circleMap = {
  0: { radius: 20, color: 0x333399 },
  1: { radius: 30, color: 0xFFFF00 },
  2: { radius: 50, color: 0x0099FF },
  3: { radius: 80, color: 0xA0522D },
  4: { radius: 110, color: 0x009933 },
  5: { radius: 160, color: 0x006400 },
}

export class FruitCircle extends GameCircle {

  circleType;

  constructor(x, y, circleType) {
    const { color, radius } = circleMap[circleType];
    super(x, y, radius, undefined, { color });
    this.circleType = circleType;
    this.body.property = this;
  }
}