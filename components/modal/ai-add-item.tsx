import React, { useState, useRef, ChangeEvent } from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Stack from "@mui/joy/Stack";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CameraCapture from "@/components/camera-capture";
import Image from "next/image";
import IconButton from "@mui/joy/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

import { LoaderCircle } from "lucide-react";
import { Transition } from "react-transition-group";
import { toast } from "react-toastify";
import { classifyPantryImage } from "@/lib/langchain";
import { usePantry } from "@/components/provider";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function UploadCaptureModal() {
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemExpiry, setItemExpiry] = useState<Date | null>(null);
  const { addItem } = usePantry();
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [classificationResult, setClassificationResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [categories, setCategories] = useState([
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
  ]);

  const handleAddItem = async () => {
    try {
      if (itemExpiry && itemCategory && itemName) {
        await addItem(
          itemName,
          itemQuantity,
          itemExpiry?.toLocaleString(),
          itemCategory,
          image
        );

        setOpen(false);
        toast.success("Item added to pantry!");
        setItemName("");
        setItemCategory("");
        setItemQuantity("");
        setItemExpiry(null);
        setImage(null);
      } else {
        toast.error("Please fill in all fields.");
      }
    } catch (error) {
      toast.error("Failed to add item.");
      console.log("something went wrong", error);
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClassifyImage = async () => {
    if (image) {
      setLoading(true);
      const response = await classifyPantryImage(image);
      if (response) {
        const item: string =
          (response as string).match(/item:\s*(\w+)/)?.[1] ?? "";
        const category: string =
          (response as string).match(/category:\s*(\w+)/)?.[1] ?? "";
        setItemName(item);
        setItemCategory(category);
        setClassificationResult(response as string);

        if (!categories.includes(category)) {
          categories.push(category);
        }
      } else {
        setItemName("");
        setItemCategory("");
        setClassificationResult("No classification result");
      }
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        startDecorator={<CameraAltIcon />}
        sx={{
          p: "0.8em 1.5em",
          borderRadius: "50px",
        }}
        className='bg-black'
        onClick={() => setOpen(true)}
      >
        Add or Scan item
      </Button>{" "}
      <Transition in={open} timeout={400}>
        {(state) => (
          <Modal
            open={!["exited", "exiting"].includes(state)}
            onClose={() => setOpen(false)}
          >
            <ModalDialog size='lg' sx={{ overflowX: "hidden" }}>
              <DialogTitle>Upload or Capture Pantry Item</DialogTitle>
              <DialogContent>
                <Stack spacing={2}>
                  <FormControl>
                    <input
                      type='file'
                      accept='image/*'
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                  </FormControl>

                  {image ? (
                    <span
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      className='w-fit ml-5 -mt-[1em] mb-[1em] relative flex  items-center justify-center  hover:opacity-50 transition-all ease-in-out
'
                    >
                      <Image
                        src={image}
                        alt='Selected'
                        className='max-w-[150px] max-h-[150px] w-[150px] h-[150px] rounded-[10px]'
                        loading='lazy'
                        width={500}
                        height={500}
                      />

                      {isHovered && (
                        <IconButton
                          variant='plain'
                          onClick={(e) => {
                            e.stopPropagation();
                            setImage(null);
                            setLoading(false);
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      )}
                    </span>
                  ) : (
                    ""
                  )}
                  {classificationResult && (
                    <p className='text-xl font-semibold'>
                      {loading ? (
                        <LoaderCircle className='animate-spin' />
                      ) : (
                        classificationResult
                      )}
                    </p>
                  )}

                  <Button
                    startDecorator={<ImageIcon />}
                    variant='plain'
                    onClick={handleButtonClick}
                  >
                    Upload image
                  </Button>
                  <Button variant='soft' onClick={handleClassifyImage}>
                    {loading ? (
                      <LoaderCircle className='animate-spin' />
                    ) : (
                      "Classify Image"
                    )}
                  </Button>
                  <CameraCapture
                    categories={categories}
                    setItemCategory={setItemCategory}
                    setItemName={setItemName}
                  />
                  <FormLabel>Name</FormLabel>
                  <Input
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
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
                  <FormLabel>Quantity</FormLabel>
                  <Input
                    required
                    type='number'
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(e.target.value)}
                  />
                  <FormLabel>Expiry Date</FormLabel>
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
                  <Button onClick={handleAddItem}>Add Item</Button>
                </Stack>
              </DialogContent>
            </ModalDialog>
          </Modal>
        )}
      </Transition>
    </>
  );
}
