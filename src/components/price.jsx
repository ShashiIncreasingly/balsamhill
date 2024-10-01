import PropTypes from 'prop-types';
import { formatter } from '../lib/helpers';
function Price({ activePrice, specialPrice }) {
    if (specialPrice == null || specialPrice == 0) {
        return (
            <div className="inc_product_desc_price_block ">
                <div className="inc_product_active_regular_block single">{formatter.format(activePrice)}</div>
            </div>
        );
    }

    return (
        <div className="inc_product_desc_price_block ">
            <div className="inc_product_active_price_block strikethrough">{formatter.format(activePrice)}</div>
            <div className="inc_product_active_regular_block both">{formatter.format(specialPrice)}</div>
        </div>
    );
}

Price.propTypes = {
    activePrice: PropTypes.number.isRequired,
    specialPrice: PropTypes.number.isRequired,
};


export default Price