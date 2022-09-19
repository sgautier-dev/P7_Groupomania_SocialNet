import React from 'react';
import { useGetUsersQuery } from './usersApiSlice';
import User from './User';

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUsersQuery();

  let content;

  if (isLoading) content = <p>En cours de chargement...</p>;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  };

  if (isSuccess) {

    const { ids } = users;

    const tableContent = ids?.length
      ? ids.map(userId => <User key={userId} userId={userId} />)
      : null;

    content = (
      //flat (CSS) table in order to apply grid 
      <table className="table table--users">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th user__username">Nom utilisateur</th>
            <th scope="col" className="table__th user__roles">Role</th>
            <th scope="col" className="table__th user__edit">Editer</th>
          </tr>
        </thead>
        <tbody>
          {tableContent}
        </tbody>
      </table>
    )
  }

  return content
};

export default UsersList;