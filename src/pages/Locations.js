import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink,useNavigate } from 'react-router-dom';
import apiPath from '../api'
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar } from '../components/_dashboard/user';
//
import trash2Outline from '@iconify/icons-eva/trash-2-outline';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Başlık', alignRight: false },
  { id: 'description', label: 'Açıklama', alignRight: false },
  { id: 'color', label: 'Renk', alignRight: false },
  { id: 'date', label: 'Tarih', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Locations() {



  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('title');
  const [filterTitle, setFilterTitle] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const[loading,setLoading] = useState(false);
  const[shapes,setShapes] = useState([]);
  const[remove,setSRemove] = useState(0);
  
  const navigate = useNavigate();

  useEffect(()=>{

        let userf = JSON.parse(localStorage.getItem('user'))
      if (userf.vip) {
          console.log("admin e" )
        }
        else{
          navigate('/', { replace: true })
        }

  },[])


  useEffect(()=>{
    setLoading(true);
    fetch(apiPath.shape.getList , {
      method: 'GET',
  }).then((res) => {
      return res.json();
  }).then((data) => {
      setShapes(data)
  });
  setLoading(false);
  },[remove])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = shapes.map((n) => n.title);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, title) => {
    const selectedIndex = selected.indexOf(title);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, title);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const handleFilterByTitle = (event) => {
    setFilterTitle(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - shapes.length) : 0;

  const filteredUsers = applySortFilter(shapes, getComparator(order, orderBy), filterTitle);

  const isUserNotFound = filteredUsers.length === 0;


  console.log('shapes : ',shapes)
  console.log('ls', JSON.parse(localStorage.getItem('user')).name)

  return (
    <Page title="Locations">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Lokasyon
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/dashboard/addlocation"
            startIcon={<Icon icon={plusFill} />}
          >
            Yeni Lokasyon
          </Button>
        </Stack>

        <Card>
          {/* <UserListToolbar
            numSelected={selected.length}
            filterTitle={filterTitle}
            onFilterTitle={handleFilterByTitle}
          /> */}

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={shapes.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, title, description, color, createdAt, _id } = row;
                      const isItemSelected = selected.indexOf(title) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, title)}
                            />
                          </TableCell>
                         
                          <TableCell align="left">{title}</TableCell>
                          <TableCell align="left">{description}</TableCell>
                          <TableCell align="left">{color}</TableCell>
                          <TableCell align="left">{createdAt.slice(0,10)}</TableCell>
                          <TableCell align="right"  onClick={()=>{

                              fetch(apiPath.shape.removeShape(_id) , {
                                method: 'DELETE',
                            }).then((res) => {
                                return res.json();
                            }).then((data) => {
                                console.log(data)
                                setSRemove(remove+1)
                            })

                              }} >
                            <Icon icon={trash2Outline} width={24} height={24}  />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterTitle} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={shapes.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
