import React from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

const BuiltBy = () => {
  return (
    <>
      <Typography variant="body2" color="textSecondary" align="center">
        <span>Made with &#10084; by </span>
        <Link href="https://www.lagoonmed.eu/">Lagoon MED</Link>
        {' team.'}
      </Typography>
      <Typography variant="body2" color="textSecondary" align="center">
        {'Email us on '}
        <Link href="mailto:info@lagoonmed.eu">info@lagoonmed.eu</Link>
      </Typography>
    </>
  );
};

export default BuiltBy;
