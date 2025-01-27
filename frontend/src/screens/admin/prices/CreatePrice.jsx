import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/Loader";
import FormContainer from "../../../components/FormContainer";
import Message from "../../../components/Message";

import { useCreatePriceMutation } from "../../../slices/pricesApiSlice";

import { useGetStoresQuery } from "../../../slices/storesApiSlice";
import { useGetChainsQuery } from "../../../slices/chainsApiSlice";
import { useGetProductsQuery } from "../../../slices/productsApiSlice";
import { toast } from "react-toastify";

const CreatePrice = () => {
  const [productId, setProductId] = useState("");
  const [productQuery, setProductQuery] = useState("");

  const [storeId, setStoreId] = useState("");
  const [storeQuery, setStoreQuery] = useState("");

  const [chainId, setChainId] = useState("");
  const [chainQuery, setChainQuery] = useState("");

  const [number, setNumber] = useState(0);

  const navigate = useNavigate();

  const [createPrice, { isLoading, error }] = useCreatePriceMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (storeQuery === "") {
      setStoreId("");
    }
    if (chainQuery === "") {
      setChainId("");
    }
    try {
      const newPrice = await createPrice({
        productId,
        storeId,
        chainId,
        number,
      });
      navigate(`/admin/prices`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }


  };

  // Products
  const {
    data: products,
    refetch: refetchProducts,
    error: errorProducts,
  } = useGetProductsQuery({
    keyword: productQuery,
  });

  const selectProductHandler = (e) => {
    const obj = JSON.parse(e);
    setProductId(obj._id);
    setProductQuery(
      obj.category.name +
        " - " +
        obj.name +
        " - " +
        obj.description +
        " - " +
        obj.barcode
    );
  };
  // Stores
  const {
    data: stores,
    refetch: refetchStores,
    error: errorStores,
  } = useGetStoresQuery({
    keyword: storeQuery,
  });

  const selectStoreHandler = (e) => {
    const obj = JSON.parse(e);
    setStoreId(obj._id);
    setStoreQuery(
      `${obj.name} - ${obj.businessNumber} ${
        obj.chain ? " - " + obj.chain.name : ""
      }`
    );
  };

  // Chain
  const {
    data: chains,
    refetch: refetchChains,
    error: errorChains,
  } = useGetChainsQuery({
    keyword: chainQuery,
  });

  const selectChainHandler = (e) => {
    const obj = JSON.parse(e);
    setChainId(obj._id);
    setChainQuery(
      `${obj.name} - ${obj.businessNumber} ${
        obj.stores ? "- " + obj.stores.length + "סניפים" : ""
      }`
    );
  };

  return (
    <FormContainer>
      <h1>יצירת מחיר</h1>

      <Form onSubmit={submitHandler}>
        {/* Product */}
        <Form.Group className="my-2" controlId="productQuery">
          <Form.Label>מוצר</Form.Label>
          <Form.Control
            type="name"
            value={productQuery}
            onChange={(e) => setProductQuery(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-2">
          {products &&
          products.products.length > 0 &&
          productQuery.length > 2 ? (
            <Form.Select
              onChange={(e) => selectProductHandler(e.target.value)}
              className="my-2"
            >
              <option defaultValue={""}>בחר מוצר</option>
              {products.products.map((x) => (
                <option value={JSON.stringify(x)} key={x._id}>
                  {x.category.name +
                    " - " +
                    x.name +
                    " - " +
                    x.description +
                    " - " +
                    x.barcode}
                </option>
              ))}
            </Form.Select>
          ) : null}
        </Form.Group>
        {/* Stores */}
        {chainQuery === "" && (
          <>
            <Form.Group className="my-2" controlId="storeQuery">
              <Form.Label>חנות</Form.Label>
              <Form.Control
                type="name"
                value={storeQuery}
                onChange={(e) => setStoreQuery(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className="my-2">
              {stores && stores.stores.length > 0 && storeQuery.length > 1 ? (
                <Form.Select
                  onChange={(e) => selectStoreHandler(e.target.value)}
                  className="my-2"
                >
                  <option defaultValue={""}>בחר חנות</option>
                  {stores.stores.map((x) => (
                    <option value={JSON.stringify(x)} key={x._id}>
                      {`${x.name} - ${x.businessNumber} ${
                        x.chain ? " - " + x.chain.name : ""
                      }`}
                    </option>
                  ))}
                </Form.Select>
              ) : null}
            </Form.Group>
          </>
        )}
        {/* Chains */}
        {storeQuery === "" && (
          <>
            <Form.Group className="my-2" controlId="chainQuery">
              <Form.Label>רשת</Form.Label>
              <Form.Control
                type="name"
                value={chainQuery}
                onChange={(e) => setChainQuery(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group className="my-2">
              {chains && chains.chains.length > 0 && chainQuery.length > 1 ? (
                <Form.Select
                  onChange={(e) => selectChainHandler(e.target.value)}
                  className="my-2"
                >
                  <option defaultValue={""}>בחר רשת</option>
                  {chains.chains.map((x) => (
                    <option value={JSON.stringify(x)} key={x._id}>
                      {`${x.name} - ${x.businessNumber} ${
                        x.stores ? "- " + x.stores.length + "סניפים" : ""
                      }`}
                    </option>
                  ))}
                </Form.Select>
              ) : null}
            </Form.Group>
          </>
        )}

        <Form.Group className="my-2" controlId="number">
          <Form.Label>מחיר</Form.Label>
          <Form.Control
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button
          disabled={isLoading}
          type="submit"
          variant="primary"
          className="my-2"
        >
          צור מחיר
        </Button>

        {isLoading && <Loader />}
      </Form>
    </FormContainer>
  );
};

export default CreatePrice;
