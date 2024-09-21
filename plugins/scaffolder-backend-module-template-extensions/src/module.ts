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
  CreatedTemplateFilter,
  createTemplateFilter,
  createTemplateGlobal,
  TemplateFilterSchema,
  TemplateGlobalFunctionSchema,
} from '@backstage/plugin-scaffolder-node';

import { scaffolderTemplatingExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';

export const scaffolderModuleTemplateExtensions = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'template-extensions',
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
            id: 'foo',
            schema: {
              input: z => z.any().describe('a value'),
              output: z => z.any().describe('same value'),
            } as TemplateFilterSchema,
            filter: (s: any) => s,
          }),
          createTemplateFilter({
            id: 'bar',
            filter: (bar: any) => !!bar,
          }),
          createTemplateFilter({
            id: 'baz',
            description: 'append the argument to the incoming value',
            schema: {
              input: z => z.string(),
              arguments: z => z.string().describe('value to append to input'),
              output: z => z.string().describe('input+suffix'),
            } as TemplateFilterSchema,
            filter: (what: string, ever: string) => what + ever,
          }),
          createTemplateFilter({
            id: 'blah',
            schema: {
              input: z => z.number(),
              arguments: z =>
                z.tuple([
                  z.number().describe('factor by which to multiply input'),
                  z
                    .number()
                    .describe('addend by which to increase input * factor'),
                ]),
            } as TemplateFilterSchema,
            filter: (base: number, factor: number, addend: number) =>
              base * factor + addend,
          }),
        ] as CreatedTemplateFilter[]);
        templating.addTemplateGlobals([
          createTemplateGlobal({
            id: 'nul',
            description: 'null value',
            value: null,
          }),
          createTemplateGlobal({
            id: 'nop',
            description: 'nop function',
            schema: {
              arguments: z => z.any().describe('input'),
              output: z => z.any().describe('output'),
            } as TemplateGlobalFunctionSchema,
            fn: (x: any) => x,
          }),
        ]);
      },
    });
  },
});
