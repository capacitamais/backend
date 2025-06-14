# backend
Repositório do backend do sistema Capacita+.

# Capacita+ - Sistema de Gestão de Treinamentos e Exames

Bem-vindo ao repositório do **Capacita+**, um sistema desenvolvido como parte do Projeto Aplicado IV do Curso de Análise e Desenvolvimento de Sistemas do SESI SENAI. Este projeto tem como objetivo criar uma ferramenta offline para técnicos consultarem a situação de treinamentos e exames obrigatórios de colaboradores da AGRO INDÚSTRIA POLPA DE FRUTA LTDA, garantindo segurança e eficiência no ambiente de trabalho.

---

## 📖 Sobre o Projeto

O **Capacita+** é uma aplicação web que permite aos técnicos verificar a aptidão de colaboradores para realizar atividades, com base em treinamentos e exames obrigatórios. A ferramenta opera offline, utilizando dados armazenados localmente, e pode ser atualizada automaticamente quando houver conexão com a internet a partir de uma planilha de controle em formato .csv. O sistema foi projetado para analistas gerenciarem registros e técnicos realizarem consultas, priorizando usabilidade e segurança.

### Objetivo
Facilitar a identificação de colaboradores capacitados, evitando acidentes de trabalho por falta de treinamento, e oferecer uma solução robusta para gestão offline em setores como o campo agrícola.

### Equipe de Desenvolvimento
- Antonio Hebert Mendonça dos Santos
- Daniel Andrade Silva
- Enrik Paulo Lemes da Silva
- Joseli Divino
- Miyuki Araújo Hirata

---

## 🚀 Como Rodar o Projeto

Siga os passos abaixo para configurar e executar o projeto localmente.

### Pré-requisitos
Certifique-se de ter as seguintes ferramentas instaladas:
- **Node.js** (versão 18 ou superior)
- **npm** (gerenciador de pacotes do Node.js)
- **Git** (para clonar o repositório)
- Um editor de código, como **VS Code**

### 1. Clone o Repositório
Clone o repositório do projeto para sua máquina local:

```bash
git clone https://github.com/capacitamais/backend.git
cd backend
```

### 2. Crie o Arquivo `.env`
Na raiz do projeto, crie um arquivo chamado .env e adicione as seguintes variáveis fornecidas:

```env
PORT=<número da porta em que deseja subir a aplicação>
MONGO_URI=<endereço do banco de dados para consultas>
JWT_SECRET=<determine uma senha para aumentar a segurança da aplicação>
```

### 3. Instale as Dependências
Instale as bibliotecas necessárias para a aplicação:

```bash
npm install
```

### 4. Execute o Projeto
Inicie o servidor:

```bash
npm start
```


## 🛠 Tecnologias Utilizadas

### Frontend
- **React**: Biblioteca para construção de interfaces dinâmicas e reutilizáveis.
- **Vite**: Ferramenta de build com inicialização rápida e hot module replacement.
- **React Router**: Gerenciamento de navegação entre páginas.
- **Axios**: Cliente HTTP para comunicação com a API.

### Backend
- **Express.js**: Framework para API REST leve e eficiente.
- **MongoDB**: Banco de dados NoSQL orientado a documentos.
- **Mongoose**: ODM para modelagem e validação de dados.
- **Bcrypt**: Criptografia segura de senhas.
- **JWT**: Autenticação com tokens JSON Web Token.
- **Outras Dependências**: `dotenv`, `cookie-parser`, `cors`, `multer`, `nodemon`.

### Ferramentas de Desenvolvimento
- **Git**: Controle de versão.
- **GitHub**: Hospedagem do repositório.
- **Jest**: Framework para testes unitários.
- **VS Code**: Editor de código.

---

## 🎨 Layout

O layout do Capacita+ é responsivo, adaptando-se a telas entre 320 e 1200+ px, com uma interface intuitiva para analistas e técnicos. Principais telas incluem:
- **Login**: Autenticação com email e senha.
- **Dashboard Analista**: Gestão de tarefas, atividades, treinamentos e exames.
- **Consulta Técnica**: Pesquisa por nome ou matrícula com status de aptidão.

---

## 📋 Requisitos do Sistema

### Requisitos Funcionais
- **RF-0001**: Analistas podem cadastrar, visualizar, editar e apagar registros.
- **RF-0002**: Técnicos podem pesquisar situação de colaboradores por nome ou matrícula.
- **RF-0003**: Exibir apenas a tarefa com colaboradores relevantes para o técnico.
- **RF-0004**: Importar dados de planilhas .csv.
- **RF-0005**: Acessar informações dos colaboradores localmente.
- **RF-0006**: Autenticação de usuários.
- **RF-0007**: Recuperação de senha.

### Requisitos Não Funcionais
- **RNF-0001**: Atualização automática de relatórios com internet.
- **RNF-0002**: Resposta em até 20 segundos ou uso de dados locais.
- **RNF-0003**: Notificação de dados desatualizados offline.
- **RNF-0004**: Interface responsiva em três faixas de largura.
- **RNF-0005**: Suporte a Chrome, Safari, Edge e Firefox online.
- **RNF-0006**: Desenvolvimento ágil com iterações.
- **RNF-0007**: Autenticação por email e senha.
- **RNF-0008**: Criptografia de dados sensíveis.

---

**Capacita+** - Garantindo segurança e eficiência na gestão de treinamentos! 🌱
