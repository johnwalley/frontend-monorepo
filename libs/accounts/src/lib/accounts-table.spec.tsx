import AccountsTable from './accounts-table';
import { act, render, screen } from '@testing-library/react';
import type { Accounts_party_accounts } from './__generated__/Accounts';
import { AccountType } from '@vegaprotocol/types';

const singleRow: Accounts_party_accounts = {
  __typename: 'Account',
  type: AccountType.Margin,
  balance: '125600000',
  market: {
    __typename: 'Market',
    name: 'BTCUSD Monthly (30 Jun 2022)',
    id: '10cd0a793ad2887b340940337fa6d97a212e0e517fe8e9eab2b5ef3a38633f35',
  },
  asset: {
    __typename: 'Asset',
    id: '5cfa87844724df6069b94e4c8a6f03af21907d7bc251593d08e4251043ee9f7c',
    symbol: 'tBTC',
    decimals: 5,
  },
};
const singleRowData = [singleRow];

test('should render successfully', async () => {
  await act(async () => {
    const { baseElement } = render(<AccountsTable data={[]} />);
    expect(baseElement).toBeTruthy();
  });
});
test('Render correct columns', async () => {
  await act(async () => {
    render(<AccountsTable data={singleRowData} />);
  });

  const headers = screen.getAllByRole('columnheader');
  expect(headers).toHaveLength(4);
  expect(
    headers.map((h) => h.querySelector('[ref="eText"]')?.textContent?.trim())
  ).toEqual(['Asset', 'Type', 'Market', 'Balance']);
});

test('Correct formatting applied', async () => {
  await act(async () => {
    render(<AccountsTable data={singleRowData} />);
  });
  const cells = screen.getAllByRole('gridcell');
  const expectedValues = [
    'tBTC',
    singleRow.type,
    'BTCUSD Monthly (30 Jun 2022)',
    '1,256.00000',
  ];
  cells.forEach((cell, i) => {
    expect(cell).toHaveTextContent(expectedValues[i]);
  });
});