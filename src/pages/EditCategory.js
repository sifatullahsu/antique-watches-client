import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import DashLoading from '../components/DashLoading';
import Heading from '../components/Heading';
import { AuthContext } from '../contexts/AuthContextComp';

const EditCategory = () => {

  const { user, testLoading, setTestLoading } = useContext(AuthContext);

  const navigate = useNavigate();
  const imageHostKey = process.env.REACT_APP_IMGBB_API;

  const location = useLocation();
  const id = location.pathname.split('/dashboard/categories/')[1];

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories', location],
    queryFn: async () => {
      if (user?.uid) {
        const res = await fetch(`https://antique-watches.vercel.app/categories/id/${id}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('antique-token')}`,
            email: user.email
          }
        });
        const data = await res.json();

        return data;
      }
      return []
    }
  });


  const updateCategoryData = (data, form) => {
    fetch(`https://antique-watches.vercel.app/categories?update=${id}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('antique-token')}`,
        email: user.email
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        toast.success('Category update successful..');
        form.reset();
        navigate('/dashboard/categories');
        setTestLoading(false)
      })
      .catch(err => {
        toast.error('Somthing is wrong..');
        setTestLoading(false);
      })
  }

  const handleEditCategory = (event) => {
    event.preventDefault();

    setTestLoading(true)

    const form = event.target;
    const catName = form.catName.value;
    const catImage = form.catImage.files[0];

    if (catImage) {
      const imageData = new FormData();
      imageData.append('image', catImage);

      fetch(`https://api.imgbb.com/1/upload?key=${imageHostKey}`, {
        method: 'POST',
        body: imageData
      })
        .then(res => res.json())
        .then(data => {
          const imgURL = data.data.url;

          const finalData = { catName, catImage: imgURL }
          updateCategoryData(finalData, form);
        })
        .catch(err => console.log(err))
    }
    else {
      updateCategoryData({ catName }, form);
    }
  }

  if (isLoading || testLoading) {
    return (
      <DashLoading></DashLoading>
    );
  }

  return (
    <div>
      <Heading
        title='Edit Category'
      ></Heading>
      <form onSubmit={handleEditCategory}>

        <div className="form-control">
          <label className="label"><span className="label-text">Category Name</span></label>
          <input type='text' defaultValue={categories.catName} name='catName' required />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Category Image</span>
          </label>
          <input type="file" name='catImage' />
          <span className="label-text text-gray-400">Note: If you don't want to change the category image. leave this field as it is. (EMPTY)</span>
        </div>

        <button type="submit" className='btn btn-primary w-full mt-5'>Add Category</button>

      </form>
    </div>
  );
};

export default EditCategory;