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

import React, { ReactNode } from 'react';
import {
  useApp,
  RouteRef,
  AnalyticsContext,
  PluginErrorBoundary,
  BackstagePlugin as LegacyBackstagePlugin,
} from '@backstage/core-plugin-api';
import { BackstagePlugin } from '../wiring';

function hasTitle(routeRef?: any): routeRef is { title: string } {
  return routeRef?.title;
}

export function legacyPluginFrom(
  source?: BackstagePlugin,
): LegacyBackstagePlugin | undefined {
  if (!source) return undefined;

  const notImplemented = () => {
    throw new Error('Not implemented in legacy plugin compatibility layer');
  };

  return {
    getId(): string {
      return source.id;
    },
    get routes() {
      return {};
    },
    get externalRoutes() {
      return {};
    },
    getApis: notImplemented,
    getFeatureFlags: notImplemented,
    provide: notImplemented,
  };
}

/** @public */
export interface ExtensionBoundaryProps {
  id: string;
  source?: BackstagePlugin;
  routeRef?: RouteRef;
  children: ReactNode;
}

/** @public */
export function ExtensionBoundary(props: ExtensionBoundaryProps) {
  const { id, source, routeRef, children } = props;

  const app = useApp();
  const plugin = legacyPluginFrom(source);

  const attributes = {
    extension: id,
    pluginId: plugin?.getId(),
    routeRef: hasTitle(routeRef) ? routeRef.title : undefined,
  };

  return (
    <PluginErrorBoundary app={app} plugin={plugin}>
      <AnalyticsContext attributes={attributes}>{children}</AnalyticsContext>
    </PluginErrorBoundary>
  );
}
