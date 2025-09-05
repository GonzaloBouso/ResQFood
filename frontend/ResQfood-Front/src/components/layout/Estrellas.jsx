import React, { useState } from 'react';
import { Star } from 'lucide-react';

const Estrellas = ({ onRatingChange }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    const handleClick = (ratingValue) => {
        setRating(ratingValue);
        onRatingChange(ratingValue);
    };

    return (
        <div className="flex justify-center items-center space-x-1">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <button
                        type="button"
                        key={ratingValue}
                        className={`cursor-pointer transition-colors duration-200 ${
                            ratingValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        onClick={() => handleClick(ratingValue)}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}
                    >
                        <Star size={32} fill="currentColor" />
                    </button>
                );
            })}
        </div>
    );
};

export default Estrellas;