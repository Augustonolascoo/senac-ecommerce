
"use client";
import { Box, Typography, IconButton, Button } from "@mui/material";
import Popover from '@mui/material/Popover';  // Certifique-se de que Popover está importado corretamente

export default function Carrinho({
  itemsInCart,
  setItemsInCart,
  addToCart,
  open,
  anchorEl,
  setAnchorEl,
}) {
  const updateQuantityInCart = async (id, quantity) => {
    await fetch('/api/cart', {
      method: 'PUT', // Usamos PUT para atualizar o item no carrinho
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: "1", // ID do usuário
        productId: id, // Usando o productId
        quantity: quantity, // Nova quantidade
      }),
    });
  };

  const handleAdd = async (item) => {
    item.quantity += 1; // Aumenta a quantidade localmente
    await updateQuantityInCart(item.productId, item.quantity); // Atualiza no banco de dados
    setItemsInCart([...itemsInCart]); // Atualiza o estado do carrinho
  };

  const handleRemove = async (item) => {
    if (item.quantity > 1) {
      item.quantity -= 1; // Diminui a quantidade localmente
      await updateQuantityInCart(item.productId, item.quantity); // Atualiza no banco de dados
    } else {
      // Se a quantidade for 1, removemos o item
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: "1", // ID do usuário
          productId: item.productId, // Usando o productId
        }),
      });
      const updatedItems = itemsInCart.filter((cartItem) => cartItem.productId !== item.productId);
      setItemsInCart(updatedItems);
      return;
    }
    setItemsInCart([...itemsInCart]); // Atualiza o estado do carrinho
  };

  const handleRemoveFromCart = async (id) => {
    await fetch('/api/cart', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: "1", // ID do usuário
        productId: id, // Usando o productId
      }),
    });

    const updatedItems = itemsInCart.filter((item) => item.productId !== id);
    setItemsInCart(updatedItems);
  };

  const handleCheckout = () => {
    // Função que pode redirecionar para a página de checkout ou processar a compra
    console.log('Redirecionando para checkout...');
    // Aqui você pode usar um router para redirecionar o usuário para uma página de checkout
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: 350,
          maxHeight: 400,
          overflowY: 'auto',
          backgroundColor: '#f5f5f5',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          p: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Carrinho
        </Typography>
        {itemsInCart.length === 0 ? (
          <Typography>Seu carrinho está vazio.</Typography>
        ) : (
          <Box>
            {itemsInCart.map((item) => (
              <Box
                key={item.productId}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 2,
                  backgroundColor: '#fff',
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Box display="flex" flexDirection="column" justifyContent="center" mr={2}>
                  <IconButton
                    onClick={() => handleAdd(item)} // Alterado para chamar handleAdd
                    sx={{
                      width: 30,
                      height: 30,
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease',
                      '&:hover': { backgroundColor: '#e0e0e0' },
                    }}
                  >
                    <img
                      src="/+.png"
                      alt="Adicionar"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </IconButton>
                  <Typography align="center" my={1}>{item.quantity}</Typography>
                  <IconButton
                    onClick={() => handleRemove(item)} // Alterado para chamar handleRemove
                    sx={{
                      width: 30,
                      height: 30,
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease',
                      '&:hover': { backgroundColor: '#e0e0e0' },
                    }}
                  >
                    <img
                      src="/-.png"
                      alt="Subtrair"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </IconButton>
                </Box>

                <Box display="flex" alignItems="center">
                  <Box
                    component="img"
                    src={item.imageUrl}
                    alt={item.name}
                    sx={{
                      width: 50,
                      height: 50,
                      objectFit: 'cover',
                      borderRadius: 1,
                    }}
                  />
                  <Box ml={2}>
                    <Typography variant="body1" fontWeight="bold">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      R$ {item.price.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                <IconButton
                  onClick={() => handleRemoveFromCart(item.productId)} // Alterado para chamar handleRemoveFromCart
                  sx={{
                    marginLeft: 'auto',
                    width: 30,
                    height: 30,
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    '&:hover': { backgroundColor: '#e0e0e0' },
                  }}
                >
                  <img
                    src="/x.png"
                    alt="Remover"
                    style={{ width: '100%', height: '100%' }}
                  />
                </IconButton>
              </Box>
            ))}
            <Typography
              sx={{
                marginTop: 2,
                fontWeight: 'bold',
                textAlign: 'right',
              }}
            >
              Total: R$ {itemsInCart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
            </Typography>
            
            {/* Botão de finalizar compra */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleCheckout}
              sx={{
                marginTop: 2,
                width: '100%',
              }}
            >
              Finalizar Compra
            </Button>
          </Box>
        )}
      </Box>
    </Popover>
  );
}
