import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  loadingContainer: {
    height: '100px',
    padding: '10px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loading: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '4px solid transparent',
    borderTopColor: '#f50057',
    borderRightColor: '#f50057',
    animation: 'loading 0.5s infinite forwards'
  }
}));

export const useSpinnerMobile = (rootRef, refreshFn, deps = []) => {
  useEffect(() => {
    const pStart = { x: 0, y: 0 };
    const pCurrent = { x: 0, y: 0 };

    const touchstart = e => {
      //Saving touch start coordinates
      if (typeof e['targetTouches'] !== 'undefined') {
        const touch = e.targetTouches[0];
        pStart.x = touch.screenX;
        pStart.y = touch.screenY;
      } else {
        pStart.x = e.screenX;
        pStart.y = e.screenY;
      }
    };

    const touchmove = e => {
      //Saving last touch position coordinates after moving
      if (typeof e['changedTouches'] !== 'undefined') {
        const touch = e.changedTouches[0];
        pCurrent.x = touch.screenX;
        pCurrent.y = touch.screenY;
      } else {
        pCurrent.x = e.screenX;
        pCurrent.y = e.screenY;
      }
    };

    const touchend = () => {
      // Calculating delta between start Y and current Y
      const changeY =
        pStart.y < pCurrent.y ? Math.abs(pStart.y - pCurrent.y) : 0;
      if (document.body.scrollTop === 0 && changeY > 100) {
        // If swipe is > 100 refreshing the list
        // Preventing global spinner to show up
        document.body.classList.add('no-spinner');
        // Translate list down to 0px to show local spinner
        rootRef.current.style.transform = 'translateY(0px)';
        // Refreshing the list in appending mode
        refreshFn();

        setTimeout(() => {
          // Removing no-spinner class to enable global spinner
          document.body.classList.remove('no-spinner');
          // Translating list back to its original position after 1.5s
          rootRef.current.style.transform = 'translateY(-100px)';
        }, 1500);
      }
    };

    document.addEventListener('touchstart', touchstart, false);
    document.addEventListener('touchmove', touchmove, false);
    document.addEventListener('touchend', touchend, false);
    return () => {
      document.removeEventListener('touchstart', touchstart);
      document.removeEventListener('touchmove', touchmove);
      document.removeEventListener('touchend', touchend);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshFn, rootRef, ...deps]);
};

const SpinnerMobile = () => {
  const classes = useStyles();

  return (
    <div className={classes.loadingContainer}>
      <div className={classes.loading} />
      <Typography component="span" variant="body2" color="textPrimary">
        {'Aggiornando...'}
      </Typography>
    </div>
  );
};

export default SpinnerMobile;
