import { TableModel } from './table.model';

type defaultDataSourceType = { c1: string, c2: string, c3: string };

const defaultInit: any = {
  visibleColumns: {
    c1: 'C1 label',
    c2: { label: 'C2 label' },
    c3: { label: 'C3 label', align: 'left', orderable: true }
  }
};

const emptyExpected = {
  dataSource: [],
  visibleColumns: {},
  totalRows: 0,
  page: 1,
  pageSize: 10,
  pageSizeOptions: [5, 10, 25],
  orderBy: '',
  orderDir: 'none',
  filters: null,
  cachedHeaderColumns: []
};

const defaultExpected = {
  dataSource: [],
  visibleColumns: { c1: { label: 'C1 label' }, c2: { label: 'C2 label' }, c3: { label: 'C3 label', align: 'left', orderable: true } },
  totalRows: 0,
  page: 1,
  pageSize: 10,
  pageSizeOptions: [5, 10, 25],
  orderBy: '',
  orderDir: 'none',
  filters: null,
  cachedHeaderColumns: [
    { key: 'c1', label: 'C1 label', align: 'text-align-left', orderable: false, orderDir: 'none' },
    { key: 'c2', label: 'C2 label', align: 'text-align-left', orderable: false, orderDir: 'none' },
    { key: 'c3', label: 'C3 label', align: 'text-align-left', orderable: true, orderDir: 'none' }
  ]
};


