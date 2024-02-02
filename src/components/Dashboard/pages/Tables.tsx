import Breadcrumb from '../components/Breadcrumb';
import Pagination from '../components/Pagination';
import TableProducts from '../components/TableProducts';

const Tables = () => {
  return (
    <>
      <Breadcrumb pageName="Products list" />

      <div className="flex flex-col gap-10">
        <Pagination/>
        <TableProducts/>
      </div>
    </>
  );
};

export default Tables;
