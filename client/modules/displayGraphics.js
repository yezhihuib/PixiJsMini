import { Graphics, Point } from "@tbminiapp/pixi-miniprogram-engine";
export class DisplayGraphics {

  static drawLines({ width, color, alpha }, points) {
    const lines = new Graphics();
    lines.beginFill(color);
    lines.lineStyle(width, color, alpha);
    lines.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      lines.lineTo(points[i].x, points[i].y);
    }
    lines.endFill();
    return lines;
  }
}