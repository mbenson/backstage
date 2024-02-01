# Catalog Graph

> **Disclaimer:**
> This documentation is made for those using the experimental new Frontend system.
> If you are not using the new Backstage frontend system, please go [here](./README.md).

The Catalog graph plugin helps you to visualize the relations between entities, like ownership, grouping or API relationships.

## Features

The plugin comes with these features:

### Catalog entity relations graph card

A card that displays the directly related entities to the current entity on the Catalog entity page. It can be customized, for example filtering for specific relations.

<img src="./catalog-graph-entity-relations-card.png" width="600" />

### Catalog entity relations graph page

A standalone page that can be added to your application providing a viewer for your entity relations.
This viewer can be used to navigate through the entities and filter for specific relations, you can access it from the the card "View Graph" action.

<img src="./catalog-graph-entity-relations-page.png" width="600" />

## Installation

This plugin installation requires the following steps:

> [!Note]
> In addition to installing this plugin, be sure to install the [Software Catalog](https://backstage.io/docs/features/software-catalog/) plugin, as it extends its capabilities.

1. Add the `@backstage/catalog-graph` dependency to your app `package.json` file and install it;
2. In your application's configuration file, enable the catalog entity relations graphic card extension so that the card begins to be presented on the catalog entity page:

```yaml
# app-config.yaml
app:
  extensions:
    - entity-card:catalog-graph/entity-relations
```

3. Then start the app, navigate to an entity's page and see the Relations graph there;
4. By clicking on the "View Graph" card action, you will be redirected to the catalog entity relations page.

## Customization

This plugin can be customized in two ways: via the `app-config.yaml` file or through code and the following sections will explain to you what kind of configurations are available for use, as well as how you can customize the plugin implementation.

### Routes

The Catalog graph plugin exposes regular and external routes that can be used to configure route bindings.

| Key             | Type           | Description                             |
| --------------- | -------------- | --------------------------------------- |
| `catalogGraph`  | Regular route  | A route ref to the Catalog graph page.  |
| `catalogEntity` | External route | A route ref to the Catalog entity page. |

As an example, here is an association between the external entity page and a different route other than the Catalog plugin's default entity page:

```yaml
# example binding the catalog graph entity page
app:
  routes:
    bindings:
      # defaults to catalog.catalogEntity
      catalog-graph.catalogEntity: <some-plugin-id>.<some-external-route-key>
```

Additionally, it is possible to point a route from another plugin to the Catalog graph page:

```yaml
app:
  routes:
    bindings:
      <some-plugin-id>.<some-external-route-key>: catalog-graph.catalogEntity
```

Route binding is also possible through code. For more information, see [this](https://backstage.io/docs/frontend-system/architecture/routes#binding-external-route-references) documentation.

### Extensions

The Catalog graphics plugin provides extensions for each of its [features](#features). Below is how to customize them.

#### Catalog Entity Relations Graph Card

A [Entity Card](https://backstage.io/docs/frontend-system/building-plugins/extension-types#entitycard---reference) extension that renders the relation graph for a Catalog entity on the Catalog entity page. This extension has an action that redirects users to the [Catalog entity's relations graph page](#catalog-entity-relations-graph-page).

| kind        | namespace     | name             | id                                           |
| ----------- | ------------- | ---------------- | -------------------------------------------- |
| entity-card | catalog-graph | entity-relations | `entity-card:catalog-graph/entity-relations` |

##### Output

A React component defined by the [coreExtensionData.reactElement](https://backstage.io/docs/reference/frontend-plugin-api.coreextensiondata/) type.

##### Inputs

There are no inputs available for this extension.

##### Config

The card configurations should be defined under the `app.extensions.entity-card:catalog-graph/entity-relations.config` key in the `app-config.yaml` located at your the root of your Backstage source code:

```yaml
# app-config.yaml
app:
  extensions:
    # this is the extension id and it follows the naming pattern bellow:
    # <extension-kind>/<plugin-namespace>:<extension-name>
    - entity-card:catalog-graph/entity-relations:
        config:
          # example configuring the card title
          # defaults to "Relations"
          title: 'Entities Relations Graph'
```

See below the complete list of available configs:

| Key               | Description                                                                                                                                                                                                      | Type                                                                                                        | Optional | Default value                                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| `filter`          | A [text-based query](<(https://github.com/backstage/backstage/pull/21480)>) used to filter whether the extension should be rendered or not                                                                       | `string`                                                                                                    | yes      | -                                                                                                               |
| `title`           | The card title text.                                                                                                                                                                                             | `string`                                                                                                    | yes      | `'Relations'`                                                                                                   |
| `variant`         | The card layout variants.                                                                                                                                                                                        | `flex` \| `fullHeight` \| `gridItem`                                                                        | yes      | `'gridItem'`                                                                                                    |
| `height`          | The card height fixed size.                                                                                                                                                                                      | `number`                                                                                                    | yes      | -                                                                                                               |
| `rootEntityNames` | A single our multiple compound root entity ref objects.                                                                                                                                                          | `{ kind: string, namespace: string, name: string }` \| `{ kind: string, namespace: string, name: string}[]` | yes      | Defaults to the entity available in the entity page context                                                     |
| `kinds`           | Restricted list of entity [kinds](https://backstage.io/docs/features/software-catalog/descriptor-format/#contents) to display in the graph.                                                                      | `string[]`                                                                                                  | yes      | `undefined`                                                                                                     |
| `relations`       | Restricted list of entity [relations](https://backstage.io/docs/features/software-catalog/descriptor-format/#common-to-all-kinds-relations) to display in the graph.                                             | `string[]`                                                                                                  | yes      | `undefined`                                                                                                     |
| `maxDepth`        | A maximum number of levels of relations to display in the graph.                                                                                                                                                 | `number`                                                                                                    | yes      | `1`                                                                                                             |
| `unidirectional`  | Shows only relations that from the source to the target entity.                                                                                                                                                  | `boolean`                                                                                                   | yes      | `true`                                                                                                          |
| `mergeRelations`  | Merge the relations line into a single one.                                                                                                                                                                      | `boolean`                                                                                                   | yes      | `true`                                                                                                          |
| `direction`       | Render direction of the graph.                                                                                                                                                                                   | `TB` \| `BT` \| `LR` \| `RL`                                                                                | yes      | `'LR'`                                                                                                          |
| `relationPairs`   | A list of [pairs of entity relations](https://backstage.io/docs/features/software-catalog/well-known-relations#relations), used to define which relations are merged together and which the primary relation is. | `[string[], string[]]`                                                                                      | yes      | Show all entity [relations](https://backstage.io/docs/features/software-catalog/well-known-relations#relations) |
| `zoom`            | Controls zoom behavior of graph.                                                                                                                                                                                 | `enabled` \| `disabled` \| `enable-on-click`                                                                | yes      | `'enabled'`                                                                                                     |
| `curve`           | A factory name for curve generators addressing both lines and areas.                                                                                                                                             | `curveStepBefore` \| `curveMonotoneX`                                                                       | yes      | `'enable-on-click' `                                                                                            |

##### Override

Overriding the card extension allows you to modify how it is implemented.

> [!Warning]
> To maintain the same level of configuration, you should define the same or an extended configuration schema.

Here is an example overriding the card extension with a custom component:

```tsx
import { createExtensionOverrides, createSchemaFromZod } from '@backstage/backstage-plugin-api';
import { createEntityCardExtension } from '@backstage/plugin-catalog-react/alpha';

export default createExtensionOverrides(
  extensions: [
    createEntityCardExtension({
      // These namespace and name are necessary so the system knows that this extension will replace the default 'entity-relations' card extension provided by the 'catalog-graph' plugin
      namespace: 'catalog-graph',
      name: 'entity-relations',
      configSchema: createSchemaFromZod(z => z.object({
        filter: z.string().optional(),
        // Ommitting the rest of default configs for simplicity in this example
      })),
      loader: () => import('./components').then(m => <m.MyEntityRelationsCard />)
    })
  ]
);
```

For more information about where to place extension overrides, see the official [documentation](https://backstage.io/docs/frontend-system/architecture/extension-overrides).

#### Catalog Entity Relations Graph Page

An [Page](https://backstage.io/docs/reference/frontend-plugin-api.createapiextension) extension that renders a more detailed relation graph for a Catalog entity. It contains a few filters that you can use to narrow down what's displayed.

| kind | namespace     | name | id                   |
| ---- | ------------- | ---- | -------------------- |
| page | catalog-graph | -    | `page:catalog-graph` |

##### Output

A React component defined by the [coreExtensionData.reactElement](https://backstage.io/docs/reference/frontend-plugin-api.coreextensiondata/) type.

##### Inputs

There are no inputs available for this extension.

##### Config

The page configurations should be defined under the `app.extensions.page:catalog-graph.config` key:

```yaml
# example configuring the page path
app:
  extensions:
    # this is the extension id and it follows the naming pattern bellow:
    # <extension-kind>/<plugin-namespace>:<extension-name>
    - page:catalog-graph:
        config:
          # defaults to "/catalog-graph"
          path: '/entity-graph'
```

See below the complete list of available configs:

| Key               | Description                                                                                                                                                                                                      | Type                                                                                                                                                                                                                                                | Optional | Default value                                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| `path`            | The page route path.                                                                                                                                                                                             | `string`                                                                                                                                                                                                                                            | true     | `'/catalog-graph' `                                                                                             |
| `initialState`    | The page filters initial state.                                                                                                                                                                                  | `{ selectedRelations?: string[],selectedKinds?: string[],rootEntityRefs?: string[],maxDepth?: number,unidirectional?: boolean,mergeRelations?: boolean,direction?: Direction,showFilters?: boolean,curve?: 'curveStepBefore' \| 'curveMonotoneX' }` | true     | `{}`                                                                                                            |
| `rootEntityNames` | A single our multiple compound root entity ref objects.                                                                                                                                                          | `{ kind: string, namespace: string, name: string }` \| `{ kind: string, namespace: string, name: string}[]`                                                                                                                                         | yes      | Defaults to the entity available in the entity page context                                                     |
| `kinds`           | Restricted list of entity [kinds](https://backstage.io/docs/features/software-catalog/descriptor-format/#contents) to display in the graph.                                                                      | `string[]`                                                                                                                                                                                                                                          | yes      | `undefined`                                                                                                     |
| `relations`       | Restricted list of entity [relations](https://backstage.io/docs/features/software-catalog/descriptor-format/#common-to-all-kinds-relations) to display in the graph.                                             | `string[]`                                                                                                                                                                                                                                          | yes      | `undefined`                                                                                                     |
| `maxDepth`        | A maximum number of levels of relations to display in the graph.                                                                                                                                                 | `number`                                                                                                                                                                                                                                            | yes      | `1`                                                                                                             |
| `unidirectional`  | Shows only relations that from the source to the target entity.                                                                                                                                                  | `boolean`                                                                                                                                                                                                                                           | yes      | `true`                                                                                                          |
| `mergeRelations`  | Merge the relations line into a single one.                                                                                                                                                                      | `boolean`                                                                                                                                                                                                                                           | yes      | `true`                                                                                                          |
| `direction`       | Render direction of the graph.                                                                                                                                                                                   | `TB` \| `BT` \| `LR` \| `RL`                                                                                                                                                                                                                        | yes      | `'LR'`                                                                                                          |
| `relationPairs`   | A list of [pairs of entity relations](https://backstage.io/docs/features/software-catalog/well-known-relations#relations), used to define which relations are merged together and which the primary relation is. | `[string[], string[]]`                                                                                                                                                                                                                              | yes      | Show all entity [relations](https://backstage.io/docs/features/software-catalog/well-known-relations#relations) |
| `zoom`            | Controls zoom behavior of graph.                                                                                                                                                                                 | `enabled` \| `disabled` \| `enable-on-click`                                                                                                                                                                                                        | yes      | `'enabled'`                                                                                                     |
| `curve`           | A factory name for curve generators addressing both lines and areas.                                                                                                                                             | `curveStepBefore` \| `curveMonotoneX`                                                                                                                                                                                                               | yes      | `'enable-on-click' `                                                                                            |

##### Override

Overriding the page extension allows you to modify how it is implemented.

> [!Warning]
> To maintain the same level of configuration, you need to define the same or an extended configuration schema. In order to avoid side effects on external plugins that expect this page to be associated with the default path and route reference, remember to use the same default path so that applications that use the default path still point to the same page and the same route reference.

Here is example overriding the page extension with a custom component:

```tsx
import { createExtensionOverrides, createPageExtension, createSchemaFromZod } from '@backstage/backstage-plugin-api';

export default createExtensionOverrides(
  extensions: [
    createPageExtension({
      // Ommiting name since it is an index page
      // This namespace is necessary so the system knows that this extension will replace the default 'catalog-graph' page extension
      namespace: 'catalog-graph',
      defaultPath: '/catalog-graph',
      routeRef: convertLegacyRouteRef(catalogGraphRouteRef),
      createSchemaFromZod(z => z.object({
        path: z.string().default('/catalog-graph')
        // Ommitting the rest of default configs for simplicity in this example
      })),
      loader: () => import('./components').then(m => <m.CustomEntityRelationsPage />)
    })
  ]
);
```

For more information about where to place extension overrides, see the official [documentation](https://backstage.io/docs/frontend-system/architecture/extension-overrides).
