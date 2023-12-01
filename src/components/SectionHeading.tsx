import React from "react"
import './SectionHeading.css'

interface SectionHeadingProps {
    sectionName: string;
    description: string;
}

export default function SectionHeading({ sectionName, description }: SectionHeadingProps) {
    return (
        <div className="categories d-flex flex-column align-items-center position-relative mb-3">
            <h1 className="text-center mb-1">
                {sectionName}
            </h1>
            <span className="description text-center">
                {description}
            </span>
        </div>
    )
}