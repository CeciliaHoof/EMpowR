import { Box, DialogTitle, Divider, Typography } from "@mui/material";

function TermsConditions() {
  return (
    <Box sx={{ textAlign: "center", overflowY: "scroll", height: "30rem", padding: '1rem' }}>
      <DialogTitle>Terms and Conditions</DialogTitle>
      <Divider sx={{marginBottom: '1rem'}}/>
      <Typography variant="body2" component="p" sx={{marginBottom: "1rem", fontSize: "1rem"}}>
        The information provided on this application, including but not limited
        to text, graphics, images, and other material, is for informational
        purposes only. It is not intended to be a substitute for professional
        medical advice, diagnosis, or treatment. Always seek the advice of your
        physician or other qualified health provider with any questions you may
        have regarding a medical condition. Never disregard professional medical
        advice or delay in seeking it because of something you have read on this
        application.
      </Typography>
      <Typography variant="body2" component="p" sx={{marginBottom: "1rem", fontSize: "1rem"}}>
        The use of any information provided on this application is solely at
        your own risk. The creators, developers, and contributors of this
        application make no representations or warranties of any kind, express
        or implied, about the completeness, accuracy, reliability, suitability,
        or availability with respect to the application or the information,
        products, services, or related graphics contained on the application for
        any purpose. Any reliance you place on such information is therefore
        strictly at your own risk.
      </Typography>
      <Typography variant="body2" component="p" sx={{marginBottom: "1rem", fontSize: "1rem"}}>
        In no event will we be liable for any loss or damage including without
        limitation, indirect or consequential loss or damage, or any loss or
        damage whatsoever arising from loss of data or profits arising out of,
        or in connection with, the use of this application.
      </Typography>
      <Typography variant="body2" component="p" sx={{marginBottom: "1rem", fontSize: "1rem"}}>
        Through this application, you may be able to link to other websites that
        are not under the control of the creators, developers, or contributors
        of this application. We have no control over the nature, content, and
        availability of those sites. The inclusion of any links does not
        necessarily imply a recommendation or endorse the views expressed within
        them.
      </Typography>
      <Typography variant="body2" component="p" sx={{marginBottom: "1rem", fontSize: "1rem"}}>
        Every effort is made to keep the application up and running smoothly.
        However, the creators, developers, and contributors of this application
        take no responsibility for, and will not be liable for, the application
        being temporarily unavailable due to technical issues beyond our
        control.
      </Typography>
      <Typography variant="body2" component="p" sx={{fontSize: "1rem"}}>
        By using this application, you acknowledge and agree to these terms and
        conditions. If you do not agree to these terms and conditions, you
        should not use this application.
      </Typography>
    </Box>
  );
}

export default TermsConditions;
