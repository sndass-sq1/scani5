import TableComp from '../components/TableComp';

export const UserActivityLog = () => {
    return (
        <>
            <div className="table-header-date-range">
                <title>Scani5 - User Activity Log</title>
                <h5 className="heading m-b-15">User Activity Log</h5>
                <TableComp from="activitylog" />
            </div>
        </>
    );
};
