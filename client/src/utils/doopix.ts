export const generateDooAvatar = (id: number): string[][] => {
  const seed = id * 1337; // Shift seed
  const matrix: string[][] = [];

  // Colors defined in the "App Style" palette
  const colors = ["sage", "sage-muted", "transparent"];

  for (let y = 0; y < 5; y++) {
    const row: string[] = [];
    for (let x = 0; x < 5; x++) {
      // Deterministic "random" based on seed + coordinates
      const val = Math.abs(Math.sin(seed + x * 0.5 + y * 0.8)) * 100;

      if (val > 70) {
        row.push("sage");
      } else if (val > 40) {
        row.push("sage-muted");
      } else {
        row.push("transparent");
      }
    }
    matrix.push(row);
  }

  return matrix;
};
