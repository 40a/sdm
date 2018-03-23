/*
 * Copyright © 2018 Atomist, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { PushTest, pushTest } from "../../PushTest";

/**
 * Is this a seed repo, based on the naming convention
 * that such repos have "-seed" in their name
 * @param {ProjectListenerInvocation} pi
 * @constructor
 */
export const NamedSeedRepo: PushTest = pushTest(
    "Named seed repo",
    pi => pi.id.repo.includes("-seed"));