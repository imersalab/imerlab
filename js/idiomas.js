(() => {
  const STORAGE_KEY = 'imersalab_language_v1';
  const DEFAULT_LANG = 'pt-BR';

  const languages = {
    'pt-BR': { label: 'Português', short: 'PT', flag: '🇧🇷' },
    'en': { label: 'English', short: 'EN', flag: '🇺🇸' },
    'es': { label: 'Español', short: 'ES', flag: '🇪🇸' }
  };

  // Traduções nativas do portal. Para ampliar futuramente, basta adicionar novos pares aqui.
  const T = {
    // Navegação e elementos comuns
    'VÍDEOS': { en: 'VIDEOS', es: 'VIDEOS' },
    'EXPERIÊNCIAS': { en: 'EXPERIENCES', es: 'EXPERIENCIAS' },
    'CATEGORIAS': { en: 'CATEGORIES', es: 'CATEGORÍAS' },
    'ENSINO': { en: 'EDUCATION', es: 'ENSEÑANZA' },
    'INICIATIVAS': { en: 'INITIATIVES', es: 'INICIATIVAS' },
    'SOBRE': { en: 'ABOUT', es: 'ACERCA DE' },
    'CONTATO': { en: 'CONTACT', es: 'CONTACTO' },
    'EQUIPE': { en: 'TEAM', es: 'EQUIPO' },
    'INÍCIO': { en: 'HOME', es: 'INICIO' },
    '❤ APOIE O PROJETO': { en: '❤ SUPPORT THE PROJECT', es: '❤ APOYA EL PROYECTO' },
    '❤ Apoie o projeto': { en: '❤ Support the project', es: '❤ Apoya el proyecto' },
    'Apoie o projeto': { en: 'Support the project', es: 'Apoya el proyecto' },
    'Sobre': { en: 'About', es: 'Acerca de' },
    'Contato': { en: 'Contact', es: 'Contacto' },
    'Nossa equipe': { en: 'Our team', es: 'Nuestro equipo' },
    'Estatísticas': { en: 'Statistics', es: 'Estadísticas' },
    'Explorar': { en: 'Explore', es: 'Explorar' },
    'Experiências': { en: 'Experiences', es: 'Experiencias' },
    'Vídeos': { en: 'Videos', es: 'Videos' },
    'Projeto': { en: 'Project', es: 'Proyecto' },
    'Mídias sociais:': { en: 'Social media:', es: 'Redes sociales:' },
    'Realidade Aumentada, Realidade Virtual e Simuladores para ensino e treinamento.': { en: 'Augmented Reality, Virtual Reality and Simulators for education and training.', es: 'Realidad Aumentada, Realidad Virtual y Simuladores para enseñanza y capacitación.' },

    // Página inicial
    'Ecossistema educacional imersivo': { en: 'Immersive educational ecosystem', es: 'Ecosistema educativo inmersivo' },
    'RA, RV e simuladores em um só lugar.': { en: 'AR, VR and simulators in one place.', es: 'RA, RV y simuladores en un solo lugar.' },
    'Explore experiências para Física, Matemática, Química, Biologia, Astronomia, Tecnologia e treinamento profissional. Encontre rapidamente o projeto ideal usando os filtros.': { en: 'Explore experiences for Physics, Mathematics, Chemistry, Biology, Astronomy, Technology and professional training. Quickly find the ideal project using the filters.', es: 'Explora experiencias de Física, Matemáticas, Química, Biología, Astronomía, Tecnología y capacitación profesional. Encuentra rápidamente el proyecto ideal usando los filtros.' },
    'Explorar experiências': { en: 'Explore experiences', es: 'Explorar experiencias' },
    'Realidade Aumentada': { en: 'Augmented Reality', es: 'Realidad Aumentada' },
    'Objetos 3D sobre o mundo real.': { en: '3D objects over the real world.', es: 'Objetos 3D sobre el mundo real.' },
    'Realidade Virtual': { en: 'Virtual Reality', es: 'Realidad Virtual' },
    'Ambientes imersivos e treinamentos.': { en: 'Immersive environments and training.', es: 'Entornos inmersivos y capacitaciones.' },
    'Simuladores': { en: 'Simulators', es: 'Simuladores' },
    'Parâmetros, gráficos e experimentos.': { en: 'Parameters, charts and experiments.', es: 'Parámetros, gráficos y experimentos.' },
    'Ensino & treinamento': { en: 'Education & training', es: 'Enseñanza y capacitación' },
    'Conteúdo acadêmico e profissional.': { en: 'Academic and professional content.', es: 'Contenido académico y profesional.' },
    'Projetos em ação': { en: 'Projects in action', es: 'Proyectos en acción' },
    'Veja como nossas experiências funcionam': { en: 'See how our experiences work', es: 'Mira cómo funcionan nuestras experiencias' },
    'Vídeos curtos para apresentar os projetos antes de explorar o catálogo completo.': { en: 'Short videos to introduce the projects before exploring the full catalog.', es: 'Videos cortos para presentar los proyectos antes de explorar el catálogo completo.' },
    'Ver todos os projetos': { en: 'View all projects', es: 'Ver todos los proyectos' },
    'Selecione uma experiência para abrir sua página completa em uma nova guia.': { en: 'Select an experience to open its full page in a new tab.', es: 'Selecciona una experiencia para abrir su página completa en una nueva pestaña.' },
    '☰ Filtros': { en: '☰ Filters', es: '☰ Filtros' },
    'Filtros': { en: 'Filters', es: 'Filtros' },
    'Limpar': { en: 'Clear', es: 'Limpiar' },
    'Tecnologia': { en: 'Technology', es: 'Tecnología' },
    'Área': { en: 'Area', es: 'Área' },
    'Nível': { en: 'Level', es: 'Nivel' },
    'Plataforma': { en: 'Platform', es: 'Plataforma' },
    'Status': { en: 'Status', es: 'Estado' },
    'Física': { en: 'Physics', es: 'Física' },
    'Matemática': { en: 'Mathematics', es: 'Matemáticas' },
    'Química': { en: 'Chemistry', es: 'Química' },
    'Biologia': { en: 'Biology', es: 'Biología' },
    'Astronomia': { en: 'Astronomy', es: 'Astronomía' },
    'Fundamental II': { en: 'Middle School', es: 'Secundaria básica' },
    'Ensino Médio': { en: 'High School', es: 'Bachillerato' },
    'Técnico': { en: 'Technical', es: 'Técnico' },
    'Superior': { en: 'Higher Education', es: 'Educación superior' },
    'Treinamento': { en: 'Training', es: 'Capacitación' },
    'Disponível': { en: 'Available', es: 'Disponible' },
    'Demonstração': { en: 'Demo', es: 'Demostración' },
    'Protótipo': { en: 'Prototype', es: 'Prototipo' },
    'experiências encontradas': { en: 'experiences found', es: 'experiencias encontradas' },
    'Nenhum projeto encontrado.': { en: 'No project found.', es: 'No se encontró ningún proyecto.' },
    'Ajuste os filtros para continuar.': { en: 'Adjust the filters to continue.', es: 'Ajusta los filtros para continuar.' },
    'Vídeo do projeto': { en: 'Project video', es: 'Video del proyecto' },
    'Adicione o arquivo MP4 deste projeto em': { en: 'Add this project MP4 file to', es: 'Agrega el archivo MP4 de este proyecto en' },

    // Página Sobre
    'Sobre o ImersaLab': { en: 'About ImersaLab', es: 'Acerca de ImersaLab' },
    'Um portal para experiências educacionais imersivas.': { en: 'A portal for immersive educational experiences.', es: 'Un portal para experiencias educativas inmersivas.' },
    'O projeto': { en: 'The project', es: 'El proyecto' },
    'O ImersaLab é um ecossistema de experiências educacionais que integra Realidade Aumentada, Realidade Virtual e Simuladores para aproximar conteúdos teóricos de situações práticas, experimentais e imersivas.': { en: 'ImersaLab is an ecosystem of educational experiences that integrates Augmented Reality, Virtual Reality and Simulators to connect theoretical content with practical, experimental and immersive situations.', es: 'ImersaLab es un ecosistema de experiencias educativas que integra Realidad Aumentada, Realidad Virtual y Simuladores para acercar contenidos teóricos a situaciones prácticas, experimentales e inmersivas.' },
    'O projeto nasceu da proposta de reunir, em um único ambiente, aplicativos e recursos digitais capazes de apoiar o ensino, o treinamento e a divulgação científica. Em vez de apenas apresentar informações, as experiências permitem que o usuário visualize modelos, manipule parâmetros, acompanhe fenômenos e explore conteúdos de forma mais ativa.': { en: 'The project was created to bring together, in one environment, applications and digital resources that support education, training and science communication. Instead of only presenting information, the experiences allow users to visualize models, manipulate parameters, observe phenomena and explore content more actively.', es: 'El proyecto nació con la propuesta de reunir, en un solo entorno, aplicaciones y recursos digitales capaces de apoyar la enseñanza, la capacitación y la divulgación científica. En lugar de solo presentar información, las experiencias permiten visualizar modelos, manipular parámetros, observar fenómenos y explorar contenidos de forma más activa.' },
    'Nosso ecossistema': { en: 'Our ecosystem', es: 'Nuestro ecosistema' },
    'Três tecnologias, diferentes formas de aprender.': { en: 'Three technologies, different ways to learn.', es: 'Tres tecnologías, diferentes formas de aprender.' },
    'Princípios do projeto': { en: 'Project principles', es: 'Principios del proyecto' },
    'Aprender fazendo': { en: 'Learning by doing', es: 'Aprender haciendo' },
    'Integração pedagógica': { en: 'Pedagogical integration', es: 'Integración pedagógica' },
    'Experimentação': { en: 'Experimentation', es: 'Experimentación' },
    'Colaboração': { en: 'Collaboration', es: 'Colaboración' },
    'Para quem é o ImersaLab?': { en: 'Who is ImersaLab for?', es: '¿Para quién es ImersaLab?' },
    'Professores que desejam tornar suas aulas mais interativas.': { en: 'Teachers who want to make their classes more interactive.', es: 'Docentes que desean hacer sus clases más interactivas.' },
    'Estudantes que aprendem melhor explorando e experimentando.': { en: 'Students who learn better by exploring and experimenting.', es: 'Estudiantes que aprenden mejor explorando y experimentando.' },
    'Escolas e instituições que buscam inovação educacional.': { en: 'Schools and institutions seeking educational innovation.', es: 'Escuelas e instituciones que buscan innovación educativa.' },
    'Projetos de ciência, tecnologia e divulgação científica.': { en: 'Science, technology and science communication projects.', es: 'Proyectos de ciencia, tecnología y divulgación científica.' },
    'Treinamento profissional': { en: 'Professional training', es: 'Capacitación profesional' },
    'Vamos construir novas experiências juntos.': { en: 'Let’s build new experiences together.', es: 'Construyamos nuevas experiencias juntos.' },
    'Entrar em contato': { en: 'Get in touch', es: 'Contactar' },
    'Ver integrantes': { en: 'Meet the team', es: 'Ver integrantes' },

    // Equipe
    'Nossa Equipe | ImersaLab': { en: 'Our Team | ImersaLab', es: 'Nuestro Equipo | ImersaLab' },
    'Pessoas por trás do projeto': { en: 'People behind the project', es: 'Personas detrás del proyecto' },
    'Quem faz parte do ImersaLab': { en: 'Who is part of ImersaLab', es: 'Quién forma parte de ImersaLab' },
    'O ImersaLab é construído por pessoas que acreditam no potencial da tecnologia para aproximar conhecimento, experimentação e aprendizagem. Nesta página, apresentamos os integrantes, suas áreas de atuação e como cada um contribui para o projeto.': { en: 'ImersaLab is built by people who believe in the potential of technology to bring knowledge, experimentation and learning closer together. On this page, we present the team members, their areas of work and how each one contributes to the project.', es: 'ImersaLab está construido por personas que creen en el potencial de la tecnología para acercar conocimiento, experimentación y aprendizaje. En esta página presentamos a los integrantes, sus áreas de actuación y cómo cada uno contribuye al proyecto.' },
    'Integrantes': { en: 'Team members', es: 'Integrantes' },
    'Nossa forma de trabalhar': { en: 'How we work', es: 'Nuestra forma de trabajar' },
    'Um projeto colaborativo': { en: 'A collaborative project', es: 'Un proyecto colaborativo' },
    'Conheça a nossa equipe.': { en: 'Meet our team.', es: 'Conoce a nuestro equipo.' },

    // Contato
    'Fale com o projeto': { en: 'Talk to the project team', es: 'Habla con el proyecto' },
    'Como podemos ajudar?': { en: 'How can we help?', es: '¿Cómo podemos ayudarte?' },
    'Entre em contato para tirar dúvidas, solicitar uma visita ao seu estabelecimento, propor parcerias ou sugerir novos aplicativos educacionais em Realidade Aumentada, Realidade Virtual e Simuladores.': { en: 'Get in touch to ask questions, request a visit to your institution, propose partnerships or suggest new educational applications in Augmented Reality, Virtual Reality and Simulators.', es: 'Ponte en contacto para resolver dudas, solicitar una visita a tu institución, proponer alianzas o sugerir nuevas aplicaciones educativas de Realidad Aumentada, Realidad Virtual y Simuladores.' },
    'Envie sua solicitação': { en: 'Send your request', es: 'Envía tu solicitud' },
    'Escolha o tipo de contato e preencha os campos abaixo.': { en: 'Choose the type of contact and fill in the fields below.', es: 'Elige el tipo de contacto y completa los campos a continuación.' },
    'Mensagem': { en: 'Message', es: 'Mensaje' },
    'Dúvidas, informações ou parcerias.': { en: 'Questions, information or partnerships.', es: 'Dudas, información o alianzas.' },
    'Solicitar visita': { en: 'Request a visit', es: 'Solicitar visita' },
    'Leve o projeto até sua instituição.': { en: 'Bring the project to your institution.', es: 'Lleva el proyecto a tu institución.' },
    'Sugerir aplicativo': { en: 'Suggest an app', es: 'Sugerir aplicación' },
    'Envie uma ideia para um novo projeto.': { en: 'Send an idea for a new project.', es: 'Envía una idea para un nuevo proyecto.' },
    'Nome completo *': { en: 'Full name *', es: 'Nombre completo *' },
    'E-mail *': { en: 'Email *', es: 'Correo electrónico *' },
    'Telefone / WhatsApp': { en: 'Phone / WhatsApp', es: 'Teléfono / WhatsApp' },
    'Cidade / Estado': { en: 'City / State', es: 'Ciudad / Estado' },
    'Informações para a visita': { en: 'Visit information', es: 'Información para la visita' },
    'Conte um pouco sobre a instituição e a visita desejada.': { en: 'Tell us a little about the institution and the desired visit.', es: 'Cuéntanos un poco sobre la institución y la visita deseada.' },
    'Nome do estabelecimento *': { en: 'Institution name *', es: 'Nombre de la institución *' },
    'Tipo de estabelecimento': { en: 'Institution type', es: 'Tipo de institución' },
    'Data preferencial': { en: 'Preferred date', es: 'Fecha preferida' },
    'Quantidade estimada de participantes': { en: 'Estimated number of participants', es: 'Cantidad estimada de participantes' },
    'Sugestão de novo aplicativo': { en: 'New app suggestion', es: 'Sugerencia de nueva aplicación' },
    'Ajude-nos a identificar novos conteúdos que podem se tornar experiências interativas.': { en: 'Help us identify new content that can become interactive experiences.', es: 'Ayúdanos a identificar nuevos contenidos que puedan convertirse en experiencias interactivas.' },
    'Nome sugerido para o aplicativo': { en: 'Suggested app name', es: 'Nombre sugerido para la aplicación' },
    'Área do conhecimento': { en: 'Field of knowledge', es: 'Área de conocimiento' },
    'Tecnologia sugerida': { en: 'Suggested technology', es: 'Tecnología sugerida' },
    'Público-alvo': { en: 'Target audience', es: 'Público objetivo' },
    'Mensagem *': { en: 'Message *', es: 'Mensaje *' },
    'Concordo em fornecer estes dados para que a equipe do ImersaLab possa entrar em contato comigo.': { en: 'I agree to provide this data so the ImersaLab team can contact me.', es: 'Acepto proporcionar estos datos para que el equipo de ImersaLab pueda contactarme.' },
    'Enviar mensagem': { en: 'Send message', es: 'Enviar mensaje' },
    'Destino:': { en: 'Destination:', es: 'Destino:' },
    'Mensagem ou parceria': { en: 'Message or partnership', es: 'Mensaje o alianza' },
    'Visitas': { en: 'Visits', es: 'Visitas' },
    'Novas ideias': { en: 'New ideas', es: 'Nuevas ideas' },
    'Contato direto': { en: 'Direct contact', es: 'Contacto directo' },

    // Doações
    'Ajude a educação imersiva a crescer': { en: 'Help immersive education grow', es: 'Ayuda a crecer la educación inmersiva' },
    'Apoie o desenvolvimento do ImersaLab': { en: 'Support ImersaLab development', es: 'Apoya el desarrollo de ImersaLab' },
    'Sua contribuição ajuda a criar novos aplicativos de Realidade Aumentada, Realidade Virtual, simuladores, materiais didáticos, cards e recursos gratuitos para estudantes e educadores.': { en: 'Your contribution helps create new Augmented Reality and Virtual Reality apps, simulators, teaching materials, cards and free resources for students and educators.', es: 'Tu contribución ayuda a crear nuevas aplicaciones de Realidad Aumentada y Virtual, simuladores, materiales didácticos, tarjetas y recursos gratuitos para estudiantes y educadores.' },
    'Escolha sua contribuição': { en: 'Choose your contribution', es: 'Elige tu contribución' },
    'Doação única': { en: 'One-time donation', es: 'Donación única' },
    'Mensal': { en: 'Monthly', es: 'Mensual' },
    'Outro valor': { en: 'Other amount', es: 'Otro valor' },
    'Continuar com a contribuição': { en: 'Continue with contribution', es: 'Continuar con la contribución' },
    'Sua contribuição': { en: 'Your contribution', es: 'Tu contribución' },
    'Forma de contribuição': { en: 'Contribution method', es: 'Forma de contribución' },
    'Pagamento online': { en: 'Online payment', es: 'Pago en línea' },
    'Como sua ajuda pode contribuir': { en: 'How your support can help', es: 'Cómo puede ayudar tu apoyo' },

    // Detalhes do projeto
    'Sobre a experiência': { en: 'About the experience', es: 'Acerca de la experiencia' },
    'Recursos de ensino': { en: 'Teaching resources', es: 'Recursos didácticos' },
    'Atividades': { en: 'Activities', es: 'Actividades' },
    'Plano de aula': { en: 'Lesson plan', es: 'Plan de clase' },
    'Como utilizar': { en: 'How to use', es: 'Cómo utilizar' },
    'Roteiros de aula': { en: 'Lesson scripts', es: 'Guiones de clase' },
    'Créditos': { en: 'Credits', es: 'Créditos' },
    'Tópicos trabalhados': { en: 'Topics covered', es: 'Temas trabajados' },
    'Conceitos principais': { en: 'Main concepts', es: 'Conceptos principales' },
    'Aplicações': { en: 'Applications', es: 'Aplicaciones' },
    'Curiosidade': { en: 'Did you know?', es: 'Curiosidad' },
    'Guia de estudo': { en: 'Study guide', es: 'Guía de estudio' },
    '📖 Guia de estudo': { en: '📖 Study guide', es: '📖 Guía de estudio' },
    '📖 Abrir guia de estudo': { en: '📖 Open study guide', es: '📖 Abrir guía de estudio' },
    '▶ Abrir experiência': { en: '▶ Open experience', es: '▶ Abrir experiencia' },
    '▶ Abrir simulador / experiência': { en: '▶ Open simulator / experience', es: '▶ Abrir simulador / experiencia' },
    '▶ Assistir ao vídeo explicativo': { en: '▶ Watch explainer video', es: '▶ Ver video explicativo' },
    '↓ Baixar card': { en: '↓ Download card', es: '↓ Descargar tarjeta' },
    '↓ Baixar atividade': { en: '↓ Download activity', es: '↓ Descargar actividad' },
    'Visualizar PDF': { en: 'View PDF', es: 'Ver PDF' },
    'Material para o professor': { en: 'Teacher material', es: 'Material para el docente' },
    'Atividade investigativa em PDF': { en: 'Inquiry activity in PDF', es: 'Actividad investigativa en PDF' },
    'Outras atividades sugeridas': { en: 'Other suggested activities', es: 'Otras actividades sugeridas' },
    'Baixe a atividade pronta para utilizar com a turma e, abaixo, consulte outras sugestões relacionadas à experiência.': { en: 'Download the ready-to-use classroom activity and see other suggestions related to the experience below.', es: 'Descarga la actividad lista para usar con la clase y consulta abajo otras sugerencias relacionadas con la experiencia.' },
    'Informações do projeto': { en: 'Project information', es: 'Información del proyecto' },
    'Tecnologia:': { en: 'Technology:', es: 'Tecnología:' },
    'Área:': { en: 'Area:', es: 'Área:' },
    'Nível:': { en: 'Level:', es: 'Nivel:' },
    'Compatibilidade:': { en: 'Compatibility:', es: 'Compatibilidad:' },
    'Voltar ao catálogo': { en: 'Back to catalog', es: 'Volver al catálogo' },

    // Simulador / guia
    'Tela cheia': { en: 'Full screen', es: 'Pantalla completa' },
    'Simulador': { en: 'Simulator', es: 'Simulador' },
    '← Voltar ao projeto': { en: '← Back to project', es: '← Volver al proyecto' },
    'Parâmetros': { en: 'Parameters', es: 'Parámetros' },
    'Ângulo de incidência': { en: 'Angle of incidence', es: 'Ángulo de incidencia' },
    'Índice do meio 2': { en: 'Medium 2 index', es: 'Índice del medio 2' },
    'Materiais': { en: 'Materials', es: 'Materiales' },
    'Estudo orientado': { en: 'Guided study', es: 'Estudio guiado' },
    'Guia de estudo ilustrado': { en: 'Illustrated study guide', es: 'Guía de estudio ilustrada' },

    // Estatísticas
    'CONTROLE DE ACESSOS': { en: 'ACCESS CONTROL', es: 'CONTROL DE ACCESOS' },
    'Estatísticas do ImersaLab': { en: 'ImersaLab Statistics', es: 'Estadísticas de ImersaLab' },
    'Visitantes, visualizações, origem geográfica e evolução diária usando os mesmos dados exibidos no painel da Vercel.': { en: 'Visitors, page views, geographic origin and daily trends using the same data shown in the Vercel dashboard.', es: 'Visitantes, visualizaciones, origen geográfico y evolución diaria usando los mismos datos mostrados en el panel de Vercel.' },
    'Atualizar dados': { en: 'Refresh data', es: 'Actualizar datos' },
    'Visitantes': { en: 'Visitors', es: 'Visitantes' },
    'VISITANTES': { en: 'VISITORS', es: 'VISITANTES' },
    'VISUALIZAÇÕES': { en: 'PAGE VIEWS', es: 'VISUALIZACIONES' },
    'Visualizações': { en: 'Page views', es: 'Visualizaciones' },
    'PÁGINAS POR VISITANTE': { en: 'PAGES PER VISITOR', es: 'PÁGINAS POR VISITANTE' },
    'LOCALIDADE': { en: 'LOCATION', es: 'LOCALIDAD' },
    'País dos visitantes': { en: 'Visitors’ country', es: 'País de los visitantes' },
    'Exibe o país com maior número de visitantes no período, usando os dados agregados do Vercel Web Analytics.': { en: 'Shows the country with the highest number of visitors in the period using aggregated Vercel Web Analytics data.', es: 'Muestra el país con mayor número de visitantes en el período usando datos agregados de Vercel Web Analytics.' },
    'EVOLUÇÃO NO PERÍODO': { en: 'TREND OVER THE PERIOD', es: 'EVOLUCIÓN EN EL PERÍODO' },
    'Acessos por dia': { en: 'Daily accesses', es: 'Accesos por día' },
    'Período': { en: 'Period', es: 'Período' },
    'Últimos 7 dias': { en: 'Last 7 days', es: 'Últimos 7 días' },
    'Últimos 14 dias': { en: 'Last 14 days', es: 'Últimos 14 días' },
    'Últimos 30 dias': { en: 'Last 30 days', es: 'Últimos 30 días' },
    'De': { en: 'From', es: 'Desde' },
    'Até': { en: 'To', es: 'Hasta' },
    'FONTE DOS DADOS': { en: 'DATA SOURCE', es: 'FUENTE DE DATOS' },
    'Vercel Web Analytics': { en: 'Vercel Web Analytics', es: 'Vercel Web Analytics' },
    'Carregando dados da Vercel…': { en: 'Loading Vercel data…', es: 'Cargando datos de Vercel…' },
    'Não há dados no período selecionado.': { en: 'No data for the selected period.', es: 'No hay datos para el período seleccionado.' },
    'Brasil': { en: 'Brazil', es: 'Brasil' },

    // Mensagens e botões gerais
    'Voltar ao site': { en: 'Back to site', es: 'Volver al sitio' },
    'VOLTAR AO SITE': { en: 'BACK TO SITE', es: 'VOLVER AL SITIO' },
    'Voltar para o site': { en: 'Back to site', es: 'Volver al sitio' },
    'Obrigado pelo contato!': { en: 'Thank you for contacting us!', es: '¡Gracias por contactarnos!' },
    'Mensagem enviada': { en: 'Message sent', es: 'Mensaje enviado' },
    'Sua mensagem foi encaminhada para o projeto ImersaLab. Retornaremos assim que possível.': { en: 'Your message has been sent to the ImersaLab project. We will get back to you as soon as possible.', es: 'Tu mensaje fue enviado al proyecto ImersaLab. Responderemos lo antes posible.' },
    'Enviar outra mensagem': { en: 'Send another message', es: 'Enviar otro mensaje' },

    // Projetos - resumos
    'Explore refração da luz, Lei de Snell, índices de refração e mudança do caminho óptico em diferentes meios.': { en: 'Explore light refraction, Snell’s Law, refractive indices and changes in the optical path through different media.', es: 'Explora la refracción de la luz, la Ley de Snell, los índices de refracción y el cambio de la trayectoria óptica en diferentes medios.' },
    'Visualize Sol, planetas, órbitas e movimentos em uma experiência de realidade aumentada baseada em cards.': { en: 'Visualize the Sun, planets, orbits and motion in a card-based augmented reality experience.', es: 'Visualiza el Sol, los planetas, las órbitas y los movimientos en una experiencia de realidad aumentada basada en tarjetas.' },
    'Monte e visualize moléculas em 3D, observando geometria molecular, átomos e ligações químicas.': { en: 'Build and visualize 3D molecules while observing molecular geometry, atoms and chemical bonds.', es: 'Construye y visualiza moléculas en 3D observando la geometría molecular, los átomos y los enlaces químicos.' },
    'Conheça os principais componentes de um computador e sua posição em uma montagem guiada.': { en: 'Learn about the main computer components and their position in a guided assembly.', es: 'Conoce los principales componentes de una computadora y su posición en un montaje guiado.' },
    'Ambiente virtual imersivo para realizar experimentos e observar fenômenos físicos em segurança.': { en: 'Immersive virtual environment for conducting experiments and safely observing physical phenomena.', es: 'Entorno virtual inmersivo para realizar experimentos y observar fenómenos físicos de forma segura.' },
    'Cenários imersivos para treinamento técnico, segurança e reconhecimento de equipamentos industriais.': { en: 'Immersive scenarios for technical training, safety and recognition of industrial equipment.', es: 'Escenarios inmersivos para capacitación técnica, seguridad y reconocimiento de equipos industriales.' },
    'Navegue por estruturas anatômicas tridimensionais e explore sistemas do corpo humano em escala ampliada.': { en: 'Navigate through three-dimensional anatomical structures and explore human body systems at an enlarged scale.', es: 'Navega por estructuras anatómicas tridimensionales y explora sistemas del cuerpo humano a escala ampliada.' },
    'Controle posição, velocidade e aceleração e acompanhe gráficos para estudar MU e movimento uniformemente variado.': { en: 'Control position, speed and acceleration and follow charts to study uniform and uniformly accelerated motion.', es: 'Controla posición, velocidad y aceleración y observa gráficos para estudiar movimiento uniforme y uniformemente variado.' },
    'Compare densidade, volume, peso e força de empuxo em diferentes fluidos com parâmetros ajustáveis.': { en: 'Compare density, volume, weight and buoyant force in different fluids using adjustable parameters.', es: 'Compara densidad, volumen, peso y fuerza de empuje en diferentes fluidos con parámetros ajustables.' },
    'Explore representações do átomo de hidrogênio e conceitos relacionados à estrutura atômica.': { en: 'Explore representations of the hydrogen atom and concepts related to atomic structure.', es: 'Explora representaciones del átomo de hidrógeno y conceptos relacionados con la estructura atómica.' },
    'Experimente forças opostas, resultante e equilíbrio de maneira lúdica e interativa.': { en: 'Experiment with opposing forces, net force and balance in a playful and interactive way.', es: 'Experimenta fuerzas opuestas, fuerza resultante y equilibrio de forma lúdica e interactiva.' },
    'Investigue formação de imagens e correções para miopia, hipermetropia e outros conceitos de óptica.': { en: 'Investigate image formation and corrections for myopia, hyperopia and other optics concepts.', es: 'Investiga la formación de imágenes y las correcciones para miopía, hipermetropía y otros conceptos de óptica.' },

    // Tópicos recorrentes
    'Refração da luz': { en: 'Light refraction', es: 'Refracción de la luz' },
    'Lei de Snell': { en: 'Snell’s Law', es: 'Ley de Snell' },
    'Índice de refração': { en: 'Refractive index', es: 'Índice de refracción' },
    'Ângulo de incidência': { en: 'Angle of incidence', es: 'Ángulo de incidencia' },
    'Ângulo de refração': { en: 'Angle of refraction', es: 'Ángulo de refracción' },
    'Sistema Solar': { en: 'Solar System', es: 'Sistema Solar' },
    'Órbitas': { en: 'Orbits', es: 'Órbitas' },
    'Rotação': { en: 'Rotation', es: 'Rotación' },
    'Translação': { en: 'Revolution', es: 'Traslación' },
    'Planetas': { en: 'Planets', es: 'Planetas' },
    'Moléculas': { en: 'Molecules', es: 'Moléculas' },
    'Geometria molecular': { en: 'Molecular geometry', es: 'Geometría molecular' },
    'Ligações químicas': { en: 'Chemical bonds', es: 'Enlaces químicos' },
    'Água': { en: 'Water', es: 'Agua' },
    'Modelos 3D': { en: '3D models', es: 'Modelos 3D' },
    'Movimento uniforme': { en: 'Uniform motion', es: 'Movimiento uniforme' },
    'Velocidade': { en: 'Speed', es: 'Velocidad' },
    'Aceleração': { en: 'Acceleration', es: 'Aceleración' },
    'Gráficos': { en: 'Charts', es: 'Gráficos' },
    'Densidade': { en: 'Density', es: 'Densidad' },
    'Princípio de Arquimedes': { en: 'Archimedes’ principle', es: 'Principio de Arquímedes' },
    'Fluidos': { en: 'Fluids', es: 'Fluidos' },
    'Forças': { en: 'Forces', es: 'Fuerzas' },
    'Força': { en: 'Force', es: 'Fuerza' },
    'Resultante': { en: 'Net force', es: 'Resultante' },
    'Equilíbrio': { en: 'Balance', es: 'Equilibrio' },
    'Leis de Newton': { en: 'Newton’s Laws', es: 'Leyes de Newton' },
    'Óptica': { en: 'Optics', es: 'Óptica' },
    'Miopia': { en: 'Myopia', es: 'Miopía' },
    'Hipermetropia': { en: 'Hyperopia', es: 'Hipermetropía' },
    'Lentes': { en: 'Lenses', es: 'Lentes' },
    'Formação de imagens': { en: 'Image formation', es: 'Formación de imágenes' },
    'Interativo': { en: 'Interactive', es: 'Interactivo' },
    'Áudio': { en: 'Audio', es: 'Audio' },
    'Offline': { en: 'Offline', es: 'Sin conexión' },

    // Selects e formulários
    'Selecione': { en: 'Select', es: 'Selecciona' },
    'Escola pública': { en: 'Public school', es: 'Escuela pública' },
    'Escola privada': { en: 'Private school', es: 'Escuela privada' },
    'Instituição de ensino técnico': { en: 'Technical education institution', es: 'Institución de educación técnica' },
    'Universidade / Faculdade': { en: 'University / College', es: 'Universidad / Facultad' },
    'Empresa': { en: 'Company', es: 'Empresa' },
    'Evento / Feira': { en: 'Event / Fair', es: 'Evento / Feria' },
    'Outro': { en: 'Other', es: 'Otro' },
    'Não sei / quero uma recomendação': { en: 'I don’t know / I want a recommendation', es: 'No sé / quiero una recomendación' }
  };

  const placeholders = {
    'Buscar experiência...': { en: 'Search experience...', es: 'Buscar experiencia...' },
    'Digite seu nome': { en: 'Enter your name', es: 'Escribe tu nombre' },
    'voce@email.com': { en: 'you@email.com', es: 'tu@email.com' },
    'Ex.: Lagarto - SE': { en: 'Ex.: Boston - MA', es: 'Ej.: Madrid' },
    'Escola, empresa, instituição...': { en: 'School, company, institution...', es: 'Escuela, empresa, institución...' },
    'Ex.: 30': { en: 'Ex.: 30', es: 'Ej.: 30' },
    'Ex.: Eletricidade AR': { en: 'Ex.: Electricity AR', es: 'Ej.: Electricidad RA' },
    'Ex.: Ensino Médio': { en: 'Ex.: High School', es: 'Ej.: Bachillerato' },
    'Escreva sua mensagem...': { en: 'Write your message...', es: 'Escribe tu mensaje...' }
  };

  const titles = {
    'Fechar vídeo': { en: 'Close video', es: 'Cerrar video' },
    'Instagram do ImersaLab': { en: 'ImersaLab Instagram', es: 'Instagram de ImersaLab' },
    'YouTube do ImersaLab': { en: 'ImersaLab YouTube', es: 'YouTube de ImersaLab' },
    'Facebook do ImersaLab': { en: 'ImersaLab Facebook', es: 'Facebook de ImersaLab' },
    'LinkedIn do ImersaLab': { en: 'ImersaLab LinkedIn', es: 'LinkedIn de ImersaLab' },
    'TikTok do ImersaLab': { en: 'ImersaLab TikTok', es: 'TikTok de ImersaLab' }
  };

  function translateExact(original, lang) {
    if (lang === DEFAULT_LANG) return original;
    const row = T[original];
    if (!row) return original;
    return row[lang] || original;
  }

  function preserveWhitespace(original, translated) {
    const lead = original.match(/^\s*/)?.[0] || '';
    const tail = original.match(/\s*$/)?.[0] || '';
    return lead + translated + tail;
  }

  function translateTextNode(node, lang) {
    if (!node || !node.nodeValue) return;
    const parent = node.parentElement;
    if (!parent || ['SCRIPT','STYLE','CODE','PRE'].includes(parent.tagName)) return;
    if (parent.closest('[data-no-i18n]')) return;

    if (node.__imersalabOriginal === undefined) node.__imersalabOriginal = node.nodeValue;
    const originalRaw = node.__imersalabOriginal;
    const original = originalRaw.trim();
    if (!original) return;
    const translated = translateExact(original, lang);
    node.nodeValue = preserveWhitespace(originalRaw, translated);
  }

  function translateAttributes(el, lang) {
    if (!(el instanceof Element)) return;
    if (el.dataset.noI18n !== undefined) return;

    ['placeholder', 'title', 'aria-label'].forEach(attr => {
      if (!el.hasAttribute(attr)) return;
      const prop = `__imersalab_${attr}`;
      if (el[prop] === undefined) el[prop] = el.getAttribute(attr);
      const original = el[prop];
      const source = attr === 'placeholder' ? placeholders : titles;
      const row = source[original] || T[original];
      el.setAttribute(attr, lang === DEFAULT_LANG ? original : (row?.[lang] || original));
    });
  }

  function translateTree(root, lang) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root, lang);
      return;
    }
    if (!(root instanceof Element || root instanceof Document || root instanceof DocumentFragment)) return;

    if (root instanceof Element) translateAttributes(root, lang);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE) translateTextNode(node, lang);
      else translateAttributes(node, lang);
    }
  }

  function setLanguage(lang) {
    if (!languages[lang]) lang = DEFAULT_LANG;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    if (document.title) {
      if (document.__imersalabTitleOriginal === undefined) document.__imersalabTitleOriginal = document.title;
      document.title = translateExact(document.__imersalabTitleOriginal, lang);
    }
    translateTree(document.body, lang);
    document.querySelectorAll('.language-selector').forEach(s => s.value = lang);
    document.querySelectorAll('[data-language-current]').forEach(el => {
      el.textContent = `${languages[lang].flag} ${languages[lang].short}`;
    });
    document.dispatchEvent(new CustomEvent('imersalab:languagechange', { detail: { lang } }));
  }

  function createPicker() {
    if (document.querySelector('.language-picker')) return;
    const wrap = document.createElement('div');
    wrap.className = 'language-picker';
    wrap.setAttribute('aria-label', 'Idioma / Language / Idioma');
    wrap.innerHTML = `
      <span class="language-globe" aria-hidden="true">🌐</span>
      <select class="language-selector" aria-label="Selecionar idioma" data-no-i18n>
        <option value="pt-BR">🇧🇷 Português</option>
        <option value="en">🇺🇸 English</option>
        <option value="es">🇪🇸 Español</option>
      </select>`;

    const nav = document.querySelector('.topbar .nav') || document.querySelector('.sim-top .container');
    if (nav) nav.appendChild(wrap);
    else {
      wrap.classList.add('language-picker-floating');
      document.body.appendChild(wrap);
    }

    const select = wrap.querySelector('select');
    select.addEventListener('change', e => setLanguage(e.target.value));
  }

  function init() {
    createPicker();
    const lang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    setLanguage(lang);

    const observer = new MutationObserver(mutations => {
      const current = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
      for (const m of mutations) {
        m.addedNodes.forEach(n => translateTree(n, current));
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.ImersaLabIdioma = { setLanguage, languages };
})();
