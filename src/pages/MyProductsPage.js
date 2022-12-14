import { useQuery } from '@tanstack/react-query';
import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import DashLoading from '../components/DashLoading';
import Heading from '../components/Heading';
import ModalCom from '../components/ModalCom';
import { AuthContext } from '../contexts/AuthContextComp';

const MyProductsPage = () => {
  const { userProfile } = useContext(AuthContext);
  const location = useLocation();

  const [itemDelete, setItemDelete] = useState(null);

  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ['products', location],
    queryFn: async () => {
      const res = await fetch(`https://antique-watches.vercel.app/products/email/${userProfile._id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('antique-token')}`
        }
      });
      const data = await res.json();

      return data;
    }
  });


  const handleDelete = (id) => {
    fetch(`https://antique-watches.vercel.app/products?delete=${id}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${localStorage.getItem('antique-token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.acknowledged) {
          toast.success('Producut delete successful..');
          refetch();
        }
        else {
          toast.error('You are not authorized user..');
        }
      })
  }

  const handleAdvertise = (id, isAdvertise) => {
    const data = isAdvertise === 'true' ? 'false' : 'true';
    const update = { advertise: data }

    fetch(`https://antique-watches.vercel.app/products?update=${id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('antique-token')}`,
      },
      body: JSON.stringify(update)
    })
      .then(res => res.json())
      .then(data => {
        if (data.acknowledged) {
          toast.success(`Product advertise ${isAdvertise === 'true' ? 'disabled' : 'enable'} successful...`);
          refetch();
        }
        else {
          toast.error('You are not authorized user..');
          refetch();
        }
      })
  }


  if (isLoading) {
    return (
      <DashLoading></DashLoading>
    );
  }

  return (
    <div>
      <Heading
        title='My Products'
      ></Heading>
      <div className="overflow-x-auto">
        <table className="table border w-full">
          <thead>
            <tr>
              <th className='rounded-none'>No.</th>
              <th>Image</th>
              <th>Name</th>
              <th>Status</th>
              <th className='text-right'>Advertise</th>
              <th className='rounded-none text-right'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              products?.map((product, index) => {
                return (
                  <tr key={product._id}>
                    <th>{index + 1}</th>
                    <td><img className='w-14 border' src={product.imgURL} alt="" /></td>
                    <td className='font-semibold'>{product.name}</td>
                    <td><span
                      className={`text-white px-3 py-1 text-xs uppercase rounded-full ${product.itemStatus === 'unsold' ? 'bg-red-600' : 'bg-green-600'}`}
                    >{product.itemStatus}</span></td>
                    <td className='text-right'>
                      <input
                        type="checkbox"
                        className="toggle toggle-sm border-gray-200"
                        defaultChecked={product.advertise === 'true' ? 'checked' : undefined}
                        onChange={() => handleAdvertise(product._id, product.advertise)}
                        disabled={product.itemStatus === 'unsold' ? false : true}
                      />
                    </td>
                    <td className='text-right'>
                      {
                        product.itemStatus === 'unsold' &&
                        <>
                          <Link to={`/dashboard/my-products/${product._id}`} className='btn btn-ghost btn-sm px-2'>
                            <FaEdit></FaEdit>
                          </Link>
                          <label
                            htmlFor="delete-modal"
                            className='btn btn-ghost btn-sm px-2'
                            onClick={() => setItemDelete(product)}
                          >
                            <FaTrashAlt></FaTrashAlt>
                          </label>
                        </>
                      }
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
      {
        (itemDelete?._id) &&
        <ModalCom
          title="Would you like to delete the product?"
          text="You won't be able to undo it again..."
          itemDelete={itemDelete}
          setItemDelete={setItemDelete}
          handleDelete={handleDelete}
        ></ModalCom>
      }

    </div>
  );
};

export default MyProductsPage;