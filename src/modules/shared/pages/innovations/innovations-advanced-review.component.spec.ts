import { FormControl, FormGroup } from '@angular/forms';

jest.mock('@app/base', () => ({
  CoreComponent: class CoreComponent {},
  CoreService: class CoreService {}
}));

jest.mock('@modules/stores', () => ({
  InnovationGroupedStatusEnum: {},
  InnovationSupportStatusEnum: {}
}));

import { PageInnovationsAdvancedReviewComponent } from './innovations-advanced-review.component';

describe('PageInnovationsAdvancedReviewComponent', () => {
  const createComponent = (search: string | undefined = undefined) => {
    const component = Object.create(PageInnovationsAdvancedReviewComponent.prototype) as PageInnovationsAdvancedReviewComponent;
    component.form = new FormGroup({
      search: new FormControl(''),
      category: new FormControl(false)
    });
    component.search = search;
    component.pageNumber = 2;
    component.filtersModel = { handleStateChanges: jest.fn() } as any;
    return component;
  };

  it('does not fetch innovations when a filter changes', () => {
    const component = createComponent();

    const getInnovationsListSpy = jest.spyOn(component, 'getInnovationsList').mockImplementation();

    component.form.get('category')?.setValue(true, { emitEvent: false });
    component.onFormChange();

    expect(getInnovationsListSpy).not.toHaveBeenCalled();
  });

  it('fetches the entered search when the search button is clicked', async () => {
    const component = createComponent();
    const search = 'INN-2608-0001-7';
    component.form.get('search')?.setValue(search, { emitEvent: false });

    const updateSearchQueryParamsSpy = jest.spyOn(component as any, 'updateSearchQueryParams').mockResolvedValue(true);
    const getInnovationsListSpy = jest.spyOn(component, 'getInnovationsList').mockImplementation();

    await component.onSearchClick();

    expect(updateSearchQueryParamsSpy).toHaveBeenCalledWith(search);
    expect(getInnovationsListSpy).toHaveBeenCalledTimes(1);
  });

  it('fetches the restored search after a reload', async () => {
    const search = 'INN-2608-0001-7';
    const component = createComponent(search);
    component.form.get('search')?.setValue(search, { emitEvent: false });

    const updateSearchQueryParamsSpy = jest.spyOn(component as any, 'updateSearchQueryParams');
    const getInnovationsListSpy = jest.spyOn(component, 'getInnovationsList').mockImplementation();

    await component.onSearchClick();

    expect(updateSearchQueryParamsSpy).not.toHaveBeenCalled();
    expect(getInnovationsListSpy).toHaveBeenCalledTimes(1);
  });

  it('fetches selected filters only when filters are applied', async () => {
    const component = createComponent('');
    component.form.get('category')?.setValue(true, { emitEvent: false });

    const getInnovationsListSpy = jest.spyOn(component, 'getInnovationsList').mockImplementation();

    await component.onSearchClick();

    expect(component.filtersModel.handleStateChanges).toHaveBeenCalledTimes(1);
    expect(getInnovationsListSpy).toHaveBeenCalledTimes(1);
  });
});
