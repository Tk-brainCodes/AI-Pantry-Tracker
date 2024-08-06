"use client";

import * as React from "react";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DeleteForever from "@mui/icons-material/DeleteForever";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { toast } from "react-toastify";
import IconButton from '@mui/joy/IconButton';
import 'react-toastify/dist/ReactToastify.css';


import { Transition } from "react-transition-group";
import { usePantry } from "../provider";

export default function DeleteItem(item: any) {
  const [open, setOpen] = React.useState<boolean>(false);
  const { deleteItem } = usePantry();

  const handleDelete = () => {
    try {
      deleteItem(item.itemId);
      setOpen(false);
      toast.success("Item deleted successfully");
    } catch (error) {
      toast.success("Failed to delete item");
      console.log("Something went wrong", error);
    }
  };

  return (
    <React.Fragment>
      <IconButton
        variant='plain'
        color='danger'
        onClick={() => setOpen(true)}
      >
        <DeleteForever />
      </IconButton>

      <Transition in={open} timeout={400}>
        {(state: string) => (
          <Modal
            keepMounted
            open={!["exited", "exiting"].includes(state)}
            onClose={() => setOpen(false)}
            slotProps={{
              backdrop: {
                sx: {
                  opacity: 0,
                  backdropFilter: "none",
                  transition: `opacity 400ms, backdrop-filter 400ms`,
                  ...{
                    entering: { opacity: 1, backdropFilter: "blur(8px)" },
                    entered: { opacity: 1, backdropFilter: "blur(8px)" },
                  }[state],
                },
              },
            }}
          >
            <ModalDialog
              sx={{
                opacity: 0,
                transition: `opacity 300ms`,
                ...{
                  entering: { opacity: 1 },
                  entered: { opacity: 1 },
                }[state],
              }}
              variant='outlined'
              role='alertdialog'
            >
              <DialogTitle>
                <WarningRoundedIcon />
                Confirmation
              </DialogTitle>
              <Divider />
              <DialogContent>
                Are you sure you want to delete item?
              </DialogContent>
              <DialogActions>
                <Button variant='solid' color='danger' onClick={handleDelete}>
                  Delete item
                </Button>
                <Button
                  variant='plain'
                  color='neutral'
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </DialogActions>
            </ModalDialog>
          </Modal>
        )}
      </Transition>
    </React.Fragment>
  );
}
