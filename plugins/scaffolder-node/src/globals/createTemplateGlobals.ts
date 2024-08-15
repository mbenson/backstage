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
import {
  CreatedTemplateGlobal,
  TemplateGlobalFunction,
  TemplateGlobalFunctionExample,
} from './types';

const jsonSchema = (schemaSpec: Schema | z.ZodType) => {
  return schemaSpec instanceof z.ZodType
    ? (zodToJsonSchema(schemaSpec) as Schema)
    : schemaSpec;
};

/** @public */
export type TemplateGlobalValueOptions<T extends JsonValue = JsonValue> = {
  id: string;
  value: T;
  description?: string;
};

/**
 * This function is used to create new template global values in type-safe manner.
 * Will convert zod schemas to json schemas for use throughout the system.
 * @public
 */
export const createTemplateGlobalValue = <T extends JsonValue = JsonValue>(
  value: TemplateGlobalValueOptions<T>,
): CreatedTemplateGlobal<T> => {
  return value as any as CreatedTemplateGlobal<T>;
};

/** @public */
export type TemplateGlobalFunctionOptions<
  TArgumentsSchema extends (Schema | z.ZodType)[] = [],
  TOutputSchema extends Schema | z.ZodType = {},
> = {
  id: string;
  description?: string;
  examples?: TemplateGlobalFunctionExample[];
  schema?: {
    arguments?: TArgumentsSchema;
    output?: TOutputSchema;
  };
};

/**
 * This function is used to create new template global functions in type-safe manner.
 * Will convert zod schemas to json schemas for use throughout the system.
 * @public
 */
export const createTemplateGlobalFunction = <
  TArguments extends JsonValue[] = [],
  TOutput extends JsonValue | undefined = JsonValue,
  TArgumentsSchema extends (Schema | z.ZodType)[] = [],
  TOutputSchema extends Schema | z.ZodType = {},
  TFnArguments extends JsonValue[] = keyof TArgumentsSchema extends never
    ? TArguments
    : {
        [K in keyof TArgumentsSchema]: TArgumentsSchema[K] extends z.ZodType<
          any,
          any,
          infer IReturn
        >
          ? IReturn
          : TArguments;
      },
  TFnOutput extends JsonValue = TOutputSchema extends z.ZodType<
    any,
    any,
    infer IReturn
  >
    ? IReturn
    : TOutput,
>(
  gf: TemplateGlobalFunctionOptions<TArgumentsSchema, TOutputSchema> & {
    fn: (...args: TFnArguments) => TFnOutput;
  },
): CreatedTemplateGlobal<TemplateGlobalFunction> => {
  return {
    ...gf,
    fn: gf.fn as any as TemplateGlobalFunction,
    ...(gf.schema
      ? {
          schema: mapValues(pickBy(gf.schema), spec =>
            Array.isArray(spec)
              ? spec.map(e => jsonSchema(e))
              : jsonSchema(spec),
          ),
        }
      : {}),
  };
};
