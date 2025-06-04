import TableComp from '../components/TableComp';

export const Organization = () => {
    return (
        <>
            <title>Scani5 - Organization</title>
            <h5 className="heading m-b-15">Organizations</h5>
            <TableComp from="organizations" />
        </>
    );
};
