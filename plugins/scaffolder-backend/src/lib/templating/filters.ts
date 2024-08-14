/*
 * Copyright 2023 The Backstage Authors
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
import { parseEntityRef } from '@backstage/catalog-model';
import { ScmIntegrations } from '@backstage/integration';
import {
  CreatedTemplateFilter,
  createTemplateFilter,
  parseRepoUrl,
  TemplateFilter,
} from '@backstage/plugin-scaffolder-node';
import type { JsonObject, JsonValue } from '@backstage/types';
import { keyBy, mapValues } from 'lodash';
import get from 'lodash/get';
import { z } from 'zod';

const parseRepoUrlFilter = (integrations: ScmIntegrations) => {
  return createTemplateFilter({
    id: 'parseRepoUrl',
    description:
      'Parses a repository URL into its components, such as owner, repository name, and more.',
    schema: {
      input: z
        .string()
        .describe('repo URL as collected from repository picker'),
      output: z
        .object({
          repo: z.string(),
          host: z.string(),
        })
        .merge(
          z
            .object({
              owner: z.string(),
              organization: z.string(),
              workspace: z.string(),
              project: z.string(),
            })
            .partial(),
        )
        .describe('`RepoSpec`'),
    },
    examples: [
      {
        example: `- id: log
name: Parse Repo URL
action: debug:log
input:
extra: \${{ parameters.repoUrl | parseRepoUrl }}`,
        notes: ` - **Input**: \`github.com?repo=backstage&owner=backstage\`
- **Output**: \`{"host":"github.com","owner":"backstage","repo":"backstage"}\`
`,
      },
    ],
    impl: url => parseRepoUrl(url as string, integrations),
  });
};

const parseEntityRefFilter = () => {
  const optionsType = z
    .object({
      defaultKind: z
        .string()
        .describe('The default kind, if none is given in the reference'),
      defaultNamespace: z
        .string()
        .describe('The default namespace, if none is given in the reference'),
    })
    .partial();

  return createTemplateFilter({
    id: 'parseEntityRef',
    description:
      'Extracts the parts of an entity reference, such as the kind, namespace, and name.',
    schema: {
      input: z.string().describe('compact entity reference'),
      arguments: [
        z.union([
          optionsType.required({ defaultKind: true }),
          optionsType.required({ defaultNamespace: true }),
        ]),
      ],
      output: z
        .object({
          kind: z.string(),
          namespace: z.string(),
          name: z.string(),
        })
        .describe('`CompoundEntityRef`'),
    },
    examples: [
      {
        description: 'Without context',
        example: `- id: log
name: Parse Entity Reference
action: debug:log
input:
  extra: \${{ parameters.owner | parseEntityRef }}
`,
        notes: ` - **Input**: \`group:techdocs\`
- **Output**: \`{"kind": "group", "namespace": "default", "name": "techdocs"}\`
`,
      },
      {
        description: 'With context',
        example: `- id: log
name: Parse Entity Reference
action: debug:log
input:
  extra: \${{ parameters.owner | parseEntityRef({ defaultKind:"group", defaultNamespace:"another-namespace" }) }}
`,
        notes: ` - **Input**: \`techdocs\`
- **Arguments:**: \`[{ "defaultKind": "group", "defaultNamespace": "another-namespace" }]\`
- **Output**: \`{"kind": "group", "namespace": "another-namespace", "name": "techdocs"}\`
`,
      },
    ],
    impl: (ref: JsonValue, context?: JsonValue) =>
      parseEntityRef(ref as string, context as JsonObject),
  });
};

export const createBuiltInTemplateFilters = ({
  integrations,
}: {
  integrations: ScmIntegrations;
}): CreatedTemplateFilter<any, any, any>[] => {
  return [
    parseRepoUrlFilter(integrations),
    parseEntityRefFilter(),
    createTemplateFilter({
      id: 'pick',
      description:
        'Selects a specific property (kind, namespace, name) from an object.',
      schema: {
        input: z.any(),
        arguments: [z.string().describe('Property')],
        output: z.any().describe('Selected property'),
      },
      examples: [
        {
          example: `- id: log
  name: Pick
  action: debug:log
  input:
    extra: \${{ parameters.owner | parseEntityRef | pick('name') }}`,
          notes: ` - **Input**: \`{ kind: 'Group', namespace: 'default', name: 'techdocs'\` }
- **Output**: \`techdocs\`
`,
        },
      ],
      impl: (obj: JsonValue, key: JsonValue) => get(obj, key as string),
    }),
    createTemplateFilter({
      id: 'projectSlug',
      description: 'Generates a project slug from a repository URL.',
      schema: {
        input: z
          .string()
          .describe('repo URL as collected from repository picker'),
        output: z.string(),
      },
      examples: [
        {
          example: `- id: log
  name: Project Slug
  action: debug:logπ
  input:
    extra: \${{ parameters.repoUrl | projectSlug }}
`,
          notes: `- **Input**: \`github.com?repo=backstage&owner=backstage\`
- **Output**: backstage/backstage
`,
        },
      ],
      impl: repoUrl => {
        const { owner, repo } = parseRepoUrl(repoUrl as string, integrations);
        return `${owner}/${repo}`;
      },
    }),
  ];
};

export const createDefaultFilters = (opts: {
  integrations: ScmIntegrations;
}): Record<string, TemplateFilter> => {
  return mapValues(keyBy(createBuiltInTemplateFilters(opts)), 'impl');
};
