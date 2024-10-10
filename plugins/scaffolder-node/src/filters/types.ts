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
import { JsonValue } from '@backstage/types';
import { z } from 'zod';

/** @public */
export type TemplateFilter = (
  arg: JsonValue,
  ...rest: JsonValue[]
) => JsonValue | undefined;

/** @public */
export type TemplateFilterSchema<
  Args extends z.ZodTuple<
    | [z.ZodType<JsonValue>]
    | [z.ZodType<JsonValue>, ...(z.ZodType<JsonValue> | z.ZodUnknown)[]],
    z.ZodType<JsonValue> | z.ZodUnknown | null
  >,
  Result extends z.ZodType<JsonValue> | z.ZodUndefined,
> = (zod: typeof z) => z.ZodFunction<Args, Result>;

/** @public */
export type TemplateFilterExample = {
  description?: string;
  example: string;
  notes?: string;
};

/** @public */
export type CreatedTemplateFilter<
  S extends TemplateFilterSchema<any, any> | undefined,
  F extends S extends TemplateFilterSchema<any, any>
    ? z.infer<ReturnType<S>>
    : (arg: JsonValue, ...rest: JsonValue[]) => JsonValue | undefined,
> = {
  id: string;
  description?: string;
  examples?: TemplateFilterExample[];
  schema?: S;
  filter: F;
};
