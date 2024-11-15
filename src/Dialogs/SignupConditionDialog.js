import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const TermsAndConditionsDialog = ({ open, handleClose, handleAgree }) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>InvestTrack Terms and Conditions</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" gutterBottom>
          <strong>Last Updated:</strong> November 13, 2024
        </Typography>
        <Typography variant="body2" paragraph>
          Welcome to InvestTrack! By using our services, you agree to abide by these Terms and Conditions. 
          Please review them carefully, as they outline the legal obligations between you and InvestTrack.
        </Typography>

        <Section title="1. Acceptance of Terms">
          By creating an account, you confirm that you have read, understood, and agreed to abide by these Terms and Conditions. 
          If you disagree with any part of the terms, please discontinue use of our platform immediately.
        </Section>

        <Section title="2. Overview of Services">
          InvestTrack connects startup owners with investors seeking new ventures. Our platform facilitates:
          <ul>
            <li>Discovery of funding opportunities across various industries.</li>
            <li>Networking between startup owners and investors, enabling direct communication and information sharing.</li>
            <li>Coordination of investment rounds through dedicated features.</li>
          </ul>
          Note: InvestTrack does not offer financial advice or directly engage in transactions between users.
        </Section>

        <Section title="3. Data Privacy and Collection">
          We prioritize your privacy and collect data only as necessary to deliver our services effectively, including:
          <ul>
            <li><strong>Personally Identifiable Information (PII):</strong> Such as your name, contact information, and business-related details.</li>
            <li><strong>Financial Information:</strong> Related to investment opportunities, funding interests, and your role in funding rounds.</li>
            <li><strong>Usage Data:</strong> Which includes your interactions on the platform, pages visited, and frequency of use.</li>
          </ul>
        </Section>

        <Section title="4. Use of Collected Information">
          The data we collect allows us to enhance your experience, including:
          <ul>
            <li>Enabling connections between users based on your profile and preferences.</li>
            <li>Delivering personalized content based on activity, past engagement, and interests.</li>
            <li>Sending notifications, event invitations, and platform updates.</li>
            <li>Conducting analytics to improve features and optimize the platform’s usability.</li>
          </ul>
          Aggregated data, without identifiable information, may be used for market research or business development.
        </Section>

        <Section title="5. Data Sharing and Disclosure">
          We share your data only under specific conditions:
          <ul>
            <li><strong>With Other Users:</strong> Profile data, like name and startup info, will be visible to registered users for networking.</li>
            <li><strong>With Service Providers:</strong> Third-party services that support platform functionality may access certain information.</li>
            <li><strong>Legal Compliance:</strong> Information may be disclosed to comply with legal obligations or governmental requests.</li>
          </ul>
          <strong>Note:</strong> InvestTrack does not sell or rent personal information to third parties.
        </Section>

        <Section title="6. User Responsibilities and Conduct">
          Users are expected to:
          <ul>
            <li>Provide accurate and up-to-date information, including profile details and funding data.</li>
            <li>Adhere to all applicable laws and refrain from illegal activities on the platform.</li>
            <li>Avoid sharing false, misleading, or harmful information with others.</li>
            <li>Use respectful communication, avoiding spam, harassment, and the sharing of sensitive data without authorization.</li>
          </ul>
          Violations may lead to account suspension or termination.
        </Section>

        <Section title="7. Data Security">
          We take precautions to protect your data, including encryption and access controls. However, we advise users to:
          <ul>
            <li>Use strong, unique passwords and update them regularly.</li>
            <li>Be cautious with shared devices and avoid sharing login credentials with others.</li>
          </ul>
          Despite our efforts, online data transmission cannot be guaranteed as fully secure.
        </Section>

        <Section title="8. User Rights">
          Based on your location, you may have rights related to your personal information:
          <ul>
            <li>Access: You may request access to or copies of your data.</li>
            <li>Update/Delete: You may request changes or deletion of certain data.</li>
            <li>Restrictions: You may limit certain processing activities.</li>
            <li>Portability: You may request data transfer to another service.</li>
          </ul>
          To exercise these rights, please contact us at <a href="mailto:investtrackhq@gmail.com" style={{ color: '#1E1E1E' }}>investtrackhq@gmail.com</a>.
        </Section>

        <Section title="9. Account Termination">
          InvestTrack reserves the right to suspend or terminate accounts for violations of these Terms or other unlawful activities.
          Users may also request account deletion through support channels. Deletion will permanently remove data associated with the account.
        </Section>

        <Section title="10. Updates to Terms and Conditions">
          These Terms and Conditions may be periodically updated. Substantial changes will be communicated to users, and continued use of the platform constitutes acceptance of the updated terms.
        </Section>

        <Section title="11. Contact Us">
          For questions or concerns, contact us at 
          <a href="mailto:investtrackhq@gmail.com" style={{ color: '#1E1E1E' }}>investtrackhq@gmail.com</a>.
        </Section>

        <Typography variant="body2" paragraph sx={{ mt: 3 }}>
          By creating an account, you acknowledge and agree to comply with these Terms and Conditions.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

const Section = ({ title, children }) => (
  <div style={{ marginTop: 16 }}>
    <Typography variant="h6" gutterBottom>{title}</Typography>
    <Typography variant="body2" paragraph>{children}</Typography>
  </div>
);

export default TermsAndConditionsDialog;
