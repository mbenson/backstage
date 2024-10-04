---
id: template-extensions
title: Template Extensions
description: Template extensions system
---

As mentioned, Backstage templating is based on [nunjucks][]. You can customize
the features available to your templates in multiple ways, through
[filters](#template-filters) and globals.

# Template Filters

The [filter][] is a critical mechanism for the rendering with Nunjucks, providing
a means of transforming values in a familiar "piped" fashion. Template filters
are functions that help you transform data, extract specific information,
and perform various operations in Scaffolder Templates.

## Built-in

As a baseline, Backstage provides the following set of "built-in" template filters:
To create your own custom filters, look to the section [Custom Filters](#custom-filters) hereafter.

### parseRepoUrl

The `parseRepoUrl` filters parse a repository URL into
its components, such as `owner`, repository `name`, and more.

**Usage Example:**

```yaml
- id: log
  name: Parse Repo URL
  action: debug:log
  input:
    message: ${{ parameters.repoUrl | parseRepoUrl }}
```

- **Input**: `github.com?repo=backstage&owner=backstage`
- **Output**: [RepoSpec](https://github.com/backstage/backstage/blob/v1.17.2/plugins/scaffolder-backend/src/scaffolder/actions/builtin/publish/util.ts#L39)

### parseEntityRef

The `parseEntityRef` filter allows you to extract different parts of
an entity reference, such as the `kind`, `namespace`, and `name`.

**Usage example**

1. Without context

```yaml
- id: log
  name: Parse Entity Reference
  action: debug:log
  input:
    message: ${{ parameters.owner | parseEntityRef }}
```

- **Input**: `group:techdocs`
- **Output**: [CompoundEntityRef](https://github.com/backstage/backstage/blob/v1.17.2/packages/catalog-model/src/types.ts#L23)

2. With context

```yaml
- id: log
  name: Parse Entity Reference
  action: debug:log
  input:
    message: ${{ parameters.owner | parseEntityRef({ defaultKind:"group", defaultNamespace:"another-namespace" }) }}
```

- **Input**: `techdocs`
- **Output**: [CompoundEntityRef](https://github.com/backstage/backstage/blob/v1.17.2/packages/catalog-model/src/types.ts#L23)

### pick

This `pick` filter allows you to select a specific property (e.g. `kind`, `namespace`, `name`) from an object.

**Usage Example**

```yaml
- id: log
  name: Pick
  action: debug:log
  input:
    message: ${{ parameters.owner | parseEntityRef | pick('name') }}
```

- **Input**: `{ kind: 'Group', namespace: 'default', name: 'techdocs' }`
- **Output**: `techdocs`

### projectSlug

The `projectSlug` filter generates a project slug from a repository URL.

**Usage Example**

```yaml
- id: log
  name: Project Slug
  action: debug:log
  input:
    message: ${{ parameters.repoUrl | projectSlug }}
```

- **Input**: `github.com?repo=backstage&owner=backstage`
- **Output**: `backstage/backstage`

## Custom Filters

Whenever it is needed to extend the built-in filters with yours `${{ parameters.name | my-filter1 | my-filter2 | etc }}`, then you can add them
using the property `additionalTemplateFilters`.

The `additionalTemplateFilters` property accepts as type a `Record`

```ts title="plugins/scaffolder-backend/src/service/Router.ts"
  additionalTemplateFilters?: Record<string, TemplateFilter>;
```

where the first parameter is the name of the filter and the second receives a list of `JSON value` arguments. The `templateFilter()` function must return a JsonValue which is either a Json array, object or primitive.

```ts title="plugins/scaffolder-node/src/types.ts"
export type TemplateFilter = (...args: JsonValue[]) => JsonValue | undefined;
```

From a practical coding point of view, you will translate that into the following snippet code handling 2 filters:

```ts"
...
additionalTemplateFilters: {
  base64: (...args: JsonValue[]) => btoa(args.join("")),
  betterFilter: (...args: JsonValue[]) => { return `This is a much better string than "${args}", don't you think?` }
}
```

And within your template, you will be able to use the filters using a parameter and the filter passed using the pipe symbol

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: test
  title: Test
spec:
  owner: user:guest
  type: service

  parameters:
    - title: Test custom filters
      properties:
        userName:
          title: Name of the user
          type: string

  steps:
    - id: debug
      name: debug
      action: debug:log
      input:
        message: ${{ parameters.userName | betterFilter | base64 }}
```

Next, you will have to register the property `addTemplateFilters` using the `scaffolderTemplatingExtensionPoint` of a new `BackendModule` [created](../../backend-system/architecture/06-modules.md).

Here is a very simplified example of how to do that:

```ts title="packages/backend-next/src/index.ts"
/* highlight-add-start */
import { scaffolderTemplatingExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { createBackendModule } from '@backstage/backend-plugin-api';
/* highlight-add-end */

/* highlight-add-start */
const scaffolderModuleCustomFilters = createBackendModule({
  pluginId: 'scaffolder', // name of the plugin that the module is targeting
  moduleId: 'custom-filters',
  register(env) {
    env.registerInit({
      deps: {
        scaffolder: scaffolderTemplatingExtensionPoint,
        // ... and other dependencies as needed
      },
      async init({ scaffolder /* ..., other dependencies */ }) {
        scaffolder.addTemplateFilters({
          base64: (...args: JsonValue[]) => btoa(args.join('')),
          betterFilter: (...args: JsonValue[]) => {
            return `This is a much better string than "${args}", don't you think?`;
          },
        });
      },
    });
  },
});
/* highlight-add-end */

