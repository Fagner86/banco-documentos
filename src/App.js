import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';


// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCcHevlP1MXxWAzuixdr_PFb8XE4s0vRqk",
  authDomain: "documentos-7c053.firebaseapp.com",
  projectId: "documentos-7c053",
  storageBucket: "documentos-7c053.appspot.com",
  messagingSenderId: "437302246602",
  appId: "1:437302246602:web:02f5cab0d7da5444010833"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [colecaoSelecionada, setColecaoSelecionada] = useState('');
  const [documentos, setDocumentos] = useState([]);
  const [novoNome, setNovoNome] = useState('');
  const [novoConteudo, setNovoConteudo] = useState('');
  const [documentoEditando, setDocumentoEditando] = useState(null);
  const [novoConteudoEditando, setNovoConteudoEditando] = useState('');
  const [colecoes] = useState(['colecao1', 'colecao2', 'colecao3']);

  // Função para carregar documentos de uma coleção
  const carregarDocumentos = useCallback(async () => {
    if (colecaoSelecionada) {
      const querySnapshot = await getDocs(collection(db, colecaoSelecionada));
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setDocumentos(docs);
    }
  }, [colecaoSelecionada]);

  // Carregar documentos quando a coleção selecionada for alterada
  useEffect(() => {
    carregarDocumentos();
  }, [colecaoSelecionada, carregarDocumentos]);

  // Adicionar um novo documento
  const adicionarDocumento = async () => {
    try {
      await addDoc(collection(db, colecaoSelecionada), {
        nome: novoNome,
        conteudo: novoConteudo
      });
      console.log('Documento adicionado');
      setNovoNome('');
      setNovoConteudo('');
      // Recarregar documentos após adição
      carregarDocumentos();
    } catch (error) {
      console.error('Erro ao adicionar documento: ', error);
    }
  };

  // Atualizar o conteúdo de um documento
  const atualizarDocumento = async () => {
    try {
      await updateDoc(doc(db, colecaoSelecionada, documentoEditando.id), {
        conteudo: novoConteudoEditando
      });
      console.log('Conteúdo do documento atualizado');
      setDocumentoEditando(null);
      setNovoConteudoEditando('');
      // Recarregar documentos após atualização
      carregarDocumentos();
    } catch (error) {
      console.error('Erro ao atualizar documento: ', error);
    }
  };

  // Excluir um documento pelo ID
  const excluirDocumento = async (id) => {
    try {
      await deleteDoc(doc(db, colecaoSelecionada, id));
      console.log('Documento excluído com ID: ', id);
      // Recarregar documentos após exclusão
      carregarDocumentos();
    } catch (error) {
      console.error('Erro ao excluir documento: ', error);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Banco de Dados Documentos</span>
        </div>
      </nav>

      <div className="container mt-4">
        <h1>Selecionar Coleção</h1>
        <div className="input-group mb-3">
          <select className="form-select" value={colecaoSelecionada} onChange={(e) => setColecaoSelecionada(e.target.value)}>
            <option value="">Selecione...</option>
            {colecoes.map((colecao) => (
              <option key={colecao} value={colecao}>{colecao}</option>
            ))}
          </select>
        </div>

        {colecaoSelecionada && (
          <>
            <h1>Meus Documentos ({colecaoSelecionada})</h1>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Nome do Documento"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Conteúdo do Documento"
                value={novoConteudo}
                onChange={(e) => setNovoConteudo(e.target.value)}
              />
              <button className="btn btn-primary" type="button" onClick={adicionarDocumento}>Adicionar</button>
            </div>
            <ul className="list-group">
              {documentos.map((documento) => (
                <li key={documento.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {documento.nome}: {documento.conteudo}
                  <div>
                    <button className="btn btn-danger" onClick={() => excluirDocumento(documento.id)}>Excluir</button>
                    <button className="btn btn-primary ms-1" onClick={() => setDocumentoEditando(documento)}>Editar</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

{documentoEditando && (
          <div className="input-group mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Novo Conteúdo"
              value={novoConteudoEditando}
              onChange={(e) => setNovoConteudoEditando(e.target.value)}
            />
            <button className="btn btn-primary" type="button" onClick={atualizarDocumento}>Salvar</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

