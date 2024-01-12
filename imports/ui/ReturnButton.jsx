import React from "react";

import { Box, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from "react-router-dom";

export function ReturnButton({ to }) {


  return <Box
    display="flex"
    justifyContent="flex-start"
    width="100%"
    height="0vh"
    marginLeft="15px"
    marginTop="15px"
  >
    <Link to={to}>
      <IconButton
        style={{
          borderRadius: '50%',
          padding: '10px',
          backgroundColor: 'gray',
          color: 'black',
        }}
        aria-label="return"
      >
        <ArrowBackIcon />
      </IconButton>
    </Link>
  </Box>
}