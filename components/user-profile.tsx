import React from "react";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Avatar from "@mui/joy/Avatar";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import ListDivider from "@mui/joy/ListDivider";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import { useAuth } from "@/components/auth-context";

const UserProfile = () => {
  const { currentUser, logout } = useAuth();

  return (
    <>
      {currentUser && (
        <Dropdown>
          <MenuButton
            variant='plain'
            size='sm'
            sx={{
              maxWidth: "32px",
              maxHeight: "32px",
              borderRadius: "9999999px",
            }}
          >
            <Avatar
              src={currentUser?.photoURL as string}
              srcSet={currentUser?.photoURL as string}
              sx={{ maxWidth: "32px", maxHeight: "32px" }}
            />
          </MenuButton>
          <Menu
            placement='bottom-end'
            size='sm'
            sx={{
              zIndex: "99999",
              p: 1,
              gap: 1,
              "--ListItem-radius": "var(--joy-radius-sm)",
            }}
          >
            <MenuItem>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Avatar
                  src={currentUser?.photoURL as string}
                  srcSet={currentUser?.photoURL as string}
                  sx={{ borderRadius: "50%" }}
                />
                <Box sx={{ ml: 1.5 }}>
                  <Typography level='title-sm' textColor='text.primary'>
                    {currentUser?.displayName}
                  </Typography>
                  <Typography level='body-xs' textColor='text.tertiary'>
                    {currentUser?.email}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            <ListDivider />
            <MenuItem onClick={logout}>
              <LogoutRoundedIcon />
              Log out
            </MenuItem>
          </Menu>
        </Dropdown>
      )}
    </>
  );
};

export default UserProfile;
