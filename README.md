# CharacterApp - Aplicação Angular

Este projeto é uma recriação moderna da aplicação CharacterApp, utilizando **Angular** e **Tailwind CSS** para oferecer uma experiência de usuário aprimorada, responsiva e visualmente atraente. A aplicação permite a criação, gerenciamento e visualização de fichas de personagens de RPG.

## Visão Geral do Projeto

O CharacterApp é um sistema completo para gerenciar fichas de personagens, com funcionalidades de CRUD (Criar, Ler, Atualizar, Deletar), persistência de dados no navegador e exportação de arquivos. A interface foi redesenhada com foco em UX/UI, garantindo uma navegação intuitiva e uma apresentação elegante das informações em diversos tamanhos de tela.

### Tecnologias Utilizadas

- **Angular**: Framework robusto para a construção da arquitetura da aplicação, componentização e gerenciamento de estado.
- **Tailwind CSS**: Framework de CSS utility-first para a criação de um design customizado, responsivo e moderno.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática, aumentando a robustez e a manutenibilidade do código.
- **RxJS**: Biblioteca para programação reativa, utilizada para gerenciar eventos e fluxos de dados assíncronos.

## Melhorias de UX/UI Implementadas

- **Design Moderno e Imersivo**: Interface com tema escuro, inspirada em painéis de jogos, com uma paleta de cores focada e hierarquia visual clara.
- **Responsividade Aprimorada**: Layout totalmente adaptável para desktops, tablets e dispositivos móveis (mobile-first).
- **Micro-interações e Animações**: Transições suaves entre telas, animações de entrada para elementos, e feedback visual em botões e inputs para uma experiência mais dinâmica.
- **Componentes Reutilizáveis**: Criação de componentes compartilhados como modais, botões flutuantes (FAB) e cabeçalhos de página para garantir consistência visual e funcional.
- **Gerenciamento de Estado Otimizado**: Indicadores de carregamento (loading spinners) e estados de tela vazia (empty states) para guiar o usuário.
- **Formulários Reativos e Validação**: Formulários com validação em tempo real e feedback claro para o usuário.
- **Auto-Save Inteligente**: Salvamento automático de rascunhos com `debounce` para não sobrecarregar o sistema.

## Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e executar a aplicação em sua máquina local.

### Pré-requisitos

Antes de começar, certifique-se de ter o **Node.js** e o **Angular CLI** instalados em seu sistema. Se não os tiver, siga os links para instalá-los:

- **Node.js**: [https://nodejs.org/](https://nodejs.org/)
- **Angular CLI**: Após instalar o Node.js, execute o comando abaixo no seu terminal:
  ```bash
  npm install -g @angular/cli
  ```

### 1. Clone o Repositório

Primeiro, obtenha os arquivos do projeto. Se você recebeu um arquivo `.zip`, descompacte-o em uma pasta de sua preferência. Se for um repositório Git, clone-o:

```bash
git clone <URL_DO_REPOSITORIO>
cd character-app
```

### 2. Instale as Dependências

Navegue até a pasta raiz do projeto (onde se encontra o arquivo `package.json`) e execute o comando abaixo para instalar todas as dependências necessárias:

```bash
npm install
```

Este comando irá baixar todas as bibliotecas listadas no `package.json`, incluindo o Angular e o Tailwind CSS.

### 3. Execute a Aplicação em Modo de Desenvolvimento

Após a instalação das dependências, você pode iniciar o servidor de desenvolvimento local com o seguinte comando:

```bash
npm start
```

Ou, alternativamente:

```bash
ng serve
```

O servidor será iniciado e a aplicação estará acessível em **`http://localhost:4200/`**. O servidor recarregará automaticamente a página sempre que você fizer alterações nos arquivos do projeto.

### 4. Build para Produção

Quando estiver pronto para implantar a aplicação, você pode criar uma versão otimizada para produção com o comando:

```bash
npm run build:prod
```

Este comando compilará a aplicação e colocará os arquivos estáticos otimizados na pasta `dist/character-app`. Esses arquivos estão prontos para serem implantados em qualquer servidor web.

## Estrutura do Projeto

A estrutura de pastas segue as melhores práticas do Angular, separando o código por responsabilidades:

```
src/
├── app/
│   ├── core/         # Serviços, modelos e lógica de negócio central.
│   ├── features/     # Componentes principais de cada funcionalidade (Dashboard, Formulário, etc.).
│   └── shared/       # Componentes, diretivas e pipes reutilizáveis.
├── assets/         # Imagens, ícones e outros arquivos estáticos.
├── environments/   # Configurações de ambiente (desenvolvimento e produção).
└── styles/         # Estilos globais e configuração do Tailwind CSS.
```

## Scripts Disponíveis

- `npm start`: Inicia o servidor de desenvolvimento.
- `npm run build`: Compila a aplicação para desenvolvimento.
- `npm run build:prod`: Compila a aplicação para produção.
- `npm test`: Executa os testes unitários.
- `npm run watch`: Compila a aplicação em modo de observação, reconstruindo a cada alteração.

---
