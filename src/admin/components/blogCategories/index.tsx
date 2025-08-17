import { Button, Container, Input } from '@medusajs/ui';
import { Table } from '@medusajs/ui';
import { useState, useEffect, useCallback } from 'react';
import { useAdminCustomPost, useAdminCustomQuery } from 'medusa-react';
import { objectToQueryString } from "../../utils/parse_query_params";
import CategoryRowItem from './CategoryRowItem';

const BlogCategories = () => {
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [newCategory, setNewCategory] = useState('');
  const [newVisible, setNewVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusDanger, setStatusDanger] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forceRefetch, setForceRefetch] = useState(0);

  const pageSize = 5;
  const pageCount = Math.ceil(totalCount / pageSize);

  const [queryParams, setQueryParams] = useState({
    take: pageSize,
    skip: 0
  });

  // Custom hooks for post and query
  const customPost = useAdminCustomPost('/blog/category', []);
  const { data, isLoading: isFetching } = useAdminCustomQuery(
    "/blog/category?" + objectToQueryString({
      select: ["id", "name"],
      take: queryParams.take,
      skip: queryParams.skip,
    }),
    ["categories", JSON.stringify(queryParams), forceRefetch]
  );

  // Trigger refetch for all pages when a new category is added
  const triggerGlobalRefetch = useCallback(() => {
    setForceRefetch(prev => prev + 1);
  }, []);

  // Effect to update categories when data changes
  useEffect(() => {
    if (data && !data?.error) {
      setCategories(data.categories);
      setTotalCount(data.count);
    }
  }, [data]);

  // Auto-clear status message
  useEffect(() => {
    if (statusMessage.length > 0) {
      const timeout = setTimeout(() => {
        setStatusMessage('');
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [statusMessage]);

  const handleError = (msg: string) => {
    setStatusMessage(msg);
    setStatusDanger(true);
  };

  const handleSuccess = (msg: string) => {
    setStatusMessage(msg);
    setStatusDanger(false);
  };

  const handleNewCategory = async () => {
    if (!newCategory.trim()) {
      handleError('Category name cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      await customPost.mutateAsync(
        { name: newCategory },
        {
          onSuccess: () => {
            handleSuccess('Category saved successfully');
            setNewCategory('');
            setNewVisible(false);

            // Trigger global refetch to update all pages
            triggerGlobalRefetch();
          },
          onError: () => {
            handleError('Failed to save category');
          }
        }
      );
    } catch (error) {
      handleError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const nextPage = () => {
    if (currentPage < pageCount - 1) {
      const newSkip = (currentPage + 1) * pageSize;
      setQueryParams(prev => ({
        ...prev,
        skip: newSkip
      }));
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 0) {
      const newSkip = (currentPage - 1) * pageSize;
      setQueryParams(prev => ({
        ...prev,
        skip: newSkip
      }));
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Container className="flex flex-col items-center px-8 py-6 gap-6">
      <div className="w-full flex justify-between text-lg font-medium text-[#111827]">
        <div>Categories</div>
        <Button
          variant="secondary"
          onClick={() => setNewVisible(!newVisible)}
          disabled={isLoading}
        >
          New Category
        </Button>
      </div>
      {newVisible && (
        <div className="w-full flex justify-between">
          <div className="w-80 flex-shrink-0">
            <Input
              id="category"
              name="category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              type="text"
              placeholder="Category name"
              className='w-full'
              disabled={isLoading}
            />
          </div>
          <Button
            variant="primary"
            className="h-fit"
            onClick={handleNewCategory}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      )}
      <p
        className={`${
          statusDanger ? 'text-red-400' : 'text-gray-400'
        } text-sm w-full text-start`}
      >
        {statusMessage}
      </p>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell className="w-80">#</Table.HeaderCell>
            <Table.HeaderCell>Category</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {categories.map((category, index) => (
            <CategoryRowItem
              key={category.id}
              category={category}
              triggerGlobalRefetch={triggerGlobalRefetch}
              handleSuccess={handleSuccess}
              handleError={handleError}
            />
          ))}
        </Table.Body>
      </Table>
      <Table.Pagination
        count={totalCount}
        pageSize={pageSize}
        pageIndex={currentPage}
        pageCount={pageCount}
        canPreviousPage={currentPage > 0}
        canNextPage={currentPage < pageCount - 1}
        previousPage={previousPage}
        nextPage={nextPage}
      />
    </Container>
  );
};

export default BlogCategories;