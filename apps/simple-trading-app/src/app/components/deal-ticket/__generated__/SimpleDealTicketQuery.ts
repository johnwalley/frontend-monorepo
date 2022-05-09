/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import {
  MarketState,
  MarketTradingMode,
} from './../../../../../../../libs/types/src/__generated__/globalTypes';

// ====================================================
// GraphQL query operation: SimpleDealTicketQuery
// ====================================================

export interface SimpleDealTicketQuery_market_tradableInstrument_instrument_product {
  __typename: 'Future';
  /**
   * String representing the quote (e.g. BTCUSD -> USD is quote)
   */
  quoteName: string;
}

export interface SimpleDealTicketQuery_market_tradableInstrument_instrument {
  __typename: 'Instrument';
  /**
   * A reference to or instance of a fully specified product, including all required product parameters for that product (Product union)
   */
  product: SimpleDealTicketQuery_market_tradableInstrument_instrument_product;
}

export interface SimpleDealTicketQuery_market_tradableInstrument {
  __typename: 'TradableInstrument';
  /**
   * An instance of or reference to a fully specified instrument.
   */
  instrument: SimpleDealTicketQuery_market_tradableInstrument_instrument;
}

export interface SimpleDealTicketQuery_market_depth_lastTrade {
  __typename: 'Trade';
  /**
   * The price of the trade (probably initially the passive order price, other determination algorithms are possible though) (uint64)
   */
  price: string;
}

export interface SimpleDealTicketQuery_market_depth {
  __typename: 'MarketDepth';
  /**
   * Last trade for the given market (if available)
   */
  lastTrade: SimpleDealTicketQuery_market_depth_lastTrade | null;
}

export interface SimpleDealTicketQuery_market {
  __typename: 'Market';
  /**
   * Market ID
   */
  id: string;
  /**
   * decimalPlaces indicates the number of decimal places that an integer must be shifted by in order to get a correct
   * number denominated in the currency of the Market. (uint64)
   *
   * Examples:
   * Currency     Balance  decimalPlaces  Real Balance
   * GBP              100              0       GBP 100
   * GBP              100              2       GBP   1.00
   * GBP              100              4       GBP   0.01
   * GBP                1              4       GBP   0.0001   (  0.01p  )
   *
   * GBX (pence)      100              0       GBP   1.00     (100p     )
   * GBX (pence)      100              2       GBP   0.01     (  1p     )
   * GBX (pence)      100              4       GBP   0.0001   (  0.01p  )
   * GBX (pence)        1              4       GBP   0.000001 (  0.0001p)
   */
  decimalPlaces: number;
  /**
   * Current state of the market
   */
  state: MarketState;
  /**
   * Current mode of execution of the market
   */
  tradingMode: MarketTradingMode;
  /**
   * An instance of or reference to a tradable instrument.
   */
  tradableInstrument: SimpleDealTicketQuery_market_tradableInstrument;
  /**
   * Current depth on the order book for this market
   */
  depth: SimpleDealTicketQuery_market_depth;
}

export interface SimpleDealTicketQuery {
  /**
   * An instrument that is trading on the VEGA network
   */
  market: SimpleDealTicketQuery_market | null;
}

export interface SimpleDealTicketQueryVariables {
  marketId: string;
}
