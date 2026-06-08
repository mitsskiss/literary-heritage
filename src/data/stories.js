function getStatusTone(status = "") {
  const normalized = status.toLowerCase();

  if (normalized.startsWith("correct")) return "correct";
  if (normalized.includes("partially")) return "partial";
  return "incorrect";
}

function createSceneChoice(id, label, xp, status, explanation, characterInsight, canonNote) {
  return {
    id,
    label,
    xp,
    result: {
      status,
      explanation,
      characterInsight,
      canonNote,
      tone: getStatusTone(status),
      isCorrect: getStatusTone(status) === "correct",
    },
  };
}

function createStoryChapter({
  id,
  workId,
  chapterNumber = 1,
  chapterTitle,
  shortTitle,
  tagline,
  estimatedMinutes = 10,
  completionXp = 36,
  scenes,
}) {
  return {
    id,
    workId,
    chapterNumber,
    chapterTitle,
    shortTitle: shortTitle ?? chapterTitle,
    tagline,
    estimatedMinutes,
    completionXp,
    scenes,
  };
}

const manualChapterStories = [
  createStoryChapter({
    id: "abai-words",
    workId: "abai-words",
    chapterTitle: "Алғашқы он сөз",
shortTitle: "1–10 сөз",
tagline: "Абайдың ой, қоғам, білім және адамдық туралы алғашқы он толғауы",
estimatedMinutes: 35,
completionXp: 120,
scenes: [
      {
        id: "abai-word-01",
        sceneNumber: 1,
        title: {
          kk: "1-сахна — Оқудың басталуы",
          ru: "Сцена 1 — Начало учения",
          en: "Scene 1 — The Beginning of Learning"
        },
        displayTitle: {
          kk: "1-сөз",
          ru: "Слово 1",
          en: "Word 1"
        },
        explanation: {
          kk: "Бірінші сөзде Абай өз өміріне есеп беріп, бұрынғы әурешілік пен тартыстың рухани өсім бермегенін көреді. Ол ел басқару, мал бағу, ғылым бағу, дін мен ғибадат жолын ұстану сияқты мүмкін жолдарды ой елегінен өткізеді. Бірақ мұның бәрін сыртқы қызмет ретінде емес, жауапкершілік пен өзін-өзі тану өлшемі арқылы бағалайды. Ақыры ойына келген сөзді қағазға түсіруді таңдайды: бұл бос ермек емес, болашақ оқырманға ғибрат қалдыру әрекеті.",
          ru: "В первом слове Абай подводит итог прожитой жизни и видит, что прежняя суета и споры не дали настоящего духовного роста. Он обдумывает разные пути: управление людьми, хозяйство, стремление к науке, религиозное служение и воспитание детей. Но оценивает их не как внешние занятия, а через ответственность и самопознание. В конце он выбирает письмо: это не пустое развлечение, а попытка оставить будущему читателю нравственный урок.",
          en: "In the first word, Abai takes account of his life and sees that restless disputes have not produced real inner growth. He considers public leadership, managing wealth, pursuing knowledge, religious devotion, and raising children. Yet he judges these paths through responsibility and self-knowledge, not as mere outward occupations. In the end he chooses writing: not idle pastime, but an attempt to leave moral guidance for a future reader."
        },
        mainIdea: {
          kk: "Абай үшін жазу — ақыл мен жауапкершілікті сақтап, адамшылыққа қажет ғибрат қалдыру жолы.",
          ru: "Для Абая письмо — способ сохранить разумную мысль, ответственность и нравственный урок для будущего читателя.",
          en: "For Abai, writing preserves reasoned thought, responsibility, and moral guidance for the reader who may need it."
        },
        historicalContext: {
          kk: "Бұл кіріспе сөз Абайдың кейінгі моральдық-философиялық толғаныстарына негіз болады. XIX ғасырдағы дала қоғамында билікке талас, малқұмарлық, надандық және жалған мақтан күшейген кезде, Абай тікелей айтыстан гөрі жазбаша ой қалдыруды маңызды санайды.",
          ru: "Это вступительное слово задаёт основание для последующих нравственно-философских размышлений Абая. В степном обществе XIX века усиливались борьба за влияние, зависимость от богатства, невежество и ложная гордость; поэтому Абай выбирает письменное размышление вместо очередного спора.",
          en: "This introductory word sets the basis for Abai’s later moral and philosophical reflections. In nineteenth-century steppe society, struggles for influence, attachment to wealth, ignorance, and false pride were strong; Abai therefore chooses reflective writing rather than another public quarrel."
        },
        themes: ["Өзін-өзі тану", "Ғибрат", "Жауапкершілік", "Рухани өсу"],
        keywords: ["әурешілік", "ғылым", "ғибадат", "ғибрат", "жауапкершілік"],
        difficultWords: {
          kk: [
            {
              term: "әурешілік",
              forms: ["әурешілікті"],
              meaning: "Бос әуреге салынып, маңызды іске көңіл бөлмеу.",
              note: "Абай бұл ұғымды адамның уақытын ұсақ тартысқа жұмсап, рухани өсуге күш қалдырмауы ретінде қолданады."
            },
            {
              term: "жауапкершілік",
              meaning: "Сөз, білім, ғибадат және елге ақыл айту сияқты істерді ішкі адалдықпен атқару міндеті.",
              note: "Бұл жерде жауапкершілік сыртқы міндет емес, адамның өз өміріне есеп беру өлшемі."
            },
            {
              term: "ғибадат",
              meaning: "Ниет, тәртіп және нәпсіні тәрбиелеумен байланысты рухани амал.",
              note: "Абай үшін ғибадат тек рәсім емес, адамның ішкі тазалығын қажет ететін жол."
            },
            {
              term: "ғибрат",
              forms: ["ғибратты"],
              meaning: "Мінезді түзетуге және ойды тереңдетуге бағытталған өнеге.",
              note: "Абай жазуды болашақ оқырманға ғибрат қалдырудың бір тәсілі ретінде көреді."
            }
          ],
          ru: [
            {
              term: "суета",
              forms: ["суеты"],
              meaning: "Пустая занятость и борьба, отвлекающая человека от главного.",
              note: "В контексте Абая это потеря внутреннего направления, а не просто активная жизнь."
            },
            {
              term: "ответственность",
              forms: ["ответственности"],
              meaning: "Готовность отвечать за слово, поступок и выбранный жизненный путь.",
              note: "Абай связывает ответственность с самопознанием и честным отношением к мысли."
            },
            {
              term: "назидание",
              forms: ["назидательное"],
              meaning: "Нравственное наставление, которое помогает читателю переосмыслить себя.",
              note: "Здесь назидательность не сухая мораль, а попытка оставить полезный духовный опыт."
            },
            {
              term: "религиозное служение",
              forms: ["религиозное"],
              meaning: "Духовная практика, требующая намерения, дисциплины и внутренней честности.",
              note: "В этом фрагменте она названа рядом с наукой и наставлением народа как серьёзная ответственность."
            }
          ],
          en: [
            {
              term: "vanity",
              forms: ["restless"],
              meaning: "Pointless concern with rivalry, appearances, or empty activity.",
              note: "In Abai’s context, this is a distraction from moral and intellectual growth."
            },
            {
              term: "responsibility",
              meaning: "The duty to treat speech, knowledge, and devotion with inner honesty.",
              note: "Abai frames responsibility as a measure of self-knowledge, not as an external rule."
            },
            {
              term: "devotion",
              meaning: "A disciplined spiritual commitment rather than a merely outward ritual.",
              note: "The word appears beside knowledge and public counsel to show the seriousness of the path."
            },
            {
              term: "edification",
              forms: ["instructive"],
              meaning: "Moral instruction that helps the reader reconsider character and direction.",
              note: "Abai’s writing aims to leave this kind of useful guidance for the future reader."
            }
          ]
        },
        context: [
          {
            kk: "Бұл жасқа келгенше жақсы өткіздік пе, жаман өткіздік пе, әйтеуір бірталай өмірімізді өткіздік: алыстық, жұлыстық, айтыстық, тартыстық — әурешілікті көре-көре келдік.",
            ru: "Дожив до этого возраста, хорошо ли мы прожили или плохо — так или иначе, значительная часть жизни уже прошла: спорили, боролись, тянули каждый в свою сторону, видели много суеты и пустой борьбы.",
            en: "Having reached this age, whether we lived well or badly, a large part of life has already passed: we argued, struggled, competed, and saw much restless conflict."
          },
          {
            kk: "Ақыры ойладым: осы ойыма келген нәрселерді қағазға жаза берейін, ақ қағаз бен қара сияны ермек қылайын, кімде-кім ішінен керекті сөз тапса, жазып алсын, я оқысын.",
            ru: "В конце концов я решил: буду записывать на бумаге мысли, которые приходят мне в голову; пусть белая бумага и чёрные чернила станут моим занятием. Если кто-то найдёт среди них нужное слово, пусть запишет его или прочитает.",
            en: "In the end, I decided to write down the thoughts that come to my mind. Let white paper and black ink become my occupation. If someone finds a useful word among them, let them write it down or read it."
          }
        ],
        fragment: {
          text: {
            kk: "Бұл жасқа келгенше жақсы өткіздік пе, жаман өткіздік пе, әйтеуір бірталай өмірімізді өткіздік: алыстық, жұлыстық, айтыстық, тартыстық — әурешілікті көре-көре келдік. Ғылым бағу, дін мен ғибадат жолын ұстану, елге ақыл айту — бәрі де жауапкершілік сұрайды. Ақыры ойладым: осы ойыма келген нәрселерді қағазға жаза берейін, кімде-кім ішінен ғибратты сөз тапса, жазып алсын, я оқысын.",
            ru: "Дожив до этого возраста, хорошо ли мы прожили или плохо — так или иначе, большая часть жизни уже прошла: мы спорили, боролись, тянули каждый в свою сторону и видели много суеты. Стремление к науке, религиозное служение, наставление народа — всё это требует ответственности. В конце концов я решил записывать мысли, которые приходят мне в голову: если кто-то найдёт среди них назидательное слово, пусть прочитает или запишет его.",
            en: "Having reached this age, whether we lived well or badly, a large part of life has already passed: we argued, struggled, competed, and saw much restless confusion. Pursuing knowledge, religious devotion, and advising the people all demand responsibility. In the end, I decided to write down the thoughts that come to my mind. If someone finds a morally instructive word among them, let them read it or write it down."
          },
          annotations: [
            {
              word: {
                kk: "әурешілікті",
                ru: "суеты",
                en: "restless"
              },
              explanation: {
                kk: "Әурешілік — босқа шаршау, мәнсіз тартыс, адамның өмірін ұсақ дауларға жұмсауы.",
                ru: "Әурешілік — суета, пустая борьба и трата жизни на мелкие конфликты без настоящего смысла.",
                en: "Aureshilik means restless fuss, empty struggle, and wasting life on conflicts without deeper meaning."
              }
            },
            {
              word: {
                kk: "жауапкершілік",
                ru: "ответственности",
                en: "responsibility"
              },
              explanation: {
                kk: "Жауапкершілік — Абайда сөз айту, ғылым іздеу немесе ғибадат ету сияқты істердің бәрін ішкі адалдықпен атқару міндеті.",
                ru: "Ответственность у Абая — обязанность совершать слово, поиск знания или религиозное служение с внутренней честностью.",
                en: "Responsibility for Abai is the duty to approach speech, the search for knowledge, or devotion with inner honesty."
              }
            },
            {
              word: {
                kk: "ғибадат",
                ru: "религиозное",
                en: "devotion"
              },
              explanation: {
                kk: "Ғибадат — тек сыртқы діни рәсім емес, ниет, жауапкершілік және адамның өз нәпсісін тәрбиелеуімен байланысты рухани амал.",
                ru: "Ғибадат — не только внешний религиозный обряд, а духовное действие, связанное с намерением, ответственностью и воспитанием собственной души.",
                en: "Ghibadat is not merely outward ritual; it is a spiritual act tied to intention, responsibility, and disciplining the self."
              }
            },
            {
              word: {
                kk: "ғибратты",
                ru: "назидательное",
                en: "instructive"
              },
              explanation: {
                kk: "Ғибрат — оқырманға мінезін, ақылын және өмірлік бағытын қайта қарауға түрткі болатын терең өнеге.",
                ru: "Ғибрат — нравственный урок, который побуждает читателя пересмотреть характер, разум и жизненное направление.",
                en: "Ghibat is moral instruction that pushes the reader to reconsider character, reason, and the direction of life."
              }
            },
            {
              word: {
                kk: "ойыма",
                ru: "мысли",
                en: "thoughts"
              },
              explanation: {
                kk: "Ой — Абайда жай пікір емес, адамның өзін, қоғамды және өмірдің мағынасын түсінуге бағытталған ішкі еңбек.",
                ru: "Ой у Абая — не случайное мнение, а внутренняя работа человека над пониманием себя, общества и смысла жизни.",
                en: "For Abai, thought is not a random opinion, but an inner effort to understand oneself, society, and the meaning of life."
              }
            },
            {
              word: {
                kk: "тартыстық",
                ru: "боролись",
                en: "struggled"
              },
              explanation: {
                kk: "Тартысу — Абай мәтінінде тек дауласу емес, адамның күшін рухани өсуге емес, бәсеке мен қажытатын қақтығысқа жұмсауы.",
                ru: "Тартысу здесь означает не только спор, а изматывающую борьбу, в которой человек тратит силы не на внутренний рост, а на соперничество.",
                en: "Struggle here is not noble effort, but exhausting contention that spends human energy on rivalry instead of inner growth."
              }
            }
          ]
        },
        prompt: {
          kk: "Бірінші сөзде Абай жазуды не үшін таңдайды?",
          ru: "Почему в первом слове Абай выбирает письмо?",
          en: "Why does Abai choose writing in the first word?"
        },
        choices: [
          createSceneChoice(
            "writing-as-reflection",
            {
              kk: "A. Ойды сақтап, керегі бар адамға жеткізу үшін.",
              ru: "A. Чтобы сохранить мысль и передать её тому, кому она окажется нужной.",
              en: "A. To preserve thought and pass it on to someone who may need it."
            },
            12,
            "correct",
            {
              kk: "Дұрыс. Абай жазуды ойды жоғалтпай, болашақ оқырманға қалдыру жолы ретінде таңдайды.",
              ru: "Верно. Абай выбирает письмо как способ не потерять мысль и оставить её будущему читателю.",
              en: "Correct. Abai chooses writing as a way to preserve thought and leave it for a future reader."
            },
            {
              kk: "Бұл жерде жазу — адамның өз өміріне есеп беруінің белгісі.",
              ru: "Здесь письмо становится формой внутреннего отчёта перед самим собой.",
              en: "Here writing becomes a form of inner self-accounting."
            },
            {
              kk: "Бірінші сөз бүкіл «Қара сөздердің» кіріспелік кілті болып тұр.",
              ru: "Первое слово работает как вступительный ключ ко всему циклу.",
              en: "The first word functions as an introductory key to the whole cycle."
            }
          ),
          createSceneChoice(
            "escape",
            {
              kk: "B. Елден толық безіп, ешкіммен сөйлеспеу үшін.",
              ru: "B. Чтобы полностью отстраниться от людей и больше ни с кем не говорить.",
              en: "B. To withdraw from people completely and stop speaking to anyone."
            },
            5,
            "partially correct",
            {
              kk: "Абай шаршағанын айтады, бірақ ол үнсіз қалмайды. Керісінше, жазу арқылы оқырманға жол ашады.",
              ru: "Абай действительно говорит об усталости, но он не выбирает молчание. Наоборот, через письмо он всё равно обращается к читателю.",
              en: "Abai does express exhaustion, but he does not choose silence. Through writing, he still addresses the reader."
            },
            {
              kk: "Шаршау мұнда ойды жинақтауға алып келеді.",
              ru: "Усталость здесь приводит не к бегству, а к собиранию мысли.",
              en: "Exhaustion here leads not to escape, but to the gathering of thought."
            },
            {
              kk: "Бұл Абайдың қоғамнан безуі емес, қоғаммен басқа түрде сөйлесуі.",
              ru: "Это не отказ от общества, а другой способ разговора с ним.",
              en: "This is not a rejection of society, but another way of speaking to it."
            }
          ),
          createSceneChoice(
            "idle-entertainment",
            {
              kk: "C. Жазу тек уақыт өткізу үшін керек.",
              ru: "C. Письмо нужно только для того, чтобы занять свободное время.",
              en: "C. Writing is only a way to pass the time."
            },
            3,
            "not quite accurate",
            {
              kk: "Жоқ. «Ермек» сөзі қолданылғанымен, Абайдың жазуы бос уақыт өткізу емес, ой еңбегі.",
              ru: "Нет. Хотя Абай употребляет слово “занятие”, его письмо — это не пустое времяпрепровождение, а труд мысли.",
              en: "No. Although Abai calls it an occupation, writing is not empty entertainment, but intellectual labor."
            },
            {
              kk: "Ойды қағазға түсіру — жауапкершілік.",
              ru: "Записать мысль — значит взять за неё ответственность.",
              en: "To write down a thought is to take responsibility for it."
            },
            {
              kk: "Сондықтан бірінші сөз шығарманың мағыналық бастамасы болады.",
              ru: "That is why the first word becomes the semantic beginning of the work.",
              en: "That is why the first word becomes the meaningful beginning of the work."
            }
          ),
        ],
      },
            {
        id: "abai-word-02",
        sceneNumber: 2,
        title: {
          kk: "2-сахна — Өзгеден ғибрат алу",
          ru: "Сцена 2 — Урок через сравнение",
          en: "Scene 2 — Learning Through Comparison"
        },
        displayTitle: {
          kk: "2-сөз",
          ru: "Слово 2",
          en: "Word 2"
        },
        explanation: {
          kk: "Екінші сөзде Абай балалық кездегі жалған мақтанды еске түсіріп, оны ересек ақылмен қайта қарайды. Ол сарт, ноғай, орыс сияқты халықтардың еңбегіне, кәсібіне, саудасына, өнеріне және тәртібіне назар аударады. Мұндағы салыстыру бір халықты төмендету үшін емес, қазақтың өз бойындағы надандық, әуесқойлық және бос мақтанды тануы үшін керек. Абай үшін өзгенің жақсысынан ғибрат алу — рухани өсудің белгісі.",
          ru: "Во втором слове Абай вспоминает детскую ложную гордость и пересматривает её зрелым разумом. Он обращает внимание на труд, ремесло, торговлю, мастерство и дисциплину сартов, ногайцев и русских. Сравнение нужно не для унижения одного народа, а для того, чтобы казахское общество увидело собственное невежество, поверхностное любопытство и пустое самодовольство. Для Абая учиться у сильных сторон других — признак духовного роста.",
          en: "In the second word, Abai recalls childish false pride and reconsiders it with mature judgment. He notices the labor, craft, trade, skill, and discipline of Sarts, Nogais, and Russians. The comparison is not meant to humiliate one people, but to help Kazakh society recognize its own ignorance, shallow curiosity, and empty pride. For Abai, learning from the strengths of others is a sign of spiritual growth."
        },
        mainIdea: {
          kk: "Өзгені кемсіту адамшылықты өсірмейді; шынайы ақыл өз кемшілігін көріп, еңбек пен өнерден ғибрат алудан басталады.",
          ru: "Унижение других не развивает человечность; зрелый разум начинается с признания своих недостатков и обучения труду, ремеслу и полезному примеру.",
          en: "Looking down on others does not deepen humanity; mature reason begins with seeing one’s own flaws and learning from labor, craft, and useful example."
        },
        historicalContext: {
          kk: "XIX ғасырда қазақ даласы отырықшы қала мәдениетімен, сауда жолдарымен, орыс әкімшілігімен және Орта Азия халықтарының кәсібімен жиі ұшырасты. Абай осы тарихи түйісуді рухани айнаға айналдырады: өзгені көргенде ұлт өз мінезін де көруі керек.",
          ru: "В XIX веке казахская степь всё теснее соприкасалась с городской оседлой культурой, торговыми путями, российской администрацией и ремесленным опытом народов Средней Азии. Абай превращает это историческое столкновение в духовное зеркало: видя других, народ должен увидеть и собственный характер.",
          en: "In the nineteenth century, the Kazakh steppe increasingly encountered settled urban culture, trade routes, Russian administration, and the craft traditions of Central Asian peoples. Abai turns this historical contact into a moral mirror: by seeing others, a people must also see its own character."
        },
        themes: ["Өзін сынау", "Ғибрат", "Еңбек", "Жалған мақтан"],
        keywords: ["сарт", "өнер", "ғибрат", "әуесқойлық", "мақтан"],
        difficultWords: {
          kk: [
            {
              term: "ғибрат",
              meaning: "Өзгенің пайдалы тәжірибесін көріп, өз мінезін түзетуге көмектесетін өнеге.",
              note: "Бұл соқыр еліктеу емес, салыстыру арқылы өзін тану."
            },
            {
              term: "мақтан",
              meaning: "Өзін өзгеден жоғары санатып, ақылды тұмандандыратын жалған рухани дерт.",
              note: "Абай мұндай мақтанды еңбек пен үйренуге қарсы қояды."
            },
            {
              term: "әуесқойлық",
              meaning: "Тұрақты еңбекке айналмаған үстірт қызығу.",
              note: "Абай үшін шынайы үйрену өткінші әуестікпен емес, ұзақ қайратпен келеді."
            },
            {
              term: "кем көру",
              forms: ["кем"],
              meaning: "Өзгені төмен санап, өзін жалған түрде биік қою.",
              note: "Бұл фрагментте кемсіту адамның адамшылыққа жетуіне кедергі болады."
            }
          ],
          ru: [
            {
              term: "тщеславие",
              forms: ["Гордость"],
              meaning: "Ложная гордость, основанная на унижении другого.",
              note: "У Абая такая гордость не ведёт к развитию, а закрывает путь к человечности."
            },
            {
              term: "нравственный урок",
              forms: ["уроком"],
              meaning: "Вывод, который помогает исправить собственный характер.",
              note: "Сравнение с другими народами нужно не для похвалы, а для самопознания."
            },
            {
              term: "любопытство",
              forms: ["увлечённость"],
              meaning: "Поверхностный интерес, который не становится устойчивым трудом.",
              note: "В этом месте текст противопоставляет увлечённость постоянному обучению."
            },
            {
              term: "пренебрежение",
              forms: ["свысока"],
              meaning: "Отношение, при котором другого считают ниже себя.",
              note: "Абай показывает, что пренебрежение рождает ложное превосходство."
            }
          ],
          en: [
            {
              term: "instructive example",
              forms: ["lesson"],
              meaning: "A moral example that helps a person correct their own character.",
              note: "Abai uses comparison as a disciplined tool of self-critique."
            },
            {
              term: "vanity",
              forms: ["Pride"],
              meaning: "False self-importance built on belittling others.",
              note: "Here pride blocks humanity because it refuses to learn from others."
            },
            {
              term: "curiosity",
              forms: ["enthusiasm"],
              meaning: "A shallow attraction that has not become steady effort.",
              note: "Abai contrasts shallow enthusiasm with lasting labor and learning."
            },
            {
              term: "contempt",
              forms: ["down"],
              meaning: "Looking at others as inferior in order to feel superior.",
              note: "The phrase “looked down” marks the attitude Abai criticizes."
            }
          ]
        },
        context: [
          {
            kk: "Бала күнімізде қазақтың өзге жұртты жамандап, өзін артық санаған сөздерін естуші едік. Сол кезде бізден жақсы халық жоқ шығар деп ойлайтынбыз.",
            ru: "В детстве мы слышали, как казахи плохо отзывались о других народах и считали себя выше них. Тогда казалось, будто нет народа лучше нас.",
            en: "In childhood, we heard Kazakhs speak badly of other peoples and consider themselves superior. At that time, it seemed as if no people were better than us."
          },
          {
            kk: "Енді қарап тұрсам, сарттың екпеген егіні жоқ, шығармаған жемісі жоқ, саудагерінің жүрмеген жері жоқ, қылмаған шеберлігі жоқ.",
            ru: "Теперь же я вижу: у сарта есть и земледелие, и плоды труда, и торговля, и ремесло; его купцы доходят до разных мест, а мастерство приносит реальную пользу.",
            en: "Now I see that the Sart has farming, the fruits of labor, trade, and craft. His merchants travel widely, and his skills bring practical benefit."
          }
        ],
        fragment: {
          text: {
            kk: "Енді қарап тұрсам, сарттың екпеген егіні жоқ, шығармаған жемісі жоқ, саудагерінің жүрмеген жері жоқ, қылмаған шеберлігі жоқ. Бұрын біз оларды кем көргендей болдық, ал шын мәнінде олардың еңбегі, кәсібі, өнері бізге ғибрат болуы тиіс. Өзгені кемсіткен мақтан адамшылыққа жеткізбейді; әуесқойлық емес, тұрақты еңбек пен үйрену керек.",
            ru: "Теперь я вижу: у сарта есть земледелие, плоды труда, торговля и ремесло. Раньше мы смотрели на них свысока, но на самом деле их труд, занятие и мастерство должны стать для нас нравственным уроком. Гордость, построенная на унижении другого, не ведёт к человечности; нужна не поверхностная увлечённость, а постоянный труд и обучение.",
            en: "Now I see that the Sart has farming, the fruits of labor, trade, and craft. Earlier, we looked down on them, but in truth their labor, occupation, and skill should become a moral lesson for us. Pride built on belittling others does not lead to humanity; what is needed is not shallow enthusiasm, but steady labor and learning."
          },
          annotations: [
            {
              word: {
                kk: "сарттың",
                ru: "сарта",
                en: "Sart"
              },
              explanation: {
                kk: "Сарт — Абай заманында Орта Азиядағы отырықшы, саудамен және егіншілікпен айналысқан халықтарға қатысты қолданылған тарихи атау.",
                ru: "Сарт — историческое название, которым в XIX веке часто обозначали оседлые торгово-земледельческие народы Средней Азии.",
                en: "Sart is a historical term used in the nineteenth century for settled Central Asian peoples associated with trade and farming."
              }
            },
            {
              word: {
                kk: "өнері",
                ru: "мастерство",
                en: "skill"
              },
              explanation: {
                kk: "Өнер — Абайда тек көркем өнер емес, кәсіп, шеберлік, пайдалы іс және адамды алға бастайтын қабілет.",
                ru: "Өнер у Абая — не только искусство, а ремесло, практическое умение и способность создавать полезное дело.",
                en: "Oner in Abai’s usage means not only art, but craft, practical skill, and the ability to create useful work."
              }
            },
            {
              word: {
                kk: "ғибрат",
                ru: "уроком",
                en: "lesson"
              },
              explanation: {
                kk: "Ғибрат — сыртқы үлгіні соқыр еліктеу емес, өз мінезін түзетуге көмектесетін терең өнеге ретінде қабылдау.",
                ru: "Ғибрат — не слепое подражание внешнему примеру, а нравственный урок, который помогает исправить собственный характер.",
                en: "Ghibat is not blind imitation of an outward model, but a moral lesson that helps correct one’s own character."
              }
            },
            {
              word: {
                kk: "мақтан",
                ru: "Гордость",
                en: "Pride"
              },
              explanation: {
                kk: "Мақтан — Абайда адамды ақылдан айырып, өзін өзгеден жоғары санауға итеретін рухани дерт.",
                ru: "Мақтан у Абая — духовная болезнь ложной гордости, которая лишает человека трезвого разума и заставляет считать себя выше других.",
                en: "Maqtan in Abai is the spiritual illness of false pride: it clouds reason and makes a person imagine superiority over others."
              }
            },
            {
              word: {
                kk: "әуесқойлық",
                ru: "увлечённость",
                en: "enthusiasm"
              },
              explanation: {
                kk: "Әуесқойлық — тұрақты қайрат пен жауапкершілікке айналмаған өткінші қызығу; Абай үшін ол шынайы үйренудің орнына жүрмейді.",
                ru: "Әуесқойлық — поверхностное увлечение, которое не стало устойчивым усилием и ответственностью; у Абая оно не заменяет настоящего учения.",
                en: "Auesqoilyq is shallow enthusiasm that has not become steady effort and responsibility; for Abai it cannot replace real learning."
              }
            },
            {
              word: {
                kk: "кем",
                ru: "свысока",
                en: "looked"
              },
              explanation: {
                kk: "Кем көру — өзгені төмен санап, өзін жалған түрде жоғары қою. Абай мұндай мақтанды рухани әлсіздік деп көрсетеді.",
                ru: "Смотреть свысока — значит унижать другого ради ложного чувства собственного превосходства. Для Абая это признак внутренней слабости.",
                en: "To look down on others means to diminish them for a false sense of superiority. For Abai, this is a sign of inner weakness."
              }
            }
          ]
        },
        prompt: {
          kk: "Екінші сөзде Абай өзге халықтарды не үшін салыстырады?",
          ru: "Зачем во втором слове Абай сравнивает казахов с другими народами?",
          en: "Why does Abai compare Kazakhs with other peoples in the second word?"
        },
        choices: [
          createSceneChoice(
            "learn-from-others",
            {
              kk: "A. Қазақтың бос мақтанын сынап, еңбек пен өнер үйрену керегін көрсету үшін.",
              ru: "A. Чтобы осудить пустую гордость и показать необходимость учиться труду, ремеслу и знанию.",
              en: "A. To criticize empty pride and show the need to learn labor, craft, and knowledge."
            },
            12,
            "correct",
            {
              kk: "Дұрыс. Абай өзгені мақтау үшін ғана емес, қазақтың өз кемшілігін көруі үшін салыстырады.",
              ru: "Верно. Абай сравнивает не ради простого восхваления других, а чтобы казахи увидели собственные недостатки.",
              en: "Correct. Abai compares not simply to praise others, but to make Kazakhs recognize their own shortcomings."
            },
            {
              kk: "Бұл жерде салыстыру — өзін-өзі танудың құралы.",
              ru: "Здесь сравнение становится инструментом самопознания.",
              en: "Here comparison becomes a tool of self-knowledge."
            },
            {
              kk: "Екінші сөз Абайдың ұлттық мінезді сынайтын маңызды ойларының бірі.",
              ru: "Второе слово — один из важных текстов Абая о критике национального характера.",
              en: "The second word is one of Abai’s important critiques of national character."
            }
          ),
          createSceneChoice(
            "mocking-others",
            {
              kk: "B. Басқа халықтарды төмендетіп, қазақты бәрінен жоғары көрсету үшін.",
              ru: "B. Чтобы унизить другие народы и показать, что казахи выше всех.",
              en: "B. To humiliate other peoples and show that Kazakhs are superior to everyone."
            },
            3,
            "not quite accurate",
            {
              kk: "Жоқ. Абай керісінше өзгені кемсіту арқылы пайда болатын жалған мақтанды сынайды.",
              ru: "Нет. Абай, наоборот, критикует ложную гордость, которая строится на унижении других.",
              en: "No. Abai criticizes the false pride that comes from belittling others."
            },
            {
              kk: "Өзгені кемсіту адамды дамытпайды.",
              ru: "Унижение другого не развивает человека.",
              en: "Belittling others does not develop a person."
            },
            {
              kk: "Абай үшін шынайы биіктік еңбек пен білімде.",
              ru: "Для Абая настоящее достоинство связано с трудом и знанием.",
              en: "For Abai, true dignity is connected with labor and knowledge."
            }
          ),
          createSceneChoice(
            "childhood-memory",
            {
              kk: "C. Тек балалық шағындағы бір естелікті айту үшін.",
              ru: "C. Только чтобы рассказать воспоминание из детства.",
              en: "C. Only to tell a childhood memory."
            },
            5,
            "partially correct",
            {
              kk: "Естелік бар, бірақ ол негізгі мақсат емес. Абай балалықтағы түсінікті ересек оймен қайта бағалайды.",
              ru: "Воспоминание действительно есть, но это не главная цель. Абай переосмысливает детское впечатление зрелым взглядом.",
              en: "There is a memory, but it is not the main purpose. Abai reinterprets a childhood impression through mature reflection."
            },
            {
              kk: "Естелік қоғамдық сынға айналады.",
              ru: "Личное воспоминание превращается в общественную критику.",
              en: "A personal memory becomes social criticism."
            },
            {
              kk: "Сондықтан бұл сөз жай әңгіме емес, ойлануға шақыру.",
              ru: "Поэтому это слово не простая история, а призыв к размышлению.",
              en: "Therefore this word is not a simple story, but a call to reflection."
            }
          ),
        ],
      },
      {
        id: "abai-word-03",
        sceneNumber: 3,
        title: {
          kk: "3-сахна — Дау мен билік сыны",
          ru: "Сцена 3 — Критика спора и власти",
          en: "Scene 3 — Critique of Conflict and Power"
        },
        displayTitle: {
          kk: "3-сөз",
          ru: "Слово 3",
          en: "Word 3"
        },
        explanation: {
          kk: "Үшінші сөзде Абай жеке мінез бен қоғамдық құрылымды бірге талдайды. Қаскүнемдік, күншілдік, өтірік арыз, партияшылдық және билікқұмарлық кездейсоқ мінез емес; олардың түбінде малқұмарлық, надандық, қайраттың дұрыс арнаға түспеуі және ақылдың әлсіреуі жатыр. Абай еңбек, өнер, ғылым және әділет болмаса, қоғамда жауапкершілік жоғалып, дау мен бақталастық күшейетінін көрсетеді.",
          ru: "В третьем слове Абай рассматривает личный характер и общественный порядок вместе. Враждебность, зависть, ложные жалобы, групповая борьба и жажда власти не случайны; в их основе лежат зависимость от богатства, невежество, неверно направленная воля и ослабление разума. Абай показывает: без труда, ремесла, знания и справедливости общество теряет ответственность, а споры и соперничество усиливаются.",
          en: "In the third word, Abai analyzes personal character and social order together. Hostility, envy, false petitions, factional struggle, and hunger for power are not accidental; they grow from attachment to wealth, ignorance, misdirected will, and weakened reason. Abai shows that without labor, craft, knowledge, and justice, society loses responsibility while conflict and rivalry intensify."
        },
        mainIdea: {
          kk: "Қоғамды түзейтін күш — малқұмарлық емес, ақыл, қайрат, ғылым, әділет және ортақ жауапкершілік.",
          ru: "Общество исправляет не зависимость от богатства, а разум, воля, знание, справедливость и общая ответственность.",
          en: "Society is repaired not by attachment to wealth, but by reason, will, knowledge, justice, and shared responsibility."
        },
        historicalContext: {
          kk: "Үшінші сөз болыс, би, сайлау, арыз, тергеу сияқты отарлық әкімшілікке байланысты шындықтарды қозғайды. Руаралық бақталастық пен қызметке талас сыртқы жүйемен ғана емес, ішкі мінезбен де байланысты болды. Абай осы жерде саясатты моральдан бөлек қарамайды: әділетсіз билік рухани надандықтың белгісіне айналады.",
          ru: "Третье слово касается волостного управления, суда, выборов, жалоб и следствий в колониальной административной системе. Родовое соперничество и борьба за должности были связаны не только с внешним устройством власти, но и с внутренним характером людей. Абай не отделяет политику от морали: несправедливая власть становится признаком духовного невежества.",
          en: "The third word addresses volost administration, courts, elections, petitions, and investigations under the colonial administrative system. Clan rivalry and competition for office were tied not only to external institutions but also to inward character. Abai does not separate politics from morality: unjust power becomes a sign of spiritual ignorance."
        },
        themes: ["Әділет", "Билікқұмарлық", "Надандық", "Жауапкершілік"],
        keywords: ["қаскүнемдік", "билікқұмарлық", "малқұмарлық", "қайрат", "ақыл"],
        difficultWords: {
          kk: [
            {
              term: "қаскүнемдік",
              forms: ["қаскүнем"],
              meaning: "Біреуге әдейі зиян тілеу, ішкі дұшпандық.",
              note: "Абай мұны қоғамдағы сенім мен бірлікті бұзатын мінез ретінде сынайды."
            },
            {
              term: "билікқұмарлық",
              forms: ["билікқұмарлықтан"],
              meaning: "Билікті жауапкершілік үшін емес, үстемдік пен пайда үшін қалау.",
              note: "Бұл ұғым қызметке талас пен әділетсіз биліктің түбін ашады."
            },
            {
              term: "қайрат",
              meaning: "Адамды әрекетке түсіретін ішкі күш.",
              note: "Ақыл мен әділетке бағынбаса, қайрат тартыс пен бақталастыққа жұмсалады."
            },
            {
              term: "ақыл",
              forms: ["ақылды"],
              meaning: "Әділетті таңдап, нәпсіні тежеп, қайратты дұрыс бағыттайтын қабілет.",
              note: "Абайда ақыл тек есеп емес, адамшылыққа қызмет ететін рухани өлшем."
            },
            {
              term: "ғылым",
              meaning: "Түсіну, мінезді түзету және қоғамды дамыту жолы.",
              note: "Бұл фрагментте ғылым малқұмарлық пен билікқұмарлыққа қарсы қойылады."
            }
          ],
          ru: [
            {
              term: "злонамеренность",
              forms: ["враждебными"],
              meaning: "Враждебное желание вреда другому человеку.",
              note: "В тексте это признак разрушенного доверия между людьми."
            },
            {
              term: "властолюбие",
              forms: ["власти"],
              meaning: "Стремление к власти ради превосходства, выгоды и влияния.",
              note: "Абай связывает властолюбие с борьбой за должность и потерей справедливости."
            },
            {
              term: "воля",
              meaning: "Внутренняя сила действия.",
              note: "Если воля не направлена разумом, она превращается в соперничество и спор."
            },
            {
              term: "разум",
              meaning: "Способность направлять поступки к справедливому и достойному делу.",
              note: "У Абая разум должен удерживать человека от низких желаний и узких целей."
            },
            {
              term: "просвещение",
              forms: ["знанию"],
              meaning: "Путь к пониманию, развитию характера и общественной пользе.",
              note: "В этом фрагменте знание противопоставлено зависимости от богатства и власти."
            }
          ],
          en: [
            {
              term: "malice",
              forms: ["hostile"],
              meaning: "A harmful hostility toward another person.",
              note: "Abai treats this as a social illness that destroys trust."
            },
            {
              term: "lust for power",
              forms: ["power"],
              meaning: "The desire for authority for prestige, control, or gain.",
              note: "Here power is criticized when it is separated from responsibility."
            },
            {
              term: "willpower",
              forms: ["will"],
              meaning: "The inner force that moves a person into action.",
              note: "Without reason and moral direction, willpower can become rivalry."
            },
            {
              term: "reason",
              meaning: "The capacity to choose worthy action and restrain narrow desire.",
              note: "Abai presents reason as a guide for will and social conduct."
            },
            {
              term: "enlightenment",
              forms: ["knowledge"],
              meaning: "The pursuit of understanding that improves character and society.",
              note: "Knowledge is offered as an alternative to wealth obsession and power struggle."
            }
          ]
        },
        context: [
          {
            kk: "Қазақтың бірінің біріне қаскүнем болмағының, бірінің тілеуін бірі тілеспейтұғынының, рас сөзі аз болатұғынының, қызметке таласқыш болатұғынының себебі не?",
            ru: "Почему один казах становится враждебным другому, почему люди не желают друг другу добра, почему правдивого слова мало и почему все так стремятся к должности?",
            en: "Why does one Kazakh become hostile to another? Why do people fail to wish one another well? Why is truthful speech rare, and why do so many compete for office?"
          },
          {
            kk: "Мұның бәрі төрт аяқты малды көбейтеміннен басқа ойының жоқтығынан, өзге егін, сауда, өнер, ғылым секілді нәрселерге салынса, бұлай болмас еді.",
            ru: "Всё это происходит потому, что мысль занята только умножением скота. Если бы люди обращались к земледелию, торговле, ремеслу и знанию, такого бы не было.",
            en: "All this happens because people think only of increasing livestock. If they turned to farming, trade, craft, and knowledge, things would not be this way."
          }
        ],
        fragment: {
          text: {
            kk: "Қазақтың бірінің біріне қаскүнем болмағының, рас сөзі аз болатұғынының, қызметке таласқыш болатұғынының себебі не? Мұның бәрі төрт аяқты малды көбейтеміннен басқа ойының жоқтығынан, малқұмарлық пен билікқұмарлықтан, қайрат пен ақылды дұрыс іске жұмсамағандықтан. Өзге егін, сауда, өнер, ғылым секілді нәрселерге салынса, бұлай болмас еді.",
            ru: "Почему люди становятся враждебными друг другу, почему правдивого слова становится мало, почему все тянутся к должности? Всё это оттого, что мысль занята только умножением скота, зависимостью от богатства и жаждой власти, а воля и разум не направлены на достойное дело. Если бы люди обращались к земледелию, торговле, ремеслу и знанию, такого бы не было.",
            en: "Why do people become hostile to one another, why does truthful speech become rare, and why do so many seek office? All this comes from thinking only of increasing livestock, from attachment to wealth and hunger for power, while will and reason are not directed toward worthy work. If people turned to farming, trade, craft, and knowledge, it would not be this way."
          },
          annotations: [
            {
              word: {
                kk: "қаскүнем",
                ru: "враждебными",
                en: "hostile"
              },
              explanation: {
                kk: "Қаскүнемдік — жай ұнатпау емес, біреуге әдейі зиян тілеу, қоғамдағы сенімді бұзатын ішкі дұшпандық.",
                ru: "Враждебность здесь не простая неприязнь, а желание вреда другому человеку; она разрушает доверие внутри общества.",
                en: "Hostility here is not simple dislike, but wishing harm to another person; it destroys trust within society."
              }
            },
            {
              word: {
                kk: "қызметке",
                ru: "должности",
                en: "office"
              },
              explanation: {
                kk: "Қызметке таласу — билікті елге қызмет ету үшін емес, бедел мен пайда үшін іздеу.",
                ru: "Стремление к должности у Абая означает поиск власти не ради общественного служения, а ради престижа, влияния и выгоды.",
                en: "Seeking office here means pursuing power not for public service, but for prestige, influence, and personal gain."
              }
            },
            {
              word: {
                kk: "малқұмарлық",
                ru: "богатства",
                en: "wealth"
              },
              explanation: {
                kk: "Малқұмарлық — байлықты тіршіліктің жалғыз мақсатына айналдырып, ақыл, әділет және адамшылықты соған бағындыру.",
                ru: "Малқұмарлық — зависимость от богатства, когда имущество становится единственной целью и подчиняет себе разум, справедливость и человечность.",
                en: "Malqumarlyq is attachment to wealth: property becomes the only aim and subordinates reason, justice, and humanity."
              }
            },
            {
              word: {
                kk: "билікқұмарлықтан",
                ru: "власти",
                en: "power"
              },
              explanation: {
                kk: "Билікқұмарлық — билікті жауапкершілік үшін емес, үстемдік, бедел және пайда үшін іздеу.",
                ru: "Билікқұмарлық — стремление к власти не ради ответственности, а ради господства, престижа и выгоды.",
                en: "Bilikqumarlyq is hunger for power pursued not for responsibility, but for dominance, prestige, and gain."
              }
            },
            {
              word: {
                kk: "қайрат",
                ru: "воля",
                en: "will"
              },
              explanation: {
                kk: "Қайрат — Абайда адамның әрекетке түсіретін ішкі күші; ол ақыл мен жүрекке бағынбаса, тартыс пен бақталастыққа жұмсалады.",
                ru: "Қайрат — внутренняя воля к действию; если она не направлена разумом и сердцем, она превращается в соперничество и разрушительный спор.",
                en: "Qairat is the inner force of action; if not guided by reason and heart, it turns into rivalry and destructive conflict."
              }
            },
            {
              word: {
                kk: "ақылды",
                ru: "разум",
                en: "reason"
              },
              explanation: {
                kk: "Ақыл — Абай үшін салқын есеп қана емес, әділетті таңдау, нәпсіні тежеу және қайратты дұрыс бағыттау қабілеті.",
                ru: "Ақыл у Абая — не холодный расчёт, а способность выбирать справедливость, сдерживать низкие желания и направлять волю.",
                en: "Aqyl for Abai is not cold calculation, but the capacity to choose justice, restrain lower desire, and direct will."
              }
            },
            {
              word: {
                kk: "ғылым",
                ru: "знанию",
                en: "knowledge"
              },
              explanation: {
                kk: "Ғылым — Абайда тек оқу емес, ақыл, түсіну, мінезді түзету және қоғамды дамыту жолы.",
                ru: "Ғылым у Абая — не только учёба, а разумное понимание, исправление характера и путь общественного развития.",
                en: "Gylym for Abai is not only study, but reasoned understanding, moral improvement, and a path of social development."
              }
            }
          ]
        },
        prompt: {
          kk: "Үшінші сөзде Абай қоғамдағы бұзылудың негізгі себебін неден көреді?",
          ru: "В чём Абай видит главную причину общественного разлада в третьем слове?",
          en: "What does Abai see as the main cause of social disorder in the third word?"
        },
        choices: [
          createSceneChoice(
            "wealth-without-knowledge",
            {
              kk: "A. Малдан басқа мақсат көрмеуден, өнер мен ғылымға ұмтылмаудан.",
              ru: "A. В том, что люди видят цель только в богатстве и не стремятся к ремеслу, труду и знанию.",
              en: "A. In people seeing wealth as the only goal and not striving for craft, labor, and knowledge."
            },
            14,
            "correct",
            {
              kk: "Дұрыс. Абай қаскүнемдік пен дау-дамайдың түбінде тар мақсат, малқұмарлық және білімсіздік жатқанын айтады.",
              ru: "Верно. Абай показывает, что враждебность и конфликт вырастают из узких целей, зависимости от богатства и недостатка знания.",
              en: "Correct. Abai shows that hostility and conflict grow from narrow aims, attachment to wealth, and lack of knowledge."
            },
            {
              kk: "Қоғамның түзелуі үшін еңбек, өнер, ғылым және әділет керек.",
              ru: "Для исправления общества нужны труд, ремесло, знание и справедливость.",
              en: "For society to improve, it needs labor, craft, knowledge, and justice."
            },
            {
              kk: "Үшінші сөз Абайдың әлеуметтік-саяси сынының ең өткір бөліктерінің бірі.",
              ru: "Третье слово — одна из самых острых частей социальной и политической критики Абая.",
              en: "The third word is one of the sharpest parts of Abai’s social and political criticism."
            }
          ),
          createSceneChoice(
            "too-much-education",
            {
              kk: "B. Білім мен ғылым тым көп болғандықтан.",
              ru: "B. В том, что образования и знания стало слишком много.",
              en: "B. In there being too much education and knowledge."
            },
            3,
            "not quite accurate",
            {
              kk: "Жоқ. Абай керісінше білім, өнер, ғылым жетіспегендіктен қоғам бұзылып отыр дейді.",
              ru: "Нет. Абай говорит обратное: общество страдает от недостатка знания, ремесла и осмысленного труда.",
              en: "No. Abai says the opposite: society suffers because knowledge, craft, and meaningful work are lacking."
            },
            {
              kk: "Білімнің аздығы тартысты күшейтеді.",
              ru: "Недостаток знания усиливает конфликт.",
              en: "Lack of knowledge intensifies conflict."
            },
            {
              kk: "Бұл сөзде ғылым қоғамды түзететін жол ретінде көрінеді.",
              ru: "В этом слове знание показано как путь исправления общества.",
              en: "In this word, knowledge appears as a way to improve society."
            }
          ),
          createSceneChoice(
            "random-conflict",
            {
              kk: "C. Дау мен тартыс кездейсоқ нәрсе, оның терең себебі жоқ.",
              ru: "C. В том, что конфликт случаен и не имеет глубокой причины.",
              en: "C. In conflict being accidental and having no deeper cause."
            },
            5,
            "partially correct",
            {
              kk: "Дау сырттай кездейсоқ көрінуі мүмкін, бірақ Абай оның астарында малқұмарлық, жалқаулық, мақтан және билікқұмарлық жатқанын көрсетеді.",
              ru: "Конфликт может казаться случайным, но Абай показывает более глубокие причины: зависимость от богатства, лень, хвастовство и жажду власти.",
              en: "Conflict may look accidental from outside, but Abai shows deeper causes: attachment to wealth, laziness, boasting, and hunger for power."
            },
            {
              kk: "Абай мінезді жеке ғана емес, қоғамдық құрылыммен байланыстырады.",
              ru: "Абай связывает личное поведение с общественным устройством.",
              en: "Abai connects personal behavior with social structure."
            },
            {
              kk: "Үшінші сөзде жеке мінез бен қоғамдық тәртіп қатар талданады.",
              ru: "В третьем слове одновременно анализируются личный характер и общественный порядок.",
              en: "The third word analyzes both personal character and social order."
            }
          ),
        ],
      },
    ],
  }),
  createStoryChapter({
    id: "auezov-abai-path",
    workId: "auezov-abai-path",
    chapterTitle: "Becoming a Voice",
    tagline: "Biography, steppe, and moral formation",
    estimatedMinutes: 12,
    completionXp: 40,
    scenes: [
      {
        id: "landscape",
        sceneNumber: 1,
        title: "Scene 1 - Landscape as Memory",
        context: [
          "Auezov does not treat the steppe as a background only.",
          "Landscape carries family, custom, conflict, and the pressure of historical time.",
        ],
        prompt: "Why does place matter in this route?",
        choices: [
          createSceneChoice(
            "memory",
            "A. It carries cultural memory and shapes the hero.",
            14,
            "correct",
            "The place is part of the moral and cultural world of the novel.",
            "Auezov shows that identity grows inside landscape, family, and public life.",
            "The Path of Abai uses place as a living archive of social memory."
          ),
          createSceneChoice(
            "decoration",
            "B. It is mostly decorative scenery.",
            4,
            "not quite accurate",
            "The landscape is too meaningful to be only decoration.",
            "The reader should notice how place guides interpretation.",
            "Auezov's prose often lets landscape carry historical and emotional weight."
          ),
          createSceneChoice(
            "escape",
            "C. It allows the hero to avoid society.",
            6,
            "partially correct",
            "Solitude exists, but the landscape more often connects the hero to society.",
            "The route is about relation, not escape.",
            "The novel links personal growth to communal life."
          ),
        ],
      },
    ],
  }),
  createStoryChapter({
    id: "baitursynuly-masa",
    workId: "baitursynuly-masa",
    chapterTitle: "Language as Awakening",
    tagline: "Education, responsibility, and public voice",
    estimatedMinutes: 10,
    completionXp: 34,
    scenes: [
      {
        id: "language",
        sceneNumber: 1,
        title: "Scene 1 - The Call to Wake",
        context: [
          "Baitursynuly writes as a teacher, reformer, and public thinker.",
          "Language is not a tool only; it becomes a way to awaken attention and responsibility.",
        ],
        prompt: "What does language do here?",
        choices: [
          createSceneChoice(
            "awakening",
            "A. It awakens readers to education and responsibility.",
            12,
            "correct",
            "Language becomes an instrument of civic and cultural awakening.",
            "The reader sees how literacy and self-respect belong together.",
            "Baitursynuly's work joins literature, education, and national consciousness."
          ),
          createSceneChoice(
            "ornament",
            "B. It is only a beautiful ornament.",
            3,
            "not quite accurate",
            "Beauty matters, but the text is also practical, urgent, and public.",
            "The route asks the reader to notice the civic force of language.",
            "The writing uses style to call people toward action."
          ),
          createSceneChoice(
            "private",
            "C. It avoids public questions.",
            4,
            "not quite accurate",
            "The text is deeply public in purpose.",
            "Baitursynuly's voice addresses education and society.",
            "Language reform and literature meet in the same cultural task."
          ),
        ],
      },
    ],
  }),
  createStoryChapter({
    id: "zhumabayev-batyr-bayan",
    workId: "zhumabayev-batyr-bayan",
    chapterTitle: "Heroic Memory",
    tagline: "Poetry, loyalty, and national imagination",
    estimatedMinutes: 9,
    completionXp: 32,
    scenes: [
      {
        id: "heroic",
        sceneNumber: 1,
        title: "Scene 1 - The Lyric Heroic Voice",
        context: [
          "Magzhan combines emotional intensity with historical imagination.",
          "The poem asks the reader to feel history as a living inner force.",
        ],
        prompt: "What gives the poem its power?",
        choices: [
          createSceneChoice(
            "emotion-history",
            "A. Emotion and history become inseparable.",
            12,
            "correct",
            "The poem makes historical memory lyrical and intimate.",
            "The reader sees that heroism is not only event, but feeling and sacrifice.",
            "Magzhan's poetic language turns memory into music and moral tension."
          ),
          createSceneChoice(
            "facts",
            "B. It works only as a list of facts.",
            3,
            "not quite accurate",
            "The poem is not documentary in that narrow sense.",
            "Its force comes from image, rhythm, and emotional meaning.",
            "The poem transforms history through lyric imagination."
          ),
          createSceneChoice(
            "distance",
            "C. It keeps the reader emotionally distant.",
            4,
            "not quite accurate",
            "The poem invites emotional involvement.",
            "The reader is meant to feel the cost of loyalty and loss.",
            "Magzhan's style is intense, musical, and inward."
          ),
        ],
      },
    ],
  }),
  createStoryChapter({
    id: "seifullin-thorny-path",
    workId: "seifullin-thorny-path",
    chapterTitle: "History as Testimony",
    tagline: "Memory, upheaval, and civic courage",
    estimatedMinutes: 11,
    completionXp: 36,
    scenes: [
      {
        id: "testimony",
        sceneNumber: 1,
        title: "Scene 1 - Writing Through Change",
        context: [
          "Seifullin writes from inside a century of rupture and transformation.",
          "The text asks how literature can carry witness when history becomes unstable.",
        ],
        prompt: "Why does testimony matter here?",
        choices: [
          createSceneChoice(
            "witness",
            "A. It keeps personal and public memory from disappearing.",
            12,
            "correct",
            "Testimony gives history a human voice.",
            "The reader sees that literature can preserve experience under pressure.",
            "Seifullin's writing joins narrative, memory, and civic responsibility."
          ),
          createSceneChoice(
            "escape",
            "B. It lets the writer avoid history.",
            3,
            "not quite accurate",
            "The writing moves toward history, not away from it.",
            "The route asks the reader to confront memory directly.",
            "The text is shaped by public events and personal cost."
          ),
          createSceneChoice(
            "neutral",
            "C. It makes history emotionally neutral.",
            4,
            "not quite accurate",
            "The text is not neutral; it carries urgency and consequence.",
            "The reader should notice the human pressure inside events.",
            "Seifullin's route is a memory route, not a detached summary."
          ),
        ],
      },
    ],
  }),
];

