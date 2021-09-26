export const arePathsEquals = (path1: number[], path2: number[]) => {
  let areEquals = path1.length === path2.length;
  let n = 0;
  let length = Math.max(path1.length, path2.length);

  while (areEquals && n <= length) {
    areEquals = path1[n] === path2[n];
    n++;
  }
  return areEquals;
};
