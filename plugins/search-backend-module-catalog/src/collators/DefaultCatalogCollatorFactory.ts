/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  PluginEndpointDiscovery,
  TokenManager,
} from '@backstage/backend-common';
import {
  readTaskScheduleDefinitionFromConfig,
  TaskScheduleDefinition,
} from '@backstage/backend-tasks';
import {
  CatalogApi,
  CatalogClient,
  EntityFilterQuery,
  GetEntitiesRequest,
} from '@backstage/catalog-client';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';
import { CatalogEntityDocument } from '@backstage/plugin-catalog-common';
import { catalogEntityReadPermission } from '@backstage/plugin-catalog-common/alpha';
import { Permission } from '@backstage/plugin-permission-common';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import { Readable } from 'stream';
import { CatalogCollatorEntityTransformer } from './CatalogCollatorEntityTransformer';
import { defaultCatalogCollatorEntityTransformer } from './defaultCatalogCollatorEntityTransformer';

/** @public */
export type DefaultCatalogCollatorFactoryOptions = {
  discovery: PluginEndpointDiscovery;
  tokenManager: TokenManager;
  catalogClient?: CatalogApi;
  /**
   * Allows you to customize how entities are shaped into documents.
   */
  entityTransformer?: CatalogCollatorEntityTransformer;
};

const configKey = 'search.collators.catalog';

/**
 * Collates entities from the Catalog into documents for the search backend.
 *
 * @public
 */
export class DefaultCatalogCollatorFactory implements DocumentCollatorFactory {
  public readonly type = 'software-catalog';
  public readonly visibilityPermission: Permission =
    catalogEntityReadPermission;

  private locationTemplate: string;
  private filter?: GetEntitiesRequest['filter'];
  private batchSize: number;
  private readonly catalogClient: CatalogApi;
  private tokenManager: TokenManager;
  private entityTransformer: CatalogCollatorEntityTransformer;

  static fromConfig(
    configRoot: Config,
    options: DefaultCatalogCollatorFactoryOptions,
  ) {
    const config = configRoot.getOptionalConfig(configKey);
    if (!config) {
      throw new InputError(`No config provided in ${configKey}`);
    }

    let schedule: TaskScheduleDefinition;
    const scheduleConfig = config.getOptionalConfig('schedule');
    if (scheduleConfig) {
      try {
        schedule = readTaskScheduleDefinitionFromConfig(scheduleConfig);
      } catch (error) {
        throw new InputError(`Invalid schedule at ${configKey}, ${error}`);
      }
    } else {
      schedule = {
        frequency: { minutes: 10 },
        timeout: { minutes: 15 },
        initialDelay: { seconds: 3 },
      };
    }

    return {
      schedule,
      collatorFactory: new DefaultCatalogCollatorFactory({
        ...options,
        locationTemplate: config.getOptionalString('locationTemplate'),
        filter: config.getOptionalConfig('filter')?.get<EntityFilterQuery>(),
        batchSize: config.getOptionalNumber('batchSize'),
      }),
    };
  }

  private constructor(options: {
    locationTemplate?: string;
    filter?: GetEntitiesRequest['filter'];
    batchSize?: number;
    entityTransformer?: CatalogCollatorEntityTransformer;
    discovery: PluginEndpointDiscovery;
    tokenManager: TokenManager;
    catalogClient?: CatalogApi;
  }) {
    const {
      batchSize,
      discovery,
      locationTemplate,
      filter,
      catalogClient,
      tokenManager,
      entityTransformer,
    } = options;

    this.locationTemplate =
      locationTemplate || '/catalog/:namespace/:kind/:name';
    this.filter = filter;
    this.batchSize = batchSize || 500;
    this.catalogClient =
      catalogClient || new CatalogClient({ discoveryApi: discovery });
    this.tokenManager = tokenManager;
    this.entityTransformer =
      entityTransformer ?? defaultCatalogCollatorEntityTransformer;
  }

  async getCollator(): Promise<Readable> {
    return Readable.from(this.execute());
  }

  private async *execute(): AsyncGenerator<CatalogEntityDocument> {
    const { token } = await this.tokenManager.getToken();
    let entitiesRetrieved = 0;
    let moreEntitiesToGet = true;

    // Offset/limit pagination is used on the Catalog Client in order to
    // limit (and allow some control over) memory used by the search backend
    // at index-time.
    while (moreEntitiesToGet) {
      const entities = (
        await this.catalogClient.getEntities(
          {
            filter: this.filter,
            limit: this.batchSize,
            offset: entitiesRetrieved,
          },
          { token },
        )
      ).items;

      // Control looping through entity batches.
      moreEntitiesToGet = entities.length === this.batchSize;
      entitiesRetrieved += entities.length;

      for (const entity of entities) {
        yield {
          ...this.entityTransformer(entity),
          authorization: {
            resourceRef: stringifyEntityRef(entity),
          },
          location: this.applyArgsToFormat(this.locationTemplate, {
            namespace: entity.metadata.namespace || 'default',
            kind: entity.kind,
            name: entity.metadata.name,
          }),
        };
      }
    }
  }

  private applyArgsToFormat(
    format: string,
    args: Record<string, string>,
  ): string {
    let formatted = format;

    for (const [key, value] of Object.entries(args)) {
      formatted = formatted.replace(`:${key}`, value);
    }

    return formatted.toLowerCase();
  }
}
