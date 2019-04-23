import React from 'react';
import { connect } from 'react-redux';
import { Columns } from 'bloomer';
import { css } from 'emotion';
import { updateTransferType } from '~/redux/app/appActions';
import { selectCurrentTransferType } from '~/redux/app/appSelectors';
import StepPage, { StepPageProps } from '~/components/stepPage/StepPage';
import TransferTypeColumn from './components/TransferTypeColumn';
import { ReduxDispatch, ReduxState, TransferType } from '~/types';

interface ConnectStateProps {
  currentTransferType: TransferType;
}

interface ConnectDispatchProps {
  onUpdateTransferType: (newTransferType: TransferType) => void;
}

export const SelectTransferTypeStepComponent: React.FC<Props> = ({
  currentTransferType,
  onUpdateTransferType,
  ...stepPageProps
}) => {
  const handleTransferTypeSelect = (transferType: TransferType) => () => {
    onUpdateTransferType(transferType);
  };

  return (
    <StepPage
      subtitle="Select Transfer Type"
      instructions={
        <p>
          Select whether you&apos;re transferring entries for just yourself or
          multiple users. Press the <strong>Next</strong> button when
          you&apos;re ready to move onto the next step.
        </p>
      }
      {...stepPageProps}
    >
      <div
        className={css`
          padding: 0 0.25rem 2rem 0.25rem;
        `}
      >
        <Columns isCentered>
          <TransferTypeColumn
            title="Single User"
            isSelected={currentTransferType === TransferType.SingleUser}
            onSelect={handleTransferTypeSelect(TransferType.SingleUser)}
          >
            Select this option if you&apos;re not the owner/admin of an
            organization and you want to transfer <strong>your</strong> entries
            to Clockify.
          </TransferTypeColumn>
          <TransferTypeColumn
            title="Multiple Users"
            isSelected={currentTransferType === TransferType.MultipleUsers}
            onSelect={handleTransferTypeSelect(TransferType.MultipleUsers)}
          >
            Select this option if you have multiple user groups/users and
            you&apos;d like to transfer <strong>all</strong> entries for you and
            the members of your team.
          </TransferTypeColumn>
        </Columns>
      </div>
    </StepPage>
  );
};

type Props = ConnectStateProps & ConnectDispatchProps & StepPageProps;

const mapStateToProps = (state: ReduxState) => ({
  currentTransferType: selectCurrentTransferType(state),
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
  onUpdateTransferType: (newTransferType: TransferType) =>
    dispatch(updateTransferType(newTransferType)),
});

export default connect<ConnectStateProps, ConnectDispatchProps, StepPageProps>(
  mapStateToProps,
  mapDispatchToProps,
)(SelectTransferTypeStepComponent);
