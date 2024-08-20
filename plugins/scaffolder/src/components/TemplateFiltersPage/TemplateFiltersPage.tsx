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
  Content,
  EmptyState,
  ErrorPanel,
  Header,
  MarkdownContent,
  Page,
  Progress,
} from '@backstage/core-components';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import {
  ListTemplateFiltersResponse,
  TemplateFilter,
  scaffolderApiRef,
} from '@backstage/plugin-scaffolder-react';
import {
  ScaffolderPageContextMenu,
  ScaffolderPageContextMenuProps,
} from '@backstage/plugin-scaffolder-react/alpha';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAsync, { AsyncState } from 'react-use/esm/useAsync';
import {
  actionsRouteRef,
  editRouteRef,
  rootRouteRef,
  scaffolderListTaskRouteRef,
  templateGlobalsRouteRef,
} from '../../routes';
import { ExamplesTable } from '../ExamplesTable/ExamplesTable';
import { Expanded, SchemaRenderContext } from '../RenderSchema';
import { RenderSchema } from '../RenderSchema/RenderSchema';
import {
  TranslationFunction,
  TranslationRef,
  useTranslationRef,
} from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../translation';

const useStyles = makeStyles(theme => ({
  code: {
    fontFamily: 'Menlo, monospace',
    padding: theme.spacing(1),
    backgroundColor:
      theme.palette.type === 'dark'
        ? theme.palette.grey[700]
        : theme.palette.grey[300],
    display: 'inline-block',
    borderRadius: 5,
    border: `1px solid ${theme.palette.grey[500]}`,
    position: 'relative',
  },

  codeRequired: {
    '&::after': {
      position: 'absolute',
      content: '"*"',
      top: 0,
      right: theme.spacing(0.5),
      fontWeight: 'bolder',
      color: theme.palette.error.light,
    },
  },
}));

type Xlate<R> = R extends TranslationRef<any, infer M>
  ? TranslationFunction<M>
  : never;

type FilterCategory = {
  id: string;
  emptyState: {
    title: string;
    description: string;
  };
  metadataAbsent: string;
  schema: {
    input: string;
    arguments: string;
    output: string;
  };
  examples: string;
};

