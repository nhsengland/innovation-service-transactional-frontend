export class TableModel<T = { [key: string]: string | number | boolean }> {

  dataSource: T[];
  visibleColumns: {
    [key: string]: { label: string, align?: string, orderable?: boolean }
  };

  totalRows: number;

  page: number;
  pageSize: number;
  pageSizeOptions: number[];

  orderBy: string;
  orderDir: '' | 'asc' | 'desc';

  constructor(data: Omit<Partial<TableModel<T>>, 'visibleColumns'> & { visibleColumns: { [key: string]: (string | { label: string; align?: string; orderable?: boolean; }) } }) {

    this.dataSource = data.dataSource || [];

    this.visibleColumns = {};
    for (const [key, item] of Object.entries(data.visibleColumns)) {
      if (typeof item === 'string') { this.visibleColumns[key] = { label: item }; }
      else { this.visibleColumns[key] = { label: item.label, align: item.align, orderable: item.orderable }; }
    }

    this.totalRows = data.totalRows || 0;

    this.page = data.page || 1;
    this.pageSize = data.pageSize || 10;
    this.pageSizeOptions = data.pageSizeOptions || [5, 10, 25];

    this.orderBy = data.orderBy || '';
    this.orderDir = data.orderDir || '';

  }

  setOrderBy(column: string): this {

    if (this.orderBy === column) {
      this.orderDir = (['', 'asc'].includes(this.orderDir) ? 'desc' : 'asc');
    } else {
      this.orderBy = column;
      this.orderDir = 'asc';
    }

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
    return this.visibleColumns[key].label;
  }

  getHeaderColumns(): { key: string, label: string, orderDir: 'asc' | 'desc' | 'none' }[] {
    return Object.entries(this.visibleColumns).map(([key, item]) => ({
      key,
      label: item.label,
      orderDir: (this.orderBy === key ? this.orderDir : 'none') as 'asc' | 'desc' | 'none'
    }));
  }


  getRecords(): T[] {
    return this.dataSource;
  }
  getTotalRowsNumber(): number {
    return this.totalRows;
  }


  getAPIQueryParams(): { take: number, skip: number, order?: { [key: string]: 'ASC' | 'DESC' } } {

    return {
      take: this.pageSize,
      skip: (this.page - 1) * this.pageSize,
      order: this.orderBy ? { [this.orderBy]: (this.orderDir.toUpperCase() || 'ASC') as 'ASC' | 'DESC' } : undefined
    };

  }

}
