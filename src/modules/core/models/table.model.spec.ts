import { TableModel } from './table.model';

type defaultDataSource = { c1: string, c2: string, c3: string };

const defaultInit: any = {
  visibleColumns: {
    c1: 'C1 label',
    c2: { label: 'C2 label' },
    c3: { label: 'C3 label', align: 'left', orderable: true }
  }
};

const defaultExpected = {
  dataSource: [],
  visibleColumns: { c1: { label: 'C1 label' }, c2: { label: 'C2 label' }, c3: { label: 'C3 label', align: 'left', orderable: true } },
  totalRows: 0,
  page: 1,
  pageSize: 10,
  pageSizeOptions: [5, 10, 25],
  orderBy: '',
  orderDir: '',
  filters: {}
};


describe('TableModel', () => {

  let component: TableModel;

  it('should create TableModel default instance', () => {
    const expected = defaultExpected;
    component = new TableModel<defaultDataSource>(defaultInit);
    expect(component).toEqual(expected);
  });

  it('should set orderBy when no ordered column is set', () => {
    const expected = { ...defaultExpected, ...{ orderBy: 'c1', orderDir: 'asc' } };
    component = new TableModel<defaultDataSource>(defaultInit);
    component.setOrderBy('c1');
    expect(component).toEqual(expected);
  });

  it('should set orderBy to DESC when ordering by the same column', () => {
    const expected = { ...defaultExpected, ...{ orderBy: 'c1', orderDir: 'desc' } };
    component = new TableModel<defaultDataSource>({ ...defaultInit, ...{ orderBy: 'c1' } });
    component.setOrderBy('c1');
    expect(component).toEqual(expected);
  });

  it('should set filters', () => {
    const expected = { ...defaultExpected, ...{ filters: { status: 'enabled' } } };
    component = new TableModel<defaultDataSource>(defaultInit);
    component.setFilters({ status: 'enabled' });
    expect(component).toEqual(expected);
  });

  it('should set data', () => {
    const expected = { ...defaultExpected, ...{ dataSource: [{ c1: 'value', c2: 'value', c3: 'value' }], totalRows: 1 } };
    component = new TableModel<defaultDataSource>(defaultInit);
    component.setData([{ c1: 'value', c2: 'value', c3: 'value' }]);
    expect(component).toEqual(expected);
    expect(component.getRecords()).toEqual(expected.dataSource);
    expect(component.getTotalRowsNumber()).toBe(1);
  });

  it('should clear data', () => {
    const expected = defaultExpected;
    component = new TableModel<defaultDataSource>(defaultInit);
    component.setData([{ c1: 'value', c2: 'value', c3: 'value' }]);
    component.clearData();
    expect(component).toEqual(expected);
  });

  it('should run getColumnLabel()', () => {
    const expected = 'C1 label';
    component = new TableModel<defaultDataSource>(defaultInit);
    expect(component.getColumnLabel('c1')).toBe(expected);
  });

  it('should run getHeaderColumns()', () => {
    const expected = [
      { key: 'c1', label: 'C1 label', align: 'text-align-left', orderable: false, orderDir: 'none' },
      { key: 'c2', label: 'C2 label', align: 'text-align-left', orderable: false, orderDir: 'none' },
      { key: 'c3', label: 'C3 label', align: 'text-align-left', orderable: true, orderDir: 'asc' }
    ];
    component = new TableModel<defaultDataSource>(defaultInit);
    component.setOrderBy('c3');
    expect(component.getHeaderColumns()).toEqual(expected);
  });

  it('should run getAPIQueryParams() with defaults', () => {
    const expected = { take: 10, skip: 0 };
    component = new TableModel<defaultDataSource>(defaultInit);
    // component.setOrderBy('c3');
    expect(component.getAPIQueryParams()).toEqual(expected);
  });

  it('should run getAPIQueryParams() with orderBy defined, but orderDir undefined', () => {
    const expected = { take: 10, skip: 0, order: { c1: 'ASC' } };
    component = new TableModel<defaultDataSource>({ ...defaultInit, ...{ orderBy: 'c1' } });
    expect(component.getAPIQueryParams()).toEqual(expected);
  });

  it('should run getAPIQueryParams() with orderBy and orderDir defined', () => {
    const expected = { take: 10, skip: 0, order: { c1: 'ASC' } };
    component = new TableModel<defaultDataSource>(defaultInit);
    component.setOrderBy('c1');
    expect(component.getAPIQueryParams()).toEqual(expected);
  });

});
