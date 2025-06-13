# NutriFit

Projeto desenvolvido como **CCH (Componentização de Conhecimento e Habilidades)** para a disciplina de **Dispositivos Móveis** da **UTFPR**.

## 👥 Desenvolvedores
- Leonardo Dall'Asta Krüger  
- Siluane Zancanaro

## 🛠️ Tecnologias Utilizadas
- React Native  
- TypeScript  
- Expo  

▶️ Como Executar o Projeto (Ambiente Local)
Este projeto usa bibliotecas nativas e requer um ambiente de desenvolvimento Android configurado. O processo de execução é feito através de um build local.

🔧 Pré-requisitos
Antes de começar, garanta que você tem o seguinte instalado e configurado em seu computador com Windows:

Node.js (versão LTS recomendada)

Git

Android Studio

Java Development Kit (JDK) (versão 17 recomendada)

Variáveis de ambiente ANDROID_HOME e JAVA_HOME devidamente configuradas.

⚙️ Configuração Inicial
Clone o Repositório
Abra seu terminal e execute os seguintes comandos para clonar o projeto e entrar na pasta:

git clone https://github.com/leonardodallasta/NutriFit
cd nutrifit

Configure o Firebase
Este projeto precisa se conectar ao seu próprio backend do Firebase.

Crie um projeto no Console do Firebase.

Registre um aplicativo Android com o nome do pacote com.company.nutrifit.

Baixe o arquivo google-services.json e coloque-o na raiz do projeto.

Instale as Dependências
Com o terminal na pasta do projeto, instale todas as bibliotecas necessárias:

npm install

🚀 Executando o Aplicativo
Inicie um Emulador
Abra o Android Studio, vá em Tools > Device Manager e inicie um dispositivo virtual (Recomendado: Pixel 5 com API 31 / Android 12).

Compile e Rode o App
Com o emulador já rodando, execute o seguinte comando no seu terminal. Ele irá compilar o aplicativo, instalá-lo no emulador e iniciar o servidor de desenvolvimento:

npx expo run:android

A primeira vez que você executar este comando, ele será demorado, pois irá baixar todas as dependências do Android (Gradle). As execuções seguintes serão muito mais rápidas.

Pronto! O aplicativo NutriFit deve abrir automaticamente no seu emulador. Qualquer alteração que você fizer no código agora será refletida em tempo real.

