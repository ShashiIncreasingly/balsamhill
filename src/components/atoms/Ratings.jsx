import { Rating } from 'react-simple-star-rating';
import './ratings.scss';

function Ratings({ rating, ratingCount, type }) {

    if (rating === 0 || rating == null) {
        return (<div className={`inc_product_desc_ratings_block ${type == 'modal' ? 'inc_modal' : type}`}>
            <span style={{ height: '25px' }}> </span>

        </div>)
    }
    return (
        <div className={`inc_product_desc_ratings_block ${type == 'modal' ? 'inc_modal' : type}`}>
            <Rating
                initialValue={rating}
                allowHover={false}
                readonly
                allowFraction
                fillColor="#363636"
                size={15}
            />
            <div className="inc_product_ratings_count">{ratingCount}</div>
        </div>
    );
}

export default Ratings;
