import { useQuery } from '@tanstack/react-query';
import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import DashLoading from '../components/DashLoading';
import Heading from '../components/Heading';
import ModalCom from '../components/ModalCom';
import { AuthContext } from '../contexts/AuthContextComp';

const MyOrderPage = () => {
  const location = useLocation();
  const { userProfile } = useContext(AuthContext);


  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['orders', location, userProfile],
    queryFn: async () => {
      if (userProfile?._id) {
        const res = await fetch(`http://localhost:5000/orders/userid/${userProfile?._id}`);
        const data = await res.json();

        return data;
      }
      else {
        return [];
      }
    }
  });

  const [itemDelete, setItemDelete] = useState(null);


  const handleDelete = (id) => {
    fetch(`http://localhost:5000/orders?delete=${id}`, {
      method: 'DELETE',
      headers: {}
    })
      .then(res => res.json())
      .then(data => {
        toast.success('Complaint delete successful...');
        refetch();
      })
  }

  console.log(orders);


  if (isLoading) {
    return (
      <DashLoading></DashLoading>
    );
  }


  return (
    <div>
      <Heading
        title='All Orders'
      ></Heading>
      {
        orders?.length > 0 ?
          <div className="overflow-x-auto">
            <table className="table border w-full">
              <thead>
                <tr>
                  <th className='rounded-none'>No.</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th className='text-right'>Payment</th>
                  <th className='rounded-none text-right'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  orders?.map((order, index) => {
                    return (
                      <tr key={order._id}>
                        <th>{index + 1}</th>
                        <td>{order.productName}</td>
                        <td>${order.productPrice}</td>
                        <td>unsold -- etst</td>
                        <td className='text-right'>
                          <button className='btn btn-primary btn-sm'>Pay Now</button>
                        </td>
                        <td className='text-right'>
                          <button className='btn btn-ghost btn-sm px-2'><FaEdit></FaEdit></button>
                          <label
                            htmlFor="delete-modal"
                            className='btn btn-ghost btn-sm px-2'
                            onClick={() => setItemDelete(order)}
                          >
                            <FaTrashAlt></FaTrashAlt>
                          </label>
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>
          :
          <h4>No orders data found..</h4>
      }

      {
        (itemDelete?._id) &&
        <ModalCom
          title="Would you like to delete the order?"
          text="You won't be able to undo it again..."
          itemDelete={itemDelete}
          setItemDelete={setItemDelete}
          handleDelete={handleDelete}
        ></ModalCom>
      }
    </div>
  );
};

export default MyOrderPage;