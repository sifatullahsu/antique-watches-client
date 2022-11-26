import { formatDistanceToNowStrict } from 'date-fns';
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { FiMapPin } from 'react-icons/fi';
import { TfiHeadphoneAlt } from 'react-icons/tfi';
import { BiCategory } from 'react-icons/bi';
import { BsShieldFillExclamation } from 'react-icons/bs';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const ProductGrid = ({ product, orderedIds, setBuyNow, setComplaint }) => {

  const {
    _id, name, price, buyingPrice, purchasedYear, condition, categoryInfo, number,
    location, itemStatus, advertise, imgURL, authorInfo, publishedDate
  } = product;

  const isOrdered = orderedIds.filter(ids => ids.productID === _id).length > 0 ? true : false;

  return (
    <div className='product border p-5 relative'>
      <div className='absolute top-0 right-0 flex'>
        <div>

          <div className="tooltip tooltip-bottom text-xs" data-tip="Report to admin">
            <label
              htmlFor="complaint-modal"
              onClick={() => setComplaint(product)}
            ><BsShieldFillExclamation className='m-5 text-lg text-gray-400'></BsShieldFillExclamation></label>
          </div>
        </div>
        <img src={imgURL} className='w-32 border-l border-b' alt="" />
      </div>

      <div className='text-xs text-gray-400'>
        <span>{formatDistanceToNowStrict(new Date(publishedDate))} ago</span>
        {
          advertise === 'true' &&
          <div className="badge badge-accent ml-5 text-xs">Sponsored</div>
        }
      </div>
      <h4>{name}</h4>
      <div className='flex flex-nowrap gap-5 text-sm text-secondary font-medium mt-3'>
        <div>
          <div>Sell Price</div>
          <div>${price}</div>
        </div>
        <div>
          <div>Buying Price</div>
          <div>${buyingPrice}</div>
        </div>
        <div>
          <div>Purchased</div>
          <div>on {purchasedYear}</div>
        </div>
      </div>

      <div className='text-sm text-secondary font-medium mt-5 '>
        <span className='mr-5'>
          <BiCategory className='inline -mt-1 mr-2'></BiCategory>
          <Link
            to={`/categories/${categoryInfo._id}`}
            className="btn btn-link p-0 min-h-0 h-0 lowercase"
          >{categoryInfo.catName}</Link>
        </span>
        <span>
          <HiOutlineShoppingBag className='inline -mt-1 mr-2'></HiOutlineShoppingBag>{condition} condition
        </span>
      </div>
      <div className='text-sm text-secondary font-medium mt-5 '>
        <span className='mr-5'><TfiHeadphoneAlt className='inline -mt-1 mr-2'></TfiHeadphoneAlt>{number}</span>
        <span><FiMapPin className='inline -mt-1 mr-2'></FiMapPin>{location}</span>
      </div>

      <div className='flex flex-nowrap items-end justify-between mt-5'>
        <div className='author flex flex-nowrap'>
          <div className='basis-auto'>
            <img src={authorInfo.image} className='w-12 h-12' alt="" />
          </div>
          <div className='basis-auto pl-3'>
            <div>
              <h5 className='uppercase font-semibold text-primary-200 inline'>{authorInfo.name}</h5>
              {
                authorInfo.verified === 'true' &&
                <FaCheckCircle className='text-blue-500 inline ml-2 -mt-1'></FaCheckCircle>
              }
            </div>
            <span className='uppercase text-xs text-gray-400'>{authorInfo.role === 'seller' ? 'SELLER' : null}</span>
          </div>
        </div>
        {
          itemStatus === 'unsold' && !isOrdered &&
          <label
            htmlFor="book-now-modal"
            className='btn btn-primary btn-sm text-xs'
            onClick={() => setBuyNow(product)}
          >Book now</label>
        }
        {
          itemStatus === 'unsold' && isOrdered &&
          <div className='text-right'>
            <div className="badge badge-info text-xs">booked</div>
            <div className='text-xs text-secondary font-medium'>Payment Incomplete</div>
            <button className="btn btn-link p-0 h-0 min-h-0">pay</button>
          </div>
        }
        {
          itemStatus === 'sold' &&
          <div className="badge badge-success ml-5 text-xs">Item Sold</div>
        }
      </div>
    </div >
  );
};

export default ProductGrid;