/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";

import "./App.css";
import "@fontsource/jost";
import "@fontsource/jost/500.css";
import "@fontsource/jost/600.css";
import "@fontsource/jost/700.css";

import SectionHeading from "./components/SectionHeading";
import CategoryCard from "./components/CategoryCard";
import ItemCard from "./components/ItemCard";
import ModalLogin from "./components/ModalLogin";
import Loading from "./components/Loading";
import ModalItem from "./components/ModalItem";

import Pagination from '@mui/material/Pagination';

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';

import { Badge, BadgeProps, Button, Divider, Drawer, Grid, IconButton, styled } from "@mui/material";
import ProductList from "./components/ProductList";
import ModalPayment from "./components/ModalPayment";

interface Product {
  id: number;
  name: string;
  price: number;
  sku: string;
  quantity: number;
  available: boolean;
  categoryId: number;
  image: string;
  createdAt: string;
  updatedAt: string;
  onCartAmount: number;
  category: {
    id: number;
    name: string;
    available: boolean;
    image: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface Category {
  id: number;
  name: string;
  available: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
}

const PAGE_SIZE = 4;

function App() {

  const [FeaturedProducts, setFeaturedProducts] = useState<Product[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);

  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [isLogged, setIsLogged] = useState(sessionStorage.getItem('user') !== '{}')

  const [cartProducts, setCartProducts] = useState<Product[]>(JSON.parse(sessionStorage.getItem('products') || '[]'));

  const [cartProductsWithAmount, setCartProductsWithAmount] = useState<Product[]>([]);

  const [showCart, setShowCart] = useState(false);

  const [open, setOpen] = useState(false);

  const [openPayment, setOpenPayment] = useState(false);

  const [openDrawer, setOpenDrawer] = useState(false)

  const [selectedItem, setSelectedItem] = useState({});

  const [selectedCategory, setSelectedCategory] = useState({});

  const [products, setProducts] = useState<Product[]>([]);

  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user') || "{}"))


  const [currentPage, setCurrentPage] = useState(2);

  const handlePageChange = (event: any, value: any) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;

  const endIndex = startIndex + PAGE_SIZE;

  const currentProducts = products.slice(startIndex, endIndex);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setSelectedItem({});
    setOpen(false);
  };

  const handleOpenPayment = () => setOpenPayment(true)

  const handleClosePayment = () => setOpenPayment(false)

  const openLoginModal = () => {
    setLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };

  const handleProductByCategory = (
    selectedCategoryId: any,
    products: Product[]
  ) => {

    if (selectedCategoryId) {
      const category = categories.find((category) => category.id === selectedCategoryId)
      const filtered = products.filter(
        ({ categoryId }) => categoryId === selectedCategoryId
      );
      return { filtered, category }
    } else {
      return products;
    }
  };

  function decreaseOnCartAmountById(items: any, itemId: any) {
    const updatedItems = items.map((item: any) => {
      if (item.id === itemId && item.onCartAmount > 0) {
        return {
          ...item,
          onCartAmount: item.onCartAmount - 1,
        };
      }
      return item;
    });

    const filteredItems = updatedItems.filter((item: any) => item.onCartAmount > 0);

    setCartProductsWithAmount(filteredItems)

    sessionStorage.setItem('products', JSON.stringify(Object.values(filteredItems)))

  }

  const handleSelectProduct = (product: any) => {

    const cartProductsAndNewlySelected = [...cartProducts, product]

    setCartProducts(cartProductsAndNewlySelected)

    const groupedProducts: any = {};

    cartProductsAndNewlySelected.forEach((product) => {
      const { id } = product;

      if (!groupedProducts[id]) {
        groupedProducts[id] = {
          ...product,
          onCartAmount: 1,
        };
      } else {
        groupedProducts[id].onCartAmount += 1;
      }
    });

    setCartProductsWithAmount(Object.values(groupedProducts))

    sessionStorage.setItem('products', JSON.stringify(Object.values(groupedProducts)))

  }

  useEffect(() => {
    setIsLoading(true);

    axios
      .get(`${process.env.REACT_APP_API_URL!}/Product/FeaturedProducts`)
      .then((res) => {
        setFeaturedProducts(res.data);
      });

    axios.get(`${process.env.REACT_APP_API_URL!}/Category`).then((res) => {
      setCategories(res.data);
    });

    axios.get(`${process.env.REACT_APP_API_URL!}/Product`).then((res: any) => {
      setProducts(res.data);
    });

    if (cartProducts) {
      setCartProductsWithAmount(JSON.parse(sessionStorage.getItem('products') || '{}'))
    }

    setIsLoading(false);
  }, []);

  return (
    <>
      <div className="App">
        <header className="header py-3 flex-row justify-content-end">
          <nav className="w-100 d-flex align-items-center position-relative">
            <div className="w-100 px-5 d-flex justify-content-between flex-row align-items-center">
              <div></div>
              <a className="navbar-brand" href="/">
                MOBILLIO
              </a>
              {showCart ? (
                <div></div>
              ) : (
                <div className="icons  d-sm-flex d-md-flex ">
                  {isLogged && (
                    <StyledBadge
                      badgeContent={cartProductsWithAmount && cartProductsWithAmount.length > 0 ? cartProductsWithAmount.reduce((sum, item) => sum + item.onCartAmount, 0) : 0}
                      color="success"
                    >
                      <ShoppingBagOutlinedIcon className="cart" onClick={() => {
                        setOpenDrawer(true)
                      }} />
                    </StyledBadge>
                  )}
                  {isLogged && user ? (
                    <div className="d-flex" onClick={openLoginModal}>
                      <div >
                        <ManageAccountsOutlinedIcon
                          className="user"

                        />
                      </div>
                      <Divider orientation="vertical" flexItem />
                      <div className="d-flex align-items-end">
                        {"Olá, " + user.firstName}
                      </div>
                    </div>
                  ) : <PersonOutlineOutlinedIcon className="user" onClick={openLoginModal} />}
                </div>
              )}
            </div>
          </nav>
        </header>

        {isLoading && <Loading />}

        {!isLoading && window.location.pathname === "/" && (
          <div className="body">
            <div className="featured w-100 d-flex align-items-center flex-column pb-5">
              {FeaturedProducts.length > 0 && (
                <div className="py-4">
                  <div className="max max-width-content w-100 d-flex align-items-center flex-column">
                    <div className="w-100 d-flex max-width-content align-items-center flex-row justify-content-between">
                      <div className="featured-product-info d-flex mr-3 pr-3 flex-column">
                        <div className="info d-flex position-relative align-items-start mb-3 p-2 flex-column text-start">
                          {`
                      Furniture
                      ${FeaturedProducts[0].category?.name} - 2023
                      `}
                        </div>
                        <h1 className="mb-3">{FeaturedProducts[0]?.name}</h1>
                        <div className="featured-price d-flex align-items-end mb-3 flex-row">
                          ${FeaturedProducts[0].price}
                        </div>
                        <div className="button-group d-flex align-items-center flex-row">
                          <button
                            onClick={() => {
                              setSelectedItem(FeaturedProducts[0]);

                              handleOpen();
                            }}
                          >
                            View Product
                          </button>
                        </div>
                      </div>
                      <img
                        src={FeaturedProducts[0].image}
                        alt="featured"
                        className="featured-product-image w-100 position-relative"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="categories section-container flex-column">
              <div className="max-width-content">
                <SectionHeading
                  sectionName="SHOP BY CATEGORIES"
                  description="Start shopping based on the categories you are interested in"
                />
                <div className="cards-container d-flex flex-row w-100 align-items-start justify-content-between">
                  {categories.map((category) => (
                    <div key={category.id}>
                      <CategoryCard category={category} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="trending section-container">
              <div className="max-width-content">
                <SectionHeading
                  sectionName="TRENDING ITEMS"
                  description="Explore our most trending products, new items and the best Mobilio offers you can buy"
                />
                <div className="gallery w-100 d-flex align-items-stretch">
                  <div
                    className="left d-flex p-3 align-items-center flex-column justify-content-center align-self-stretch"
                    style={{ flex: 1, }}
                    onClick={() => {
                      setSelectedItem(FeaturedProducts[0]);
                      handleOpen();
                    }}
                  >
                    <ItemCard product={FeaturedProducts[0]} style={{
                      aspectRatio: '3/2',
                      objectFit: 'cover',
                      transition: 'all .5s ease-in-out',
                      width: '605px',
                      height: 'auto'
                    }} />
                  </div>
                  <div className="right">
                    {FeaturedProducts.length >= 2 && (
                      <div
                        className="top w-100 d-flex flex-row"
                        style={{ flex: 1 }}
                      >
                        <div
                          className="left d-flex p-3 align-items-center flex-column justify-content-center"
                          style={{ flex: 1 }}
                          onClick={() => {
                            setSelectedItem(FeaturedProducts[1]);
                            handleOpen();
                          }}
                        >
                          <ItemCard product={FeaturedProducts[1]} style={{
                            aspectRatio: '3/2',
                            objectFit: 'contain',
                            transition: 'all .5s ease-in-out',
                            width: '150px',
                            height: 'auto'
                          }} />
                        </div>
                        <div
                          className="right d-flex p-3 align-items-center flex-column justify-content-center"
                          style={{ flex: 1 }}
                          onClick={() => {
                            setSelectedItem(FeaturedProducts[2]);
                            handleOpen();
                          }}
                        >
                          <ItemCard product={FeaturedProducts[2]} style={{
                            aspectRatio: '2/3',
                            objectFit: 'cover',
                            transition: 'all .5s ease-in-out',
                            width: '150px',
                            height: 'auto'
                          }} />
                        </div>
                      </div>
                    )}

                    {FeaturedProducts.length >= 4 && (
                      <div
                        className="bottom w-100 d-flex flex-row"
                        style={{ flex: 1 }}
                      >
                        <div
                          className="left d-flex p-3 align-items-center flex-column justify-content-center"
                          style={{ flex: 1 }}
                          onClick={() => {
                            setSelectedItem(FeaturedProducts[3]);
                            handleOpen();
                          }}
                        >
                          <ItemCard product={FeaturedProducts[3]} style={{
                            aspectRatio: '2/3',
                            objectFit: 'cover',
                            transition: 'all .5s ease-in-out',
                            width: '150px',
                            height: 'auto'
                          }} />
                        </div>
                        <div
                          className="right d-flex p-3 align-items-center flex-column justify-content-center"
                          style={{ flex: 1 }}
                          onClick={() => {
                            setSelectedItem(FeaturedProducts[4]);
                            handleOpen();
                          }}
                        >
                          <ItemCard product={FeaturedProducts[4]} style={{
                            aspectRatio: '2/3',
                            objectFit: 'cover',
                            transition: 'all .5s ease-in-out',
                            width: '150px',
                            height: 'auto'
                          }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="products section-container">
              <div className="max-width-content">
                <SectionHeading
                  sectionName="ALL PRODUCTS"
                  description="Explore our catalog, and find what you seek"
                />
                <div className="container d-flex flex-column align-items-center justify-content-center" style={{ height: '622px!important' }}>
                  <Grid container spacing={2} style={{ transition: 'all .5s ease-in-out' }}>
                    {currentProducts.map((product: any) => (
                      <Grid key={product.id!} item xs={12} sm={6} md={3} onClick={() => {
                        setSelectedItem(product)

                        handleOpen()
                      }}>
                        <ItemCard product={product} style={{
                          aspectRatio: '2/3',
                          objectFit: 'cover',
                          transition: 'all .5s ease-in-out'
                        }} />
                      </Grid>
                    ))}
                  </Grid>
                  <Pagination
                    count={Math.ceil(products.length / PAGE_SIZE)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    style={{ marginTop: "20px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && window.location.pathname.includes("/category/") && (
          <ProductList
            productsList={handleProductByCategory(
              Number(window.location.pathname.split("/")[2]),
              products
            )}
            handleOpen={handleOpen}
            setSelectedItem={setSelectedItem}
            category={selectedCategory}
          />
        )}

        <div className="footer p-3">
          <div className="max-width-content">
            <div
              className="w-100 d-flex align-items-start flex-row pb-5 justify-content-between"
              style={{ maxWidth: "max-content" }}
            >
              <div
                className="d-flex align-items-start flex-column text-start"
                style={{ maxWidth: "max-content", marginRight: "150px" }}
              >
                <h3>MOBILLIO</h3>
                <span>
                  Street Avenue Of Somewhere, 4002, Someplace - TX, 29060270,
                  United States
                </span>
                <span>11 4002-8922</span>
                <span>email@mobillio.com</span>
              </div>

              <div className="container-links d-flex align-items-start flex-row justify-content-between">
                <div className="categories-links d-flex align-items-start flex-column justify-content-start">
                  <span className="mb-5">Categories</span>
                  {categories.map((category) => (
                    <a
                      key={`category-${category.id}`}
                      href={`/category/${category.id}`}
                    >
                      <span
                        style={{ color: "#00000080", marginBottom: "16px" }}
                      >
                        {category.name}
                      </span>
                    </a>
                  ))}
                </div>
                <div className="categories-links d-flex align-items-start flex-column justify-content-start">
                  <span className="mb-5">Company</span>
                  <span style={{ color: "#00000080", marginBottom: "16px" }}>
                    Shop
                  </span>
                  <span style={{ color: "#00000080", marginBottom: "16px" }}>
                    About Us
                  </span>
                </div>

                <div className="categories-links d-flex align-items-start flex-column justify-content-start">
                  <span className="mb-5">Resources</span>
                  <span style={{ color: "#00000080", marginBottom: "16px" }}>
                    Contact us
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Drawer anchor="right" open={openDrawer} onClose={() => setOpenDrawer(false)} >
          <div className="d-flex flex-column justify-content-between" style={{ width: '431.75px', height: '100%', padding: '24px' }}>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <h1>Your cart</h1>
                </div>
              </div>
              <hr style={{ borderTop: 'dashed 1px' }} />

              <div>
                {cartProductsWithAmount && cartProductsWithAmount.length > 0 ? cartProductsWithAmount.map((product, index) => {
                  return (
                    <div key={index} className="container">
                      <div className="row">
                        <div className="col-2">
                          <img src={product.image} style={{ aspectRatio: '1/1', objectFit: 'cover', width: '70px', height: 'auto' }} alt={`product-${product.name}`} />
                        </div>
                        <div className="col-10 d-flex justify-content-center align-items-center">
                          <div className="container">
                            <div className="row">
                              <div className="col-10 d-flex justify-content-center align-items-center">

                                <span className="">{product.category.name} - {product.name} {' '} </span>

                                <span className="">{` / x${product.onCartAmount}`}</span>
                              </div>
                              <div className="d-flex justify-content-center align-items-center col-2">
                                <IconButton aria-label="delete" color="error" onClick={() => {
                                  decreaseOnCartAmountById(cartProductsWithAmount, product.id)
                                }}><DeleteOutlineOutlinedIcon color="error" /></IconButton>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                      {index + 1 === cartProductsWithAmount.length ? null : <hr />}
                    </div>)
                }) : (
                  null
                )}
              </div>
            </div>


            {cartProductsWithAmount && cartProductsWithAmount.length > 0 ? null : (<div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100%' }}>
              <AddShoppingCartOutlinedIcon color="disabled" />
              <p> Seems that you dont have any items selected :{'('} </p>
              <p> Start Buying now!</p>
            </div>)}



            <div className="container">
              <hr style={{ borderTop: 'dashed 1px' }} />

              <div className="row">
                <div className="col-7">
                  <h1>Total</h1>
                </div>
                <div className="col-5 d-flex text-end justify-content-center align-items-center">
                  <h4>{cartProductsWithAmount && cartProductsWithAmount.length > 0 ? `$ ${cartProductsWithAmount.reduce((sum, item) => sum + item.price * item.onCartAmount, 0).toFixed(2)}` : `$ 0.00`}</h4>
                </div>
              </div>
              <hr style={{ borderTop: 'dashed 1px' }} />

              <Button className="w-100" variant="contained" color="success" disabled={!(cartProductsWithAmount.length > 0)} onClick={() => {
                setOpenDrawer(false)
                handleOpenPayment()
              }}>
                Payment
              </Button>
            </div>


          </div>

        </Drawer>
        <ModalLogin isOpen={loginModalOpen} onClose={closeLoginModal} setIsLogged={setIsLogged} isLogged={isLogged} />

        <ModalPayment handleOpen={handleOpenPayment} handleClose={handleClosePayment} open={openPayment} cartProducts={cartProductsWithAmount} setCartProductsWithAmount={setCartProductsWithAmount} setCartProducts={setCartProducts} user={user} />

        <ModalItem
          handleOpen={handleOpen}
          handleClose={handleClose}
          open={open}
          item={selectedItem}
          setCartProducts={handleSelectProduct}
        />
      </div>
    </>
  );
}

export default App;

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 10,
    top: 3,
  },
}));
