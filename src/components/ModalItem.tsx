import React from "react";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import { ModalDialog } from "@mui/joy";
import SectionHeading from "./SectionHeading";
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    height: '90vh',
    borderRadius: '10px',
    p: 3,
    boxShadow: 'lg',
};



export default function ModalItem({
    handleOpen,
    handleClose,
    open,
    item,
    setCartProducts,
}: any) {
    return (
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={open}
            onClose={handleClose}
            sx={style}
        >
            <ModalDialog variant="soft" layout="fullscreen">
                <ModalClose variant="plain" sx={{ m: 1 }} />
                <div className="row">
                    <div className="col">
                        <div className="item-card w-100 d-flex position-relative flex-column justify-content-center align-items-center" >
                            <img src={item?.image} alt='product' style={{ flex: 1, width: '100%', objectFit: 'scale-down', maxHeight: '546.7px', aspectRatio: '1/1', mixBlendMode: 'multiply', filter: 'contrast(1)' }} />
                        </div>
                    </div>

                    <div className="col p-5">
                        <div className="d-flex justify-content-between flex-column h-100">
                            <SectionHeading sectionName={item.name} description="" />
                            <span className="description text-center">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tempor maximus neque, auctor feugiat magna pellentesque non. Sed ultrices dignissim sem, vitae accumsan dui. Quisque at felis ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed nec nisl interdum, pharetra elit vel, ultrices ante. Praesent nec feugiat nulla. Nam elementum sodales mattis.
                            </span>
                            <div className='button-group d-flex align-items-center flex-column w-100'>
                                <h1>$ {item.price}</h1>
                                <button className="align-items-center justify-content-center" style={{ width: '70%' }} onClick={() => {
                                    setCartProducts(item)
                                }}><AddShoppingCartOutlinedIcon />Add 1 to cart</button>
                            </div>
                        </div>

                    </div>

                </div>

            </ModalDialog>
        </Modal>

    );
}

