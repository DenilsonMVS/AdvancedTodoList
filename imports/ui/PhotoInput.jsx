import React from 'react';
import { Avatar, Box, IconButton } from '@mui/material';

export const PhotoInput = ({value, onChange}) => {

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader(file);
      reader.onload = (e) => {
        setPhotoUrl(e.target.result);
        onChange(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box display="flex" justifyContent="flex-end">
      <input accept="image/*" id="upload-avatar-pic" type="file" hidden onChange={handlePhotoChange} />
      <label htmlFor="upload-avatar-pic">
        <IconButton component="span">
          <Avatar sx={{ width: "10vmin", height: "10vmin" }} src={value} alt="User Photo"/>
        </IconButton>
      </label>
    </Box>
  );
};
