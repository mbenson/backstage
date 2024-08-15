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
import { Schema } from 'jsonschema';

/** @public */
export type TemplateGlobalFunction<
  Args extends JsonValue[] = JsonValue[],
  Output extends JsonValue | undefined = JsonValue,
> = (...args: Args) => Output;

/** @public */
export type TemplateGlobal = TemplateGlobalFunction | JsonValue;

/** @public */
export type TemplateGlobalValue<T extends JsonValue = JsonValue> = {
  value: T;
  description?: string;
};

/** @public */
export type TemplateGlobalFunctionSchema = {
  arguments?: Schema[];
  output?: Schema;
};

/** @public */
export type TemplateGlobalFunctionExample = {
  description?: string;
  example: string;
  notes?: string;
};

/** @public */
export type TemplateGlobalFunctionMetadata = {
  description?: string;
  schema?: TemplateGlobalFunctionSchema;
  examples?: TemplateGlobalFunctionExample[];
};

/** @public */
export type CreatedTemplateGlobal<
  T extends TemplateGlobalFunction | JsonValue,
> = {
  id: string;
} & (T extends JsonValue
  ? TemplateGlobalValue<T>
  : TemplateGlobalFunctionMetadata & {
      fn: T;
    });
