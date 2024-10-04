/*
 * Copyright 2024 The Backstage Authors
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
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';

import {
  createTemplateFilter,
  TemplateFilterSchema,
} from '@backstage/plugin-scaffolder-node';

import { scaffolderTemplatingExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';

export const scaffolderModuleTxDocDemo = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'tx-doc-demo',
  register(reg) {
    reg.registerInit({
      deps: {
        logger: coreServices.logger,
        templating: scaffolderTemplatingExtensionPoint,
      },
      async init({ logger, templating }) {
        logger.info('Hello World!');
        templating.addTemplateFilters([
          createTemplateFilter({
            id: 'containsOccurrences',
            schema: {
              input: z => z.string(),
              arguments: z =>
                z.tuple([
                  z.string().describe('factor by which to multiply input'),
                  z
                    .number()
                    .describe('addend by which to increase input * factor'),
                ]),
            } as TemplateFilterSchema,
            filter: (arg: string, substring: string, times: number) => {
              let pos = 0;
              let count = 0;
              while (pos < arg.length) {
                pos = arg.indexOf(substring, pos);
                if (pos < 0) {
                  break;
                }
                count++;
              }
              return count === times;
            },
          }),
        ]);
      },
    });
  },
});
