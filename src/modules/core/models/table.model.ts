type AlignType = 'left' | 'right' | 'center';

type OrderDirectionType = 'none' | 'ascending' | 'descending';

export type APIQueryParamsType = {
  take: number;
  skip: number;
  order?: { [key: string]: 'ASC' | 'DESC' };
  filters: { [key: string]: string | number | boolean | string[] };
};

export class TableModel<T = { [key: string]: string | number | boolean }> {

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

  filters: { [key: string]: string | number | boolean | string[] };

  // This variable is needed so angular lifecycle only refresh when something changes, when using this.getHeaderColumns() on a *ngFor.
  private cachedHeaderColumns: { key: string, label: string, align: string, orderable: boolean, orderDir: OrderDirectionType }[];

  constructor(data: Omit<Partial<TableModel<T>>, 'visibleColumns'> & { visibleColumns?: { [key: string]: (string | { label: string; align?: AlignType; orderable?: boolean; }) } }) {

    this.dataSource = data.dataSource || [];

    this.visibleColumns = {};
    this.setVisibleColumns(data.visibleColumns || {});

    this.totalRows = data.totalRows || 0;

    this.page = data.page || 1;
    this.pageSize = data.pageSize || 10;
    this.pageSizeOptions = data.pageSizeOptions || [5, 10, 25];

    this.orderBy = data.orderBy || '';
    this.orderDir = data.orderDir || 'none';

    this.filters = data.filters || {};

    this.cachedHeaderColumns = [];
    this.setHeaderColumns();

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

  setFilters(filters: { [key: string]: string | number | boolean | string[] }): this {
    Object.entries(filters).forEach(([key, item]) => this.filters[key] = item);
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

  getTotalRowsNumber(): number { return this.totalRows; }

  getAPIQueryParams(): APIQueryParamsType {

    return {
      take: this.pageSize,
      skip: (this.page - 1) * this.pageSize,
      order: this.orderBy ? { [this.orderBy]: (['none', 'ascending'].includes(this.orderDir) ? 'ASC' : 'DESC') } : undefined,
      filters: Object.keys(this.filters).length > 0 ? this.filters : {}
    };

  }

}
