import { gql } from '@apollo/client';
import type { Market, MarketVariables } from './__generated__/Market';
import { Splash } from '@vegaprotocol/ui-toolkit';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { PageQueryContainer } from '../../components/page-query-container';
import { TradeGrid, TradePanels } from './trade-grid';
import { t } from '@vegaprotocol/react-helpers';

// Top level page query
const MARKET_QUERY = gql`
  query Market($marketId: ID!) {
    market(id: $marketId) {
      id
      name
    }
  }
`;

const MarketPage = () => {
  const { query } = useRouter();
  const { w } = useWindowSize();

  // Default to first marketId query item if found
  const marketId = Array.isArray(query.marketId)
    ? query.marketId[0]
    : query.marketId;

  if (!marketId) {
    return (
      <Splash>
        <p>{t('Not found')}</p>
      </Splash>
    );
  }

  return (
    <PageQueryContainer<Market, MarketVariables>
      query={MARKET_QUERY}
      options={{
        variables: {
          marketId,
        },
        fetchPolicy: 'network-only',
      }}
      render={({ market }) => {
        if (!market) {
          return <Splash>{t('Market not found')}</Splash>;
        }

        return w > 960 ? (
          <TradeGrid market={market} />
        ) : (
          <TradePanels market={market} />
        );
      }}
    />
  );
};

MarketPage.getInitialProps = () => ({
  page: 'market',
});

export default MarketPage;

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(() => {
    if (typeof window !== 'undefined') {
      return {
        w: window.innerWidth,
        h: window.innerHeight,
      };
    }

    // Something sensible for server rendered page
    return {
      w: 1200,
      h: 900,
    };
  });

  useEffect(() => {
    const handleResize = debounce(({ target }) => {
      setWindowSize({
        w: target.innerWidth,
        h: target.innerHeight,
      });
    }, 300);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
};
