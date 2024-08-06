"use client";

import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Checkbox from "@mui/joy/Checkbox";
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import EditModal from "@/components/modal/editModal";
import DeleteItem from "../modal/deleteModal";
import Image from "next/image";

import { usePantry } from "@/components/provider";
import { PantryItem } from "@/components/provider";

export default function PantryTbale() {
  const { items } = usePantry();
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  );

  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const filteredItems = selectedCategory
    ? currentItems.filter((item) => item.category === selectedCategory)
    : items;

  return (
    <React.Fragment>
      <Box
        className='SearchAndFilters-tabletUp'
        sx={{
          borderRadius: "sm",
          py: 2,
          display: { lg: "flex" },
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": {
            minWidth: { xs: "120px", md: "160px" },
          },
        }}
      >
        <FormControl size='sm'>
          <FormLabel>Search for items</FormLabel>
          <Input
            size='sm'
            placeholder='Search'
            className='w-[400px]'
            startDecorator={<SearchIcon />}
          />
        </FormControl>
        <FormControl size='sm'>
          <FormLabel>Filter by Category</FormLabel>
          <select
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
          >
            <option value=''>All Categories</option>
            {Array.from(new Set(items.map((item) => item.category))).map(
              (category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              )
            )}
          </select>
        </FormControl>
      </Box>
      <Sheet
        className='OrderTableContainer'
        variant='outlined'
        sx={{
          display: { lg: "flex" },
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          maxHeight: "70vh",
        }}
      >
        <Table
          aria-labelledby='tableTitle'
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground":
              "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground":
              "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{ width: 48, textAlign: "center", padding: "12px 6px" }}
              >
                <Checkbox
                  size='sm'
                  indeterminate={
                    selected.length > 0 && selected.length !== items.length
                  }
                  checked={selected.length === items.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? items.map((row) => row.id) : []
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === items.length
                      ? "primary"
                      : undefined
                  }
                  sx={{ verticalAlign: "text-bottom" }}
                />
              </th>
              <th style={{ width: 140, padding: "12px 6px" }}>Expiry Date</th>
              <th style={{ width: 240, padding: "12px 6px" }}>Item name</th>
              <th style={{ width: 240, padding: "12px 6px" }}>Quantity</th>
              <th style={{ width: 240, padding: "12px 6px" }}>Category</th>
              <th style={{ width: 240, padding: "12px 6px" }}>Image</th>
              <th style={{ width: 140, padding: "12px 6px" }}>Actions </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((row: PantryItem) => (
              <tr key={row.id}>
                <td style={{ textAlign: "center", width: 120 }}>
                  <Checkbox
                    size='sm'
                    checked={selected.includes(row.id)}
                    color={selected.includes(row.id) ? "primary" : undefined}
                    onChange={(event) => {
                      setSelected((ids) =>
                        event.target.checked
                          ? ids.concat(row.id)
                          : ids.filter((itemId) => itemId !== row.id)
                      );
                    }}
                    slotProps={{ checkbox: { sx: { textAlign: "left" } } }}
                    sx={{ verticalAlign: "text-bottom" }}
                  />
                </td>
                <td>{row.expiry}</td>
                <td>{row.name}</td>
                <td>{row.quantity}</td>
                <td>{row.category || "N/A"}</td>
                <td>
                  <Image
                    src={row.imageUrl as string}
                    alt='item-image'
                    width={500}
                    height={500}
                    className='w-[100px] h-[100px] rounder-md'
                  />
                </td>
                <td>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <EditModal item={row} />
                    <DeleteItem itemId={row.id} />
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
      <Box
        className='Pagination-tabletUp'
        sx={{ display: { xs: "none", sm: "flex" } }}
      >
        <Button
          variant='plain'
          color='neutral'
          size='sm'
          startDecorator={<KeyboardArrowLeftIcon />}
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        {Array.from(
          { length: Math.ceil(items.length / itemsPerPage) },
          (_, i) => i + 1
        ).map((pageNumber) => (
          <IconButton
            key={pageNumber}
            size='sm'
            variant={pageNumber === page ? "soft" : "outlined"}
            color={pageNumber === page ? "primary" : "neutral"}
            aria-label={`page ${pageNumber}`}
            onClick={() => setPage(pageNumber)}
          >
            {pageNumber}
          </IconButton>
        ))}
        <Button
          variant='plain'
          color='neutral'
          size='sm'
          endDecorator={<KeyboardArrowRightIcon />}
          onClick={() => setPage(page + 1)}
          disabled={page === Math.ceil(items.length / itemsPerPage)}
        >
          Next
        </Button>
      </Box>
    </React.Fragment>
  );
}
