import React, { useState } from "react";
import Button from "@mui/joy/Button";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import Stack from "@mui/joy/Stack";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/joy/IconButton";
import { toast } from "react-toastify";
import { Transition } from "react-transition-group";
import { usePantry } from "@/components/provider";
import FormControl from "@mui/joy/FormControl";
import "react-toastify/dist/ReactToastify.css";

const categories = [
  "Baking",
  "Breakfast",
  "Grains",
  "Canned Goods",
  "Oils & Vinegars",
  "Spices",
  "Toppings",
  "Snacks",
  "Supplements",
  "Dry Goods",
  "Baby Food",
  "Drinks",
  "Paper Products",
  "Experimental Foods",
  "Use It or Lose It",
];

export default function EditModal({ item }: { item: any }) {
  const [open, setOpen] = useState(false);
  const { editItem } = usePantry();
  const [itemName, setItemName] = useState(item.name);
  const [itemQuantity, setItemQuantity] = useState(item.quantity);
  const [itemExpiry, setItemExpiry] = useState<Date | null>(
    item.expiry ? new Date(item.expiry) : new Date()
  );
  const [itemCategory, setItemCategory] = useState(item.classification || "");
  const [loading, setLoading] = useState(false);

  const handleSaveEditItem =  () => {
    try {
      if (itemExpiry && item.id) {
        setLoading(true);
        editItem(
          item.id,
          itemName,
          itemQuantity,
          itemExpiry?.toLocaleString(),
          itemCategory,
        );
        setOpen(false);
        setLoading(false);
        toast.success("Item updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update item");
      console.log("something went wrong", error);
    }
  };

  return (
    <React.Fragment>
      <IconButton variant='plain' onClick={() => setOpen(true)}>
        <EditIcon />
      </IconButton>
      <Transition in={open} timeout={400}>
        {(state) => (
          <Modal
            open={!["exited", "exiting"].includes(state)}
            onClose={() => setOpen(false)}
          >
            <ModalDialog>
              <DialogTitle>Edit pantry item</DialogTitle>
              <Stack spacing={2}>
                <FormLabel>Name</FormLabel>
                <Input
                  required
                  placeholder='Item name'
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
                <FormLabel>Expiry date</FormLabel>
                <DatePicker
                  selected={itemExpiry}
                  onChange={(date) => setItemExpiry(date)}
                  placeholderText='Enter expiry date'
                  showTimeInput={false}
                  dateFormat='yyyy-MM-dd'
                  minDate={new Date()}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                />
                <FormLabel>Quantity</FormLabel>
                <Input
                  required
                  type='number'
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(e.target.value)}
                />
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                  >
                    <option value='' disabled>
                      Select a category
                    </option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <Button loading={loading} onClick={handleSaveEditItem}>
                  Update item
                </Button>
              </Stack>
            </ModalDialog>
          </Modal>
        )}
      </Transition>
    </React.Fragment>
  );
}
