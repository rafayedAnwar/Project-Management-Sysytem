import React from 'react'
import '../styles/Reviews.css'
const StarRating = ({ rating, setRating, maxStars = 5 }) => {
  const handleStarClick = (selectedRating) => {
    // If user clicks the same star twice, clear the rating
    if (rating === selectedRating) {
      setRating(0)
    } else {
      setRating(selectedRating)
    }
  }
  return (
    <div className="star-rating">
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1
        return (
          <span
            key={index}
            className={`star ${starValue <= rating ? 'filled' : ''}`}
            onClick={() => handleStarClick(starValue)}
          >
            ★
          </span>
        )
      })}
    </div>
  )
}
export default StarRating