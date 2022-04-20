import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Image from "next/image";
import logo from "../public/logo.png";
import Link from "next/link";
import AppContext from "../store/AppContext";
import { useRouter } from "next/router";

type Page = {
  name: string;
  path: string;
};

const pages: Page[] = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Create API",
    path: "/generate/api",
  },
  {
    name: "Connect to API",
    path: "/config",
  },
  {
    name: "Create Entity",
    path: "/generate/entity",
  },
];

const Header = () => {
  const router = useRouter();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const appCtx = useContext(AppContext);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "background.paper" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            <Image src={logo} alt="FastGen Logo" height="50px" width="50px" />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              {/* <MenuIcon /> */}
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Link href={page.path}>
                    <Typography textAlign="center">{page.name}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            <Image src={logo} alt="FastGen Logo" height="15px" width="15px" />
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Link key={page.name} href={page.path}>
                <Button onClick={handleCloseNavMenu}>{page.name}</Button>
              </Link>
            ))}
          </Box>
          {appCtx.api && (
            <Chip
              variant="outlined"
              color="info"
              label={`Configuring API: ${appCtx.api.name}`}
              sx={{ marginRight: "1rem" }}
            />
          )}

          {appCtx.apiConnected ? (
            <Tooltip title="Serverside features are enabled">
              <Chip variant="outlined" color="success" label="Connected" />
            </Tooltip>
          ) : (
            <Tooltip title="Enable the Fastgen-api on your server to unlock serverside features">
              <Box onClick={() => appCtx.checkApi()}>
                <Chip
                  variant="outlined"
                  color="error"
                  label="API not Connected"
                  clickable={true}
                />
              </Box>
            </Tooltip>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
