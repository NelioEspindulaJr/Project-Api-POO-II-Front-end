import React from "react";

import './CategoryCard.css'

export default function CategoryCard({ category }: any) {
    return (
        <div className="category-card d-flex position-relative align-items-center flex-column">
            <img src={category.image} alt="category" onClick={() => {
                window.location.assign(`/category/${category.id}`)
            }} />
            <span>{category.name}</span>
        </div>
    )
}