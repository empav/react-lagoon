import React from 'react';
import Slide from '@material-ui/core/Slide';

const TransitionDialog = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default TransitionDialog;
