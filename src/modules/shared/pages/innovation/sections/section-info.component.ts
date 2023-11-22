import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CoreComponent } from '@app/base';
import { ContextInnovationType } from '@app/base/types';

import { WizardSummaryType } from '@modules/shared/forms';
import { InnovationDocumentsListOutDTO } from '@modules/shared/services/innovation-documents.service';
import { getInnovationRecordConfig } from '@modules/stores/innovation/innovation-record/ir-versions.config';


@Component({
  selector: 'shared-pages-innovation-section-info',
  templateUrl: './section-info.component.html'
})
export class PageInnovationSectionInfoComponent extends CoreComponent implements OnInit {

  innovation: ContextInnovationType | undefined;
  sectionId: string = '';

  sectionSubmittedText: string = '';

  sectionsIdsList: string[];
  summaryList: WizardSummaryType[] = [];
  evidencesList: WizardSummaryType[] = [];
  documentsList: InnovationDocumentsListOutDTO['data'] = [];

  previousSection: null | { id: string, title: string } = null;
  nextSection: null | { id: string, title: string } = null;

  baseUrl: string;

  paramSubscription: Subscription = new Subscription();

  sectionIdentification: {
    group: {
        number: number;
        title: string;
    };
    section: {
        number: number;
        title: string;
    }
  } | null = null;


  constructor(
    private activatedRoute: ActivatedRoute,
  ) {

    super();

    this.sectionId = this.activatedRoute.snapshot.params.sectionId;
    this.innovation = this.stores.context.getInnovation();

    this.sectionsIdsList = getInnovationRecordConfig().flatMap(sectionsGroup => sectionsGroup.sections.map(section => section.id));

    this.baseUrl = `${this.stores.authentication.userUrlBasePath()}/innovations/${this.innovation.id}`;

  }

  ngOnInit(): void {
    
    this.paramSubscription = this.activatedRoute.params.subscribe(() => {
      this.initializePage();
    });

    this.initializePage();

    // This router subscription is needed for the button to go to the next step.
    // As is it the same component, we can't use the routerLink directive alone.
    this.subscriptions.push(
      this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(e => this.initializePage())
    );

  }

  private getPreviousAndNextPagination(): void {

    const currentSectionIndex = this.sectionsIdsList.indexOf(this.sectionId);
    const previousSectionId = this.sectionsIdsList[currentSectionIndex - 1] || null;
    const nextSectionId = this.sectionsIdsList[currentSectionIndex + 1] || null;

    if (previousSectionId) {
      const previousSection = this.stores.innovation.getInnovationRecordSectionIdentification(previousSectionId);
      this.previousSection = { id: previousSectionId, title: previousSection ? `${previousSection.group.number}.${previousSection.section.number} ${previousSection.section.title}` : '' };
    } else {
      this.previousSection = null;
    }

    if (nextSectionId) {
      const nextSection = this.stores.innovation.getInnovationRecordSectionIdentification(nextSectionId);
      this.nextSection = { id: nextSectionId, title: nextSection ? `${nextSection.group.number}.${nextSection.section.number} ${nextSection.section.title}` : '' };
    } else {
      this.nextSection = null;
    }

  }

  private initializePage(): void {
    
    this.sectionId = this.activatedRoute.snapshot.params.sectionId;
    this.sectionIdentification = this.stores.innovation.getInnovationRecordSectionIdentification(this.sectionId);
    this.sectionSubmittedText =  this.sectionIdentification ? `You have submitted section ${this.sectionIdentification?.group.number}.${this.sectionIdentification?.section.number} '${this.sectionIdentification?.section.title}'` : '';
    
    this.setPageTitle(this.translate(this.sectionIdentification!.section.title), { hint: this.sectionIdentification ? `${this.sectionIdentification.group.number}. ${this.sectionIdentification.group.title}` : '' });
    this.setBackLink('Innovation Record', `${this.baseUrl}/record`);

    this.getPreviousAndNextPagination();

  }

}
