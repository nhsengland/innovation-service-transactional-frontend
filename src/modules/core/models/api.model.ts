import { FullDict, KeysUnion } from '../helpers/types.helper';

export type Paginated<R extends string[]> = {
  take: number;
  skip: number;
  order?: { [key in R[number]]?: 'ASC' | 'DESC' };
};

export type APIListResponse<T extends object, S extends KeysUnion<T>> = {
  count: number;
  data: FullDict<T, S>[];
};
