import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const TermsAndConditionsDialog = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>InvestTrack Terms and Conditions</DialogTitle>
        <DialogContent dividers>
        <Typography variant="body2" gutterBottom>Last Updated: November 13, 2024</Typography>
            <Typography variant="body2" gutterBottom>
              Welcome to InvestTrack! By signing up and creating an account, you agree to the following Terms and Conditions. 
              Please read these terms carefully to understand our practices regarding your information, data privacy, and how our services work.
            </Typography>

            <Typography variant="h6" gutterBottom>
              1. Acceptance of Terms
            </Typography>
            <Typography variant="body2" paragraph>
              By creating an account on InvestTrack, you confirm that you have read, understood, and agreed to these Terms and Conditions. 
              If you do not agree to these terms, you should not use our platform.
            </Typography>

            <Typography variant="h6" gutterBottom>
              2. Overview of Services
            </Typography>
            <Typography variant="body2" paragraph>
              InvestTrack is an online platform designed to connect startup owners seeking funding with investors looking for promising ventures. 
              Our platform allows users to share and discover funding opportunities, connect with potential partners, and facilitate the process of startup funding rounds.
            </Typography>

            <Typography variant="h6" gutterBottom>
              3. Data Privacy and Collection
            </Typography>
            <Typography variant="body2" paragraph>
              We prioritize your privacy. When you register with InvestTrack, you agree that we may collect and process personal information, including but not limited to:
              <ul>
                <li>Personal Identifiable Information (PII): Such as your name, contact details, and business-related information.</li>
                <li>Financial and Funding Information: Details related to investment opportunities, funding rounds, and other related activities.</li>
                <li>Usage Data: Information about your interactions with our platform, including pages visited, features used, and engagement statistics.</li>
              </ul>
            </Typography>

            <Typography variant="h6" gutterBottom>
              4. Use of Collected Information
            </Typography>
            <Typography variant="body2" paragraph>
              Your information is collected for the purpose of providing and enhancing our services, including:
              <ul>
                <li>Displaying relevant information on the platform to facilitate connections between startup owners and investors.</li>
                <li>Personalizing your experience on InvestTrack, such as showing recommended connections based on your interests and activities.</li>
                <li>Communicating with you about updates, new features, and relevant events.</li>
                <li>Conducting analytics to improve our platform and tailor it to the needs of our users.</li>
              </ul>
              We may use anonymized or aggregated data for research, analytics, and business purposes.
            </Typography>

            <Typography variant="h6" gutterBottom>
              5. Data Sharing and Disclosure
            </Typography>
            <Typography variant="body2" paragraph>
              InvestTrack may share your information in the following circumstances:
              <ul>
                <li>With Other Users: As part of our core service, your profile and relevant information (e.g., name, startup details, and public funding information) will be visible to other registered users to facilitate investment and networking. Additionally, your contact information may be displayed so that you can be reached in case someone has a question, concern, or other communication regarding your startup or activities on the platform.</li>
                <li>With Third-Party Service Providers: We may use third-party providers to help operate our platform, and they may have access to your information as needed to provide these services.</li>
                <li>As Required by Law: We may disclose your information if required to comply with legal obligations, regulations, or governmental requests.</li>
              </ul>
              We do not sell or rent your personal information to third parties.
            </Typography>

            <Typography variant="h6" gutterBottom>
              6. User Responsibilities and Conduct
            </Typography>
            <Typography variant="body2" paragraph>
              As a user of InvestTrack, you agree to:
              <ul>
                <li>Provide accurate and up-to-date information when registering and using the platform.</li>
                <li>Use the platform in compliance with all applicable laws and regulations.</li>
                <li>Avoid sharing misleading, false, or harmful information about yourself or others.</li>
                <li>Refrain from any misuse of the platform, including spamming, harassing, or sharing sensitive information about other users without their consent.</li>
              </ul>
            </Typography>

            <Typography variant="h6" gutterBottom>
              7. Data Security
            </Typography>
            <Typography variant="body2" paragraph>
              We implement security measures to protect your personal information. However, we cannot guarantee complete security due to the inherent risks associated with online data transmission. We encourage you to use strong passwords and to keep your login credentials confidential.
            </Typography>

            <Typography variant="h6" gutterBottom>
              8. User Rights
            </Typography>
            <Typography variant="body2" paragraph>
              Depending on your location, you may have certain rights regarding your personal information, including the right to:
              <ul>
                <li>Access, update, or delete your personal information on our platform.</li>
                <li>Restrict or object to certain processing of your data.</li>
                <li>Withdraw consent for data collection where applicable.</li>
                <li>Request a copy of your data or transfer it to another service provider.</li>
              </ul>
              To exercise any of these rights, please contact us at [investtrackhq@gmail.com].
            </Typography>

            <Typography variant="h6" gutterBottom>
              9. Termination of Account
            </Typography>
            <Typography variant="body2" paragraph>
              We reserve the right to suspend or terminate your account at our discretion if you violate these Terms and Conditions or engage in any harmful or unlawful activities on the platform.
            </Typography>

            <Typography variant="h6" gutterBottom>
              10. Updates to Terms and Conditions
            </Typography>
            <Typography variant="body2" paragraph>
              InvestTrack may update these Terms and Conditions from time to time. We will notify you of any significant changes, and your continued use of the platform constitutes acceptance of the updated terms.
            </Typography>

            <Typography variant="h6" gutterBottom>
              11. Contact Us
            </Typography>
            <Typography variant="body2" paragraph>
              If you have questions, concerns, or feedback regarding these Terms and Conditions, please contact us at [investtrackhq@gmail.com].
            </Typography>

            <Typography variant="body2" paragraph>
              By creating an account, you acknowledge that you have read and understood these Terms and Conditions and agree to abide by them.
            </Typography>
        </DialogContent>
      <DialogActions>

        <Button onClick={handleClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsAndConditionsDialog;