const backend = createBackend();
backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));
/* highlight-add-next-line */
backend.add(scaffolderModuleCustomFilters);
```

If you still use the legacy backend system, then you will use the `createRouter()` function of the `Scaffolder plugin`

```ts title="packages/backend/src/plugins/scaffolder.ts"
export default async function createPlugin({
  logger,
  config,
}: PluginEnvironment): Promise<Router> {
  ...
  return await createRouter({
    logger,
    config,

    additionalTemplateFilters: {
        <YOUR_FILTERS>
    }
  });
```

If you want to extend the functionality of the Scaffolder, you can do so
by writing custom actions which can be used alongside our
[built-in actions](./builtin-actions.md).

:::

# Customizing the templating environment

You can use custom plugins to install your own template filters, global
functions and global values. If you are on the new backend you will use a
scaffolder plugin module to do this; we will also discuss how to install
template extensions on the old backend.

## Streamlining Template Extension Module Creation with Backstage CLI

The creation of a template extensions module in Backstage can be accelerated
using the Backstage CLI.

Start by using the `yarn backstage-cli new` command to generate a scaffolder module. This command sets up the necessary boilerplate code, providing a smooth start:

```
$ yarn backstage-cli new
? What do you want to create?
> backend-module - A new backend module that extends an existing backend plugin with additional features
  backend-plugin - A new backend plugin
  plugin - A new frontend plugin
  node-library - A new node-library package, exporting shared functionality for backend plugins and modules
  plugin-common - A new isomorphic common plugin package
  plugin-node - A new Node.js library plugin package
  plugin-react - A new web library plugin package
  scaffolder-module - An module exporting custom actions for @backstage/plugin-scaffolder-backend
```

When prompted, select the option to generate a backend module.
Since we want to extend the Scaffolder backend, enter `scaffolder` when prompted for the plugin to extend.
Next, enter a name for your module (relative to the generated `scaffolder-backend-module-` prefix),
and the CLI will generate the required files and directory structure.

## Writing your Module

Once the CLI has generated for you the essential structure for your new
scaffolder module, it's time to implement our template extensions. Here we'll
demonstrate how to create each of the supported extension types.

`src/module.ts` is where the magic happens. Firstly, in that file, we prepare
ourselves to utilize the relevant API extension point, by adding:

```ts
import { scaffolderTemplatingExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
```

Next, add to the `register` callback of your
`CreateBackendModuleOptions` (argument to `createBackendModule()`)
a property associating the imported extension point with a
reference name, e.g. `templating`:

```ts
      deps: {
        logger: coreServices.logger,
        templating: scaffolderTemplatingExtensionPoint,
      },
```

Finally, make your `templating` extension point available in your `init`
callback by adding it to the argument structure:

```ts
      async init({ logger, templating }) {
```

Now we're ready to extend the scaffolder templating engine. For our
purposes here we'll drop everything in `module.ts`; use your own judgment
as to the organization of your real-world plugin modules.

#### Template Filter

In this contrived example, we will add a filter that tests whether
the incoming string value contains a particular character sequence
a specified number of times.

First you'll need some new imports:

```ts
import {
  CreatedTemplateFilter,
  createTemplateFilter,
  TemplateFilterSchema,
} from '@backstage/plugin-scaffolder-node';
import { z } from 'zod';
```

And in `init` function passed to `register`, we'll add:

```ts
templating.addTemplateFilters([
  createTemplateFilter({
    id: 'occursExactly',
    schema: {
      input: z => z.string().describe('a string'),
      arguments: z => z.string().describe('contained string to check'),
      output: z => z.boolean().describe('whether '),
    } as TemplateFilterSchema,
    filter: (s: any) => s,
  }),
]);
```

Let's create a simple action that adds a new file and some contents that are passed as `input` to the function. Within the generated directory, locate the file at `src/actions/example/example.ts`. Feel free to rename this file along with its generated unit test. We will replace the existing placeholder code with our custom action code as follows:

```ts title="With Zod"
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import fs from 'fs-extra';
import { z } from 'zod';

export const createNewFileAction = () => {
  return createTemplateAction({
    id: 'acme:file:create',
    description: 'Create an Acme file.',
    schema: {
      input: z.object({
        contents: z.string().describe('The contents of the file'),
        filename: z
          .string()
          .describe('The filename of the file that will be created'),
      }),
    },

    async handler(ctx) {
      await fs.outputFile(
        resolveSafeChildPath(ctx.workspacePath, ctx.input.filename),
        ctx.input.contents,
      );
    },
  });
};
```

So let's break this down. The `createNewFileAction` is a function that returns a
`createTemplateAction`, and it's a good place to pass in dependencies which
close over the `TemplateAction`. Take a look at our
[built-in actions](https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend/src/scaffolder/actions/builtin)
for reference.

The `createTemplateAction` takes an object which specifies the following:

- `id` - A unique ID for your custom action. We encourage you to namespace these
  in some way so that they won't collide with future built-in actions that we
  may ship with the `scaffolder-backend` plugin.
- `description` - An optional field to describe the purpose of the action. This will populate in the `/create/actions` endpoint.
- `schema.input` - A `zod` or JSON schema object for input values to your function
- `schema.output` - A `zod` or JSON schema object for values which are output from the
  function using `ctx.output`
- `handler` - the actual code which is run as part of the action, with a context

You can also choose to define your custom action using JSON schema instead of `zod`:

```ts title="With JSON Schema"
import { resolveSafeChildPath } from '@backstage/backend-plugin-api';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { writeFile } from 'fs';

export const createNewFileAction = () => {
  return createTemplateAction<{ contents: string; filename: string }>({
    id: 'acme:file:create',
    description: 'Create an Acme file.',
    schema: {
      input: {
        required: ['contents', 'filename'],
        type: 'object',
        properties: {
          contents: {
            type: 'string',
            title: 'Contents',
            description: 'The contents of the file',
          },
          filename: {
            type: 'string',
            title: 'Filename',
            description: 'The filename of the file that will be created',
          },
        },
      },
    },
    async handler(ctx) {
      const { signal } = ctx;
      await writeFile(
        resolveSafeChildPath(ctx.workspacePath, ctx.input.filename),
        ctx.input.contents,
        { signal },
        _ => {},
      );
    },
  });
};
```

### Naming Conventions

Try to keep names consistent for both your own custom actions, and any actions contributed to open source. We've found that a separation of `:` and using a verb as the last part of the name works well.
We follow `provider:entity:verb` or as close to this as possible for our built in actions. For example, `github:actions:create` or `github:repo:create`.

Also feel free to use your company name to namespace them if you prefer too, for example `acme:file:create` like above.

Prefer to use `camelCase` over `snake_case` or `kebab-case` for these actions if possible, which leads to better reading and writing of template entity definitions.

> We're aware that there are some exceptions to this, but try to follow as close as possible. We'll be working on migrating these in the repository over time too.

### The context object

When the action `handler` is called, we provide you a `context` as the only
argument. It looks like the following:

- `ctx.baseUrl` - a string where the template is located
- `ctx.checkpoint` - _Experimental_ allows to
  implement [idempotency of the actions](https://github.com/backstage/backstage/tree/master/beps/0004-scaffolder-task-idempotency)
  by not re-running the same function again if it was
  executed successfully on the previous run.
- `ctx.logger` - a Winston logger for additional logging inside your action
- `ctx.logStream` - a stream version of the logger if needed
- `ctx.workspacePath` - a string of the working directory of the template run
- `ctx.input` - an object which should match the `zod` or JSON schema provided in the
  `schema.input` part of the action definition
- `ctx.output` - a function which you can call to set outputs that match the
  JSON schema or `zod` in `schema.output` for ex. `ctx.output('downloadUrl', myDownloadUrl)`
- `createTemporaryDirectory` a function to call to give you a temporary
  directory somewhere on the runner, so you can store some files there rather
  than polluting the `workspacePath`
- `ctx.metadata` - an object containing a `name` field, indicating the template
  name. More metadata fields may be added later.

## Registering Custom Actions

To register your new custom action in the Backend System you will need to create a backend module. Here is a very simplified example of how to do that:

```ts title="packages/backend/src/index.ts"
/* highlight-add-start */
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { createBackendModule } from '@backstage/backend-plugin-api';
/* highlight-add-end */

/* highlight-add-start */
const scaffolderModuleCustomExtensions = createBackendModule({
  pluginId: 'scaffolder', // name of the plugin that the module is targeting
  moduleId: 'custom-extensions',
  register(env) {
    env.registerInit({
      deps: {
        scaffolder: scaffolderActionsExtensionPoint,
        // ... and other dependencies as needed
      },
      async init({ scaffolder /* ..., other dependencies */ }) {
        // Here you have the opportunity to interact with the extension
        // point before the plugin itself gets instantiated
        scaffolder.addActions(new createNewFileAction()); // just an example
      },
    });
  },
});
/* highlight-add-end */

const backend = createBackend();
backend.add(import('@backstage/plugin-scaffolder-backend/alpha'));
/* highlight-add-next-line */
backend.add(scaffolderModuleCustomExtensions);
```

If your custom action requires core services such as `config` or `cache` they can be imported in the dependencies and passed to the custom action function.

```ts title="packages/backend/src/index.ts"
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';

...

    env.registerInit({
      deps: {
        scaffolder: scaffolderActionsExtensionPoint,
        cache: coreServices.cache,
        config: coreServices.rootConfig,
      },
      async init({ scaffolder, cache, config }) {
        scaffolder.addActions(
          customActionNeedingCacheAndConfig({ cache: cache, config: config }),
        );
    })
```

### Using Checkpoints in Custom Actions (Experimental)

Idempotent action could be achieved via the usage of checkpoints.

Example:

```ts title="plugins/my-company-scaffolder-actions-plugin/src/vendor/my-custom-action.ts"
const res = await ctx.checkpoint?.('create.projects', async () => {
  const projectStgId = createStagingProjectId();
  const projectProId = createProductionProjectId();

  return {
    projectStgId,
    projectProId,
  };
});
```

You have to define the unique key in scope of the scaffolder task for your checkpoint. During the execution task engine
will check if the checkpoint with such key was already executed or not, if yes, and the run was successful, the callback
will be skipped and instead the stored value will be returned.

### Register Custom Actions with the Legacy Backend System

Once you have your Custom Action ready for usage with the scaffolder, you'll
need to pass this into the `scaffolder-backend` `createRouter` function. You
should have something similar to the below in
`packages/backend/src/plugins/scaffolder.ts`

```ts
return await createRouter({
  catalogClient,
  logger: env.logger,
  config: env.config,
  database: env.database,
  reader: env.reader,
});
```

There's another property you can pass here, which is an array of `actions` which
will set the available actions that the scaffolder has access to.

```ts
import { createBuiltinActions } from '@backstage/plugin-scaffolder-backend';
import { ScmIntegrations } from '@backstage/integration';
import { createNewFileAction } from './scaffolder/actions/custom';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({ discoveryApi: env.discovery });
  const integrations = ScmIntegrations.fromConfig(env.config);

  const builtInActions = createBuiltinActions({
    integrations,
    catalogClient,
    config: env.config,
    reader: env.reader,
  });

  const actions = [...builtInActions, createNewFileAction()];

  return createRouter({
    actions,
    catalogClient: catalogClient,
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
  });
}
```

[nunjucks]: https://mozilla.github.io/nunjucks
[filter]: https://mozilla.github.io/nunjucks/templating.html#filters
