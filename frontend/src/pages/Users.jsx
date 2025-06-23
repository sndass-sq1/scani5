import TableComp from '../components/TableComp';

export const Users = () => {
    return (
        <>
            <title>Scani5 - Users</title>
            <h5 className="heading m-b-15">Users</h5>
            <TableComp from="users" />
        </>
    );
};
