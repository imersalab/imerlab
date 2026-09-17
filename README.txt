IMERSALAB - estrutura do site

ARQUIVOS PRINCIPAIS
- index.html: catálogo com filtros e cards.
- detalhe.html: página dinâmica de cada projeto.
- simulador.html: página da experiência/simulador.
- css/style.css: todos os estilos.
- js/projetos.js: banco de dados dos projetos.
- js/index.js: filtros e cards.
- js/detalhe.js: conteúdo da página de detalhes.
- js/simulador.js: página do simulador.

COMO FUNCIONA
1. O card abre detalhe.html?id=ID em uma nova guia.
2. A página de detalhes lê o projeto pelo ID.
3. O vídeo tenta carregar assets/videos/ID.mp4.
4. Se o MP4 não existir, aparece um painel visual de divulgação.
5. Ao clicar no vídeo/painel, abre simulador.html?id=ID em nova guia.
6. LuxRefra AR inclui um simulador demonstrativo funcional de refração.
7. Os demais projetos têm uma área preparada para receber WebGL/Unity/iframe/aplicação própria.

EXEMPLO DE VÍDEO
Para LuxRefra AR, salve o arquivo como:
assets/videos/luxrefra-ar.mp4


NOVO FLUXO
- A página inicial agora possui uma seção de vídeos antes do catálogo.
- Clicar em um vídeo de destaque abre a página do projeto e o vídeo automaticamente.
- Na página do projeto, clicar no vídeo abre um player em tela modal.
- Os botões "Abrir experiência" agora abrem loading.html.
- loading.html mostra uma splash screen preta com logomarca ImersaLab e barra de progresso.
- Ao concluir o carregamento, a página redireciona para simulador.html.

IMPORTANTE
A barra de carregamento atual é uma animação visual. Quando o projeto usar Unity WebGL,
ela pode ser conectada ao progresso real da build.


AJUSTE DO VÍDEO
- Ao clicar em qualquer vídeo da página inicial, abre video.html em nova guia.
- Ao clicar no vídeo da página do projeto, abre video.html em nova guia.
- video.html contém somente o player do vídeo em fundo preto.
- Nenhum outro fluxo do site foi alterado.


AJUSTE FINAL DO VÍDEO
- Os vídeos não abrem mais outra guia.
- Na página inicial, clicar no vídeo amplia o player sobre a própria página.
- Na página individual do projeto, o comportamento é o mesmo.
- Ao fechar o vídeo, a pessoa retorna exatamente à página e à posição onde estava.
- ESC também fecha o vídeo.


PÁGINAS DE REALIDADE AUMENTADA
- Projetos RA exibem um Kit de Realidade Aumentada com imagem do card, descrição, vídeo e download.
- Novas abas: Plano de aula, Como utilizar e Roteiros de aula.
- Cards em assets/cards/ID-DO-PROJETO.png.
- Para trocar pelo card real, substitua o PNG mantendo o mesmo nome.


DOWNLOAD DO APLICATIVO ANDROID
- Projetos de Realidade Aumentada agora exibem o botão "Baixar aplicativo Android".
- A pasta dos aplicativos é assets/apps/.
- Não é necessário alterar código para adicionar um APK.
- Use o ID do projeto como nome do arquivo.
- Exemplos: assets/apps/luxrefra-ar.apk e assets/apps/sistema-solar-ar.apk.
- Ao publicar o site, o botão da página RA fará o download desse arquivo automaticamente.


DOAÇÕES / APOIO AO PROJETO
- O site possui agora o botão "Apoie o projeto".
- A página doacao.html permite escolher valor, doação única/mensal, dados do doador e forma de contribuição.
- Configure PIX e checkout no início do arquivo js/doacao.js.
- Campo pixKey: coloque sua chave PIX.
- Campo checkoutUrl: coloque um Payment Link do Mercado Pago, Stripe, PagBank, PayPal ou outro provedor.
- Por segurança, o site não coleta nem armazena dados de cartão.

