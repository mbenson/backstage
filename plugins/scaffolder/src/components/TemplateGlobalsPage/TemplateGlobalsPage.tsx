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
  CodeSnippet,
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
  ListTemplateGlobalFunctionsResponse,
  ListTemplateGlobalValuesResponse,
  TemplateGlobalFunction,
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
  templateFiltersRouteRef,
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

const FunctionDetailContent = ({
  classes,
  fnName,
  fn,
  t,
}: {
  classes: ClassNameMap;
  fnName: string;
  fn: TemplateGlobalFunction;
  t: Xlate<typeof scaffolderTranslationRef>;
}) => {
  const expanded = useState<Expanded>({});
  if (Object.keys(fn).length === 0) {
    return (
      <Typography style={{ fontStyle: 'italic' }}>
        Function metadata unavailable
      </Typography>
    );
  }
  const schema = fn.schema;
  const partialSchemaRenderContext: Omit<SchemaRenderContext, 'parentId'> = {
    classes,
    expanded,
    headings: [<Typography variant="h6" component="h4" />],
  };
  return (
    <React.Fragment key={`${fnName}.detail`}>
      {fn.description && <MarkdownContent content={fn.description} />}
      {schema?.arguments?.length && (
        <Box key={`${fnName}.args`} pb={2}>
          <Typography variant="h5" component="h3">
            {t('templateGlobals.content.fn.schema.arguments')}
          </Typography>
          {schema.arguments.map((arg, i) => (
            <React.Fragment key={i}>
              <Typography variant="h6" component="h4">{`[${i}]`}</Typography>
              <RenderSchema
                strategy="root"
                context={{
                  parentId: `${fnName}.arg${i}`,
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
          {t('templateGlobals.content.fn.schema.output')}
        </Typography>
        <RenderSchema
          strategy="root"
          context={{
            parentId: `${fnName}.output`,
            ...partialSchemaRenderContext,
          }}
          schema={schema?.output ?? {}}
        />
      </Box>
      {fn.examples && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5" component="h3">
              {t('templateGlobals.content.fn.examples')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box pb={2}>
              <ExamplesTable examples={fn.examples} />
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </React.Fragment>
  );
};

const TemplateGlobalFunctions = ({
  classes,
  state,
  t,
}: {
  classes: ClassNameMap;
  state: AsyncState<ListTemplateGlobalFunctionsResponse>;
  t: Xlate<typeof scaffolderTranslationRef>;
}) => {
  const { loading, value, error } = state;

  if (loading) {
    return <Progress />;
  }
  if (error || !value || Object.keys(value).length === 0) {
    return (
      <div data-testid="global-functions">
        {error && <ErrorPanel error={error} />}
        <EmptyState
          missing="info"
          title={t('templateGlobals.content.fn.emptyState.title')}
          description={t('templateGlobals.content.fn.emptyState.description')}
        />
      </div>
    );
  }
  return (
    <>
      {Object.entries(value).map(([fnName, fn]) => (
        <Box pb={4} key={fnName} id={fnName} data-testid={fnName}>
          <Typography variant="h4" component="h2" className={classes.code}>
            {fnName}
          </Typography>
          <FunctionDetailContent {...{ classes, fnName, fn, t }} />
        </Box>
      ))}
    </>
  );
};

const TemplateGlobalValues = ({
  classes,
  state,
  t,
}: {
  classes: ClassNameMap;
  state: AsyncState<ListTemplateGlobalValuesResponse>;
  t: Xlate<typeof scaffolderTranslationRef>;
}) => {
  const { loading, value, error } = state;

  if (loading) {
    return <Progress />;
  }
  if (error || !value || Object.keys(value).length === 0) {
    return (
      <div data-testid="global-values">
        {error && <ErrorPanel error={error} />}
        <EmptyState
          missing="info"
          title={t('templateGlobals.content.value.emptyState.title')}
          description={t('templateGlobals.content.fn.emptyState.description')}
        />
      </div>
    );
  }
  return (
    <>
      {Object.entries(value).map(([key, gv]) => (
        <Box pb={4} key={key} id={key} data-testid={key}>
          <Typography variant="h4" component="h2" className={classes.code}>
            {key}
          </Typography>
          {gv.description && <MarkdownContent content={gv.description} />}
          <Box padding={1} data-testid={`${key}.value`}>
            <CodeSnippet
              text={JSON.stringify(gv.value, null, 2)}
              showCopyCodeButton
              language="json"
            />
          </Box>
        </Box>
      ))}
    </>
  );
};

const TemplateGlobalsPageContent = ({
  t,
}: {
  t: Xlate<typeof scaffolderTranslationRef>;
}) => {
  const api = useApi(scaffolderApiRef);

  const classes = useStyles();

  const fns = useAsync(async () => {
    return api.listTemplateGlobalFunctions();
  });

  const vals = useAsync(async () => {
    return api.listTemplateGlobalValues();
  });

  return (
    <>
      <Typography variant="h3" component="h1" className={classes.code}>
        {t('templateGlobals.content.fn.heading')}
      </Typography>
      <TemplateGlobalFunctions state={fns} {...{ classes, t }} />
      <Typography variant="h3" component="h1" className={classes.code}>
        {t('templateGlobals.content.value.heading')}
      </Typography>
      <TemplateGlobalValues state={vals} {...{ classes, t }} />
    </>
  );
};

export const TemplateGlobalsPage = () => {
  const navigate = useNavigate();
  const editorLink = useRouteRef(editRouteRef);
  const tasksLink = useRouteRef(scaffolderListTaskRouteRef);
  const createLink = useRouteRef(rootRouteRef);
  const actionsLink = useRouteRef(actionsRouteRef);
  const templateFiltersLink = useRouteRef(templateFiltersRouteRef);

  const scaffolderPageContextMenuProps: ScaffolderPageContextMenuProps = {
    onEditorClicked: () => navigate(editorLink()),
    onActionsClicked: () => navigate(actionsLink()),
    onTasksClicked: () => navigate(tasksLink()),
    onCreateClicked: () => navigate(createLink()),
    onTemplateFiltersClicked: () => navigate(templateFiltersLink()),
  };

  const { t } = useTranslationRef(scaffolderTranslationRef);

  return (
    <Page themeId="home">
      <Header
        pageTitleOverride={t('templateGlobals.pageTitle')}
        title={t('templateGlobals.title')}
        subtitle={t('templateGlobals.subtitle')}
      >
        <ScaffolderPageContextMenu {...scaffolderPageContextMenuProps} />
      </Header>
      <Content>
        <TemplateGlobalsPageContent {...{ t }} />
      </Content>
    </Page>
  );
};
