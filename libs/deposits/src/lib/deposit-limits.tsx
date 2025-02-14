import { t } from '@vegaprotocol/react-helpers';
import type BigNumber from 'bignumber.js';

interface DepositLimitsProps {
  limits: {
    min: BigNumber;
    max: BigNumber;
  };
}

export const DepositLimits = ({ limits }: DepositLimitsProps) => {
  const minLimit = limits.min.toString();
  const maxLimit = limits.max.isEqualTo(Infinity)
    ? t('No limit')
    : limits.max.toString();
  return (
    <>
      <p className="text-ui font-bold">{t('Temporary deposit limits')}</p>
      <table className="w-full text-ui">
        <tbody>
          <tr>
            <th className="text-left font-normal">{t('Minimum')}</th>
            <td className="text-right">{minLimit}</td>
          </tr>
          <tr>
            <th className="text-left font-normal">{t('Maximum')}</th>
            <td className="text-right">{maxLimit}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};
