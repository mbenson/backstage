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
import { mapValues, pickBy } from 'lodash';
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import { CreatedTemplateFilter, TemplateFilterExample } from './types';

const jsonSchema = (schemaSpec: Schema | z.ZodType) => {
  return schemaSpec instanceof z.ZodType
    ? (zodToJsonSchema(schemaSpec) as Schema)
    : schemaSpec;
};

/** @public */
export type TemplateFilterOptions<
  TInputSchema extends Schema | z.ZodType = {},
  TArgumentsSchema extends (Schema | z.ZodType)[] = [],
  TOutputSchema extends Schema | z.ZodType = {},
> = {
  id: string;
  description?: string;
  examples?: TemplateFilterExample[];
  schema?: {
    input?: TInputSchema;
    arguments?: TArgumentsSchema;
    output?: TOutputSchema;
  };
};

type ConditionalZodResult<
  S extends Schema | z.ZodType,
  D,
> = S extends z.ZodType<any, any, infer IReturn> ? IReturn : D;

/**
 * This function is used to create new template filters to get type safety.
 * Will convert zod schemas to json schemas for use throughout the system.
 * @public
 */
export const createTemplateFilter = <
  TInput extends JsonValue = JsonValue,
  TArguments extends JsonValue[] = [],
  TOutput extends JsonValue | undefined = JsonValue,
  TInputSchema extends Schema | z.ZodType = {},
  TArgumentsSchema extends (Schema | z.ZodType)[] = [],
  TOutputSchema extends Schema | z.ZodType = {},
  TFilterInput extends JsonValue = ConditionalZodResult<TInputSchema, TInput>,
  TFilterArguments extends JsonValue[] = keyof TArgumentsSchema extends never
    ? TArguments
    : {
        [K in keyof TArgumentsSchema]: ConditionalZodResult<
          TArgumentsSchema[K],
          JsonValue
        >;
      },
  TFilterOutput extends JsonValue = ConditionalZodResult<
    TOutputSchema,
    TOutput
  >,
>(
  filter: TemplateFilterOptions<
    TInputSchema,
    TArgumentsSchema,
    TOutputSchema
  > & { impl: (...args: [TFilterInput, ...TFilterArguments]) => TFilterOutput },
): CreatedTemplateFilter<TFilterInput, TFilterArguments, TFilterOutput> => {
  return {
    ...filter,
    ...(filter.schema
      ? {
          schema: mapValues(pickBy(filter.schema), spec =>
            Array.isArray(spec)
              ? spec.map(e => jsonSchema(e))
              : jsonSchema(spec),
          ),
        }
      : {}),
  };
};
