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
                  z.string().describe('substring whose occurrences to find'),
                  z
                    .number()
                    .describe('number of occurrences to check for')
                    .optional(),
                ]),
              output: z => z.boolean(),
            } as TemplateFilterSchema,
            examples: [
              {
                description: 'Basic Usage',
                example: `\
- id: log
  name: Contains Occurrences
  action: debug:log
  input:
    message: \${{ parameters.projectName | containsOccurrences('-', 2) }}
            `,
                notes: `\
- **Input**: \`foo-bar-baz\`
- **Output**: \`true\`
            `,
              },
            ],
            filter: (arg: string, substring: string, times?: number) => {
              if (times === undefined) {
                return arg.includes(substring);
              }
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
