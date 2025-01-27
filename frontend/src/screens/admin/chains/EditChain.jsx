import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Col, Row, Table, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../../components/Message";
import Loader from "../../../components/Loader";
import FormContainer from "../../../components/FormContainer";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import {
  useGetChainQuery,
  useUpdateChainMutation,
} from "../../../slices/chainsApiSlice";
import {
  useUploadImgMutation
} from "../../../slices/filesApiSlice";
import { useCreateStoreMutation, useDeleteStoreMutation } from "../../../slices/storesApiSlice";

import isValidChain from "../../../validations/ChainValidation";

const EditChain = () => {
  const { id: chainId } = useParams();
  const [name, setName] = useState("");
  const [stores, setStores] = useState([]);
  const [image, setImage] = useState('');


  const { data: chain, isLoading, error, refetch } = useGetChainQuery(chainId);

  const [updateChain, { isLoading: loadingUpdate }] = useUpdateChainMutation();

  const [uploadImg, { isLoading: loadingUpload }] = useUploadImgMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const valid = isValidChain({ chainId, name, image, stores });
    if (typeof valid === 'boolean') {
      try {
        await updateChain({
          chainId,
          name,
          image,
          stores,
        });
        toast.success("הרשת עודכנה בהצלחה");
        refetch();
        navigate("/admin/chains");

      } catch (err) {
        console.log(err?.data?.message || err.error);
      }

    } else {
      valid.map((err) => {
        toast.error(err);
      });
    }
  };

  useEffect(() => {
    if (chain) {
      setName(chain.name);
      setStores(chain.stores);
      setImage(chain.image);

    }
  }, [chain]);

  const [createStore, { isLoading: loadingCreate }] = useCreateStoreMutation();

  const createStoreHandler = async () => {
    if (window.confirm("האם אתה בטוח שאתה רוצה ליצור חנות חדשה?")) {
      try {
        const { data: newStore } = await createStore({ chainId, name }).unwrap();
        navigate(`/admin/store/${newStore._id}/edit`);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [deleteStore] = useDeleteStoreMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("האם אתה בטוח?")) {
      try {
        await deleteStore(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadImg(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to="/admin/chains" className="btn btn-light my-3">
        רשימת רשתות
      </Link>
      {loadingUpdate && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Row>
          <Col>
            <h1>עריכת רשת: {name}</h1>
            <FormContainer>
              <Form onSubmit={submitHandler}>

                <Form.Group controlId='image'>

                  {image && <Image src={`/api/${image}`} rounded className="w-50 m-3 d-grid gap-2" />}
                  <Form.Label>תמונה</Form.Label>

                  {/* <Form.Control
                type='text'
                placeholder='הכנס כתובת'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control> */}
                  <Form.Control
                    label='Choose File'
                    onChange={uploadFileHandler}
                    type='file'
                  ></Form.Control>
                  {loadingUpload && <Loader />}
                </Form.Group>


                <Form.Group className="my-2" controlId="name">
                  <Form.Label>שם</Form.Label>
                  <Form.Control
                    type="name"
                    placeholder="נא להכניס שם"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
                </Form.Group>



                <Form.Group className="my-2" controlId="prices">
                  <Form.Label>מחירים</Form.Label>
                  <Link to={`/admin/chain/${chainId}/prices`} className="mx-2">
                    רשימת מחירים
                  </Link>
                </Form.Group>

                <div className=" my-3 d-flex justify-content-around">
                  <Button type="submit" variant="primary">
                    עדכון
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={createStoreHandler}
                  >
                    הוספת סניף
                  </Button>
                </div>
              </Form>
            </FormContainer>
          </Col>

          {
            stores && stores.length > 0 &&
            <Col>
              <h3>סניפים</h3>
              <Table striped bordered hover responsive className="table-sm">
                <thead>
                  <tr>
                    <th>שם</th>
                    <th>כתובת</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store) => (
                    <tr key={store._id}>
                      <td>{store.name}</td>
                      <td>{store.address.street + ", " + store.address.city + ", " + store.address.postalCode}</td>

                      <td>
                        <>
                          <LinkContainer
                            to={`/admin/store/${store._id}/edit`}
                            style={{ marginRight: "10px" }}
                          >
                            <Button variant="light" className="btn-sm mx-2">
                              <FaEdit />
                            </Button>
                          </LinkContainer>
                          <Button
                            variant="danger"
                            className="btn-sm"
                            onClick={() => deleteHandler(store._id)}
                          >
                            <FaTrash style={{ color: "white" }} />
                          </Button>
                        </>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          }


        </Row>
      )}
    </>
  );
};

export default EditChain;
