import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { TableHead } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import DialogoConfirmacao from '../../confirmacao/DialogoConfirmacao';


const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(Math.ceil(count / rowsPerPage));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
});



export default function TabelaNoticias({rows, onSetRowsPerPage, onSetPage, currentPage, rowsPerPage, numElems, onDelete}) {
  const classes = useStyles2();

  const emptyRows = rowsPerPage - rows.length;
  const [open, setOpen] = useState(false);
  const [noticiaToDelete, setNoticiaToDelete] = useState(null);

  return (
    <>
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="custom pagination table">
        <TableHead>
            <TableRow>
              <TableCell component="th" scope="row">
                Título
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                Data de Publicação
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                Ações
              </TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row['_id']}>
              <TableCell component="th" scope="row">
                {row.titulo}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.data_publicacao? new Date(row.data_publicacao).toLocaleDateString() : null}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                <IconButton onClick={() => {window.location.href = '/noticia/form/' + row['_id'] }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => { setNoticiaToDelete(row); setOpen(true) }}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: -1 }]}
              colSpan={3}
              count={numElems}
              rowsPerPage={rowsPerPage}
              page={currentPage}
              SelectProps={{
                inputProps: { 'aria-label': 'linhas por página' },
                native: true,
              }}
              labelRowsPerPage="Linhas por página"
              onChangePage={onSetPage}
              onChangeRowsPerPage={onSetRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
    <DialogoConfirmacao 
        open={open}
        title={"Confirmação"}
        text={"Deseja mesmo excluir essa notícia?"} 
        okButtonText={"OK"}
        cancelButtonText={"Cancelar"}
        onClickOk={(noticia) => { onDelete(noticiaToDelete); setOpen(false)}}
        onClose={() => setOpen(false)}/>
    </>
  );
}