import React from "react";

import './ItemCard.css'

export default function ItemCard({ product, style }: any) {
    const opacity = product?.quantity === 0 || !product?.available ? '0.4' : '1'
    const cursor = product?.quantity === 0 || !product?.available ? 'auto' : 'pointer'
    return (
        <>
            <div className="item-card w-100 d-flex position-relative flex-column justify-content-center align-items-center" style={{ flex: 1, cursor: cursor, opacity: opacity }}>
                <img src={product?.image} alt='product' style={style} />
                <div className="w-100 d-flex p-4 align-items-center flex-column justify-content-center">
                    <h3>{product?.name}</h3>
                </div>
                <div className="d-flex align-items-center flex-row justify-content-center">
                    <span>$ {product?.price}</span>
                </div>
            </div>
        </>
    )
}