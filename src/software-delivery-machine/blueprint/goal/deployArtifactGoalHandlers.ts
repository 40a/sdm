import { composeFunctionalUnits } from "../../../blueprint/ComposedFunctionalUnit";
import { EmptyFunctionalUnit, FunctionalUnit } from "../../../blueprint/FunctionalUnit";
import { ArtifactDeploySpec, deployArtifactWithLogs } from "../../../common/delivery/deploy/executeDeploy";
import { undeployArtifactWithLogs } from "../../../common/delivery/deploy/executeUndeploy";
import { triggerGoal } from "../../../handlers/commands/RetryGoal";
import { ExecuteGoalOnPendingStatus } from "../../../handlers/events/delivery/ExecuteGoalOnPendingStatus";
import { ExecuteGoalOnSuccessStatus } from "../../../handlers/events/delivery/ExecuteGoalOnSuccessStatus";
import { TargetInfo } from "../../../spi/deploy/Deployment";

export function deployArtifactGoalHandlers<T extends TargetInfo>(spec: ArtifactDeploySpec<T>): FunctionalUnit {
    const deployHandlers = {
        eventHandlers: [
            () => new ExecuteGoalOnSuccessStatus(spec.implementationName,
                spec.deployGoal,
                deployArtifactWithLogs(spec)),
            () => new ExecuteGoalOnPendingStatus(spec.implementationName,
                spec.deployGoal,
                deployArtifactWithLogs(spec)),
        ],
        commandHandlers: [
            () => triggerGoal(spec.implementationName, spec.deployGoal),
        ],
    };

    const undeployHandlers = spec.undeploy ? {
        eventHandlers: [
            () => new ExecuteGoalOnPendingStatus(spec.undeploy.implementationName,
                spec.undeploy.goal,
                undeployArtifactWithLogs(spec), true),
        ],
        commandHandlers: [
            () => triggerGoal(spec.undeploy.implementationName, spec.undeploy.goal),
        ],
    } : EmptyFunctionalUnit;

    return composeFunctionalUnits(deployHandlers, undeployHandlers);
}