import { gql, useApolloClient } from '@apollo/client';
import { Radio, RadioGroup } from '@blueprintjs/core';
import * as Sentry from '@sentry/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { TokenInput } from '../../components/token-input';
import { NetworkParams } from '../../config';
import { useAppState } from '../../contexts/app-state/app-state-context';
import { useNetworkParam } from '../../hooks/use-network-param';
import { useSearchParams } from '../../hooks/use-search-params';
import { BigNumber } from '../../lib/bignumber';
import { addDecimal, removeDecimal } from '../../lib/decimals';
import type {
  PartyDelegations,
  PartyDelegationsVariables,
} from './__generated__/PartyDelegations';
import { StakeFailure } from './stake-failure';
import { StakePending } from './stake-pending';
import { StakeSuccess } from './stake-success';
import { Button, FormGroup } from '@vegaprotocol/ui-toolkit';
import { useVegaWallet } from '@vegaprotocol/wallet';
import type {
  DelegateSubmissionBody,
  UndelegateSubmissionBody,
} from '@vegaprotocol/vegawallet-service-api-client';

export const PARTY_DELEGATIONS_QUERY = gql`
  query PartyDelegations($partyId: ID!) {
    party(id: $partyId) {
      id
      delegations {
        amount
        amountFormatted @client
        node {
          id
        }
        epoch
      }
    }
    epoch {
      id
    }
  }
`;

enum FormState {
  Default,
  Pending,
  Success,
  Failure,
}

export enum Actions {
  Add = 'Add',
  Remove = 'Remove',
}
export type StakeAction = Actions | undefined;
export enum RemoveType {
  EndOfEpoch,
  Now,
}

interface StakingFormProps {
  nodeId: string;
  pubkey: string;
  nodeName: string;
  availableStakeToAdd: BigNumber;
  availableStakeToRemove: BigNumber;
}

