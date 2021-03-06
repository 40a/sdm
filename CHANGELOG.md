# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased](https://github.com/atomist/sdm/compare/1.0.0-M.1...HEAD)

### Added

-   Added `EnforceableProjectInvariantRegistration`.
-   Added `AutoInspectRegistration`.
-   Register shutdown hooks to clean up cloned directories. [#494](https://github.com/atomist/sdm/issues/494)

### Changed

-   **BREAKING** `AutofixRegistration.parameters` method renamed to `parametersInstance`.
-   **BREAKING** `CodeTransformRegistration.react` method renamed to `onTransformResults`.
-   **BREAKING** `CodeInspectionRegistration.react` method renamed to `onInspectionResults`.
-   **BREAKING** `ReviewerRegistration.action` renamed `inspect`.
-   **BREAKING** Rename `ReviewGoal` -> \`CodeInspectionGoal. [#e30b6c1](https://github.com/atomist/sdm/commit/e30b6c15ffc3b35bf1fc09cd822f9a6fee1ee5a6)
-   **BREAKING** Evaluate pushTest when selecting goal implementations. [#493](https://github.com/atomist/sdm/issues/493)

## [1.0.0-M.1](https://github.com/atomist/sdm/compare/0.4.8...1.0.0-M.1) - 2018-08-27

### Changed

-   Prepare for 1.0.0 release.

## [0.4.8](https://github.com/atomist/sdm/compare/0.4.7...0.4.8) - 2018-08-27

### Added

-   Specific logging on cleanup of cached project. [#483](https://github.com/atomist/sdm/issues/483)

## [0.4.7](https://github.com/atomist/sdm/compare/0.4.6...0.4.7) - 2018-08-24

## [0.4.6](https://github.com/atomist/sdm/compare/0.4.5...0.4.6) - 2018-08-24

## [0.4.5](https://github.com/atomist/sdm/compare/0.4.4...0.4.5) - 2018-08-23

## [0.4.4](https://github.com/atomist/sdm/compare/0.4.3...0.4.4) - 2018-08-22

### Fixed

-   CachingProjectLoader doesn’t clean file system resources. [#482](https://github.com/atomist/sdm/issues/482)

## [0.4.3](https://github.com/atomist/sdm/compare/0.4.2...0.4.3) - 2018-08-21

## [0.4.2](https://github.com/atomist/sdm/compare/0.4.1...0.4.2) - 2018-08-17

## [0.4.1](https://github.com/atomist/sdm/compare/0.4.0...0.4.1) - 2018-08-09

### Added

-   By default, address channels on a transform. [#474](https://github.com/atomist/sdm/issues/474)
-   Key types from `automation-client` are now exported by this module, which serves as the main Atomist API.

### Changed

-   Fixed name of OnIssueAction GraphQL subscription.

### Deprecated

-   OnNewIssue GraphQL subscription.

## [0.4.0](https://github.com/atomist/sdm/compare/0.3.1...0.4.0) - 2018-08-07

### Added

-   Add paging for goals. [#436](https://github.com/atomist/sdm/issues/436)
-   Add DSL for creating Goals. [#437](https://github.com/atomist/sdm/issues/437)
-   Add "build aware" code transform support. Replaces "dry run" support presently in `sdm-core`.
-   `CodeTransform` now takes a second argument of type `CommandListenerInvocation` for consistency and to expose more context to transforms.
-   `CodeInspecton` registration to run a non-mutating command against one or more repositories.
-   Add goal set completion listener. [#275](https://github.com/atomist/sdm/issues/275)
-   Support BitBucket. [#225](https://github.com/atomist/sdm/issues/225)
-   `CodeTransform` registration can now specify a `react` method to run after transforms are complete.
-   Add ability to extract and report goal Progress. [#455](https://github.com/atomist/sdm/issues/455)
-   Add predicate mapping cost analyzer. [#459](https://github.com/atomist/sdm/issues/459)
-   Collect names of Goal and Goals instances in contributor model. [#461](https://github.com/atomist/sdm/issues/461)
-   Add `GoalExecutionListener` to track goal execution within an SDM.
-   Add support voting on goal approval in an SDM. [#465](https://github.com/atomist/sdm/issues/465)
-   Add goal locking model through `LockingGoal` and `Goals.andLock()`

### Changed

-   **BREAKING** Command handler and autofix registrations are now strongly typed, defaulting to `NoParameters` rather than `any`.
-   **BREAKING** Remove deprecated `addEditor` SDM method, and deprecated `createTransform` method on `ProjectOperationRegistration`.
-   **BREAKING** `addPushReaction` renamed `addPushImpactListener` for consistency.
-   **BREAKING** `addNewRepoWithCodeAction` renamed `addNewRepoWithCodeListener` for consistency.
-   **BREAKING**  `CodeTransformRegistration.editMode` is replaced by `transformPresentation`.
-   **BREAKING** `CommandHandler` registrations must now specify a `listener`. `createCommand` alternative is removed.
-   **BREAKING** Review listeners must now have names. Introduced `ReviewListenerRegistration`

### Fixed

-   Make a better workaround for not getting org token on custom events. [#279](https://github.com/atomist/sdm/issues/279)
-   Link is missing on npm publish goal. [#447](https://github.com/atomist/sdm/issues/447)

## [0.3.1](https://github.com/atomist/sdm/compare/0.3.0...0.3.1) - 2018-07-05

### Added

-   Timeout goals after 10mins or config value. [#427](https://github.com/atomist/sdm/issues/427)
-   Allow generator registrations to specify a starting point. [#425](https://github.com/atomist/sdm/issues/425)

### Changed

-   Rename "editor" to "codeTransform" for clarity. [#424](https://github.com/atomist/sdm/issues/424)
-   **BREAKING** `onAnyPush` becomes a function to avoid side effects.
-   **BREAKING** `CodeTransform` is now an alias for `SimpleProjectEditor` to make the commonest case natural. Use `CodeTransformRegisterable` to return an `EditResult`.
-   Generators can now have parameter types that don't extend `SeedDrivenGeneratorParameters`, as this will be mixed in.

### Deprecated

-   Rename to GoalInvocation; deprecate status. [#426](https://github.com/atomist/sdm/issues/426)

### Removed

-   Do not memoize pre-emptively. [#431](https://github.com/atomist/sdm/issues/431)

## [0.3.0](https://github.com/atomist/sdm/tree/0.3.0) - 2018-06-16

### Changed

-   **BREAKING** Broke out `sdm` and `sdm-core`.
