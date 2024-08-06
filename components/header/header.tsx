"use client";

import * as React from "react";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Sheet from "@mui/joy/Sheet";
import IconButton from "@mui/joy/IconButton";
import Logo from "@/assets/shopping-bag.svg";
import Image from "next/image";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import UploadCaptureModal from "../modal/ai-add-item";
import UserProfile from "@/components/user-profile";

export default function Header() {
  return (
    <Sheet
      sx={{
        display: { lg: "flex" },
        alignItems: "center",
        justifyContent: "space-between",
        position: "fixed",
        top: 0,
        width: "100vw",
        height: "var(--Header-height)",
        zIndex: 9995,
        p: 4,
        gap: 1,
        borderColor: "background.level1",
        marginBottom: "2em",
        background: "none",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Header-height": "52px",
            [theme.breakpoints.up("md")]: {
              "--Header-height": "0px",
            },
          },
        })}
      />

      <Box
        sx={{
          mb: 1,
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
          height: "var(--Header-height)",
          background: "none",
        }}
        className='flex flex-1 items-start justify-between'
      >
        <IconButton
          color='neutral'
          size='sm'
          sx={{ display: "flex", gap: 1 }}
          className='ml-3'
        >
          <Image
            src={Logo}
            alt='logo'
            width={500}
            height={500}
            className='w-[40px] h-[40px]'
          />
          <Typography level='h3' component='h1' sx={{ color: "white" }}>
            Pantry Tracker
          </Typography>{" "}
        </IconButton>
        <Sheet
          sx={{
            display: "flex",
            gap: 1,
            background: "none",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <UploadCaptureModal />
          <UserProfile />
        </Sheet>
      </Box>
    </Sheet>
  );
}
