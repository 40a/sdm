/*
 * Copyright © 2018 Atomist, Inc.
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

import { GitProject } from "@atomist/automation-client/project/git/GitProject";
import { ExecuteGoalResult } from "../../common/delivery/goals/ExecuteGoalResult";
import { ProgressLog } from "../../spi/log/ProgressLog";
import { StatusForExecuteGoal } from "../../typings/types";
import { RepoContext } from "../context/SdmContext";

export type ExecuteGoalWithLog = (r: RunWithLogContext) => Promise<ExecuteGoalResult>;

export type PrepareForGoalExecution = (p: GitProject, r: RunWithLogContext) => Promise<ExecuteGoalResult>;

export interface RunWithLogContext extends RepoContext {

    status: StatusForExecuteGoal.Fragment;
    progressLog: ProgressLog;

}
