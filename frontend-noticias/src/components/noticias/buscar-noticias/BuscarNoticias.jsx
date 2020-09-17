import React, { useEffect, useState } from "react";
import FormBuscarNoticias from "./FormBuscarNoticias";
import TabelaNoticias from "./TabelaNoticias";
import { Typography, Button, Box } from "@material-ui/core";
import $ from "jquery";
import Alert from "@material-ui/lab/Alert";

export default function BuscarNoticias() {
  const baseUrl = "http://localhost:8000/noticia/";
  const [rows, setRows] = useState([]);
  const [numElems, setNumElems] = useState(0);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [lastQuery, setLastQuery] = useState("");

  const [mensagem, setMensagem] = useState();
  const [statusMensagem, setStatusMensagem] = useState("success");
  const [deletedCount, setDeletedCount] = useState(0);

  useEffect(() => {
    let skip = page * itemsPerPage;
    const url =
      baseUrl + "?q=" + lastQuery + "&skip=" + skip + "&limit=" + itemsPerPage + "&timestamp=" + new Date().getTime().toString();
    $.getJSON(url).then((data) => {
      setRows(data.results);
      setNumElems(data.num_elems);
    });
  }, [itemsPerPage, page, lastQuery, deletedCount]);


  if (localStorage.getItem('mensagem_sucesso') !== null) {
      setMensagem(localStorage.getItem('mensagem_sucesso'));
      setStatusMensagem("success");
      localStorage.removeItem('mensagem_sucesso');
  }

  

  function deletarNoticia(noticia) {
    $.ajax({
      url: "http://localhost:8000/noticia/" + noticia["_id"],
      method: "DELETE",
      contentType: "application/json",
      success: function (data) {
        setMensagem("Notícia apagada com sucesso");
        setStatusMensagem("success");
        setPage(0);
        setDeletedCount(deletedCount + 1);
      },
      error: function (err) {
        setMensagem("Ocorreu um erro ao apagar a notícia");
        setStatusMensagem("error");
      },
    });
  }


  function pesquisarNoticias(query) {
    if (query === undefined) query = "";
    setLastQuery(query);
    setPage(0);
  }

  function changeItemsPerPage(event) {
    setItemsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  function changePage(page) {
    setPage(page);
  }

  return (
    <>
      <Typography variant="h5" component="h5" align="center">
        Notícias
      </Typography>
      {mensagem != null ? (
                <Alert
                    color={statusMensagem}
                    closeText="Fechar"
                    onClose={() => {
                        setMensagem(null);
                    }}
                    >
                    {mensagem}
                    </Alert>
                    ) : null } 
      <FormBuscarNoticias pesquisarNoticias={pesquisarNoticias} />
      <TabelaNoticias
        rows={rows}
        onSetRowsPerPage={changeItemsPerPage}
        numElems={numElems}
        onSetPage={changePage}
        currentPage={page}
        rowsPerPage={itemsPerPage}
        onDelete={deletarNoticia}
      />
      <Box m={1}>
        <Button
          type="button"
          color="secondary"
          fullWidth
          variant="contained"
          margin="normal"
          onClick={() => (window.location.href = "/noticia/form")}
        >
          Novo
        </Button>
      </Box>
    </>
  );
}
