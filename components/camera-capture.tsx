"use client";

import { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import Button from "@mui/joy/Button";
import Image from "next/image";
import { classifyPantryImage } from "@/lib/langchain";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

const CameraCapture = ({
  setItemName,
  setItemCategory,
  categories,
  onCapture, 
}: {
  setItemName: any;
  setItemCategory: any;
  categories: any;
  onCapture: (image: string) => void;
}) => {
  const camera = useRef<any>(null);
  const [image, setImage] = useState<string | null>(null);
  const [classificationResult, setClassificationResult] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(false);

  const takePhoto = () => {
    const photo = camera.current.takePhoto();
    setImage(photo);
    setClassificationResult(null);
    onCapture(photo); 
  };

  const classifyImage = async (file: File) => {
    setLoading(true);
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      const response = await classifyPantryImage(base64Image);
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
        setClassificationResult(`Item: ${item}, Category: ${category}`);
      } else {
        setClassificationResult("Could not classify the item.");
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (image) {
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], `photo-${Date.now()}.png`, {
        type: "image/png",
      });
      await classifyImage(file);
      setImage(null);
    }
  };

  const errorMessages = {
    noCameraAccessible:
      "No camera device accessible. Please connect your camera or try a different browser.",
    permissionDenied:
      "Permission denied. Please refresh and give camera permission.",
    switchCamera:
      "It is not possible to switch camera to different one because there is only one video device accessible.",
    canvas: "Canvas is not supported.",
  };

  return (
    <div>
      <Camera ref={camera} aspectRatio={16 / 9} errorMessages={errorMessages} />
      <Button
        startDecorator={<CameraAltIcon />}
        color='primary'
        onClick={takePhoto}
        variant='plain'
      >
        Take Photo
      </Button>
      {image && (
        <div>
          <Image
            src={image}
            alt='Captured'
            style={{ width: "100%" }}
            loading='lazy'
            width={500}
            height={500}
          />
          <Button color='primary' onClick={handleUpload}>
            Upload Photo
          </Button>
        </div>
      )}
      {loading && (
        <p className='text-xl text-green-400 mt-2 mb-2'>Classifying image...</p>
      )}
      {classificationResult && (
        <p className='text-xl font-semibold'>{classificationResult}</p>
      )}
    </div>
  );
};

export default CameraCapture;
