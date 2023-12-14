type KeysUnionWithUndefined<T, Cache extends string = ''> = T extends PropertyKey
  ? Cache
  : keyof T extends object
    ? Cache
    : {
        [P in keyof T]: P extends string
          ? Cache extends ''
            ? KeysUnionWithUndefined<T[P], `${P}`>
            : Cache | KeysUnionWithUndefined<T[P], `${Cache}.${P}`>
          : never;
      }[keyof T];
export type KeysUnion<T> = Exclude<KeysUnionWithUndefined<T>, undefined> extends infer X
  ? X extends string // only interested in string keys otherwise it could be numbers if there's an array for example
    ? X
    : never
  : never;

export type FullDict<T extends object, S extends KeysUnion<T>> = {
  [K in S as K extends `${infer U}.${infer _R}` ? U : S]: K extends `${infer K}.${infer R}`
    ? K extends keyof T
      ? {
          [key in R]: R extends keyof T[K] ? T[K][R] : never;
        }
      : never
    : S extends keyof T
      ? T[S]
      : never;
};
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type RemoveDottedKeys<T extends object> = {
  [K in keyof T as K extends `${infer _K}.${infer _R}` ? never : K]: UnionToIntersection<T[K]>;
};
