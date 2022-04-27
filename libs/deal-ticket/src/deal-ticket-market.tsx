import type { ReactNode } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { addDecimal } from '@vegaprotocol/react-helpers';
import { FormGroup, Input, Button } from '@vegaprotocol/ui-toolkit';
import type { TransactionStatus } from './deal-ticket';
import { SideSelector } from './side-selector';
import { SubmitButton } from './submit-button';
import { TimeInForceSelector } from './time-in-force-selector';
import { TypeSelector } from './type-selector';
import type { Order } from './use-order-state';
import type { DealTicketQuery_market } from './__generated__/DealTicketQuery';

interface DealTicketMarketProps {
  order: Order;
  updateOrder: (order: Partial<Order>) => void;
  transactionStatus: TransactionStatus;
  market: DealTicketQuery_market;
}

type Step = {
  label: string;
  description: string;
  component: ReactNode;
  disabled?: boolean;
};

interface StepperProps {
  steps: Step[];
}

export function VerticalLinearStepper({ steps }: StepperProps) {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Paper square elevation={1} sx={{ p: 3, mt: 5 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === steps.length - 1 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography sx={{ mb: 2 }}>{step.description}</Typography>
              {step.component}
              <Divider sx={{ mb: 2 }} />
              <Box>
                <div>
                  <Button
                    variant="secondary"
                    onClick={handleNext}
                    disabled={step.disabled}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    variant="inline"
                    disabled={index === 0}
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset}>Reset</Button>
        </Paper>
      )}
    </Paper>
  );
}

export const DealTicketMarket = ({
  order,
  updateOrder,
  transactionStatus,
  market,
}: DealTicketMarketProps) => {
  const steps = [
    {
      label: 'Select Asset',
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      component: (
        <TypeSelector
          order={order}
          onSelect={(type) => updateOrder({ type })}
        />
      ),
    },
    {
      label: 'Select Order Type',
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      component: (
        <SideSelector
          order={order}
          onSelect={(side) => updateOrder({ side })}
        />
      ),
    },
    {
      label: 'Select Market Position',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      component: (
        <div className="flex items-center gap-8">
          <div className="flex-1">
            <FormGroup label="Amount">
              <Input
                value={order.size}
                onChange={(e) => updateOrder({ size: e.target.value })}
                className="w-full"
                type="number"
                data-testid="order-size"
              />
            </FormGroup>
          </div>
          <div className="pt-4">@</div>
          <div className="flex-1 pt-4" data-testid="last-price">
            {market.depth.lastTrade ? (
              <>
                ~
                {addDecimal(market.depth.lastTrade.price, market.decimalPlaces)}{' '}
                {market.tradableInstrument.instrument.product.quoteName}
              </>
            ) : (
              '-'
            )}
          </div>
        </div>
      ),
    },
    {
      label: 'Select Duration',
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      component: (
        <TimeInForceSelector
          order={order}
          onSelect={(timeInForce) => updateOrder({ timeInForce })}
        />
      ),
    },
    {
      label: 'Submit Order',
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      component: (
        <Box sx={{ mb: 2 }}>
          <SubmitButton
            transactionStatus={transactionStatus}
            market={market}
            order={order}
          />
        </Box>
      ),
      disabled: true,
    },
  ];

  return <VerticalLinearStepper steps={steps} />;
};
