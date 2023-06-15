import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { CoreService } from '@app/base';
import { UserRoleEnum } from '@app/base/enums';
import { FileUploadType } from '@app/base/forms';
import { UrlModel } from '@app/base/models';
import { APIQueryParamsType, DateISOType } from '@app/base/types';

import { getAllSectionsList } from '@modules/stores/innovation/innovation-record/ir-versions.config';


type ContextTypeType = 'INNOVATION' | 'INNOVATION_SECTION';

export type InnovationDocumentsListFiltersType = {
  name?: null | string
}
type InnovationDocumentsListInDTO = {
  count: number,
  data: {
    id: string,
    context: { type: ContextTypeType, id: string },
    name: string,
    createdAt: DateISOType,
    createdBy: { name: string; role: UserRoleEnum; isOwner?: boolean; orgUnitName?: string };
    file: FileUploadType
  }[]
};
export type InnovationDocumentsListOutDTO = {
  count: number,
  data: (InnovationDocumentsListInDTO['data'][number] & {
    context: InnovationDocumentsListInDTO['data'][number]['context'] & { label: string, description?: string },
    createdBy: InnovationDocumentsListInDTO['data'][number]['createdBy'] & { description: string }
  })[]
};

type InnovationDocumentInfoInDTO = {
  id: string,
  context: { type: ContextTypeType, id: string },
  name: string,
  description?: string,
  createdAt: DateISOType,
  createdBy: { name: string; role: UserRoleEnum; isOwner?: boolean; orgUnitName?: string };
  file: FileUploadType,
  canDelete: boolean
};
export type InnovationDocumentInfoOutDTO = InnovationDocumentInfoInDTO & {
  context: InnovationDocumentInfoInDTO['context'] & { label: string, description?: string, descriptionUrl?: string },
  createdBy: InnovationDocumentInfoInDTO['createdBy'] & { description: string }
};

export type UpsertInnovationDocumentType = {
  contextType: ContextTypeType,
  section?: string,
  name: string,
  description?: string,
  file?: FileUploadType
};


@Injectable()
export class InnovationDocumentsService extends CoreService {

  constructor() { super(); }


  getDocumentList(innovationId: string, queryParams: APIQueryParamsType<InnovationDocumentsListFiltersType>): Observable<InnovationDocumentsListOutDTO> {

    const { filters, ...qParams } = queryParams;
    const qp = {
      ...qParams,
      ...(filters.name ? { name: filters.name } : {})
    };

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/files').setPathParams({ innovationId }).setQueryParams(qp);
    return this.http.get<InnovationDocumentsListInDTO>(url.buildUrl()).pipe(take(1),
      map(response => ({
        count: response.count,
        data: response.data.map(item => {

          let userDescription = `${item.createdBy.name}, ${this.stores.authentication.getRoleDescription(item.createdBy.role)}`;

          if (item.createdBy.role === UserRoleEnum.INNOVATOR) {
            switch (item.createdBy.isOwner) {
              case undefined: userDescription += ''; break;
              case true: userDescription += ' (Owner)'; break;
              case false: userDescription += ' (Collaborator)'; break;
            }
          } else {
            userDescription += item.createdBy.orgUnitName ? ` at ${item.createdBy.orgUnitName}` : ''
          }

          return {
            ...item,
            context: {
              ...item.context,
              label: item.context.type === 'INNOVATION_SECTION' ? 'Innovation record' : 'Documents',
              ...(item.context.type === 'INNOVATION_SECTION' && { description: getAllSectionsList().find(s => s.value === item.context.id)?.label ?? '[archived section]' })
            },
            createdBy: { ...item.createdBy, description: userDescription }
          };

        })

      })));

  }

  getDocumentInfo(innovationId: string, documentId: string): Observable<InnovationDocumentInfoOutDTO> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/files/:documentId').setPathParams({ innovationId, documentId });
    return this.http.get<InnovationDocumentInfoInDTO>(url.buildUrl()).pipe(take(1),
      map(item => {

        let userDescription = `${item.createdBy.name}, ${this.stores.authentication.getRoleDescription(item.createdBy.role)}`;
        if (item.createdBy.role === UserRoleEnum.INNOVATOR) {
          switch (item.createdBy.isOwner) {
            case undefined: userDescription += ''; break;
            case true: userDescription += ' (Owner)'; break;
            case false: userDescription += ' (Collaborator)'; break;
          }
        } else {
          userDescription += item.createdBy.orgUnitName ? ` at ${item.createdBy.orgUnitName}` : ''
        }

        let section;
        if (item.context.type === 'INNOVATION_SECTION') {
          section = getAllSectionsList().find(s => s.value === item.context.id)?.label;
        }

        return {
          ...item,
          context: {
            ...item.context,
            label: item.context.type === 'INNOVATION_SECTION' ? 'Innovation record' : 'Documents',
            ...(item.context.type === 'INNOVATION_SECTION' && { description: section ?? '[archived section]' }),
            ...(item.context.type === 'INNOVATION_SECTION' && section && { descriptionUrl: `${this.stores.authentication.userUrlBasePath()}/innovations/${innovationId}/record/sections/${item.context.id}` })
          },
          createdBy: { ...item.createdBy, description: userDescription }
        };

      }));

  }

  createDocument(innovationId: string, data: UpsertInnovationDocumentType): Observable<{ id: string }> {

    const body = {
      context: {
        type: data.contextType,
        id: data.contextType === 'INNOVATION_SECTION' ? data.section : innovationId
      },
      name: data.name,
      ...(data.description && { description: data.description }),
      ...(data.file && {
        file: {
          id: data.file.id,
          name: data.file.name,
          size: data.file.size,
          extension: data.file.extension
        }
      })
    };

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/files').setPathParams({ innovationId });
    return this.http.post<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }

  updateDocument(innovationId: string, documentId: string, data: UpsertInnovationDocumentType): Observable<{ id: string }> {

    const body = {
      name: data.name,
      ...(data.description && { description: data.description })
    };

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/files/:documentId').setPathParams({ innovationId, documentId });
    return this.http.put<{ id: string }>(url.buildUrl(), body).pipe(take(1), map(response => response));

  }

  deleteDocument(innovationId: string, documentId: string): Observable<void> {

    const url = new UrlModel(this.API_INNOVATIONS_URL).addPath('v1/:innovationId/files/:documentId').setPathParams({ innovationId, documentId });
    return this.http.delete<void>(url.buildUrl()).pipe(take(1));

  }

}
