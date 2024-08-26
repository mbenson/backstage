/*
 * Copyright 2022 The Backstage Authors
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

import { BackendFeature } from '../../types';

/**
 * TODO
 *
 * @public
 */
export type ServiceRef<
  TService,
  TScope extends 'root' | 'plugin' = 'root' | 'plugin',
  TInstances extends 'singleton' | 'multiton' = 'singleton' | 'multiton',
> = {
  id: string;

  /**
   * This determines the scope at which this service is available.
   *
   * Root scoped services are available to all other services but
   * may only depend on other root scoped services.
   *
   * Plugin scoped services are only available to other plugin scoped
   * services but may depend on all other services.
   */
  scope: TScope;

  multiton?: TInstances extends 'multiton' ? true : false;

  /**
   * Utility for getting the type of the service, using `typeof serviceRef.T`.
   * Attempting to actually read this value will result in an exception.
   */
  T: TService;

  $$type: '@backstage/ServiceRef';
};

/** @public */
export interface ServiceFactory<
  TService = unknown,
  TScope extends 'plugin' | 'root' = 'plugin' | 'root',
  TInstances extends 'singleton' | 'multiton' = 'singleton' | 'multiton',
> extends BackendFeature {
  service: ServiceRef<TService, TScope, TInstances>;
}

/** @internal */
export interface InternalServiceFactory<
  TService = unknown,
  TScope extends 'plugin' | 'root' = 'plugin' | 'root',
  TInstances extends 'singleton' | 'multiton' = 'singleton' | 'multiton',
> extends ServiceFactory<TService, TScope, TInstances> {
  version: 'v1';
  featureType: 'service';
  initialization?: 'always' | 'lazy';
  deps: { [key in string]: ServiceRef<unknown> };
  createRootContext?(deps: { [key in string]: unknown }): Promise<unknown>;
  factory(
    deps: { [key in string]: unknown },
    context: unknown,
  ): Promise<TService>;
}

/** @public */
export interface ServiceRefOptions<
  TService,
  TScope extends 'root' | 'plugin',
  TInstances extends 'singleton' | 'multiton',
> {
  id: string;
  scope?: TScope;
  multiton?: TInstances extends 'multiton' ? true : false;
  defaultFactory?(
    service: ServiceRef<TService, TScope>,
  ): Promise<ServiceFactory>;
}

/**
 * Creates a new service definition. This overload is used to create plugin scoped services.
 *
 * @public
 */
export function createServiceRef<TService>(
  options: ServiceRefOptions<TService, 'plugin', 'singleton'>,
): ServiceRef<TService, 'plugin', 'singleton'>;

/**
 * Creates a new service definition. This overload is used to create root scoped services.
 *
 * @public
 */
export function createServiceRef<TService>(
  options: ServiceRefOptions<TService, 'root', 'singleton'>,
): ServiceRef<TService, 'root', 'singleton'>;

/**
 * Creates a new service definition. This overload is used to create plugin scoped services.
 *
 * @public
 */
export function createServiceRef<TService>(
  options: ServiceRefOptions<TService, 'plugin', 'multiton'>,
): ServiceRef<TService, 'plugin', 'multiton'>;

/**
 * Creates a new service definition. This overload is used to create root scoped services.
 *
 * @public
 */
export function createServiceRef<TService>(
  options: ServiceRefOptions<TService, 'root', 'multiton'>,
): ServiceRef<TService, 'root', 'multiton'>;
export function createServiceRef<
  TService,
  TInstances extends 'singleton' | 'multiton',
>(
  options: ServiceRefOptions<TService, any, TInstances>,
): ServiceRef<TService, any, TInstances> {
  const { id, scope = 'plugin', multiton = false, defaultFactory } = options;
  return {
    id,
    scope,
    multiton,
    get T(): TService {
      throw new Error(`tried to read ServiceRef.T of ${this}`);
    },
    toString() {
      return `serviceRef{${options.id}}`;
    },
    $$type: '@backstage/ServiceRef',
    __defaultFactory: defaultFactory,
  } as ServiceRef<TService, typeof scope, TInstances> & {
    __defaultFactory?: (
      service: ServiceRef<TService>,
    ) => Promise<ServiceFactory<TService>>;
  };
}

/** @ignore */
type ServiceRefsToInstances<
  T extends { [key in string]: ServiceRef<unknown> },
  TScope extends 'root' | 'plugin' = 'root' | 'plugin',
> = {
  [key in keyof T as T[key]['scope'] extends TScope
    ? key
    : never]: T[key]['multiton'] extends true | undefined
    ? Array<T[key]['T']>
    : T[key]['T'];
};

/** @public */
export interface RootServiceFactoryOptions<
  TInstances extends 'singleton' | 'multiton',
  TImpl extends ServiceRef<unknown, 'root', TInstances>,
  TDeps extends { [name in string]: ServiceRef<unknown> },
