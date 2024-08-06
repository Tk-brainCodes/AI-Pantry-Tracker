"use client";

import React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import { ToastContainer } from "react-toastify";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";

import Header from "@/components/header/header";
import PantryTable from "@/components/pantryTable/pantryTable";

export default function PantryTracker() {

  return (
    <>
      <ToastContainer />
      <CssVarsProvider disableTransitionOnChange>
        <CssBaseline />
        <Box sx={{ display: "flex", minHeight: "100dvh" }}>
          <Header />
          {/* <CameraCapture /> */}
          <Box
            component='main'
            className='MainContent'
            sx={{
              px: { xs: 2, md: 6 },
              pt: {
                xs: "calc(12px + var(--Header-height))",
                sm: "calc(12px + var(--Header-height))",
                md: 3,
              },
              pb: { xs: 2, sm: 2, md: 3 },
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              height: "100dvh",
              gap: 1,
              marginTop: "8em",
            }}
          >
            <PantryTable />
          </Box>
        </Box>
      </CssVarsProvider>
    </>
  );
}
