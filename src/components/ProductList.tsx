import React from "react";

import './Category.css'
import ItemCard from "./ItemCard";
import { Divider } from "@mui/joy";

export default function ProductList({ productsList, handleOpen, setSelectedItem }: any) {
    const { filtered, category } = productsList


    return (
        <div className="container pt-5">
            <div className="d-flex justify-content-start align-items-center">
                <h1>{category?.name}</h1>
            </div>
            <Divider />
            <div
                className="row row-cols-4 mt-4"
                style={{ flex: 1, }}
            >

                {filtered.map((product: any, index: number) =>
                    <div className="col" onClick={() => {
                        setSelectedItem(product)

                        handleOpen()
                    }} key={index}>
                        <ItemCard product={product} style={{
                            width: '250px',
                            aspectRatio: '1/1',
                            objectFit: 'cover'
                        }} />
                    </div>)}

            </div>
        </div>
    )

}