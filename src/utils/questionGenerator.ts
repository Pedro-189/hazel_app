import { Question, QuestionCategory } from '../types/qa';

const PROMPT_TEMPLATES: Record<string, { intros: string[]; subjects: string[]; questions: string[]; emojis: string[]; colors: string[] }> = {
  romance: {
    intros: [
      'Si tuvieras que describir en tres palabras lo que sientes cuando',
      '¿Qué pequeño gesto o detalle entre nosotros hace que',
      'Si pudieras revivir en cámara lenta cualquier momento en que',
      '¿En qué situación específica sentiste con mayor fuerza que',
      'Si tuvieras que escribirnos una promesa secreta para',
    ],
    subjects: [
      'escuchas mi voz al final de un día largo y agotador',
      'nos miramos a los ojos sabiendo lo que piensa el otro',
      'planeamos nuestro próximo abrazo sin importar la distancia',
      'recibes un mensaje cariñoso en el momento exacto',
      'recordamos el primer día en que todo empezó a tener sentido',
    ],
    questions: [
      '¿cómo me lo explicarías?',
      '¿qué es lo que más te conmueve el corazón?',
      '¿qué significado especial tiene para ti hoy en día?',
      '¿de qué forma sientes que transforma tu día?',
      '¿qué le dirías a tu corazón en ese instante?',
    ],
    emojis: ['💖', '🌸', '✨', '💌', '🌹'],
    colors: ['#FF6B8B', '#FF8E72', '#FFAAA6'],
  },
  future: {
    intros: [
      'Cuando finalmente vivamos juntos y tengamos nuestra propia rutina,',
      'Si cerramos los ojos y visualizamos nuestro hogar dentro de varios años,',
      'En nuestro primer viaje largo recorriendo una ciudad desconocida,',
      'El día en que alcances tu mayor meta profesional o personal,',
      'Si tuviéramos un rincón sagrado en nuestra casa dedicado a nosotros,',
    ],
    subjects: [
      '¿qué pequeña costumbre de las mañanas te gustaría que nunca falte?',
      '¿qué rincón o espacio especial diseñarías pensando solo en nosotros dos?',
      '¿qué aventura o anécdota loca sueñas que vivamos juntos?',
      '¿cómo te gustaría que yo celebre ese logro contigo?',
      '¿qué objeto, foto o recuerdo pondrías en el lugar principal?',
    ],
    questions: [
      '¿y qué emoción te produce imaginarlo?',
      '¿cómo crees que eso fortalecerá aún más nuestro equipo?',
      '¿y qué es lo primero que harías al despertarte a mi lado?',
      '¿cómo te imaginas esa noche perfecta?',
    ],
    emojis: ['🌌', '✈️', '🏡', '🪐', '🌟'],
    colors: ['#8AADF4', '#7DC4E4', '#91D7E3'],
  },
  spicy: {
    intros: [
      'Cuando estemos a solas en nuestra habitación con las luces tenues,',
      'Si pudieras pedirme un deseo atrevido sin ninguna censura para nuestra próxima noche,',
      '¿Qué recuerdo de caricias o besos nuestros te provoca más sensaciones',
      'Si tuviéramos 24 horas encerrados en un hotel boutique sin salir de la cama,',
      '¿Qué ropa, perfume o actitud mía te hace sentir más atracción',
    ],
    subjects: [
      '¿qué caricia o juego lento te gustaría que dure más tiempo?',
      '¿cuál sería y cómo te gustaría que lo cumplamos juntos?',
      'cuando estás solo/a en la noche recordándome?',
      '¿cómo empezaríamos y qué detalles harían la noche inolvidable?',
      'y te despierta más ganas de abrazarme fuerte?',
    ],
    questions: [
      '¿te atreverías a confesármelo con todos los detalles?',
      '¿qué suspiro o sensación te provoca pensarlo ahora mismo?',
      '¿qué es lo que más extrañas de mi piel y mis labios?',
    ],
    emojis: ['🌶️', '🔥', '💋', '😈', '🍷'],
    colors: ['#E63946', '#D90429', '#EF233C'],
  },
  deep: {
    intros: [
      'En tus momentos de mayor introspección y silencio personal,',
      '¿Qué lección sobre la paciencia y la madurez emocional',
      'Si pudieras sanar cualquier herida o miedo del pasado gracias a nuestro amor,',
      '¿De qué manera sientes que nos complementamos en nuestras diferencias',
      '¿Qué verdad sobre ti mismo/a has aprendido a aceptar con orgullo',
    ],
    subjects: [
      '¿qué es lo que más agradeces de tener a alguien que te entienda como yo?',
      'sientes que este tiempo juntos te ha enseñado de forma más profunda?',
      '¿cuál sería y cómo te ayudo a sentirte más seguro/a día tras día?',
      'para ser dos personas más completas y en paz?',
      'desde que estamos construyendo este camino juntos?',
    ],
    questions: [
      '¿y qué te hace sentir esa certeza en el alma?',
      '¿cómo sientes que eso moldea tu futuro?',
      '¿qué te gustaría prometerme para cuidar siempre este vínculo?',
    ],
    emojis: ['🧠', '🧘', '🕯️', '💎', '🌿'],
    colors: ['#C6A0F6', '#B7BDF8', '#CBA6F7'],
  },
  fun: {
    intros: [
      'Si tuviéramos que participar en un reality show de parejas locas,',
      'Si pudieras cambiar una ley del universo exclusivamente para nosotros dos,',
      'En un concurso de comida callejera o postres raros a ciegas,',
      'Si nos despertáramos con la habilidad de hablar con las mascotas de la casa,',
      'Si fuéramos personajes de un videojuego de aventuras cooperativo,',
    ],
    subjects: [
      '¿cuál sería nuestra estrategia para ganar sin pelear por tonterías?',
      '¿qué regla absurda pondrías para nuestras citas a distancia?',
      '¿quién comería más y quién terminaría pidiendo auxilio?',
      '¿qué quejas graciosas crees que nos diría nuestro gatito o perrito?',
      '¿qué poder especial tendría cada uno para salvar al otro?',
    ],
    questions: [
      '¿y qué apodo cómico nos pondría el público?',
      '¿te animarías a probarlo conmigo en nuestro próximo viaje?',
      '¿y cómo lo celebraríamos al final?',
    ],
    emojis: ['🎭', '🍕', '🎮', '🦄', '🍿'],
    colors: ['#A6DA95', '#8BD5CA', '#99D1DB'],
  },
};

