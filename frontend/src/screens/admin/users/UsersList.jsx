// React packages
import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { useParams } from "react-router-dom";
// BootStrap
import { Table, Button } from "react-bootstrap";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
// Components
import Message from "../../../components/Message";
import Loader from "../../../components/Loader";
import Paginate from "../../../components/Paginate";
import SearchBox from "../../../components/SearchBox";
// Api Slices
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../../slices/usersApiSlice";
// Toastify
import { toast } from "react-toastify";

// The component
const UsersList = () => {
  // State variables
  const { pageNumber, keyword } = useParams();
  // Use Api Slices
  // Get users slice
  const { data, refetch, isLoading, error } = useGetUsersQuery({
    keyword,
    pageNumber,
  });

  useEffect(() => {
    refetch();
  }, [data]);

  const [deleteUser] = useDeleteUserMutation();
  // Delete handler
  const deleteHandler = async (id) => {
    if (window.confirm("האם את.ה בטוח.ה?")) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <h1>משתמשים</h1>
      {/* Server data fetch */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          {/* Search Box */}
          <div className="w-50">
            <SearchBox route={"/admin/users"} />
          </div>
          {/* Users table */}
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>שם מלא</th>
                <th>אימייל</th>
                <th>גישת ניהול</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user._id}>
                  <td>{user.firstName + " " + user.lastName}</td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    <>
                      <LinkContainer
                        to={`/admin/user/${user._id}/edit`}
                        style={{ marginRight: "10px" }}
                      >
                        <Button variant="light" className="btn-sm mx-2">
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(user._id)}
                      >
                        <FaTrash style={{ color: "white" }} />
                      </Button>
                    </>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate
            page={data.page}
            pages={data.pages}
            isAdmin={true}
            route={"users"}
          />
        </>
      )}
    </>
  );
};

export default UsersList;
