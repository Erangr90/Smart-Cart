import { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import { Row } from "react-bootstrap";
import {
    useGetCategoryQuery
} from "../../slices/categoriesApiSlice";
import { useParams } from 'react-router-dom';
import Product from '../../components/Product';

const CategoryScreen = () => {
    const [name, setName] = useState('');
    const [products, setProducts] = useState([]);
    const { id: categoryId } = useParams('');

    const {
        data: category,
        isLoading: categoryLoading,
        error: categoryError,
        refetch: categoryRefetch,
    } = useGetCategoryQuery(categoryId);

    useEffect(() => {
        if (category) {
            setName(category?.name);
            setProducts(category?.products);
        }
        categoryRefetch();
    }, [category]);


    console.log(category);

    return (
        <>
            {
                categoryLoading ? <Loader /> : (
                    products && products.length > 0 &&
                    <>
                        <h3>{name}</h3>
                        <div className="horizontal-container">
                            {
                                products.map((pro) => (
                                    <Product key={pro._id} product={pro} className="mx-2 my-3" />
                                ))
                            }

                        </div>

                    </>
                )
            }

        </>
    );
};

export default CategoryScreen;

