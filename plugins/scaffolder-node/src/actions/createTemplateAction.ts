/*
 * Copyright 2021 The Backstage Authors
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

import { ActionContext, TemplateAction } from './types';
import { z } from 'zod';
import { Schema } from 'jsonschema';
import zodToJsonSchema from 'zod-to-json-schema';
import { JsonObject } from '@backstage/types';

/** @public */
export type TemplateExample = {
  description: string;
  example: string;
};

/** @public */
export type TemplateActionOptions<
  TActionInput extends JsonObject = {},
  TActionOutput extends JsonObject = {},
  TInputSchema extends Schema | z.ZodType = {},
  TOutputSchema extends Schema | z.ZodType = {},
> = {
  id: string;
  description?: string;
  examples?: TemplateExample[];
  supportsDryRun?: boolean;
  schema?: [TInputSchema, TOutputSchema] extends [
    z.ZodObject<any>,
    z.ZodObject<any>,
  ]
    ? (
        zodImpl: typeof z,
      ) => z.ZodPipeline<
        Extract<TInputSchema, z.ZodObject<any>>,
        Extract<TOutputSchema, z.ZodObject<any>>
      >
    : {
        input?: TInputSchema;
        output?: TOutputSchema;
      };
  handler: (ctx: ActionContext<TActionInput, TActionOutput>) => Promise<void>;
};

/**
 * This function is used to create new template actions to get type safety.
 * Will convert zod schemas to json schemas for use throughout the system.
 * @public
 */
export const createTemplateAction = <
  TInputParams extends JsonObject = JsonObject,
  TOutputParams extends JsonObject = JsonObject,
  TInputSchema extends Schema | z.ZodType = {},
  TOutputSchema extends Schema | z.ZodType = {},
  TActionInput extends JsonObject = TInputSchema extends z.ZodType<
    any,
    any,
    infer IReturn
  >
    ? IReturn
    : TInputParams,
  TActionOutput extends JsonObject = TOutputSchema extends z.ZodType<
    any,
    any,
    infer IReturn
  >
    ? IReturn
    : TOutputParams,
>(
  action: TemplateActionOptions<
    TActionInput,
    TActionOutput,
    TInputSchema,
    TOutputSchema
  >,
): TemplateAction<TActionInput, TActionOutput> => {
  let inputSchema: Schema | undefined;
  let outputSchema: Schema | undefined;

  if (typeof action.schema === 'function') {
    const pipe = action.schema(z);

    inputSchema = zodToJsonSchema(pipe._def.in) as Schema;
    outputSchema = zodToJsonSchema(pipe._def.out) as Schema;
  } else if (action.schema) {
    inputSchema =
      action.schema.input instanceof z.ZodType
        ? (zodToJsonSchema(action.schema.input) as Schema)
        : action.schema.input;

    outputSchema =
      action.schema.output instanceof z.ZodType
        ? (zodToJsonSchema(action.schema.output) as Schema)
        : action.schema?.output;
  }
  return {
    ...action,
    schema: {
      ...action.schema,
      input: inputSchema,
      output: outputSchema,
    },
  };
};
