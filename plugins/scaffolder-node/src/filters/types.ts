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
export type TemplateFilter = (...args: JsonValue[]) => JsonValue | undefined;

/** @public */
export type TemplateFilterSchema = {
  input?: Schema;
  arguments?: Schema[];
  output?: Schema;
};

/** @public */
export type TemplateFilterExample = {
  description?: string;
  example: string;
  notes?: string;
};

/** @public */
export type TemplateFilterMetadata = {
  description?: string;
  schema?: TemplateFilterSchema;
  examples?: TemplateFilterExample[];
};

/** @public */
export type CreatedTemplateFilter<
  TFilterInput extends JsonValue = JsonValue,
  TFilterArguments extends JsonValue[] = JsonValue[],
  TFilterOutput extends JsonValue | undefined = JsonValue,
> = {
  id: string;
  impl: (...args: [TFilterInput, ...TFilterArguments]) => TFilterOutput;
} & TemplateFilterMetadata;
