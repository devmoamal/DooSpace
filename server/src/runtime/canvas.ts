export class Canvas {
  public pixels: string[][];

  constructor(initialPixels?: string[][]) {
    this.pixels = initialPixels || Array.from({ length: 24 }, () =>
      Array.from({ length: 24 }, () => "white"),
    );
  }

  set(x: number, y: number, color: string) {
    if (x >= 0 && x < 24 && y >= 0 && y < 24) {
      this.pixels[y][x] = color;
    }
  }

  fill(color: string) {
    for (let y = 0; y < 24; y++) {
      for (let x = 0; x < 24; x++) {
        this.pixels[y][x] = color;
      }
    }
  }

  clear() {
    this.fill("white");
  }

  rect(x: number, y: number, w: number, h: number, color: string) {
    for (let i = y; i < y + h; i++) {
      for (let j = x; j < x + w; j++) {
        this.set(j, i, color);
      }
    }
  }

  getPixels() {
    return this.pixels;
  }
}
