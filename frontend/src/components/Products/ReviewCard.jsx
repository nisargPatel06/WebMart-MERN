import React from "react";
import { LuUserCircle2 } from "react-icons/lu";
import ReactStars from "react-rating-stars-component";

const ReviewCard = ({ review }) => {
  return (
    <div className="flex gap-5">
      <div className="max-w-[22vw] h-fit p-3 border-[#0000001a] border-[1px] flex flex-col gap-1 rounded-lg shadow-md">
        <div className="flex gap-2">
          <LuUserCircle2 className="text-xl text-[#6b6b6b]" />
          {review.name}
        </div>

        <ReactStars
          edit={false}
          color="#c5c5c5"
          activeColor="#ff6b35"
          size={25} // window.innerwidth < 600 ? 20 : 25
          value={review.rating}
          isHalf={true}
        />

        <p>{review.comment}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
