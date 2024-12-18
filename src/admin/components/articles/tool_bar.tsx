import { Link } from 'react-router-dom';
import { Button, Input, Container, Select } from '@medusajs/ui';
import {
  ArchiveBox,
  MagnifyingGlass,
  TrianglesMini,
  PencilSquare,
} from '@medusajs/icons';
import { useState, useEffect, useRef } from 'react';

const ToolBar = (props) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [contentMenu, setContentMenu] = useState<'search' | 'sort' | null>(
    null
  );

  const sortTypes = useRef([
    {
      label: 'Ascending',
      value: 'ASC',
    },
    {
      label: 'Descending',
      value: 'DESC',
    },
  ]);
  const columns = useRef([
    {
      label: 'Created at',
      value: 'created_at',
    }
  ]);

  const [sort, setSort] = useState({
    order_by: null,
    field: null,
  });

  // This two function are needed because the Select component doesn't accept custom functions
  const changeOrderBy = (value) =>
    setSort((sort) => {
      return { ...sort, order_by: value };
    });

  const changeField = (value) =>
    setSort((sort) => {
      return { ...sort, field: value };
    });

  useEffect(() => {
    if (sort.order_by && sort.field) {
      props.setFiltersSort((filter_sort) => {
        return {
          ...filter_sort,
          order: {
            [sort.field]: sort['order_by'],
          },
        };
      });
    }
  }, [JSON.stringify(sort)]);

  const [inputTimeout, setInputTimeout] = useState<NodeJS.Timeout | null>(null);

  function setInputValueSearch(event) {
    if (inputTimeout) {
      clearTimeout(inputTimeout);
    }

    const newTimeout = setTimeout(() => {
      props.setSearchText(event.target.value);
    }, 1500);

    setInputTimeout(newTimeout);
  }

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-3">
          <Link to="/a/article-editor">
            <Button variant="primary">
              <ArchiveBox />
              New article
            </Button>
          </Link>
          <Button variant="primary" onClick={() => props.setCategoryVisible(!props.categoryVisible)}>
            <PencilSquare />
            Categories
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              if (contentMenu == 'sort') {
                setShowMenu(false);
                setContentMenu(null);
              } else {
                setShowMenu(true);
                setContentMenu('sort');
              }
            }}
            variant="secondary"
          >
            <TrianglesMini />
            Sort by
          </Button>
          <Button
            onClick={() => {
              if (contentMenu == 'search') {
                setShowMenu(false);
                setContentMenu(null);
              } else {
                setShowMenu(true);
                setContentMenu('search');
              }
            }}
            variant="secondary"
          >
            <MagnifyingGlass />
            Search
          </Button>
        </div>
      </div>
      {showMenu ? (
        <Container className="flex justify-center">
          {contentMenu == 'search' ? (
            <div className="flex flex-col gap-2.5 w-full">
              <p className="text-xl font-semibold">Search</p>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                      <div
                        className="flex items-center gap-4 w-full"
                      >
                        <div className="grid grid-cols-5 gap-4 w-full">
                          <div className="col-span-2">
                            <input
                              onChange={setInputValueSearch}
                              className="caret-ui-fg-base bg-ui-bg-field hover:bg-ui-bg-field-hover shadow-borders-base placeholder-ui-fg-muted text-ui-fg-base transition-fg relative w-full appearance-none rounded-md outline-none focus-visible:shadow-borders-interactive-with-active disabled:text-ui-fg-disabled disabled:!bg-ui-bg-disabled disabled:placeholder-ui-fg-disabled disabled:cursor-not-allowed aria-[invalid=true]:!shadow-borders-error invalid:!shadow-borders-error [&amp;::--webkit-search-cancel-button]:hidden [&amp;::-webkit-search-cancel-button]:hidden [&amp;::-webkit-search-decoration]:hidden txt-compact-small h-8 px-2 py-1.5"
                              placeholder="Value to filter"
                            ></input>
                          </div>
                        </div>
                      </div>

                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 w-full">
              <p className="text-xl font-semibold">Sort by</p>
              <div className="flex gap-4 items-center">
                <Select onValueChange={changeField}>
                  <Select.Trigger>
                    <Select.Value placeholder="Select a field to sort" />
                  </Select.Trigger>
                  <Select.Content>
                    {columns.current.map((item) => (
                      <Select.Item key={item.value} value={item.value}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
                <Select onValueChange={changeOrderBy}>
                  <Select.Trigger>
                    <Select.Value placeholder="Select an order to sort" />
                  </Select.Trigger>
                  <Select.Content>
                    {sortTypes.current.map((item) => (
                      <Select.Item key={item.value} value={item.value}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>
            </div>
          )}
        </Container>
      ) : (
        ''
      )}
    </div>
  );
};

export default ToolBar;
