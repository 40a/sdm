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

import { ProjectReviewer } from "@atomist/automation-client/operations/review/projectReviewer";
import { DefaultReviewComment } from "@atomist/automation-client/operations/review/ReviewResult";
import { saveFromFiles } from "@atomist/automation-client/project/util/projectUtils";
import { nodeTagger } from "@atomist/spring-automation/commands/tag/nodeTagger";
import { springBootTagger } from "@atomist/spring-automation/commands/tag/springTagger";
import { onAnyPush } from "../../blueprint/dsl/goalDsl";
import { SoftwareDeliveryMachine, SoftwareDeliveryMachineOptions } from "../../blueprint/SoftwareDeliveryMachine";
import { EphemeralLocalArtifactStore } from "../../common/artifact/local/EphemeralLocalArtifactStore";
import { DoNotSetAnyGoals } from "../../common/listener/PushMapping";
import { tagRepo } from "../../common/listener/support/tagRepo";
import { CachingProjectLoader } from "../../common/repo/CachingProjectLoader";
import { springBootGenerator } from "../commands/generators/java/spring/springBootGenerator";
import { nodeGenerator } from "../commands/generators/node/nodeGenerator";

export type ProjectCreationMachineOptions = SoftwareDeliveryMachineOptions;

/**
 * Assemble a machine that performs only project creation and tagging,
 * for Spring/Java and Node
 * @return {SoftwareDeliveryMachine}
 */
export function projectCreationMachine(opts: Partial<ProjectCreationMachineOptions> = {}): SoftwareDeliveryMachine {
    const options: ProjectCreationMachineOptions = {
        artifactStore: new EphemeralLocalArtifactStore(),
        projectLoader: new CachingProjectLoader(),
        ...opts,
    };
    const sdm = new SoftwareDeliveryMachine(
        "Project creation machine",
        options,
        onAnyPush
            .setGoals(DoNotSetAnyGoals));

    sdm.addGenerators(
        () => springBootGenerator({
            seedOwner: "spring-team",
            seedRepo: "spring-rest-seed",
            groupId: "atomist",
            intent: "create spring",
        }),
        () => nodeGenerator({
            seedOwner: "spring-team",
            seedRepo: "typescript-express-seed",
            intent: "create node",
        }),
        () => nodeGenerator({
            seedOwner: "spring-team",
            seedRepo: "minimal-node-seed",
            intent: "create minimal node",
        }))
        .addNewRepoWithCodeActions(
            tagRepo(springBootTagger),
            tagRepo(nodeTagger),
        );
    return sdm;
}

const rodHatesYml: ProjectReviewer = async p => {
    return {
        repoId: p.id,
        comments: await saveFromFiles(p, "**/*.yml", f =>
            new DefaultReviewComment("info", "yml-reviewer",
                `Found YML in \`${f.path}\`: Rod regards the format as an insult to computer science`,
                {
                    path: f.path,
                    lineFrom1: 1,
                    offset: -1,
                })),
    };
};