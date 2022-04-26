import './pending-stake.scss';

import React from 'react';
import * as Sentry from '@sentry/react';
import { Button, Callout, Intent } from '@vegaprotocol/ui-toolkit';
import { useTranslation } from 'react-i18next';
import { useAppState } from '../../contexts/app-state/app-state-context';
import { BigNumber } from '../../lib/bignumber';
import { removeDecimal } from '../../lib/decimals';
import { vegaWalletService } from '../../lib/vega-wallet/vega-wallet-service';
import type { UndelegateSubmissionInput } from '../../lib/vega-wallet/vega-wallet-service';

interface PendingStakeProps {
  pendingAmount: BigNumber;
  nodeId: string;
  pubkey: string;
}

enum FormState {
  Default,
  Pending,
  Success,
  Failure,
}

export const PendingStake = ({
  pendingAmount,
  nodeId,
  pubkey,
}: PendingStakeProps) => {
  const { t } = useTranslation();
  const { appState } = useAppState();
  const [formState, setFormState] = React.useState(FormState.Default);

  const removeStakeNow = async () => {
    setFormState(FormState.Pending);
    const undelegateInput: UndelegateSubmissionInput = {
      pubKey: pubkey,
      undelegateSubmission: {
        nodeId,
        amount: removeDecimal(new BigNumber(pendingAmount), appState.decimals),
        method: 'METHOD_NOW',
      },
    };

    try {
      const command = undelegateInput;
      const [err] = await vegaWalletService.commandSync(command);

      if (err) {
        setFormState(FormState.Failure);
        Sentry.captureException(err);
      }
    } catch (err) {
      setFormState(FormState.Failure);
      Sentry.captureException(err);
    }
  };

  if (formState === FormState.Failure) {
    return (
      <Callout
        intent={Intent.Danger}
        title={t('failedToRemovePendingStake', { pendingAmount })}
      >
        <p>{t('pleaseTryAgain')}</p>
      </Callout>
    );
  } else if (formState === FormState.Pending) {
    return (
      <Callout
        iconName="refresh"
        title={t('removingPendingStake', { pendingAmount })}
      />
    );
  }

  return (
    <div className="your-stake__container">
      <h2>{t('pendingNomination')}</h2>
      <p>{t('pendingNominationNextEpoch', { pendingAmount })}</p>
      <Button
        className="button-secondary button-secondary--dark"
        onClick={() => removeStakeNow()}
      >
        {t('cancelPendingEpochNomination')}
      </Button>
    </div>
  );
};