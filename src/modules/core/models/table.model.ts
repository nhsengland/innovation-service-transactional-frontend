type AlignType = 'left' | 'right' | 'center';

type OrderDirectionType = 'none' | 'ascending' | 'descending';

export type APIQueryParamsType<F = { [key: string]: string | number | boolean | string[] }> = {
  take: number;
  skip: number;
  order?: { [key: string]: 'ASC' | 'DESC' };
  filters: F;
};

export class TableModel<T = { [key: string]: string | number | boolean }, F = APIQueryParamsType['filters']> {

  dataSource: T[];
  visibleColumns: {
    [key: string]: { label: string, align?: AlignType, orderable?: boolean }
  };

  totalRows: number;

  page: number;
  pageSize: number;
  pageSizeOptions: number[];

  orderBy: string;
  orderDir: OrderDirectionType;

  filters: null | F;

  // This variable is needed so angular lifecycle only refresh when something changes, when using this.getHeaderColumns() on a *ngFor.
  private cachedHeaderColumns: { key: string, label: string, align: string, orderable: boolean, orderDir: OrderDirectionType }[];

  constructor(data?: Omit<Partial<TableModel<T, F>>, 'visibleColumns'> & { visibleColumns?: { [key: string]: (string | { label: string; align?: AlignType; orderable?: boolean; }) } }) {

    this.dataSource = data?.dataSource || [];

    this.visibleColumns = {};
    this.setVisibleColumns(data?.visibleColumns || {});

    this.totalRows = data?.totalRows || 0;

    this.page = data?.page || 1;
    this.pageSize = data?.pageSize || 20;
    this.pageSizeOptions = data?.pageSizeOptions || [5, 10, 25];

    this.orderBy = data?.orderBy || '';
    this.orderDir = data?.orderDir || 'none';

    this.filters = data?.filters || null;

    this.cachedHeaderColumns = [];
    this.setHeaderColumns();

  }

  isSortable(): boolean {
    return this.orderBy !== '' ? true : false;
  }

  setVisibleColumns(visibleColumns: { [key: string]: (string | { label: string; align?: AlignType; orderable?: boolean; }) }): this {

    this.visibleColumns = {};

    for (const [key, item] of Object.entries(visibleColumns)) {
      if (typeof item === 'string') { this.visibleColumns[key] = { label: item }; }
      else { this.visibleColumns[key] = { label: item.label, align: item.align, orderable: item.orderable }; }
    }

    this.setHeaderColumns();

    return this;

  }

  setPage(page: number): this {
    this.page = page;
    return this;
  }

  setOrderBy(column: string, orderDir?: 'ascending' | 'descending'): this {

    if (orderDir) {
      this.orderBy = column;
      this.orderDir = orderDir;
      this.setHeaderColumns();
      return this;
    }

    if (this.orderBy === column) {
      this.orderDir = (['none', 'ascending'].includes(this.orderDir) ? 'descending' : 'ascending');
    } else {
      this.orderBy = column;
      this.orderDir = 'ascending';
    }

    this.setHeaderColumns();

    return this;
  }

  setFilters(filters: F): this {
    this.filters = filters;
    this.setHeaderColumns();
    return this;
  }

  setData(data: Array<T>, totalRows?: number): this {
    this.dataSource = data;
    this.totalRows = totalRows ? totalRows : data.length;
    return this;
  }

  clearData(): this {
    this.dataSource = [];
    this.totalRows = 0;
    this.page = 1;
    return this;
  }

  getColumnLabel(key: string): string {
    return this.visibleColumns[key]?.label || '';
  }

  getHeaderColumns(): { key: string, label: string, align: string, orderable: boolean, orderDir: OrderDirectionType }[] {
    return this.cachedHeaderColumns;

  }

  setHeaderColumns(): void {

    this.cachedHeaderColumns = Object.entries(this.visibleColumns).map(([key, item]) => ({
      key,
      label: item.label,
      align: `text-align-${item.align || 'left'}`, // Return the CSS class.
      orderable: item.orderable === true ? true : false,
      orderDir: (this.orderBy === key ? this.orderDir : 'none')
    }));

  }

  getRecords(): T[] { return this.dataSource; }

  getVisibleRowsNumber(): number { return this.dataSource.length; }
  getTotalRowsNumber(): number { return this.totalRows; }

  getAPIQueryParams(): APIQueryParamsType<F> {

    return {
      take: this.pageSize,
      skip: (this.page - 1) * this.pageSize,
      order: this.orderBy ? { [this.orderBy]: (['none', 'ascending'].includes(this.orderDir) ? 'ASC' : 'DESC') } : undefined,
      // TODO - maybe use this in the future
      // ...(this.filters && { filters: this.filters})
      filters: this.filters || ({} as F)
    };

  }

}
