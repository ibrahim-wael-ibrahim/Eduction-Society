"use client";
import React, { useState } from "react";
 
const ReadMore = ({ children }) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };
    return (
        <p>
            {isReadMore ? text.slice(0, 100) : text}
            {text.length > 100 && (
                <span
                    onClick={toggleReadMore}
                    className=" text-green-400 cursor-pointer"
                >
                    {isReadMore ? "...read more" : " show less"}
                </span>
            )}
        </p>
    );
};

 
const Content = ({content}) => {
    return (
        <div className=" container w-10/12">
                <ReadMore>
                    {content}
                </ReadMore>
        </div>
    );
};
 
export default Content;