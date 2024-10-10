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
export type TemplateGlobalFunction<
  Args extends JsonValue[] = JsonValue[],
  Output extends JsonValue | undefined = JsonValue | undefined,
> = (...args: Args) => Output;

/** @public */
export type TemplateGlobal = TemplateGlobalFunction | JsonValue;

/** @public */
export type CreatedTemplateGlobalValue<T extends JsonValue = JsonValue> = {
  id: string;
  value: T;
  description?: string;
};

/** @public */
export type TemplateGlobalFunctionSchema<
  Args extends z.ZodTuple<
    [] | [z.ZodType<JsonValue>, ...(z.ZodType<JsonValue> | z.ZodUnknown)[]],
    z.ZodType<JsonValue> | z.ZodUnknown | null
  >,
  Result extends z.ZodType<JsonValue> | z.ZodUndefined,
> = (zod: typeof z) => z.ZodFunction<Args, Result>;

/** @public */
export type TemplateGlobalFunctionExample = {
  description?: string;
  example: string;
  notes?: string;
};

/** @public */
export type CreatedTemplateGlobalFunction<
  S extends TemplateGlobalFunctionSchema<any, any> | undefined,
  F extends S extends TemplateGlobalFunctionSchema<any, any>
    ? z.infer<ReturnType<S>>
    : (...args: JsonValue[]) => JsonValue | undefined,
> = {
  id: string;
  description?: string;
  examples?: TemplateGlobalFunctionExample[];
  schema?: S;
  fn: F;
};

/** @public */
export type CreatedTemplateGlobal =
  | CreatedTemplateGlobalValue<any>
  | CreatedTemplateGlobalFunction<any, any>;
