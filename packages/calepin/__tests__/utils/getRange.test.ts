const getRange = (paths: [number[]]) => {
  let reverse = false;

  return paths;
};

test("no reverse range", () => {
  const paths = [
    [1, 0],
    [1, 1],
    [2, 2]
  ];

  expect(getRange(paths)).toBe(paths);
});
