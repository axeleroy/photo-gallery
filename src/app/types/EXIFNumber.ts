export interface EXIFNumber {
  denominator: number;
  numerator: number;

  toString(radix?: number);
  valueOf();
}
