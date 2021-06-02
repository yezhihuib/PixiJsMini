import { GameCircle, GameTextureCircle } from "./gameGraphics";
import { loader } from "@tbminiapp/pixi-miniprogram-engine";
import { fruitPicMap } from "/contants/fruitPicMap";

export const circleMap = {
  0: { radius: 20, picName: "1" },
  1: { radius: 30, picName: "2" },
  2: { radius: 50, picName: "3" },
  3: { radius: 70, picName: "4" },
  4: { radius: 90, picName: "5" },
  5: { radius: 120, picName: "6" },
  6: { radius: 150, picName: "7" },
  7: { radius: 190, picName: "8" },
  8: { radius: 190, picName: "9" },
}

export class FruitCircle extends GameTextureCircle {

  circleType;

  constructor(x, y, circleType) {
    const { radius, picName } = circleMap[circleType];
    const texture = loader.resources[fruitPicMap[picName]].texture;
    super(x, y, radius, undefined, texture);
    this.circleType = circleType;
    this.body.property = this;
  }
}