const FilterDetailContent = ({
  category,
  classes,
  filterName,
  filter,
}: {
  category: FilterCategory;
  classes: ClassNameMap;
  filterName: string;
  filter: TemplateFilter;
}) => {
  const expanded = useState<Expanded>({});
  if (Object.keys(filter).length === 0) {
    return (
      <Typography style={{ fontStyle: 'italic' }}>
        {category.metadataAbsent}
      </Typography>
    );
  }
  const schema = filter.schema;
  const partialSchemaRenderContext: Omit<SchemaRenderContext, 'parentId'> = {
    classes,
    expanded,
    headings: [<Typography variant="h6" component="h4" />],
  };
  return (
    <React.Fragment key={`${filterName}.detail`}>
      {filter.description && <MarkdownContent content={filter.description} />}
      <Box pb={2}>
        <Typography variant="h5" component="h3">
          {category.schema.input}
        </Typography>
        <RenderSchema
          strategy="root"
          context={{
            parentId: `${filterName}.input`,
            ...partialSchemaRenderContext,
          }}
          schema={schema?.input ?? {}}
        />
      </Box>
      {schema?.arguments?.length && (
        <Box key={`${filterName}.args`} pb={2}>
          <Typography variant="h5" component="h3">
            {category.schema.arguments}
          </Typography>
          {schema.arguments.map((arg, i) => (
            <React.Fragment key={i}>
              <Typography variant="h6" component="h4">{`[${i}]`}</Typography>
              <RenderSchema
                strategy="root"
                context={{
                  parentId: `${filterName}.arg${i}`,
                  ...partialSchemaRenderContext,
                  headings: [<Typography variant="h6" component="h5" />],
                }}
                schema={arg}
              />
            </React.Fragment>
          ))}
        </Box>
      )}
      <Box pb={2}>
        <Typography variant="h5" component="h3">
          {category.schema.output}
        </Typography>
        <RenderSchema
          strategy="root"
          context={{
            parentId: `${filterName}.output`,
            ...partialSchemaRenderContext,
          }}
          schema={schema?.output ?? {}}
        />
      </Box>
      {filter.examples && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5" component="h3">
              {category.examples}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box pb={2}>
              <ExamplesTable examples={filter.examples} />
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </React.Fragment>
  );
};

const TemplateFilters = ({
  category,
  classes,
  state,
}: {
  category: FilterCategory;
  classes: ClassNameMap;
  state: AsyncState<ListTemplateFiltersResponse>;
}) => {
  const { loading, value, error } = state;

  if (loading) {
    return <Progress />;
  }
  if (error || !value || Object.keys(value).length === 0) {
    return (
      <div data-testid={category.id}>
        {error && <ErrorPanel error={error} />}
        <EmptyState missing="info" {...category.emptyState} />
      </div>
    );
  }
  return (
    <>
      {Object.entries(value).map(([filterName, filter]) => (
        <Box pb={4} key={filterName} id={filterName} data-testid={filterName}>
          <Typography variant="h4" component="h2" className={classes.code}>
            {filterName}
          </Typography>
          <FilterDetailContent {...{ category, classes, filterName, filter }} />
        </Box>
      ))}
    </>
  );
};

const TemplateFiltersPageContent = ({
  t,
}: {
  t: Xlate<typeof scaffolderTranslationRef>;
}) => {
  const api = useApi(scaffolderApiRef);

  const classes = useStyles();

  const builtIn = useAsync(async () => {
    return api.listBuiltInTemplateFilters();
  });

  const additional = useAsync(async () => {
    return api.listAdditionalTemplateFilters();
  });

  return (
    <>
      <Typography variant="h3" component="h1" className={classes.code}>
        {t('templateFilters.content.builtIn.heading')}
      </Typography>
      <TemplateFilters
        category={{
          id: 'built-in',
          emptyState: {
            title: t('templateFilters.content.builtIn.emptyState.title'),
            description: t(
              'templateFilters.content.builtIn.emptyState.description',
            ),
          },
          metadataAbsent: t('templateFilters.content.builtIn.metadataAbsent'),
          schema: {
            input: t('templateFilters.content.builtIn.schema.input'),
            arguments: t('templateFilters.content.builtIn.schema.arguments'),
            output: t('templateFilters.content.builtIn.schema.output'),
          },
          examples: t('templateFilters.content.builtIn.examples'),
        }}
        classes={classes}
        state={builtIn}
      />
      <Typography variant="h3" component="h1" className={classes.code}>
        {t('templateFilters.content.additional.heading')}
      </Typography>
      <TemplateFilters
        category={{
          id: 'additional',
          emptyState: {
            title: t('templateFilters.content.additional.emptyState.title'),
            description: t(
              'templateFilters.content.additional.emptyState.description',
            ),
          },
          metadataAbsent: t(
            'templateFilters.content.additional.metadataAbsent',
          ),
          schema: {
            input: t('templateFilters.content.additional.schema.input'),
            arguments: t('templateFilters.content.additional.schema.arguments'),
            output: t('templateFilters.content.additional.schema.output'),
          },
          examples: t('templateFilters.content.additional.examples'),
        }}
        classes={classes}
        state={additional}
      />
    </>
  );
};

export const TemplateFiltersPage = () => {
  const navigate = useNavigate();
  const editorLink = useRouteRef(editRouteRef);
  const tasksLink = useRouteRef(scaffolderListTaskRouteRef);
  const createLink = useRouteRef(rootRouteRef);
  const actionsLink = useRouteRef(actionsRouteRef);
  const templateGlobalsLink = useRouteRef(templateGlobalsRouteRef);

  const scaffolderPageContextMenuProps: ScaffolderPageContextMenuProps = {
    onEditorClicked: () => navigate(editorLink()),
    onActionsClicked: () => navigate(actionsLink()),
    onTasksClicked: () => navigate(tasksLink()),
    onCreateClicked: () => navigate(createLink()),
    onTemplateGlobalsClicked: () => navigate(templateGlobalsLink()),
  };

  const { t } = useTranslationRef(scaffolderTranslationRef);

  return (
    <Page themeId="home">
      <Header
        pageTitleOverride={t('templateFilters.pageTitle')}
        title={t('templateFilters.title')}
        subtitle={t('templateFilters.subtitle')}
      >
        <ScaffolderPageContextMenu {...scaffolderPageContextMenuProps} />
      </Header>
      <Content>
        <TemplateFiltersPageContent {...{ t }} />
      </Content>
    </Page>
  );
};
