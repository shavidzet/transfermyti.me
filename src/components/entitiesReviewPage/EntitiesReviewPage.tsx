import React, { useState } from "react";
import { Else, If, Then, When } from "react-if";
import { first, get, isNil } from "lodash";
import EntitiesList from "../entitiesList/EntitiesList";
import StepPage, { StepPageProps } from "../stepPage/StepPage";
import EntityTabs from "./EntityTabs";
import IncludedYearsSelect from "./IncludedYearsSelect";
import NoRecordsDisplay from "./NoRecordsDisplay";
import PageFooter from "./PageFooter";
import WorkspacesDropdown from "./WorkspacesDropdown";
import {
  CompoundEntityModel,
  EntityGroup,
  ToolName,
} from "~/common/commonTypes";
import {
  CompoundWorkspaceModel,
  CountsByGroupByWorkspaceModel,
  EntitiesByGroupByWorkspaceModel,
  RecordCountsModel,
  UpdateIncludedWorkspaceYearModel,
} from "~/workspaces/workspacesTypes";

interface Props extends StepPageProps {
  subtitle: string;
  toolName: ToolName;
  countsByGroupByWorkspace: CountsByGroupByWorkspaceModel;
  entitiesByGroupByWorkspace: EntitiesByGroupByWorkspaceModel;
  workspacesById: Record<string, CompoundWorkspaceModel>;
  onRefreshClick?: () => void;
  onFlipIsWorkspaceEntityIncluded?: (
    entityGroup: EntityGroup,
    entityRecord: CompoundEntityModel,
  ) => void;
  onUpdateIsWorkspaceYearIncluded?: (
    updateDetails: UpdateIncludedWorkspaceYearModel,
  ) => void;
}

const CONTENTS_HEIGHT = 600;

const EntitiesReviewPage: React.FC<Props> = ({
  toolName,
  countsByGroupByWorkspace,
  entitiesByGroupByWorkspace,
  workspacesById,
  onFlipIsWorkspaceEntityIncluded,
  onUpdateIsWorkspaceYearIncluded,
  ...stepPageProps
}) => {
  const [workspaceId, setWorkspaceId] = useState<string>(
    first(Object.keys(workspacesById)),
  );
  const [activeEntityGroup, setActiveEntityGroup] = useState<EntityGroup>(
    EntityGroup.Projects,
  );
  const [contentsWidth, setContentsWidth] = useState<number>(0);
  const [showInclusionsOnly, setShowInclusionsOnly] = useState<boolean>(false);

  let activeEntityRecords = get(
    entitiesByGroupByWorkspace,
    [workspaceId, activeEntityGroup],
    [],
  ) as CompoundEntityModel[];

  if (showInclusionsOnly && activeEntityRecords.length !== 0) {
    activeEntityRecords = activeEntityRecords.reduce(
      (acc: CompoundEntityModel[], entityRecord: CompoundEntityModel) => {
        if (!isNil(entityRecord.linkedId) || !entityRecord.isIncluded) {
          return acc;
        }

        return [...acc, entityRecord];
      },
      [],
    );
  }

  const groupRecordCounts = get(
    countsByGroupByWorkspace,
    [workspaceId, activeEntityGroup],
    {},
  ) as RecordCountsModel;

  const handleIncludedYearUpdate = (
    year: number,
    isIncluded: boolean,
  ): void => {
    const updateDetails = { workspaceId, year, isIncluded };
    onUpdateIsWorkspaceYearIncluded(updateDetails);
  };

  const activeWorkspace = workspacesById[workspaceId];

  const isIncludedYearsSelectShown =
    activeEntityGroup === EntityGroup.TimeEntries &&
    !isNil(onUpdateIsWorkspaceYearIncluded);

  return (
    <StepPage onResize={setContentsWidth} {...stepPageProps}>
      <div css={{ marginBottom: "1rem", position: "relative" }}>
        <EntityTabs
          activeTab={activeEntityGroup}
          onTabClick={setActiveEntityGroup}
        />
        <WorkspacesDropdown
          workspacesById={workspacesById}
          activeWorkspaceId={workspaceId}
          onItemClick={setWorkspaceId}
        />
      </div>
      <When condition={isIncludedYearsSelectShown}>
        <IncludedYearsSelect
          inclusionsByYear={activeWorkspace.inclusionsByYear}
          onUpdateIncludedYear={handleIncludedYearUpdate}
        />
      </When>
      <If condition={activeEntityRecords.length === 0}>
        <Then>
          <NoRecordsDisplay
            activeEntityGroup={activeEntityGroup}
            height={CONTENTS_HEIGHT}
            toolName={toolName}
          />
        </Then>
        <Else>
          <EntitiesList
            entityGroup={activeEntityGroup}
            entityRecords={activeEntityRecords}
            height={CONTENTS_HEIGHT}
            width={contentsWidth}
            onItemClick={onFlipIsWorkspaceEntityIncluded}
          />
        </Else>
      </If>
      <PageFooter
        activeEntityGroup={activeEntityGroup}
        groupRecordCounts={groupRecordCounts}
        showInclusionsOnly={showInclusionsOnly}
        onFlipInclusionsOnly={() => setShowInclusionsOnly(!showInclusionsOnly)}
      />
    </StepPage>
  );
};

export default EntitiesReviewPage;
