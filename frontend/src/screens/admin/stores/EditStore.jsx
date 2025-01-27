import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Image } from "react-bootstrap";
import Message from "../../../components/Message";
import Loader from "../../../components/Loader";
import FormContainer from "../../../components/FormContainer";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import {
  useGetStoreQuery,
  useUpdateStoreMutation,
} from "../../../slices/storesApiSlice";
import {
  useUploadImgMutation
} from "../../../slices/filesApiSlice";
import isValidStore from "../../../validations/StoreValidation";

const EditStore = () => {

  const { id: storeId } = useParams();
  const [name, setName] = useState("");
  const [address, setAddress] = useState({});
  const [chain, setChain] = useState({});
  const [image, setImage] = useState("");


  const { data: store, isLoading, error, refetch } = useGetStoreQuery(storeId);

  const [updateStore, { isLoading: loadingUpdate }] = useUpdateStoreMutation();

  const [uploadImg, { isLoading: loadingUpload }] = useUploadImgMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (image != "") {
        const valid = isValidStore({ name, address, image, chain, });
        if (typeof valid == 'boolean') {
          await updateStore({
            storeId,
            name,
            address,
            image,
            chain,
          }).unwrap();
          toast.success("החנות עודכנה בהצלחה");
          refetch();
          navigate("/admin/stores");
        } else {
          valid.map((err) => {
            toast.error(err);
          });
        }


      } else {
        const valid = isValidStore({ storeId, name, address, image, chain });
        if (typeof valid == 'boolean') {
          await updateStore({
            storeId,
            name,
            address,
            chain,
            image
          }).unwrap();
          toast.success("החנות עודכנה בהצלחה");
          refetch();
          navigate("/admin/stores");
        } else {
          valid.map((err) => {
            toast.error(err);
          });
        }
      }

    } catch (err) {
      console.log(err);
    }
  };

  const addressHandler = (e) => {
    let temp = { ...address };
    temp[e.target.id] = e.target.value;
    setAddress({ ...temp });
  };

  useEffect(() => {
    if (store) {
      setName(store.name);
      if ((store.chain && store.chain.image) || store.image) {
        setImage(store.chain.image || store.image);
      }
      setAddress(store.address);
      setChain(store.chain);
    }
  }, [store]);

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
      <Link to="/admin/stores" className="btn btn-light my-3">
        רשימת חנויות
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          {chain ? <h1>עריכת סניף לרשת: {chain.name}</h1> : <h1>עריכת חנות - {name}</h1>}
          <FormContainer>
            <Form onSubmit={submitHandler}>
              {image && <Image src={`/api/${image}`} rounded className="w-25 m-3 d-grid gap-2" />}
              {
                !store.chain && image ? (
                  <>
                    <Form.Group controlId='image'>

                      <Image src={`/api/${image}`} rounded className="w-25 m-3 d-grid gap-2" />
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
                  </>
                ) : null
              }


              <Form.Group className="my-2" controlId="name">
                <Form.Label>שם</Form.Label>
                <Form.Control
                  type="name"
                  placeholder="נא להכניס שם"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group className="my-2" controlId="city">
                <Form.Label>עיר</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="נא להכניס עיר"
                  value={address ? address.city : ""}
                  onChange={(e) => addressHandler(e)}
                ></Form.Control>
              </Form.Group>
              <Form.Group className="my-2" controlId="street">
                <Form.Label>כתובת</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="נא להכניס כתובת"
                  value={address ? address.street : ""}
                  onChange={(e) => addressHandler(e)}
                ></Form.Control>
              </Form.Group>
              <Form.Group className="my-2" controlId="postalCode">
                <Form.Label>מיקוד</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="נא להכניס מיקוד"
                  value={address ? address.postalCode : ""}
                  onChange={(e) => addressHandler(e)}
                ></Form.Control>
              </Form.Group>

              {chain && (
                <>
                  <Form.Group className="my-2" controlId="chain">
                    <Form.Label>רשת</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="נא להכניס רשת"
                      value={chain ? chain.name : ""}
                      readOnly={true}
                    ></Form.Control>
                  </Form.Group>
                </>
              )}
              <Form.Group className="my-2" controlId="prices">
                <Form.Label>מחירים</Form.Label>
                <Link to={`/admin/store/${storeId}/prices`} className="mx-2">
                  רשימת מחירים
                </Link>
              </Form.Group>

              <Button type="submit" variant="primary">
                עדכון
              </Button>
            </Form>
          </FormContainer>
        </>
      )}
    </>
  );
};

export default EditStore;
