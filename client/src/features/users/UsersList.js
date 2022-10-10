import React from 'react';
import { useGetUsersQuery } from './usersApiSlice';
import User from './User';
import PuffLoader from 'react-spinners/PuffLoader';

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUsersQuery('usersList', {
    pollingInterval: 60000, //re-fetching data every 60s
    refetchOnFocus: true, //re-fetching data if user put focus on an other window and comes back
    refetchOnMountOrArgChange: true //re-fetching data on the component mounting or changing
  });

  let content;

  if (isLoading) content = <PuffLoader color={"#FFF"} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  };

  if (isSuccess) {

    const { ids } = users;

    const tableContent = ids?.length && ids.map(userId => <User key={userId} userId={userId} />);

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