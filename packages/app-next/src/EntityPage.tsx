/*
 * Copyright 2025 The Backstage Authors
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

import React, { useCallback } from 'react';

import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { makeStyles } from '@material-ui/core/styles';

import {
  alertApiRef,
  createFrontendModule,
  useApi,
} from '@backstage/frontend-plugin-api';

import { useEntity } from '@backstage/plugin-catalog-react';
import {
  EntityCardLayoutBlueprint,
  EntityCardLayoutProps,
  EntityHeaderBlueprint,
} from '@backstage/plugin-catalog-react/alpha';

const useStyles = makeStyles(theme => ({
  [theme.breakpoints.up('sm')]: {
    infoArea: {
      order: 1,
    },
    card: {
      alignSelf: 'stretch',
      '& > *': {
        height: '100%',
        minHeight: 400,
      },
    },
  },
}));

function StickyEntityContentOverviewLayout(props: EntityCardLayoutProps) {
  const { cards } = props;
  const classes = useStyles();
  return (
    <Grid container spacing={3}>
      <Grid
        className={classes.infoArea}
        xs={12}
        md={4}
        style={{
          position: 'sticky',
          top: -16,
          alignSelf: 'flex-start',
        }}
        item
      >
        <Grid container spacing={3}>
          {cards
            .filter(card => card.area === 'info')
            .map((card, index) => (
              <Grid key={index} xs={12} item>
                {card.element}
              </Grid>
            ))}
        </Grid>
      </Grid>
      <Grid xs={12} md={8} item>
        <Grid container spacing={3}>
          {cards
            .filter(card => card.area === 'peek')
            .map((card, index) => (
              <Grid key={index} className={classes.card} xs={12} md={6} item>
                {card.element}
              </Grid>
            ))}
          {cards
            .filter(card => !card.area || card.area === 'full')
            .map((card, index) => (
              <Grid key={index} className={classes.card} xs={12} md={6} item>
                {card.element}
              </Grid>
            ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

function CopyEntityNameToClipboard() {
  const { entity } = useEntity();
  const alertApi = useApi(alertApiRef);

  const handleClick = useCallback(() => {
    if (!entity) return;
    window.navigator.clipboard
      .writeText(entity.metadata.name)
      .then(() =>
        alertApi.post({ message: 'Entity name copied to clipboard' }),
      );
  }, [entity, alertApi]);

  return (
    <Tooltip title="Copy to clipboard">
      <IconButton onClick={handleClick}>
        <FileCopyIcon htmlColor="#fff" />
      </IconButton>
    </Tooltip>
  );
}

export const customEntityContentOverviewLayoutModule = createFrontendModule({
  pluginId: 'app',
  extensions: [
    EntityCardLayoutBlueprint.make({
      name: 'sticky',
      params: {
        loader: async () => StickyEntityContentOverviewLayout,
      },
    }),
    EntityHeaderBlueprint.make({
      name: 'default',
      params: {
        title: { actions: [<CopyEntityNameToClipboard />] },
      },
    }),
  ],
});
