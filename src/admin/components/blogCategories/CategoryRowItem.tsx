import { Button } from '@medusajs/ui';
import { Table } from '@medusajs/ui';
import { Trash } from '@medusajs/icons';
import { useAdminCustomDelete } from 'medusa-react';

const CategoryRowItem = ({
  category,
  handleSuccess,
  triggerGlobalRefetch,
  handleError,
}) => {
  const customDelete = useAdminCustomDelete(
    `/blog/category/${category.id}`,
    []
  );

  const handleDeleteCategory = () => {
    customDelete.mutate(void 0, {
      onSuccess: () => {
        triggerGlobalRefetch();
        handleSuccess('Deleted');
      },
      onError: () => {
        handleError('Delete error, try again');
      },
    });
  };

  return (
    <Table.Row key={category.id}>
      <Table.Cell className="w-80">{category.id}</Table.Cell>
      <Table.Cell>{category.name}</Table.Cell>
      <Table.Cell className="flex items-center justify-end">
        <Button
          variant="danger"
          className="h-fit"
          onClick={() => handleDeleteCategory()}
        >
          <Trash />
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};
export default CategoryRowItem;
