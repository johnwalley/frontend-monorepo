import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { ThemeContext } from '@vegaprotocol/react-helpers';
import { useThemeSwitcher } from '@vegaprotocol/react-helpers';
import { createClient } from './lib/apollo-client';
import { DATA_SOURCES } from './config';
import { TendermintWebsocketProvider } from './contexts/websocket/tendermint-websocket-provider';
import {
  VegaConnectDialog,
  VegaManageDialog,
  VegaWalletProvider,
} from '@vegaprotocol/wallet';
import { DealTicketContainer } from '@vegaprotocol/deal-ticket';
import { VegaWalletConnectButton } from './components/vega-wallet-connect-button';
import { ThemeSwitcher } from '@vegaprotocol/ui-toolkit';
import { Connectors } from './lib/vega-connectors';
import '../styles.scss';
import { AppLoader } from './components/app-loader';

function App() {
  const [theme, toggleTheme] = useThemeSwitcher();
  const [menuOpen, setMenuOpen] = useState(false);
  const [vegaWallet, setVegaWallet] = useState({
    connect: false,
    manage: false,
  });
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const client = useMemo(() => createClient(DATA_SOURCES.dataNodeUrl), []);

  return (
    <ThemeContext.Provider value={theme}>
      <TendermintWebsocketProvider>
        <ApolloProvider client={client}>
          <VegaWalletProvider>
            <AppLoader>
              <div className="h-full dark:bg-black dark:text-white-60 bg-white text-black-60 grid grid-rows-[min-content,1fr]">
                <div className="flex items-stretch border-b-[7px] border-vega-yellow">
                  <div className="flex items-center gap-4 ml-auto mr-8">
                    <VegaWalletConnectButton
                      setConnectDialog={(open) =>
                        setVegaWallet((x) => ({ ...x, connect: open }))
                      }
                      setManageDialog={(open) =>
                        setVegaWallet((x) => ({ ...x, manage: open }))
                      }
                    />
                    <ThemeSwitcher onToggle={toggleTheme} className="-my-4" />
                  </div>
                </div>
                <main>
                  <div className="md:w-4/5 lg:w-3/5 xl:w-1/3 mx-auto">
                    <DealTicketContainer
                      marketId={
                        'c06b5542704323949df33a03da426d8d76a01ee21ed732c67e5d2ef46a7c8e9a'
                      }
                    />
                  </div>
                </main>
                <VegaConnectDialog
                  connectors={Connectors}
                  dialogOpen={vegaWallet.connect}
                  setDialogOpen={(open) =>
                    setVegaWallet((x) => ({ ...x, connect: open }))
                  }
                />
                <VegaManageDialog
                  dialogOpen={vegaWallet.manage}
                  setDialogOpen={(open) =>
                    setVegaWallet((x) => ({ ...x, manage: open }))
                  }
                />
              </div>
            </AppLoader>
          </VegaWalletProvider>
        </ApolloProvider>
      </TendermintWebsocketProvider>
    </ThemeContext.Provider>
  );
}

export default App;