PÁGINA DE CONTATO
- contato.html possui formulário para mensagem geral, solicitação de visita e sugestão de novo aplicativo.
- O formulário envia para vslssbarbosa@gmail.com usando FormSubmit.
- O visitante não precisa abrir seu programa de e-mail.
- Após o envio, o usuário retorna para contato-sucesso.html.
- Na primeira utilização do FormSubmit, o serviço pode enviar um e-mail de ativação para confirmar o endereço de destino.

CORREÇÃO DO FORMULÁRIO - V9
- O envio agora usa o endpoint AJAX oficial do FormSubmit.
- O método POST é executado explicitamente via fetch().
- O usuário permanece no site durante o envio.
- Após sucesso, abre contato-sucesso.html.
- O formulário mantém method="POST" como fallback caso JavaScript esteja desativado.
- Na primeira utilização, confirme o e-mail de ativação enviado pelo FormSubmit para vslssbarbosa@gmail.com.

CORREÇÃO DO FORMULÁRIO - V10
- O envio de contato usa agora o POST nativo do navegador, sem AJAX/fetch.
- Isso evita bloqueios CORS durante testes locais e no Live Server.
- O formulário continua enviando para vslssbarbosa@gmail.com via FormSubmit.
- Quando publicado em HTTP/HTTPS, o retorno após o envio é contato-sucesso.html.
- Se aberto diretamente como file://, o FormSubmit usa sua própria página de confirmação.
- Na primeira utilização, confirme o e-mail de ativação enviado pelo FormSubmit.


NOVA PÁGINA SOBRE
-----------------
- sobre.html: apresenta o propósito do ImersaLab, o ecossistema RA/RV/Simuladores, público-alvo e princípios do projeto.
- O item SOBRE do menu principal da index.html agora abre essa página.

PÁGINA DA EQUIPE
----------------
- equipe.html: página com integrantes do projeto.
- js/equipe.js: cadastro dos integrantes (nome, função, descrição, foto, LinkedIn e e-mail).
- assets/equipe/: coloque as fotografias dos integrantes nesta pasta.


ATIVIDADES PARA DOWNLOAD
------------------------
A aba "Atividades" de cada projeto agora possui um botão para baixar um PDF.
Os arquivos ficam dentro do site em:

assets/atividades/

Exemplo:
assets/atividades/luxrefra-ar-atividade.pdf

O caminho de cada arquivo é configurado em js/projetos.js pelo campo:
activityFile: "assets/atividades/luxrefra-ar-atividade.pdf"

Para trocar uma atividade, você pode substituir o PDF mantendo o mesmo nome
ou alterar o campo activityFile para apontar para outro arquivo.


REDES SOCIAIS
-------------
Os botões de Instagram, YouTube, Facebook e TikTok estão no rodapé das principais páginas.
Para apontar para os perfis oficiais, edite apenas o arquivo:
  js/redes.js

Substitua as URLs de cada rede pelo endereço do perfil oficial do projeto.


CONTADOR DE ACESSOS
-------------------
A versão atual inclui um sistema de estatísticas em:
  estatisticas.html

O sistema acompanha:
- Visitas: nova visita após 30 minutos sem navegação neste navegador.
- Visitantes únicos aproximados: um registro por navegador/dispositivo.
- Páginas visualizadas: cada página monitorada carregada.

ARQUIVOS:
- api/visitas.js: função serverless da Vercel que registra e consulta os contadores.
- js/visitas.js: registra os acessos nas páginas públicas.
- js/estatisticas.js: atualiza o painel de estatísticas.
- estatisticas.html: painel de controle.

ATIVAÇÃO NA VERCEL:
1. Crie uma conta no CounterAPI e um workspace.
2. Gere um token de acesso.
3. Na Vercel, abra o projeto > Settings > Environment Variables.
4. Crie:
   COUNTERAPI_WORKSPACE = nome do seu workspace
   COUNTERAPI_TOKEN = seu token
5. Faça um novo deploy do projeto.
6. Abra /estatisticas.html para conferir os números.

IMPORTANTE:
O token NÃO deve ser colocado em arquivos HTML ou JavaScript do navegador.
Ele fica apenas nas variáveis de ambiente da Vercel e é utilizado por api/visitas.js.
A contagem de visitantes únicos é uma estimativa por navegador/dispositivo, não uma identificação pessoal.
