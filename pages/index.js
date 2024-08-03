import React, { useState, useEffect } from 'react';
import { Box, Modal, Typography, Stack, TextField, Button, IconButton } from '@mui/material';
import { firestore } from '@/firebase';
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from 'firebase/firestore';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function Home() {
  const [inventorypantry, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setLoading(false);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const updateItemQuantity = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    if (quantity <= 0) {
      await deleteDoc(docRef);
    } else {
      await setDoc(docRef, { quantity });
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventorypantry.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{
        bgcolor: darkMode ? '#1f1f1f' : '#e0f7fa',
        color: darkMode ? '#e0e0e0' : '#333',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        backgroundImage: darkMode ? 'linear-gradient(180deg, #1f1f1f, #333)' : 'linear-gradient(180deg, #e0f7fa, #b2ebf2)',
      }}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={350}
          bgcolor={darkMode ? '#2c2c2c' : '#ffffff'}
          border="2px solid #000"
          boxShadow={24}
          p={3}
          display="flex"
          flexDirection="column"
          gap={2}
          sx={{ transform: "translate(-50%, -50%)", borderRadius: '8px' }}
        >
          <Typography variant="h6" color={darkMode ? '#e0e0e0' : '#333'}>
            Add New Item
          </Typography>
          <Stack width="100%" direction="row" spacing={1}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Item Name"
              sx={{ input: { color: darkMode ? '#e0e0e0' : '#000' } }}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
              sx={{
                bgcolor: darkMode ? '#007bff' : '#007bff',
                '&:hover': {
                  bgcolor: darkMode ? '#0056b3' : '#0056b3',
                },
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Stack direction="row" spacing={2} mb={2}>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            bgcolor: darkMode ? '#007bff' : '#007bff',
            '&:hover': {
              bgcolor: darkMode ? '#0056b3' : '#0056b3',
            },
          }}
        >
          Add Item
        </Button>
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ input: { color: darkMode ? '#e0e0e0' : '#000' } }}
        />
        <IconButton onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Stack>
      <Box border={`1px solid ${darkMode ? '#e0e0e0' : '#333'}`} mt={2} bgcolor={darkMode ? '#2c2c2c' : '#ffffff'}>
        <Box
          width="700px"
          height="80px"
          bgcolor={darkMode ? '#333' : '#4dd0e1'}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={1}
          borderRadius="8px"
          boxShadow="0px 4px 6px rgba(0,0,0,0.1)"
        >
          <Typography variant="h4" color={darkMode ? '#e0e0e0' : '#333'}>
            Inventory
          </Typography>
        </Box>
        <Stack width="700px" spacing={2} overflow="auto" p={2}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="80px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor={darkMode ? '#333' : '#f5f5f5'}
              padding={2}
              border={`1px solid ${darkMode ? '#e0e0e0' : '#ccc'}`}
              borderRadius="8px"
              boxShadow="0px 4px 6px rgba(0,0,0,0.1)"
            >
              <Typography variant="h6" color={darkMode ? '#e0e0e0' : '#333'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h6" color={darkMode ? '#e0e0e0' : '#333'}>
                {quantity}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    bgcolor: '#4caf50',
                    borderRadius: '50%',
                    width: 36,
                    height: 36,
                    minWidth: 36,
                    padding: 0,
                    '&:hover': {
                      bgcolor: '#388e3c',
                    },
                  }}
                  onClick={() => updateItemQuantity(name, quantity + 1)}
                >
                  +
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    bgcolor: '#f44336',
                    borderRadius: '50%',
                    width: 36,
                    height: 36,
                    minWidth: 36,
                    padding: 0,
                    '&:hover': {
                      bgcolor: '#c62828',
                    },
                  }}
                  onClick={() => updateItemQuantity(name, quantity - 1)}
                >
                  -
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    bgcolor: '#ff5722',
                    borderRadius: '8px',
                    '&:hover': {
                      bgcolor: '#e64a19',
                    },
                  }}
                  onClick={() => removeItem(name)}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}


