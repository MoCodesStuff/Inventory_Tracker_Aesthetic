'use client'

import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, Modal, Stack, Typography, TextField, Button, IconButton, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import { collection, getDocs, query, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';


export default function Home() {
    const [inventory, setInventory] = useState([])
    const [open, setOpen] = useState(false)
    const [itemName, setItemName] = useState('')

    const updateInventory = async () => {
        const snapshot = query(collection(firestore, 'inventory'))
        const docs = await getDocs(snapshot)
        const inventoryList = []
        docs.forEach(doc => {
            inventoryList.push({
                name: doc.id,
                ...doc.data()
            })
        })
        setInventory(inventoryList)
    }

    const removeItem = async (item) => {
        const docRef = doc(collection(firestore, 'inventory'), item)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const { quantity } = docSnap.data()
            if (quantity === 1) {
                await deleteDoc(docRef)
            } else {
                await setDoc(docRef, { quantity: quantity - 1 }, { merge: true })
            }
        }

        await updateInventory()
    }

    const addItem = async (item) => {
        const docRef = doc(firestore, 'inventory', item)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const { quantity } = docSnap.data()
            await setDoc(docRef, { quantity: quantity + 1 }, { merge: true })
        } else {
            await setDoc(docRef, { quantity: 1 })
        }
        updateInventory()
    }

    useEffect(() => {
        updateInventory()
    }, [])

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    return (
        <Box
            width="100vw"
            height="100vh"
            display="inline-flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={2}
            bgcolor='antiquewhite'
        >
            <Modal open={open} onClose={handleClose}>
                <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    width={500}
                    bgcolor="white"
                    border="2px solid #000"
                    boxShadow={24}
                    p={4}
                    display="flex"
                    flexDirection="column"
                    gap={3}
                    sx={{
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <Typography variant="h6" sx={{ fontFamily: 'Monospace', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Add Item
                        <Button
                            sx={{
                                color: 'black',
                                backgroundColor: 'transparent',
                                border: '2px solid black',
                                borderRadius: 0,
                                padding: '8.5px 29px',
                                margin: 0,
                                fontFamily: 'Monospace',
                                fontWeight: 'bold',
                                width: 'auto',
                                minWidth: '75px',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    color: 'darkred',
                                    borderColor: 'darkred',
                                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                },
                            }}
                            onClick={handleClose}
                        >
                            Exit_
                        </Button>
                    </Typography>
                    <Stack
                        width="100%"
                        direction="row"
                        spacing={2}
                        sx={{
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            variant='outlined'
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            sx={{
                                width: '75%',
                                border: '0.75px solid black',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'black',
                                        borderRadius: 0,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'black',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'black',
                                    },
                                },
                                input: {
                                    fontFamily: 'Monospace',
                                    padding: '10px',
                                },
                            }}
                        />
                        <Button
                            variant="outlined"
                            onClick={() => {
                                addItem(itemName)
                                setItemName('')
                                handleClose()
                            }}
                            sx={{
                                width: '25%',
                                color: 'black',
                                borderColor: 'black',
                                borderRadius: 0,
                                fontWeight: 'bold',
                                border: '2px solid black',
                                fontFamily: 'Monospace',
                                padding: '8.5px 20px',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                    borderColor: 'black',
                                },
                            }}
                        >
                            Add_
                        </Button>
                    </Stack>
                </Box>
            </Modal>

            <Box border="2px solid #333">
                <Box
                    width="800px"
                    height="100px"
                    bgcolor="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        borderBottom: '2px solid black',
                    }}
                >
                    <Typography variant="h3" color="333" sx={{ fontFamily: 'Monospace' }} borderColor="black">
                        Inventory_Items_
                    </Typography>
                </Box>

                <Box bgcolor="#FAF0E6" width="800px" height="300px" overflow="auto">
                    <Table sx={{ borderCollapse: 'collapse', width: '100%' }}>
                        <TableHead
                            sx={{
                                position: 'sticky',
                                top: 0,
                                backgroundColor: '#FAF0E6', // Match the background to ensure consistency
                                zIndex: 2, // Ensure the header stays above the content
                            }}
                        >
                            <TableRow
                                sx={{
                                    borderBottom: '2px solid black', // Ensure the border stays with the header
                                }}
                            >
                                <TableCell sx={{ fontFamily: 'Monospace', fontWeight: 'bold' }}>Item Name</TableCell>
                                <TableCell
                                    sx={{
                                        fontFamily: 'Monospace',
                                        fontWeight: 'bold',
                                        textAlign: 'right',
                                        paddingRight: '16px',
                                    }}
                                    align="right"
                                >
                                    Quantity
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontFamily: 'Monospace',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        paddingLeft: '16px',
                                    }}
                                    align="center"
                                >
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {inventory.map(({ name, quantity }, index) => (
                                <TableRow
                                    key={name}
                                    sx={{
                                        borderBottom: index !== inventory.length - 1 ? '2px solid black' : 'none',
                                    }}
                                >
                                    <TableCell
                                        sx={{
                                            borderBottom: '2px solid black',
                                            fontFamily: 'Monospace',
                                            maxWidth: '200px',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {name.charAt(0).toUpperCase() + name.slice(1)}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontFamily: 'Monospace',
                                            textAlign: 'center',
                                            width: '100px',
                                            borderBottom: '2px solid black',
                                        }}
                                    >
                                        {quantity}
                                    </TableCell>
                                    <TableCell align="center" sx={{ width: '100px', borderBottom: '2px solid black' }}>
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <IconButton
                                                aria-label="add"
                                                color="success"
                                                onClick={() => addItem(name)}
                                                sx={{
                                                    color: 'black',
                                                    '&:hover': {
                                                        color: 'green',
                                                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                                    },
                                                }}
                                            >
                                                <AddIcon fontSize="inherit" />
                                            </IconButton>
                                            <IconButton
                                                aria-label="remove"
                                                color="warning"
                                                onClick={() => removeItem(name)}
                                                sx={{
                                                    color: 'black',
                                                    '&:hover': {
                                                        color: 'red',
                                                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                                    },
                                                }}
                                            >
                                                <RemoveIcon fontSize="inherit" />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Box>

            <Button
                variant="outlined"
                color="primary"
                onClick={handleOpen}
                sx={{
                    color: 'black',
                    borderColor: 'black',
                    fontWeight: 'light',
                    fontFamily: 'Monospace',
                    borderRadiusadius:'0',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        borderColor: 'black',
                    },
                }}
            >
                Add New Item
            </Button>
        </Box>
    )
}