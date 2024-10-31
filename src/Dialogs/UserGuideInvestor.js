import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stepper, Step, StepLabel, Box, IconButton, } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import investorUserGuideSteps from '../static/investorUserGuideSteps';

const UserGuideInvestor = ({ open, onClose, activeStep, setActiveStep }) => {
  const handleNext = () => {
    setActiveStep((prevStep) =>
      prevStep < investorUserGuideSteps.length - 1 ? prevStep + 1 : prevStep
    );
  };

  const handleBack = () => {
    setActiveStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
  };

  const handleStepClick = (stepIndex) => {
    setActiveStep(stepIndex);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        User Guide: Startup Vest (Investor)
        <IconButton onClick={onClose} edge="end" sx={{ color: "#ED262A" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel>
          {investorUserGuideSteps.map((step, index) => (
            <Step key={index}>
              <StepLabel onClick={() => handleStepClick(index)} style={{ cursor: 'pointer' }}>
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 2 }}>
          {investorUserGuideSteps[activeStep]?.content}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleBack} disabled={activeStep === 0}>Back</Button>
        <Button onClick={handleNext} disabled={activeStep === investorUserGuideSteps.length - 1}>Next</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserGuideInvestor;