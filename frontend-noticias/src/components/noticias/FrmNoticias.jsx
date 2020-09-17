import "date-fns";
import { TextField, Typography, Button, Box } from "@material-ui/core";
import React, { useState } from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import $ from "jquery";
import Alert from "@material-ui/lab/Alert";
import { useParams } from "react-router-dom";

function FrmNoticias() {
  const [dataPublicacao, setDataPublicacao] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [loaded, setLoaded] = useState(false);
  const { id_noticia } = useParams();
  const [mensagem, setMensagem] = useState();
  const [statusMensagem, setStatusMensagem] = useState();

  if (id_noticia !== null && id_noticia !== undefined && loaded === false) {
    setLoaded(true);
    let url = "http://localhost:8000/noticia/" + id_noticia;
    $.getJSON(url).then((data) => {
      setTitulo(data.titulo);
      setConteudo(data.conteudo);
      setDataPublicacao(new Date(data.data_publicacao));
    });
  }


  const initialFormStatus = {
    titulo: { error: false, message: "" },
    conteudo: { error: false, message: "" },
    dataPublicacao: { error: false, message: "" },
  };

  const [formStatus, setFormStatus] = useState(initialFormStatus);


  const handleDateChange = (date) => {
    setDataPublicacao(date);
  };

  function validarRequerido(event, campo, mensagem) {
    let newFrmStatus = { ...formStatus };
    if (event.target.value === "" || event.target.value === null) {
      newFrmStatus[campo] = { error: true, message: mensagem };
      setFormStatus(newFrmStatus);
    } else {
      newFrmStatus[campo] = { error: false, message: "" };
      setFormStatus(newFrmStatus);
    }
  }

  function removerMensagemErroDataPublicacao(ev) {
    let newFrmStatus = { ...formStatus };
    newFrmStatus["dataPublicacao"] = { error: false, message: "" };
    setFormStatus(newFrmStatus);
  }

  function enviarFormulario(event) {
    event.preventDefault();

    const noticia = {
      titulo: titulo,
      conteudo: conteudo,
      data_publicacao: dataPublicacao,
    };

    if (id_noticia == null) {
      //TODO parametrizar url
      $.post({
        url: "http://localhost:8000/noticia/",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(noticia),
        success: function (data) {
          setMensagem("Cadastro realizado com sucesso");
          setStatusMensagem("success");
          setConteudo("");
          setTitulo("");
          setDataPublicacao(null);
        },
        error: function (err) {
          if (
            err.responseJSON &&
            err.responseJSON.error &&
            err.responseJSON.error.type === "ValidationException"
          ) {
            let details = err.responseJSON.error.details;
            let newFormStatus = { ...formStatus };
            for (let d in details) {
              newFormStatus[details[d].id] = {
                error: true,
                message: details[d].message,
              };
            }
            setFormStatus(newFormStatus);
          } else {
            setMensagem("Ocorreu um erro desconhecido");
            setStatusMensagem("error");
            console.log(err);
          }
        },
      });
    } else {
      $.ajax({
        url: "http://localhost:8000/noticia/" + id_noticia,
        dataType: "json",
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(noticia),
        success: function (data) {
          localStorage.setItem('mensagem_sucesso', 'Cadastro atualizado com sucesso');
          window.location.href = '/noticia';
        },
        error: function (err) {
          if (
            err.responseJSON &&
            err.responseJSON.error &&
            err.responseJSON.error.type === "ValidationException"
          ) {
            let details = err.responseJSON.error.details;
            let newFormStatus = { ...formStatus };
            for (let d in details) {
              newFormStatus[details[d].id] = {
                error: true,
                message: details[d].message,
              };
            }
            setFormStatus(newFormStatus);
          }
        },
      });
    }
  }

  return (
    <form
      onSubmit={(ev) => {
        enviarFormulario(ev);
      }}
    >
      <Typography variant="h5" component="h5" align="center">
        Cadastro de Notícias
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
      ) : null}

      <TextField
        id="titulo"
        name="titulo"
        value={titulo}
        placeholder="Titulo"
        label="Título"
        required
        variant="outlined"
        fullWidth
        margin="normal"
        type="text"
        error={formStatus.titulo.error}
        helperText={formStatus.titulo.message}
        onBlur={(ev) => validarRequerido(ev, "titulo", "Título é requerido")}
        onChange={(ev) => setTitulo(ev.target.value)}
      />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          inputVariant="outlined"
          format="dd/MM/yyyy"
          margin="normal"
          id="data-publicacao"
          label="Data de Publicação"
          onChange={handleDateChange}
          value={dataPublicacao}
          error={formStatus.dataPublicacao.error}
          helperText={formStatus.dataPublicacao.message}
          required
          onAccept={removerMensagemErroDataPublicacao}
          onBlur={(ev) =>
            validarRequerido(
              ev,
              "dataPublicacao",
              "Data de publicação é requerida"
            )
          }
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
      </MuiPickersUtilsProvider>

      <TextField
        id="conteudo"
        name="conteudo"
        placeholder="Conteúdo"
        label="Conteúdo"
        required
        variant="outlined"
        margin="normal"
        rows={4}
        multiline
        onChange={(ev) => setConteudo(ev.target.value)}
        value={conteudo}
        error={formStatus.conteudo.error}
        helperText={formStatus.conteudo.message}
        onBlur={(ev) =>
          validarRequerido(ev, "conteudo", "Conteúdo é requerido")
        }
        fullWidth
      />
      <Box m={1}>

        <Button
          type="submit"
          color="primary"
          fullWidth
          variant="contained"
        >
          Salvar
        </Button>
      </Box>
      <Box m={1}>
        <Button
          type="button"
          color="secondary"
          fullWidth
          variant="contained"
          onClick={() => (window.location.href = "/noticia/")}
        >
          Voltar
        </Button>
      </Box>
    </form>
  );
}

export default FrmNoticias;
