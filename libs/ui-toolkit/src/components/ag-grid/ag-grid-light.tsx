import type { ReactNode } from 'react';
import { theme } from '@vegaprotocol/tailwindcss-config';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const agGridLightVariables = `
  .ag-theme-balham {
    --ag-background-color: ${theme.colors.white[100]};
    --ag-border-color: ${theme.colors.black['05']};
    --ag-header-background-color: ${theme.colors.white[100]};
    --ag-odd-row-background-color: ${theme.colors.white[100]};
    --ag-row-border-color: ${theme.colors.white[100]};
    --ag-row-hover-color: ${theme.colors.yellow.DEFAULT};
    --ag-font-size: 12px;
  }

  .ag-theme-balham .ag-root-wrapper {
    border: 0;
  }

  .ag-theme-balham .ag-react-container {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ag-theme-balham-dark .ag-header-row {
    font-weight: 400;
  }
`;

export const AgGrid = (props: { children: ReactNode }) => (
  <>
    <style>{agGridLightVariables}</style>
    {props.children}
  </>
);
