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
import { ScmIntegrations } from '@backstage/integration';
import parseRepoUrl from './parseRepoUrl';
import parseEntityRef from './parseEntityRef';
import pick from './pick';
import projectSlug from './projectSlug';

export default (options: { integrations: ScmIntegrations }) => [
  parseRepoUrl(options.integrations),
  parseEntityRef,
  pick,
  projectSlug(options.integrations),
];