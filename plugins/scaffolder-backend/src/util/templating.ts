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
  CreatedTemplateFilter,
  CreatedTemplateGlobal,
  TemplateFilter,
  TemplateFilterMetadata,
  TemplateGlobal,
  TemplateGlobalFunction,
  TemplateGlobalFunctionMetadata,
  TemplateGlobalValue,
} from '@backstage/plugin-scaffolder-node';
import { JsonValue } from '@backstage/types';
import {
  filter,
  fromPairs,
  keyBy,
  mapValues,
  negate,
  omit,
  pick,
  toPairs,
} from 'lodash';

export function templateFilterImpls(
  filters?: Record<string, TemplateFilter> | CreatedTemplateFilter[],
): Record<string, TemplateFilter> {
  if (!filters) {
    return {};
  }
  if (Array.isArray(filters)) {
    return mapValues(keyBy(filters, 'id'), f => f.impl as TemplateFilter);
  }
  return filters;
}

export function templateFilterMetadata(
  filters?: Record<string, TemplateFilter> | CreatedTemplateFilter[],
): Record<string, Partial<TemplateFilterMetadata>> {
  if (!filters) {
    return {};
  }
  if (Array.isArray(filters)) {
    return mapValues(keyBy(filters, 'id'), f => omit(f, 'id', 'impl'));
  }
  return mapValues(filters, _ => ({}));
}

function isGlobalFunctionInfo(
  global: CreatedTemplateGlobal<any>,
): global is CreatedTemplateGlobal<TemplateGlobalFunction> {
  return Object.hasOwn(global, 'fn');
}

type GlobalRecordRow = [string, TemplateGlobal];

export function templateGlobalFunctionMetadata(
  globals?: Record<string, TemplateGlobal> | CreatedTemplateGlobal<any>[],
): Record<string, TemplateGlobalFunctionMetadata> {
  if (!globals) {
    return {};
  }
  if (!Array.isArray(globals)) {
    const rows = toPairs(globals) as GlobalRecordRow[];
    const fns = rows.filter(([_, g]) => typeof g === 'function') as [
      string,
      Exclude<TemplateGlobal, JsonValue>,
    ][];
    return fromPairs(fns.map(([k, _]) => [k, {}]));
  }
  return mapValues(keyBy(filter(globals, isGlobalFunctionInfo), 'id'), v =>
    pick(v, 'description', 'schema', 'examples'),
  );
}

export function templateGlobalValueMetadata(
  globals?: Record<string, TemplateGlobal> | CreatedTemplateGlobal<any>[],
): Record<string, TemplateGlobalValue<any>> {
  if (!globals) {
    return {};
  }
  if (!Array.isArray(globals)) {
    const rows = toPairs(globals) as GlobalRecordRow[];
    const vals = rows.filter(([_, g]) => typeof g !== 'function') as [
      string,
      JsonValue,
    ][];
    return fromPairs(vals.map(([k, value]) => [k, { value }]));
  }
  return mapValues(
    keyBy(
      filter(
        globals,
        negate(isGlobalFunctionInfo),
      ) as CreatedTemplateGlobal<JsonValue>[],
      'id',
    ),
    v => pick(v, 'value', 'description') as TemplateGlobalValue,
  );
}

export function templateGlobals(
  globals?: Record<string, TemplateGlobal> | CreatedTemplateGlobal<any>[],
): Record<string, TemplateGlobal> {
  if (!globals) {
    return {};
  }
  if (!Array.isArray(globals)) {
    return globals;
  }
  return mapValues(keyBy(globals, 'id'), v =>
    isGlobalFunctionInfo(v) ? v.fn : (v as TemplateGlobalValue).value,
  );
}
