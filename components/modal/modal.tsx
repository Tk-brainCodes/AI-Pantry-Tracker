import React, { useState } from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Stack from "@mui/joy/Stack";
import AddIcon from "@mui/icons-material/Add";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { Transition } from "react-transition-group";
import { usePantry } from "@/components/provider";
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

export default function AddItemModal() {
  const [open, setOpen] = useState(false);
  const { addItem } = usePantry();
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemExpiry, setItemExpiry] = useState<Date | null>(null);
  const [itemCategory, setItemCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddItem = async () => {
    try {
      if (itemExpiry && itemCategory) {
        setLoading(true);
        addItem(
          itemName,
          itemQuantity,
          itemExpiry?.toLocaleString(),
          itemCategory
        );
        setItemName("");
        setItemQuantity("");
        setItemExpiry(null);
        setItemCategory("");
        setLoading(false);
        setOpen(false);
        toast.success("Item added to pantry!");
      }
    } catch (error) {
      toast.error("Please select an expiry date and category.");
      console.log("something went wrong", error);
    }
  };

  return (
    <React.Fragment>
      <Button
        sx={{
          p: "0.8em 1.5em",
          borderRadius: "50px",
          backgroundColor: "#6482AD",
        }}
        startDecorator={<AddIcon />}
        onClick={() => setOpen(true)}
      >
        Add new item
      </Button>
      <Transition in={open} timeout={400}>
        {(state) => (
          <Modal
            open={!["exited", "exiting"].includes(state)}
            onClose={() => setOpen(false)}
          >
            <ModalDialog>
              <DialogTitle>Create new pantry item</DialogTitle>
              <DialogContent>
                Fill in the information for a pantry item.
              </DialogContent>
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
                <Button loading={loading} onClick={handleAddItem}>
                  Add item
                </Button>
              </Stack>
            </ModalDialog>
          </Modal>
        )}
      </Transition>
    </React.Fragment>
  );
}
