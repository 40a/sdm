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

import { logger } from "@atomist/automation-client";
import { ChildProcess } from "child_process";
import { ProgressLog } from "../../spi/log/ProgressLog";

import * as strip_ansi from "strip-ansi";

export type ErrorFinder = (code: number, signal: string, log: ProgressLog) => boolean;

export interface ChildProcessResult {
    error: boolean;
    code: number;
}

export interface SpawnWatchOptions {
    errorFinder: ErrorFinder;
    stripAnsi: boolean;
}

/**
 * Handle the result of a spawned process, streaming back
 * output to log
 * @param {"child_process".ChildProcess} childProcess
 * @param {ProgressLog} log
 * @param opts: Options for error parsing, ANSI code stripping etc.
 * @return {Promise<ChildProcessResult>}
 */
export function watchSpawned(childProcess: ChildProcess,
                             log: ProgressLog,
                             opts: Partial<SpawnWatchOptions> = {}): Promise<ChildProcessResult> {
    return new Promise<ChildProcessResult>((resolve, reject) => {
        const optsToUse = {
            errorFinder: code => code !== 0,
            stripAnsi: false,
            ...opts,
        };

        function sendToLog(data) {
            const formatted = optsToUse.stripAnsi ? strip_ansi(data.toString()) : data.toString();
            return log.write(formatted);
        }

        childProcess.stdout.on("data", data => sendToLog(data));
        childProcess.stderr.on("data", data => sendToLog(data));
        childProcess.addListener("exit", (code, signal) => {
            resolve({
                error: opts.errorFinder(code, signal, log),
                code,
            });
        });
        childProcess.addListener("error", err => {
            logger.warn("Spawn failure: %s", err);
            reject(err);
        });
    });
}

/**
 * The first two arguments to spawn
 */
export interface SpawnCommand {

    command: string;
    args?: string[];
}

/**
 * Convenient function to create a spawn command from a sentence such as "npm run compile"
 * @param {string} sentence
 * @return {SpawnCommand}
 */
export function asSpawnCommand(sentence: string): SpawnCommand {
    const split = sentence.split(" ");
    return {
        command: split[0],
        args: split.slice(1),
    };
}