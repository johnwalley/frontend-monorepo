import { gql, useSubscription } from '@apollo/client';
import type {
  DepositEvent,
  DepositEventVariables,
  DepositEvent_busEvents_event_Deposit,
} from './__generated__/DepositEvent';
import { DepositStatus } from '@vegaprotocol/types';
import { useState } from 'react';
import { remove0x } from '@vegaprotocol/react-helpers';
import { useEthereumTransaction } from '@vegaprotocol/web3';
import type { VegaErc20Bridge } from '@vegaprotocol/smart-contracts-sdk';

const DEPOSIT_EVENT_SUB = gql`
  subscription DepositEvent($partyId: ID!) {
    busEvents(partyId: $partyId, batchSize: 0, types: [Deposit]) {
      event {
        ... on Deposit {
          id
          txHash
          status
        }
      }
    }
  }
`;

export const useSubmitDeposit = (
  contract: VegaErc20Bridge | null,
  confirmations: number
) => {
  const [confirmationEvent, setConfirmationEvent] =
    useState<DepositEvent_busEvents_event_Deposit | null>(null);
  // Store public key from contract arguments for use in the subscription,
  // NOTE: it may be different from the users connected key
  const [partyId, setPartyId] = useState<string | null>(null);

  const { transaction, perform } = useEthereumTransaction<{
    assetSource: string;
    amount: string;
    vegaPublicKey: string;
  }>((args) => {
    if (!contract) {
      return null;
    }
    // New deposit started clear old confirmation event and start
    // tracking deposits for the new public key
    setConfirmationEvent(null);
    setPartyId(args.vegaPublicKey);

    return contract.depositAsset(
      args.assetSource,
      args.amount,
      args.vegaPublicKey
    );
  }, confirmations);

  useSubscription<DepositEvent, DepositEventVariables>(DEPOSIT_EVENT_SUB, {
    variables: { partyId: partyId ? remove0x(partyId) : '' },
    skip: !partyId,
    onSubscriptionData: ({ subscriptionData }) => {
      if (!subscriptionData.data?.busEvents?.length) {
        return;
      }

      const matchingDeposit = subscriptionData.data.busEvents.find((e) => {
        if (e.event.__typename !== 'Deposit') {
          return false;
        }

        if (
          e.event.txHash === transaction.txHash &&
          // Note there is a bug in data node where the subscription is not emitted when the status
          // changes from 'Open' to 'Finalized' as a result the deposit UI will hang in a pending state right now
          // https://github.com/vegaprotocol/data-node/issues/460
          e.event.status === DepositStatus.Finalized
        ) {
          return true;
        }

        return false;
      });

      if (matchingDeposit && matchingDeposit.event.__typename === 'Deposit') {
        setConfirmationEvent(matchingDeposit.event);
      }
    },
  });

  return {
    ...transaction,
    perform,
    confirmationEvent,
  };
};
