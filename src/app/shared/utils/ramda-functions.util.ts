// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/**
 * rambda vs ramda
 * rambda is simply faster than ramda.
 * So whatever the function you find in rambda use it, otherwise use ramda
 * If you list in RB then if there is no function, then typescript will complain for you.
 * https://github.com/selfrefactor/rambda#benchmark
 */
// tslint:disable-next-line:import-blacklist
import * as RB from 'rambda';
// tslint:disable-next-line:import-blacklist
import * as R from 'ramda';
import { roundTo } from './math.util';

export const {
  and,
  or,
  lensProp,
  lensPath,
  view,
  add,
  set,
  over,
  identity,
  forEach,
  compose,
  when,
  anyPass,
  not,
  propEq,
  join,
  keys,
  ifElse,
  inc,
  dec,
  intersection,
  contains,
  difference,
  differenceWith,
  curry,
  reverse,
  propOr,
  uniq,
  uniqBy,
  pickBy,
  comparator,
  gt,
  gte,
  lt,
  sort,
  eqProps,
  groupWith,
  merge,
  indexBy,
  chain,
  map,
  partition,
  pipe,
  applySpec,
  juxt,
  mergeAll,
  props,
  sortWith,
  ascend,
  findIndex,
  remove,
  symmetricDifference,
  without,
} = R;

export const {
  isNil,
  is,
  prop,
  path,
  pathOr,
  equals,
  has,
  isEmpty,
  both,
  either,
  multiply,
  toPairs,
  type,
  find,
  complement,
  flatten,
  defaultTo,
  range,
  groupBy,
  toLower,
  toUpper,
  head,
  drop,
  concat,
  sum,
  sortBy,
  filter,
  reduce,
  replace,
  flip,
  pluck,
  adjust,
  negate,
  assoc,
  dissoc,
  pick,
  omit,
  values,
  // tslint:disable-next-line: variable-name
  any,
  match,
  split,
} = RB;

export const createLensProp = (val: string) => {
  return lensProp(val);
};

export const isStrNumber = (val: string): boolean => {
  return /^\d+$/.test(val);
};

const isStringNullOrNil = (val: string): boolean =>
  equals('null', val) || equals('undefined', val) || isNil(val);
export const isNilOrEmpty = either(isStringNullOrNil, isEmpty);
export const propOrZero = propOr(0);

export const toNumber = (val: string): number => {
  return isNilOrEmpty(val) ? null : +val;
};

export const sumOfArray = (numbers: number[], roundToDecimal = 2): number =>
  roundTo(sum(numbers), roundToDecimal);

export const uniqBySpeciesId = uniqBy(prop('speciesId'));

// https://github.com/ramda/ramda/wiki/Cookbook#sql-style-joins
// tslint:disable-next-line: max-func-args
export const joinInner = curry((field1, field2, table1, table2) => {
  const indexed = indexBy(field1, table1);

  return chain((t2row) => {
    const corresponding = indexed[field2(t2row)];

    return corresponding ? [merge(t2row, corresponding)] : [];
  }, table2);
});

// tslint:disable-next-line: max-func-args
export const joinRight = R.curry((mapper1, mapper2, t1, t2) => {
  const indexed = R.indexBy(mapper1, t1);

  return t2.map((t2row) => R.merge(t2row, indexed[mapper2(t2row)]));
});

// tslint:disable-next-line: max-func-args
export const joinOuter = curry((field1, field2, table1, table2) => {
  const o1 = indexBy(field1, table1);
  const o2 = indexBy(field2, table2);

  return values(R.mergeWith(merge, o1, o2));
});

// tslint:disable-next-line: max-func-args
export const joinLeft = R.curry((f1, f2, t1, t2) => joinRight(f2, f1, t2, t1));

// tslint:disable-next-line:max-line-length
// https://github.com/ramda/ramda/wiki/Cookbook#sort-a-list-by-array-of-props-if-first-prop-equivalent-sort-by-second-etc
const firstTruthy = ([headItem, ...tailItem]) =>
  reduce(either, headItem, tailItem);
const makeComparator = (propName: string) =>
  comparator((a, b) => lt(prop(propName, a), prop(propName, b)));
export const sortByProps = curry((args: string[], list) =>
  sort(firstTruthy(map(makeComparator, args)), list),
);
export const capitalise = (text: string) => toUpper(head(text)) + drop(1, text);
export const concatFlipped = flip(concat);
export const notEquals = complement(equals);
export const isNotNilOrEmpty = complement(isNilOrEmpty);
