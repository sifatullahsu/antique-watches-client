import { useQuery } from '@tanstack/react-query';
import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import DashLoading from '../components/DashLoading';
import Heading from '../components/Heading';
import ModalCom from '../components/ModalCom';
import { AuthContext } from '../contexts/AuthContextComp';

const CategoriesPage = () => {

  const location = useLocation();
  const { user } = useContext(AuthContext);

  const { data: categories = [], isLoading, refetch } = useQuery({
    queryKey: ['categories', location],
    queryFn: async () => {
      const res = await fetch(`https://antique-watches.vercel.app/categories`);
      const data = await res.json();

      return data;
    }
  });

  const [itemDelete, setItemDelete] = useState(null);

  const handleDelete = (id) => {
    fetch(`https://antique-watches.vercel.app/categories?delete=${id}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${localStorage.getItem('antique-token')}`,
        email: user.email
      }
    })
      .then(res => res.json())
      .then(data => {
        toast.success('Category delete successful...');
        refetch();
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
        title='All Categories'
      ></Heading>
      <div className="overflow-x-auto">
        <table className="table border w-full">
          <thead>
            <tr>
              <th className='rounded-none'>No.</th>
              <th>Image</th>
              <th>Name</th>
              <th className='rounded-none text-right'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              categories?.map((category, index) => {
                return (
                  <tr key={category._id}>
                    <th>{index + 1}</th>
                    <td><img className='w-14 border' src={category.catImage} alt="" /></td>
                    <td className='font-semibold'>{category.catName}</td>
                    <td className='text-right'>
                      <Link to={`/dashboard/categories/${category._id}`} className='btn btn-ghost btn-sm px-2'>
                        <FaEdit></FaEdit>
                      </Link>
                      <label
                        htmlFor="delete-modal"
                        className='btn btn-ghost btn-sm px-2'
                        onClick={() => setItemDelete(category)}
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
      {
        (itemDelete?._id) &&
        <ModalCom
          title="Would you like to delete the category?"
          text="You won't be able to undo it again..."
          itemDelete={itemDelete}
          setItemDelete={setItemDelete}
          handleDelete={handleDelete}
        ></ModalCom>
      }

    </div>
  );
};

export default CategoriesPage;