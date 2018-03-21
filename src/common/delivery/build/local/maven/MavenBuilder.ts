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

import { ProjectOperationCredentials } from "@atomist/automation-client/operations/common/ProjectOperationCredentials";
import { RemoteRepoRef } from "@atomist/automation-client/operations/common/RepoId";
import { spawn } from "child_process";
import { ArtifactStore } from "../../../../../spi/artifact/ArtifactStore";
import { AppInfo } from "../../../../../spi/deploy/Deployment";
import { LogInterpretation, LogInterpreter } from "../../../../../spi/log/InterpretedLog";
import { LogFactory, ProgressLog } from "../../../../../spi/log/ProgressLog";
import { ProjectLoader } from "../../../../repo/ProjectLoader";
import { AddressChannels } from "../../../../slack/addressChannels";
import { LocalBuilder, LocalBuildInProgress } from "../LocalBuilder";
import { interpretMavenLog } from "./mavenLogInterpreter";
import { identification } from "./pomParser";

/**
 * Build with Maven in the local automation client.
 * This implementation requires Java and maven on the classpath.
 * Note it is NOT intended for use for multiple organizations. It's OK
 * for one organization to use inside its firewall, but there is potential
 * vulnerability in builds of unrelated tenants getting at each others
 * artifacts.
 */
export class MavenBuilder extends LocalBuilder implements LogInterpretation {

    constructor(artifactStore: ArtifactStore,
                logFactory: LogFactory,
                projectLoader: ProjectLoader,
                private skipTests: boolean = true) {
        super("MavenBuilder", artifactStore, logFactory, projectLoader);
    }

    protected async startBuild(credentials: ProjectOperationCredentials,
                               id: RemoteRepoRef,
                               atomistTeam: string,
                               log: ProgressLog,
                               addressChannels: AddressChannels): Promise<LocalBuildInProgress> {
        return this.projectLoader.doWithProject({credentials, id, readOnly: true}, async p => {
            // Find the artifact info from Maven
            const pom = await p.findFile("pom.xml");
            const content = await pom.getContent();
            const va = await identification(content);
            const appId = {...va, name: va.artifact, id};

            // TODO update to take skipTests parameter
            const childProcess = spawn("mvn", [
                "package",
                "-DskipTests",
            ], {
                cwd: p.baseDir,
            });
            if (!childProcess.pid) {
                await addressChannels("Fatal error building using Maven--is `mvn` on your automation node path?\n" +
                    "Attempted to execute `mvn package`");
            }

            // TODO update to use new watchSpawned support
            const buildResult = new Promise<{ error: boolean, code: number }>((resolve, reject) => {
                childProcess.stdout.on("data", data => {
                    log.write(data.toString());
                });
                childProcess.addListener("exit", (code, signal) => {
                    resolve({error: log.log.includes("[ERROR]"), code});
                });
                childProcess.addListener("error", (code, signal) => {
                    resolve({error: true, code});
                });
            });
            const rb = new UpdatingBuild(id, buildResult, atomistTeam, log.url);
            rb.ai = appId;
            rb.deploymentUnitFile = `${p.baseDir}/target/${appId.name}-${appId.version}.jar`;
            return rb;
        });
    }

    public logInterpreter: LogInterpreter = log => interpretMavenLog(log);

}

class UpdatingBuild implements LocalBuildInProgress {

    constructor(public repoRef: RemoteRepoRef,
                public buildResult: Promise<{ error: boolean, code: number }>,
                public team: string,
                public url: string) {
    }

    public ai: AppInfo;

    public deploymentUnitFile: string;

    get appInfo(): AppInfo {
        return this.ai;
    }

}