export const chapterStoryLibrary = Object.fromEntries(
  manualChapterStories.map((story) => [story.id, story])
);

const storyBooks = manualChapterStories.reduce((books, story) => {
  if (!books[story.workId]) {
    books[story.workId] = {
      workId: story.workId,
      overview: story.tagline,
      chapterIds: [],
    };
  }

  books[story.workId].chapterIds.push(story.id);

  return books;
}, {});

export function hasStoryMode(workId) {
  return Boolean(storyBooks[workId]);
}

export function getStoryById(id) {
  return chapterStoryLibrary[id] ?? null;
}

export function getChaptersByWorkId(workId) {
  const book = storyBooks[workId];

  if (!book) return [];

  return book.chapterIds
    .map((chapterId) => chapterStoryLibrary[chapterId])
    .filter(Boolean)
    .sort((left, right) => left.chapterNumber - right.chapterNumber);
}

export function getStoryBookByWorkId(workId) {
  const book = storyBooks[workId];

  if (!book) return null;

  const chapters = getChaptersByWorkId(workId);

  return {
    ...book,
    chapters,
    totalScenes: chapters.reduce((sum, chapter) => sum + chapter.scenes.length, 0),
    totalMinutes: chapters.reduce((sum, chapter) => sum + chapter.estimatedMinutes, 0),
    totalXp: chapters.reduce((sum, chapter) => sum + chapter.completionXp, 0),
  };
}

export function getStoryChapterByWorkAndNumber(workId, chapterNumber) {
  return (
    getChaptersByWorkId(workId).find(
      (chapter) => String(chapter.chapterNumber) === String(chapterNumber)
    ) ?? null
  );
}

export function getChapterPath(workId, chapterNumber) {
  return `/reading/${workId}/chapter/${chapterNumber}`;
}
