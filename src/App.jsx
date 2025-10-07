import { useState } from 'react';
import './App.css';

function App() {
  const [files, setFiles] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, loading, error, success
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFiles(event.target.files);
      setStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!files) {
      setErrorMessage('Por favor, selecione pelo menos um arquivo PDF.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const response = await fetch('https://folhas-backend.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Ocorreu um erro no servidor.');
      }

      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'planilha_consolidada.xlsx';
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setStatus('success');
    } catch (error) {
      setErrorMessage(error.message);
      setStatus('error');
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Extrator de Folhas de Pagamento</h1>
        <p>Faça o upload dos seus arquivos PDF para consolidá-los em uma única planilha Excel.</p>
      </header>
      
      <main>
        <div className="upload-box">
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileChange}
            className="file-input"
          />
          <button 
            onClick={handleUpload} 
            disabled={status === 'loading'}
            className="upload-button"
          >
            {status === 'loading' ? 'Processando...' : 'Processar e Baixar Excel'}
          </button>
        </div>
        
        <div className="status-box">
          {/* A BARRA DE PROGRESSO APARECERÁ AQUI */}
          {status === 'loading' && (
            <div className="progress-bar">
              <div className="progress-bar-inner"></div>
            </div>
          )}

          {status === 'error' && <p className="status-error">Erro: {errorMessage}</p>}
          {status === 'success' && <p className="status-success">Sucesso! O download da sua planilha foi iniciado.</p>}
          
          {files && status !== 'loading' && (
            <div className="file-list">
              <p>Arquivos selecionados:</p>
              <ul>
                {Array.from(files).map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