> {
  /**
   * The initialization strategy for the service factory. This service is root scoped and will use `always` by default.
   *
   * @remarks
   *
   * - `always` - The service will always be initialized regardless if it is used or not.
   * - `lazy` - The service will only be initialized if it is depended on by a different service or feature.
   *
   * Service factories for root scoped services use `always` as the default, while plugin scoped services use `lazy`.
   */
  initialization?: 'always' | 'lazy';
  service: ServiceRef<unknown, 'root', TInstances>;
  deps: TDeps;
  factory(deps: ServiceRefsToInstances<TDeps, 'root'>): TImpl | Promise<TImpl>;
}

/** @public */
export interface PluginServiceFactoryOptions<
  TInstances extends 'singleton' | 'multiton',
  TContext,
  TImpl extends ServiceRef<unknown, 'plugin', TInstances>,
  TDeps extends { [name in string]: ServiceRef<unknown> },
> {
  /**
   * The initialization strategy for the service factory. This service is plugin scoped and will use `lazy` by default.
   *
   * @remarks
   *
   * - `always` - The service will always be initialized regardless if it is used or not.
   * - `lazy` - The service will only be initialized if it is depended on by a different service or feature.
   *
   * Service factories for root scoped services use `always` as the default, while plugin scoped services use `lazy`.
   */
  initialization?: 'always' | 'lazy';
  service: ServiceRef<unknown, 'plugin', TInstances>;
  deps: TDeps;
  createRootContext?(
    deps: ServiceRefsToInstances<TDeps, 'root'>,
  ): TContext | Promise<TContext>;
  factory(
    deps: ServiceRefsToInstances<TDeps>,
    context: TContext,
  ): TImpl | Promise<TImpl>;
}

/**
 * Creates a root scoped service factory without options.
 *
 * @public
 * @param options - The service factory configuration.
 */
export function createServiceFactory<
  TInstances extends 'singleton' | 'multiton',
  TImpl extends ServiceRef<unknown, 'root', TInstances>,
  TDeps extends { [name in string]: ServiceRef<unknown, 'root'> },
>(
  options: RootServiceFactoryOptions<TInstances, TImpl, TDeps>,
): ServiceFactory<
  ServiceRef<unknown, 'root', TInstances>['T'],
  'root',
  TInstances
>;
/**
 * Creates a plugin scoped service factory without options.
 *
 * @public
 * @param options - The service factory configuration.
 */
export function createServiceFactory<
  TInstances extends 'singleton' | 'multiton',
  TImpl extends ServiceRef<unknown, 'plugin', TInstances>,
  TDeps extends { [name in string]: ServiceRef<unknown> },
  TContext = undefined,
>(
  options: PluginServiceFactoryOptions<TInstances, TContext, TImpl, TDeps>,
): ServiceFactory<
  ServiceRef<unknown, 'plugin', TInstances>['T'],
  'plugin',
  TInstances
>;
export function createServiceFactory<
  TInstances extends 'singleton' | 'multiton',
  TDeps extends { [name in string]: ServiceRef<unknown> },
  TContext,
>(
  options:
    | RootServiceFactoryOptions<
        TInstances,
        ServiceRef<unknown, 'root', TInstances>,
        TDeps
      >
    | PluginServiceFactoryOptions<
        TInstances,
        TContext,
        ServiceRef<unknown, 'plugin', TInstances>,
        TDeps
      >,
): ServiceFactory<
  ServiceRef<unknown, 'root' | 'plugin', TInstances>,
  'root' | 'plugin',
  'singleton' | 'multiton'
> {
  if (options.service.scope === 'root') {
    const c = options as RootServiceFactoryOptions<
      TInstances,
      ServiceRef<unknown, 'root', TInstances>,
      TDeps
    >;
    return {
      $$type: '@backstage/BackendFeature',
      version: 'v1',
      featureType: 'service',
      service: c.service,
      initialization: c.initialization,
      deps: options.deps,
      factory: async (deps: ServiceRefsToInstances<TDeps, 'root'>) =>
        c.factory(deps),
    } as InternalServiceFactory<
      ServiceRef<unknown, 'root', TInstances>,
      'root',
      TInstances
    >;
  }
  const c = options as PluginServiceFactoryOptions<
    TInstances,
    TContext,
    ServiceRef<unknown, 'plugin', TInstances>,
    TDeps
  >;
  return {
    $$type: '@backstage/BackendFeature',
    version: 'v1',
    featureType: 'service',
    service: c.service,
    initialization: c.initialization,
    ...('createRootContext' in options
      ? {
          createRootContext: async (
            deps: ServiceRefsToInstances<TDeps, 'root'>,
          ) => c?.createRootContext?.(deps),
        }
      : {}),
    deps: options.deps,
    factory: async (deps: ServiceRefsToInstances<TDeps>, ctx: TContext) =>
      c.factory(deps, ctx),
  } as InternalServiceFactory<
    ServiceRef<unknown, 'plugin', TInstances>,
    'plugin',
    TInstances
  >;
}