export const generateInfiniteQuestion = (
  themeKey: 'romance' | 'future' | 'spicy' | 'deep' | 'fun' = 'romance'
): Question => {
  const tmpl = PROMPT_TEMPLATES[themeKey] || PROMPT_TEMPLATES.romance;
  const intro = tmpl.intros[Math.floor(Math.random() * tmpl.intros.length)];
  const subject = tmpl.subjects[Math.floor(Math.random() * tmpl.subjects.length)];
  const questionEnding = tmpl.questions[Math.floor(Math.random() * tmpl.questions.length)];
  const emoji = tmpl.emojis[Math.floor(Math.random() * tmpl.emojis.length)];
  const color = tmpl.colors[Math.floor(Math.random() * tmpl.colors.length)];

  const fullPrompt = `${intro} ${subject}, ${questionEnding}`;

  const categoryMap: Record<string, QuestionCategory> = {
    romance: 'intimacy',
    future: 'dreams',
    spicy: 'spicy',
    deep: 'deep',
    fun: 'fun',
  };

  const labelMap: Record<string, string> = {
    romance: 'Generada: Amor & Pasión',
    future: 'Generada: Sueños Compartidos',
    spicy: 'Generada: Química Íntima',
    deep: 'Generada: Reflexión & Alma',
    fun: 'Generada: Risas & Locuras',
  };

  return {
    id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    category: categoryMap[themeKey] || 'intimacy',
    categoryLabel: labelMap[themeKey] || 'Generada para Ustedes',
    categoryEmoji: emoji,
    accentColor: color,
    title: `Chispa de ${labelMap[themeKey].split(':')[1]?.trim() || 'Amor'}`,
    prompt: fullPrompt,
    isCustom: true,
    rewardHearts: 35,
  };
};
