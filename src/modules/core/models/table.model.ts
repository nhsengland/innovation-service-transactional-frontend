import { UtilsHelper } from '../helpers/utils.helper';

type AlignType = 'left' | 'right' | 'center';

type OrderDirectionType = 'none' | 'ascending' | 'descending';

export type APIQueryParamsType<F = Record<string, string | number | boolean | string[]>> = {
  take: number;
  skip: number;
  order?: Record<string, 'ASC' | 'DESC'>;
  filters: Partial<F>;
};

export class TableModel<T = Record<string, string | number | boolean>, F = APIQueryParamsType['filters']> {
  dataSource: T[];
  visibleColumns: Record<string, { label: string; align?: AlignType; orderable?: boolean }>;

  totalRows: number;

  page: number;
  pageSize: number;
  pageSizeOptions: number[];

  orderBy: string;
  orderDir: OrderDirectionType;

  filters: Partial<F>;

  // This variable is needed so angular lifecycle only refresh when something changes, when using this.getHeaderColumns() on a *ngFor.
  private cachedHeaderColumns: {
    key: string;
    label: string;
    align: string;
    orderable: boolean;
    orderDir: OrderDirectionType;
  }[];

  constructor(
    data?: Omit<Partial<TableModel<T, F>>, 'visibleColumns'> & {
      visibleColumns?: Record<string, string | { label: string; align?: AlignType; orderable?: boolean }>;
    }
  ) {
    this.dataSource = data?.dataSource || [];

    this.visibleColumns = {};
    this.setVisibleColumns(data?.visibleColumns || {});

    this.totalRows = data?.totalRows || 0;

    this.page = data?.page || 1;
    this.pageSize = data?.pageSize || 20;
    this.pageSizeOptions = data?.pageSizeOptions || [5, 10, 25];

    this.orderBy = data?.orderBy || '';
    this.orderDir = data?.orderDir || 'none';

    this.filters = data?.filters || {};

    this.cachedHeaderColumns = [];
    this.setHeaderColumns();
  }

  isSortable(): boolean {
    return this.orderBy !== '' ? true : false;
    // TODO: Maybe the validation below is more accurate.
    // A table is sortable when any column can be sorted, and not when an API call request information sorted by something (ex: the first request).
    // Didn't applied yet for concerns around performance.
    // return Object.entries(this.visibleColumns).some(([_key, value]) => value.orderable);
  }

  setFocusOnSortedColumnHeader(column: string): void {
    setTimeout(() => {
      // Await for the html injection if needed.
      const button = document.querySelector('button#' + column) as HTMLButtonElement;
      const caption = button.closest('table')?.firstChild as HTMLTableCaptionElement;
      caption.setAttribute('aria-hidden', 'true');
      if (button && caption) {
        button.setAttribute('tabIndex', '-1');
        button.focus();
        button.addEventListener('blur', e => {
          e.preventDefault();
          button.removeAttribute('tabIndex');
        });
        button.addEventListener('keyup', e => {
          caption.setAttribute('aria-hidden', 'false');
        });
      }
    });
  }

  setVisibleColumns(
    visibleColumns: Record<string, string | { label: string; align?: AlignType; orderable?: boolean }>
  ): this {
    this.visibleColumns = {};

    for (const [key, item] of Object.entries(visibleColumns)) {
      if (typeof item === 'string') {
        this.visibleColumns[key] = { label: item };
      } else {
        this.visibleColumns[key] = { label: item.label, align: item.align, orderable: item.orderable };
      }
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
      this.orderDir = ['none', 'ascending'].includes(this.orderDir) ? 'descending' : 'ascending';
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

  setData(data: T[], totalRows?: number): this {
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

  getHeaderColumns(): {
    key: string;
    label: string;
    align: string;
    orderable: boolean;
    orderDir: OrderDirectionType;
  }[] {
    return this.cachedHeaderColumns;
  }

  setHeaderColumns(): void {
    this.cachedHeaderColumns = Object.entries(this.visibleColumns).map(([key, item]) => ({
      key,
      label: item.label,
      align: `text-align-${item.align || 'left'}`, // Return the CSS class.
      orderable: item.orderable === true ? true : false,
      orderDir: this.orderBy === key ? this.orderDir : 'none'
    }));
  }

  getRecords(): T[] {
    return this.dataSource;
  }

  getVisibleRowsNumber(): number {
    return this.dataSource.length;
  }
  getTotalRowsNumber(): number {
    return this.totalRows;
  }

  /**
   * returns the query parameters to be used in the API call
   * @param param - optional param to keep empty filters otherwise they are stripped by default
   */
  getAPIQueryParams(param?: { keepEmptyFilters: boolean }): APIQueryParamsType<F> {
    return {
      take: this.pageSize,
      skip: (this.page - 1) * this.pageSize,
      order: this.orderBy
        ? { [this.orderBy]: ['none', 'ascending'].includes(this.orderDir) ? 'ASC' : 'DESC' }
        : undefined,
      // TODO - maybe use this in the future
      // ...(this.filters && { filters: this.filters})
      filters: param?.keepEmptyFilters
        ? this.filters
        : Object.entries(this.filters).reduce((acc, [key, value]) => {
            // Maybe it should only be undefined but think we never filter by null so we should strip it
            if (value != null && !UtilsHelper.isEmpty(value)) {
              acc[key as keyof F] = value;
            }
            return acc;
          }, {} as any) // this has any is required unless we change the type of filters to extend instead of default but we aren't following that restriction code wise having many string|null that don't match the type
    };
  }
}
