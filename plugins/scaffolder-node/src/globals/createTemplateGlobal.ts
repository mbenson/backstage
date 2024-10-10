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
import {
  CreatedTemplateGlobalFunction,
  CreatedTemplateGlobalValue,
  TemplateGlobalFunctionSchema,
} from './types';
import { z } from 'zod';

/**
 * This function is used to created new template global values in type-safe manner.
 * @param v - CreatedTemplateGlobalValue
 * @returns v
 * @public
 */
export const createTemplateGlobalValue = (
  v: CreatedTemplateGlobalValue,
): CreatedTemplateGlobalValue => v;

/**
 * This function is used to created new template global functions in type-safe manner.
 * @param fn - CreatedTemplateGlobalFunction
 * @returns fn
 * @public
 */
export const createTemplateGlobalFunction = <
  S extends TemplateGlobalFunctionSchema<any, any> | undefined,
  F extends S extends TemplateGlobalFunctionSchema<any, any>
    ? z.infer<ReturnType<S>>
    : (...args: JsonValue[]) => JsonValue | undefined,
>(
  fn: CreatedTemplateGlobalFunction<S, F>,
): CreatedTemplateGlobalFunction<any, any> => fn;