describe('Core/Models/TableModel', () => {

  let component: TableModel;

  it('should create TableModel with EMPTY information', () => {
    component = new TableModel<defaultDataSourceType>({});
    expect(component).toEqual(emptyExpected);
  });

  it('should create TableModel default instance', () => {
    component = new TableModel<defaultDataSourceType>(defaultInit);
    expect(component).toEqual(defaultExpected);
  });

  it('should set visibleColumns to empty', () => {
    const expected = { ...defaultExpected, visibleColumns: {}, cachedHeaderColumns: [] };
    component = new TableModel<defaultDataSourceType>(defaultInit);
    component.setVisibleColumns({});
    expect(component).toEqual(expected);
  });

  it('should set visibleColumns to new ones', () => {
    const expected = {
      ...defaultExpected,
      visibleColumns: { c1: { label: 'C1 new label' }, c2: { label: 'C2 new label' } },
      cachedHeaderColumns: [
        { key: 'c1', label: 'C1 new label', align: 'text-align-left', orderable: false, orderDir: 'none' },
        { key: 'c2', label: 'C2 new label', align: 'text-align-left', orderable: false, orderDir: 'none' }
      ]
    };
    component = new TableModel<defaultDataSourceType>(defaultInit);
    component.setVisibleColumns({ c1: 'C1 new label', c2: { label: 'C2 new label' } });
    expect(component).toEqual(expected);
  });

  it('should set orderBy and orderDir to a specific column', () => {
    const expected = {
      ...defaultExpected, orderBy: 'c1', orderDir: 'descending',
      cachedHeaderColumns: [
        { key: 'c1', label: 'C1 label', align: 'text-align-left', orderable: false, orderDir: 'descending' },
        { key: 'c2', label: 'C2 label', align: 'text-align-left', orderable: false, orderDir: 'none' },
        { key: 'c3', label: 'C3 label', align: 'text-align-left', orderable: true, orderDir: 'none' }
      ]
    };
    component = new TableModel<defaultDataSourceType>(defaultInit);
    component.setOrderBy('c1', 'descending');
    expect(component).toEqual(expected);
  });

  it('should toggle orderBy of currently ordered column when it is ascending', () => {
    const expected = {
      ...defaultExpected, orderBy: 'c1', orderDir: 'descending',
      cachedHeaderColumns: [
        { key: 'c1', label: 'C1 label', align: 'text-align-left', orderable: false, orderDir: 'descending' },
        { key: 'c2', label: 'C2 label', align: 'text-align-left', orderable: false, orderDir: 'none' },
        { key: 'c3', label: 'C3 label', align: 'text-align-left', orderable: true, orderDir: 'none' }
      ]
    };
    component = new TableModel<defaultDataSourceType>({ ...defaultInit, ...{ orderBy: 'c1', orderDir: 'ascending' } });
    component.setOrderBy('c1');
    expect(component).toEqual(expected);
  });

  it('should toggle orderBy of currently ordered column when it is descending', () => {
    const expected = {
      ...defaultExpected, orderBy: 'c1', orderDir: 'ascending',
      cachedHeaderColumns: [
        { key: 'c1', label: 'C1 label', align: 'text-align-left', orderable: false, orderDir: 'ascending' },
        { key: 'c2', label: 'C2 label', align: 'text-align-left', orderable: false, orderDir: 'none' },
        { key: 'c3', label: 'C3 label', align: 'text-align-left', orderable: true, orderDir: 'none' }
      ]
    };
    component = new TableModel<defaultDataSourceType>({ ...defaultInit, ...{ orderBy: 'c1', orderDir: 'descending' } });
    component.setOrderBy('c1');
    expect(component).toEqual(expected);
  });

  it('should set orderBy to DESC when ordering by the same column', () => {
    const expected = {
      ...defaultExpected, orderBy: 'c1', orderDir: 'descending',
      cachedHeaderColumns: [
        { key: 'c1', label: 'C1 label', align: 'text-align-left', orderable: false, orderDir: 'descending' },
        { key: 'c2', label: 'C2 label', align: 'text-align-left', orderable: false, orderDir: 'none' },
        { key: 'c3', label: 'C3 label', align: 'text-align-left', orderable: true, orderDir: 'none' }
      ]
    };
    component = new TableModel<defaultDataSourceType>({ ...defaultInit, ...{ orderBy: 'c1' } });
    component.setOrderBy('c1');
    expect(component).toEqual(expected);
  });


  it('should set filters', () => {
    const expected = { ...defaultExpected, ...{ filters: { status: 'enabled' } } };
    component = new TableModel<defaultDataSourceType>(defaultInit);
    component.setFilters({ status: 'enabled' });
    expect(component).toEqual(expected);
  });

  it('should set data without totalRows', () => {
    const expected = { ...defaultExpected, ...{ dataSource: [{ c1: 'value', c2: 'value', c3: 'value' }], totalRows: 1 } };
    component = new TableModel<defaultDataSourceType>(defaultInit);
    component.setData([{ c1: 'value', c2: 'value', c3: 'value' }]);
    expect(component).toEqual(expected);
    expect(component.getRecords()).toEqual(expected.dataSource);
    expect(component.getTotalRowsNumber()).toBe(expected.totalRows);
  });

  it('should set data with totalRows', () => {
    const expected = { ...defaultExpected, ...{ dataSource: [{ c1: 'value', c2: 'value', c3: 'value' }], totalRows: 50 } };
    component = new TableModel<defaultDataSourceType>(defaultInit);
    component.setData([{ c1: 'value', c2: 'value', c3: 'value' }], 50);
    expect(component).toEqual(expected);
    expect(component.getRecords()).toEqual(expected.dataSource);
    expect(component.getTotalRowsNumber()).toBe(expected.totalRows);
  });

  it('should clear data', () => {
    const expected = defaultExpected;
    component = new TableModel<defaultDataSourceType>(defaultInit);
    component.setData([{ c1: 'value', c2: 'value', c3: 'value' }]);
    component.clearData();
    expect(component).toEqual(expected);
  });

  it('should run getColumnLabel() that dont exists', () => {
    const expected = '';
    component = new TableModel<defaultDataSourceType>(defaultInit);
    expect(component.getColumnLabel('columnsThatDontExists')).toBe(expected);
  });

  it('should run getColumnLabel() that exists', () => {
    const expected = 'C1 label';
    component = new TableModel<defaultDataSourceType>(defaultInit);
    expect(component.getColumnLabel('c1')).toBe(expected);
  });

  it('should run getHeaderColumns()', () => {
    const expected = [
      { key: 'c1', label: 'C1 label', align: 'text-align-left', orderable: false, orderDir: 'none' },
      { key: 'c2', label: 'C2 label', align: 'text-align-left', orderable: false, orderDir: 'none' },
      { key: 'c3', label: 'C3 label', align: 'text-align-left', orderable: true, orderDir: 'ascending' }
    ];
    component = new TableModel<defaultDataSourceType>(defaultInit);
    component.setOrderBy('c3');
    expect(component.getHeaderColumns()).toEqual(expected);
  });

  it('should run getAPIQueryParams() with defaults', () => {
    const expected = { take: 10, skip: 0, filters: {} };
    component = new TableModel<defaultDataSourceType>(defaultInit);
    expect(component.getAPIQueryParams()).toEqual(expected);
  });

  it('should run getAPIQueryParams() with orderBy defined and orderDir ascending', () => {
    const expected = { take: 10, skip: 0, order: { c1: 'ASC' }, filters: {} };
    component = new TableModel<defaultDataSourceType>({ ...defaultInit, ...{ orderBy: 'c1', orderDir: 'ascending' } });
    expect(component.getAPIQueryParams()).toEqual(expected);
  });

  it('should run getAPIQueryParams() with orderBy defined and orderDir descending', () => {
    const expected = { take: 10, skip: 0, order: { c1: 'DESC' }, filters: {} };
    component = new TableModel<defaultDataSourceType>({ ...defaultInit, ...{ orderBy: 'c1', orderDir: 'descending' } });
    expect(component.getAPIQueryParams()).toEqual(expected);
  });

  it('should run getAPIQueryParams() with orderBy, orderDir and filters defined', () => {
    const expected = { take: 10, skip: 0, order: { c1: 'ASC' }, filters: { status: 'enabled' } };
    component = new TableModel<defaultDataSourceType>(defaultInit);
    component.setOrderBy('c1');
    component.setFilters({ status: 'enabled' });
    expect(component.getAPIQueryParams()).toEqual(expected);
  });

});
