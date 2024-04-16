import React from "react";
import { Dialog, DialogContent, DialogTitle, Slide, Stack,} from "@mui/material";

import { CallList } from "../../data";
import { CallElement } from "../../components/CallElement";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StartCall = ({ open, handleClose }) => {
  return (
    <Dialog  fullWidth  maxWidth="xs"  open={open}  TransitionComponent={Transition}   keepMounted  onClose={handleClose}  aria-describedby="alert-dialog-slide-description"  sx={{ p: 4 }}  >
      <DialogTitle>{"Start New Conversation"}</DialogTitle>
      <Stack p={1} sx={{ width: "100%" }}>
      </Stack>
      <DialogContent>
        <Stack sx={{ height: "100%" }}>
          <Stack spacing={2.4}>
            {CallList.map((el, idx) => <CallElement key={idx} {...el} handleClose={handleClose} />)}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default StartCall;