export const StakingForm = ({
  nodeId,
  pubkey,
  nodeName,
  availableStakeToAdd,
  availableStakeToRemove,
}: StakingFormProps) => {
  const params = useSearchParams();
  const navigate = useNavigate();
  const client = useApolloClient();
  const { appState } = useAppState();
  const { sendTx } = useVegaWallet();
  const [formState, setFormState] = React.useState(FormState.Default);
  const { t } = useTranslation();
  const [action, setAction] = React.useState<StakeAction>(params.action);
  const [amount, setAmount] = React.useState('');
  const [removeType, setRemoveType] = React.useState<RemoveType>(
    RemoveType.EndOfEpoch
  );
  // Clear the amount when the staking method changes
  React.useEffect(() => {
    setAmount('');
  }, [action, setAmount]);
  const { data } = useNetworkParam([
    NetworkParams.VALIDATOR_DELEGATION_MIN_AMOUNT,
  ]);
  const minTokensWithDecimals = React.useMemo(() => {
    const minTokens = new BigNumber(data && data.length === 1 ? data[0] : '');
    return addDecimal(minTokens, appState.decimals);
  }, [appState.decimals, data]);

  const maxDelegation = React.useMemo(() => {
    if (action === Actions.Add) {
      return availableStakeToAdd;
    }

    if (action === Actions.Remove) {
      return availableStakeToRemove;
    }

    return new BigNumber(0);
  }, [action, availableStakeToAdd, availableStakeToRemove]);

  async function onSubmit() {
    setFormState(FormState.Pending);
    const delegateInput: DelegateSubmissionBody = {
      pubKey: pubkey,
      propagate: true,
      delegateSubmission: {
        nodeId,
        amount: removeDecimal(new BigNumber(amount), appState.decimals),
      },
    };
    const undelegateInput: UndelegateSubmissionBody = {
      pubKey: pubkey,
      propagate: true,
      undelegateSubmission: {
        nodeId,
        amount: removeDecimal(new BigNumber(amount), appState.decimals),
        method:
          removeType === RemoveType.Now
            ? 'METHOD_NOW'
            : 'METHOD_AT_END_OF_EPOCH',
      },
    };
    try {
      const command = action === Actions.Add ? delegateInput : undelegateInput;
      await sendTx(command);

      // await success via poll
    } catch (err) {
      setFormState(FormState.Failure);
      Sentry.captureException(err);
    }
  }

  React.useEffect(() => {
    // eslint-disable-next-line
    let interval: any;

    if (formState === FormState.Pending) {
      // start polling for delegation
      interval = setInterval(() => {
        client
          .query<PartyDelegations, PartyDelegationsVariables>({
            query: PARTY_DELEGATIONS_QUERY,
            variables: { partyId: pubkey },
            fetchPolicy: 'network-only',
          })
          .then((res) => {
            const delegation = res.data.party?.delegations?.find((d) => {
              return (
                d.node.id === nodeId &&
                d.epoch === Number(res.data.epoch.id) + 1
              );
            });

            if (delegation) {
              setFormState(FormState.Success);
              clearInterval(interval);
            }
          })
          .catch((err) => {
            Sentry.captureException(err);
          });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [formState, client, pubkey, nodeId]);

  if (formState === FormState.Failure) {
    return <StakeFailure nodeName={nodeName} />;
  } else if (formState === FormState.Pending) {
    return <StakePending action={action} amount={amount} nodeName={nodeName} />;
  } else if (formState === FormState.Success) {
    return (
      <StakeSuccess
        action={action}
        amount={amount}
        nodeName={nodeName}
        removeType={removeType}
      />
    );
  } else if (
    availableStakeToAdd.isEqualTo(0) &&
    availableStakeToRemove.isEqualTo(0)
  ) {
    if (appState.lien.isGreaterThan(0)) {
      return <span className={'text-red'}>{t('stakeNodeWrongVegaKey')}</span>;
    } else {
      return <span className={'text-red'}>{t('stakeNodeNone')}</span>;
    }
  }

  return (
    <>
      <h2 className="text-h4 mb-8">{t('Manage your stake')}</h2>
      <FormGroup>
        <RadioGroup
          onChange={(e) => {
            // @ts-ignore value does exist on target
            const value = e.target.value;
            setAction(value);
            navigate(`?action=${value}`, {
              replace: true,
            });
          }}
          selectedValue={action}
          inline={true}
        >
          <Radio
            disabled={availableStakeToAdd.isEqualTo(0)}
            value={Actions.Add}
            label="Add"
            data-testid="add-stake-radio"
          />
          <Radio
            disabled={availableStakeToRemove.isEqualTo(0)}
            value={Actions.Remove}
            label="Remove"
            data-testid="remove-stake-radio"
          />
        </RadioGroup>
      </FormGroup>
      {action !== undefined && (
        // eslint-disable-next-line
        <>
          {action === Actions.Add ? (
            <>
              <h2 className="text-h4 mb-8">
                {t('How much to Add in next epoch?')}
              </h2>
              <p>
                {t('minimumNomination', {
                  minTokens: minTokensWithDecimals,
                })}{' '}
              </p>
              <TokenInput
                submitText={`Add ${amount ? amount : ''} ${t('vegaTokens')}`}
                perform={onSubmit}
                amount={amount}
                setAmount={setAmount}
                maximum={maxDelegation}
                minimum={new BigNumber(minTokensWithDecimals)}
                currency={t('VEGA Tokens')}
              />
            </>
          ) : (
            <>
              <h2>{t('How much to Remove?')}</h2>
              {removeType === RemoveType.Now ? (
                <p>
                  {t(
                    'Removing stake mid epoch will forsake any staking rewards from that epoch'
                  )}
                </p>
              ) : null}
              <TokenInput
                submitText={t('undelegateSubmitButton', {
                  amount: t('Remove {{amount}} VEGA tokens', { amount }),
                  when:
                    removeType === RemoveType.Now
                      ? t('as soon as possible')
                      : t('at the end of epoch'),
                })}
                perform={onSubmit}
                amount={amount}
                setAmount={setAmount}
                maximum={maxDelegation}
                currency={t('VEGA Tokens')}
              />
              {removeType === RemoveType.Now ? (
                <>
                  <p>{t('Want to remove your stake before the epoch ends?')}</p>
                  <Button
                    onClick={() => setRemoveType(RemoveType.EndOfEpoch)}
                    variant="inline-link"
                  >
                    {t('Switch to form for removal at end of epoch')}
                  </Button>
                </>
              ) : (
                <>
                  <p>
                    {t('Want to remove your stake at the end of the epoch?')}
                  </p>
                  <Button
                    onClick={() => setRemoveType(RemoveType.Now)}
                    variant="inline-link"
                  >
                    {t('Switch to form for immediate removal')}
                  </Button>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};
