import { Radio, RadioGroup } from '@blueprintjs/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

export enum StakingMethod {
  Contract = 'Contract',
  Wallet = 'Wallet',
}

export const StakingMethodRadio = ({
  setSelectedStakingMethod,
  selectedStakingMethod,
}: {
  selectedStakingMethod: StakingMethod | null;
  setSelectedStakingMethod: React.Dispatch<
    React.SetStateAction<StakingMethod | null>
  >;
}) => {
  const { t } = useTranslation();
  return (
    <RadioGroup
      inline={true}
      onChange={(e) => {
        // @ts-ignore can't recognise .value
        setSelectedStakingMethod(e.target.value);
      }}
      selectedValue={selectedStakingMethod || undefined}
    >
      <Radio
        data-testid="associate-radio-contract"
        label={t('Vesting contract')}
        value={StakingMethod.Contract}
      />
      <Radio
        data-testid="associate-radio-wallet"
        label={t('Wallet')}
        value={StakingMethod.Wallet}
      />
    </RadioGroup>
  );
};
