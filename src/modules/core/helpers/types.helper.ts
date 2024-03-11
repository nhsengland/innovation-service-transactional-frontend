type KeysUnionWithUndefined<T, Cache extends string = ''> = T extends boolean
  ? Cache
  : T extends unknown[]
    ? KeysUnionWithUndefined<T[0], `${Cache}`>
    : T extends PropertyKey
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

export type FullDictTemp<T extends object, S extends KeysUnion<T>> = {
  [K in S as K extends `${infer U}.${infer _R}` ? U : K]: K extends `${infer K}.${infer R}`
    ? K extends keyof T
      ? Extract<T[K], null> extends never
        ? {
            [key in R]: R extends keyof NonNullable<T[K]> ? NonNullable<T[K]>[R] : never;
          }
        :
            | null
            | {
                [key in R]: R extends keyof NonNullable<T[K]> ? NonNullable<T[K]>[R] : never;
              }
      : never
    : S extends keyof T
      ? T[K]
      : never;
};

export type FullDict<T extends object, S extends KeysUnion<T>> = {
  [k in keyof FullDictTemp<T, S>]: FullDictTemp<T, S>[k] extends object
    ? UnionToIntersection<NonNullable<FullDictTemp<T, S>[k]>>
    : Extract<FullDictTemp<T, S>[k], null> extends never
      ? FullDictTemp<T, S>[k]
      : null | UnionToIntersection<NonNullable<FullDictTemp<T, S>[k]>>;
};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
