import React, {useEffect} from "react";
import { LinkContainer } from "react-router-bootstrap";
import {  useNavigate } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../../components/Message";
import Loader from "../../../components/Loader";
import {
    useGetSubscriptionsQuery,
    useDeleteSubscriptionMutation,
    useCreateSubscriptionMutation
} from "../../../slices/subscriptionsApiSlice";
import { toast } from "react-toastify";

const SubscriptionsList = () => {
  const navigate = useNavigate();
  const { data, refetch, isLoading, error } = useGetSubscriptionsQuery({});


  useEffect(() => {
    refetch();
  }, [data]);

  const [deleteSubscription] = useDeleteSubscriptionMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("האם אתה בטוח?")) {
      try {
        await deleteSubscription(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createSubscription, { isLoading: loadingCreate }] =
  useCreateSubscriptionMutation();

  const createSubscriptionHandler = async ()=>{
    if (window.confirm('האם אתה בטוח שאתה רוצה ליצור מנוי חדש?')) {
      try {
        const {data:newSubscription} = await createSubscription()
        navigate(`/admin/subscription/${newSubscription._id}/edit`)
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  }

  return (
    <>
      <h1>מנויים</h1>
      <div className="d-flex justify-content-between">
            <Button type='button' variant='warning' className='my-3' onClick={createSubscriptionHandler}>
              צור מנוי חדש
            </Button>
          </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>שם</th>
                <th>מחיר</th>
                <th>הנחה</th>
                <th>תיאור</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((subscription) => (
                <tr key={subscription._id}>
                  <td>{subscription.name}</td>
                  <td>{subscription.price}</td>
                  <td>{subscription.discount}</td>
                  <td>{subscription.description}</td> 
                  <td>
                    <>
                      <LinkContainer
                        to={`/admin/subscription/${subscription._id}/edit`}
                        style={{ marginRight: "10px" }}
                      >
                        <Button variant="light" className="btn-sm mx-2">
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(subscription._id)}
                      >
                        <FaTrash style={{ color: "white" }} />
                      </Button>
                    </>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default SubscriptionsList;
