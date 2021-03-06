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

import { logger } from "@atomist/automation-client";
import {
    BaseContext,
    GitHubStatusContext,
} from "./GitHubContext";
import { GoalEnvironment } from "./support/environment";

/**
 * Core data for a goal
 */
export interface GoalDefinition {

    /**
     * Must be unique among goals
     * Should be camel case
     */
    uniqueName: string;

    environment: GoalEnvironment;
    orderedName: string;
    displayName?: string;
    completedDescription?: string;
    workingDescription?: string;
    failedDescription?: string;
    waitingForApprovalDescription?: string;

    // when set to true, this goal will execute in its own container/client
    isolated?: boolean;

    // when set to true, this goal requires approval before it is marked success
    approvalRequired?: boolean;

    // when set to true, this goal can be retried in case of failure
    retryFeasible?: boolean;
}

const ValidGoalName = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

/**
 * Represents a delivery action, such as Build or Deploy.
 */
export class Goal {

    public readonly context: GitHubStatusContext;
    public readonly name: string;
    public readonly definition: GoalDefinition;
    public readonly uniqueCamelCaseName: string;

    get environment() {
        return this.definition.environment;
    }

    get successDescription() {
        return this.definition.completedDescription || ("Complete: " + this.name);
    }

    get inProcessDescription() {
        return this.definition.workingDescription || ("Working: " + this.name);
    }

    get failureDescription() {
        return this.definition.failedDescription || ("Failed: " + this.name);
    }

    get requestedDescription() {
        return "Planned: " + this.name;
    }

    get waitingForApprovalDescription() {
        return this.definition.waitingForApprovalDescription || (this.successDescription + "(but needs approval)");
    }

    get retryIntent() {
        return "trigger " + this.name;
    }

    constructor(definition: GoalDefinition) {
        if (!ValidGoalName.test(definition.uniqueName)) {
            throw new Error(`${definition.uniqueName} is not a valid goal name: Must be camel case`);
        }
        this.definition = definition;
        this.context = BaseContext + definition.environment + definition.orderedName;

        this.uniqueCamelCaseName = definition.uniqueName;

        const numberAndName = /([0-9\.]+)-(.*)/;
        const matchGoal = definition.orderedName.match(numberAndName);
        if (!matchGoal) {
            logger.debug(`Ordered name was not '#-name'. Did not find number and name in ${definition.orderedName}`);
        }

        this.name = definition.displayName || (matchGoal && matchGoal[2]) || definition.orderedName;

    }
}

export class GoalWithPrecondition extends Goal {

    public readonly dependsOn: Goal[];

    constructor(definition: GoalDefinition, ...dependsOn: Goal[]) {
        super(definition);
        this.dependsOn = dependsOn;
    }

}

export function hasPreconditions(goal: Goal): goal is GoalWithPrecondition {
    return !!(goal as GoalWithPrecondition).dependsOn;
}
