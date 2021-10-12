import { customAlphabet } from "nanoid";
//@ts-ignore
import { alphanumeric } from "nanoid-dictionary";

export const nanoid = (size: number = 10) => {
  return customAlphabet(alphanumeric, size)();
};
