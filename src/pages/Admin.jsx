import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  createBlankScene,
  emptyAdminContent,
} from "../admin/adminContent";
import { useAdminAccess } from "../hooks/useAdminAccess";
import { useAdminContent } from "../hooks/useAdminContent";
import "./Admin.css";

const tabs = [
  { id: "authors", label: "Авторы" },
  { id: "works", label: "Произведения" },
  { id: "chapters", label: "Главы и вопросы" },
  { id: "translations", label: "Переводы" },
  { id: "data", label: "Экспорт" },
];

const initialAuthor = {
  name: "",
  period: "",
  description: "",
  image: "",
};

const initialWork = {
  id: "",
  title: "",
  author: "",
  image: "",
  year: "",
  themes: "",
  description: "",
  type: "Book",
  period: "",
  mood: "",
  readingTime: 12,
  whyNow: "",
  fragmentText: "",
  fragmentNote: "",
};

const initialChapter = {
  workId: "",
  chapterNumber: 1,
  chapterTitle: "",
  tagline: "",
  estimatedMinutes: 10,
  completionXp: 36,
  scenes: JSON.stringify([createBlankScene(1)], null, 2),
};

const initialTranslation = {
  entityType: "work",
  entityId: "",
  language: "ru",
  title: "",
  name: "",
  description: "",
  period: "",
  tagline: "",
};

function makeId(value, fallback) {
  const slug = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яёәіңғүұқөһ]+/gi, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `${fallback}-${Date.now()}`;
}

function Admin() {
  const { isAdmin, checkingAdmin, requiresSetup, user } = useAdminAccess();
  const {
    content,
    updateContent,
    isRemoteLoading,
    syncStatus,
    syncError,
  } = useAdminContent({ canWrite: isAdmin });
  const [activeTab, setActiveTab] = useState("works");
  const [authorForm, setAuthorForm] = useState(initialAuthor);
  const [workForm, setWorkForm] = useState(initialWork);
  const [chapterForm, setChapterForm] = useState(initialChapter);
  const [translationForm, setTranslationForm] = useState(initialTranslation);
  const [importValue, setImportValue] = useState("");
  const [message, setMessage] = useState("");
  const syncLabel = syncStatus === "remote" ? "Supabase" : "Локальное хранилище";
  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label ?? "Раздел";

  const workOptions = useMemo(
    () => content.works.map((work) => ({ id: work.id, title: work.title })),
    [content.works]
  );

  const showMessage = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2600);
  };

  const saveSharedContent = async (updater, successMessage) => {
    const result = await updateContent(updater);

    if (result?.ok) {
      showMessage(successMessage);
      return true;
    }

    showMessage(result?.error?.message ?? "Нет доступа для сохранения в Supabase");
    return false;
  };

  const addAuthor = async (event) => {
    event.preventDefault();
    const nextAuthor = {
      id: makeId(authorForm.name, "author"),
      ...authorForm,
    };

    const saved = await saveSharedContent((current) => ({
      ...current,
      authors: [...current.authors.filter((item) => item.name !== nextAuthor.name), nextAuthor],
    }), "Автор сохранён");

    if (saved) setAuthorForm(initialAuthor);
  };

  const addWork = async (event) => {
    event.preventDefault();
    const fragment = workForm.fragmentText.trim()
      ? [
          {
            id: `${makeId(workForm.title, "work")}-fragment-1`,
            text: workForm.fragmentText.trim(),
            authorNote: workForm.fragmentNote.trim(),
            annotations: [],
          },
        ]
      : [];
    const nextWork = {
      ...workForm,
      id: makeId(workForm.id || workForm.title, "work"),
      fragments: fragment,
    };

    const saved = await saveSharedContent((current) => ({
      ...current,
      works: [...current.works.filter((item) => item.id !== nextWork.id), nextWork],
    }), "Произведение добавлено в каталог");

    if (saved) setWorkForm(initialWork);
  };

  const addChapter = async (event) => {
    event.preventDefault();

    try {
      const scenes = JSON.parse(chapterForm.scenes);
      const workId = chapterForm.workId;
      const nextChapter = {
        ...chapterForm,
        id: `${workId}-chapter-${chapterForm.chapterNumber}`,
        scenes,
      };

      const saved = await saveSharedContent((current) => ({
        ...current,
        chapters: [
          ...current.chapters.filter((item) => item.id !== nextChapter.id),
          nextChapter,
        ],
      }), "Глава и вопросы сохранены");

      if (saved) setChapterForm(initialChapter);
    } catch {
      showMessage("В JSON сцен есть ошибка. Проверь скобки и кавычки.");
    }
  };

  const addTranslation = async (event) => {
    event.preventDefault();
    const nextTranslation = {
      ...translationForm,
      id: `${translationForm.entityType}-${translationForm.entityId}-${translationForm.language}`,
    };

    const saved = await saveSharedContent((current) => ({
      ...current,
      translations: [
        ...current.translations.filter((item) => item.id !== nextTranslation.id),
        nextTranslation,
      ],
    }), "Перевод сохранён");

    if (saved) setTranslationForm(initialTranslation);
  };

  const removeItem = async (type, id) => {
    await saveSharedContent((current) => ({
      ...current,
      [type]: current[type].filter((item) => item.id !== id),
    }), "Удалено");
  };

  const importContent = async () => {
    try {
      const parsed = JSON.parse(importValue);
      const saved = await saveSharedContent(parsed, "Данные импортированы");
      if (saved) setImportValue("");
    } catch {
      showMessage("Не получилось импортировать JSON");
    }
  };

  const exportJson = JSON.stringify(content, null, 2);

  if (requiresSetup) {
    return (
      <AdminAccessState
        title="Supabase не подключён"
        text="Чтобы админ-контент был общим для всех устройств, добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в .env."
      />
    );
  }

  if (checkingAdmin || isRemoteLoading) {
    return (
      <AdminAccessState
        title="Проверяем доступ"
        text="Сайт проверяет ваш аккаунт и загружает общий контент из Supabase."
      />
    );
  }

  if (!user) {
    return (
      <AdminAccessState
        title="Войдите в аккаунт"
        text="Админ-панель доступна только пользователям, которым вы выдали роль администратора."
        action={<Link to="/auth" className="admin-hero__link">Войти</Link>}
      />
    );
  }

  if (!isAdmin) {
    return (
      <AdminAccessState
        title="Нет доступа администратора"
        text="Добавьте этот user id в таблицу admin_users или поставьте role = 'admin' в profiles."
        code={user.id}
      />
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-page__container">
        <header className="admin-hero">
          <div>
            <p className="admin-hero__kicker">Content studio</p>
            <h1>Админ-панель библиотеки</h1>
            <p>
              Добавляйте авторов, произведения, главы, вопросы и переводы прямо
              из интерфейса. Новые материалы сразу появляются в каталоге и чтении.
            </p>
            <div className="admin-hero__meta" aria-label="Статус админ-панели">
              <span>Доступ: администратор</span>
              <span>Синхронизация: {syncLabel}</span>
              <span>Активно: {activeTabLabel}</span>
            </div>
            {syncError ? <p className="admin-hero__sync">{syncError}</p> : null}
          </div>
          <Link to="/works" className="admin-hero__link">
            Открыть каталог
          </Link>
        </header>

        <section className="admin-stats" aria-label="Сводка">
          <article>
            <strong>{content.authors.length}</strong>
            <span>авторов</span>
          </article>
          <article>
            <strong>{content.works.length}</strong>
            <span>произведений</span>
          </article>
          <article>
            <strong>{content.chapters.length}</strong>
            <span>глав</span>
          </article>
          <article>
            <strong>{content.translations.length}</strong>
            <span>переводов</span>
          </article>
        </section>

        <nav className="admin-tabs" aria-label="Разделы админ-панели">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              className={activeTab === tab.id ? "is-active" : ""}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {message ? <div className="admin-toast">{message}</div> : null}

        {activeTab === "authors" ? (
          <section className="admin-panel">
            <FormShell title="Добавить автора" onSubmit={addAuthor}>
              <AdminInput label="Имя" value={authorForm.name} onChange={(name) => setAuthorForm({ ...authorForm, name })} required />
              <AdminInput label="Период" value={authorForm.period} onChange={(period) => setAuthorForm({ ...authorForm, period })} />
              <AdminInput label="URL фото" value={authorForm.image} onChange={(image) => setAuthorForm({ ...authorForm, image })} />
              <AdminTextarea label="Описание" value={authorForm.description} onChange={(description) => setAuthorForm({ ...authorForm, description })} required />
              <button className="admin-submit" type="submit">Сохранить автора</button>
            </FormShell>
            <AdminList items={content.authors} type="authors" titleKey="name" onRemove={removeItem} />
          </section>
        ) : null}

        {activeTab === "works" ? (
          <section className="admin-panel">
            <FormShell title="Добавить произведение" onSubmit={addWork}>
              <AdminInput label="ID (можно оставить пустым)" value={workForm.id} onChange={(id) => setWorkForm({ ...workForm, id })} />
              <AdminInput label="Название" value={workForm.title} onChange={(title) => setWorkForm({ ...workForm, title })} required />
              <AdminInput label="Автор" value={workForm.author} onChange={(author) => setWorkForm({ ...workForm, author })} required />
              <AdminInput label="URL обложки" value={workForm.image} onChange={(image) => setWorkForm({ ...workForm, image })} />
              <AdminInput label="Год" type="number" value={workForm.year} onChange={(year) => setWorkForm({ ...workForm, year })} />
              <AdminInput label="Темы через запятую" value={workForm.themes} onChange={(themes) => setWorkForm({ ...workForm, themes })} placeholder="Identity, Society, Freedom" />
              <AdminInput label="Тип" value={workForm.type} onChange={(type) => setWorkForm({ ...workForm, type })} />
              <AdminInput label="Период" value={workForm.period} onChange={(period) => setWorkForm({ ...workForm, period })} />
              <AdminInput label="Время чтения" type="number" value={workForm.readingTime} onChange={(readingTime) => setWorkForm({ ...workForm, readingTime })} />
              <AdminTextarea label="Описание" value={workForm.description} onChange={(description) => setWorkForm({ ...workForm, description })} required />
              <AdminTextarea label="Реальный фрагмент/цитата" value={workForm.fragmentText} onChange={(fragmentText) => setWorkForm({ ...workForm, fragmentText })} />
              <AdminTextarea label="Пояснение к фрагменту" value={workForm.fragmentNote} onChange={(fragmentNote) => setWorkForm({ ...workForm, fragmentNote })} />
              <button className="admin-submit" type="submit">Добавить произведение</button>
            </FormShell>
            <AdminList items={content.works} type="works" titleKey="title" onRemove={removeItem} />
          </section>
        ) : null}

        {activeTab === "chapters" ? (
          <section className="admin-panel">
            <FormShell title="Добавить главу, сцены и вопросы" onSubmit={addChapter}>
              <label className="admin-field">
                <span>Произведение</span>
                <select
                  value={chapterForm.workId}
                  onChange={(event) => setChapterForm({ ...chapterForm, workId: event.target.value })}
                  required
                >
                  <option value="">Выберите произведение</option>
                  {workOptions.map((work) => (
                    <option key={work.id} value={work.id}>{work.title}</option>
                  ))}
                </select>
              </label>
              <AdminInput label="Номер главы" type="number" value={chapterForm.chapterNumber} onChange={(chapterNumber) => setChapterForm({ ...chapterForm, chapterNumber })} />
              <AdminInput label="Название главы" value={chapterForm.chapterTitle} onChange={(chapterTitle) => setChapterForm({ ...chapterForm, chapterTitle })} required />
              <AdminInput label="Короткое описание" value={chapterForm.tagline} onChange={(tagline) => setChapterForm({ ...chapterForm, tagline })} />
              <AdminInput label="Минуты" type="number" value={chapterForm.estimatedMinutes} onChange={(estimatedMinutes) => setChapterForm({ ...chapterForm, estimatedMinutes })} />
              <AdminInput label="XP за главу" type="number" value={chapterForm.completionXp} onChange={(completionXp) => setChapterForm({ ...chapterForm, completionXp })} />
              <AdminTextarea
                label="Сцены и вопросы JSON"
                value={chapterForm.scenes}
                onChange={(scenes) => setChapterForm({ ...chapterForm, scenes })}
                rows={18}
              />
              <button
                type="button"
                className="admin-secondary"
                onClick={() => setChapterForm({ ...chapterForm, scenes: JSON.stringify([createBlankScene(1)], null, 2) })}
              >
                Вставить шаблон сцены
              </button>
              <button className="admin-submit" type="submit">Сохранить главу</button>
            </FormShell>
            <AdminList items={content.chapters} type="chapters" titleKey="chapterTitle" onRemove={removeItem} />
          </section>
        ) : null}

        {activeTab === "translations" ? (
          <section className="admin-panel">
            <FormShell title="Добавить перевод" onSubmit={addTranslation}>
              <label className="admin-field">
                <span>Тип</span>
                <select value={translationForm.entityType} onChange={(event) => setTranslationForm({ ...translationForm, entityType: event.target.value })}>
                  <option value="work">Произведение</option>
                  <option value="author">Автор</option>
                  <option value="chapter">Глава</option>
                </select>
              </label>
              <AdminInput label="ID элемента" value={translationForm.entityId} onChange={(entityId) => setTranslationForm({ ...translationForm, entityId })} required />
              <label className="admin-field">
                <span>Язык</span>
                <select value={translationForm.language} onChange={(event) => setTranslationForm({ ...translationForm, language: event.target.value })}>
                  <option value="en">English</option>
                  <option value="ru">Русский</option>
                  <option value="kk">Қазақша</option>
                </select>
              </label>
              <AdminInput label="Название" value={translationForm.title} onChange={(title) => setTranslationForm({ ...translationForm, title })} />
              <AdminInput label="Имя автора" value={translationForm.name} onChange={(name) => setTranslationForm({ ...translationForm, name })} />
              <AdminInput label="Период" value={translationForm.period} onChange={(period) => setTranslationForm({ ...translationForm, period })} />
              <AdminInput label="Тэглайн главы" value={translationForm.tagline} onChange={(tagline) => setTranslationForm({ ...translationForm, tagline })} />
              <AdminTextarea label="Описание" value={translationForm.description} onChange={(description) => setTranslationForm({ ...translationForm, description })} />
              <button className="admin-submit" type="submit">Сохранить перевод</button>
            </FormShell>
            <AdminList items={content.translations} type="translations" titleKey="entityId" onRemove={removeItem} />
          </section>
        ) : null}

        {activeTab === "data" ? (
          <section className="admin-panel">
            <div className="admin-card">
              <h2>Экспорт / импорт</h2>
              <p>
                JSON можно сохранить отдельно и импортировать на другом устройстве.
                Это удобный способ переносить контент без изменения кода.
              </p>
              <textarea value={exportJson} readOnly rows={14} />
              <textarea
                value={importValue}
                onChange={(event) => setImportValue(event.target.value)}
                rows={8}
                placeholder="Вставьте JSON для импорта"
              />
              <div className="admin-actions">
                <button type="button" className="admin-submit" onClick={importContent}>Импортировать</button>
                <button type="button" className="admin-danger" onClick={() => saveSharedContent(emptyAdminContent, "Админ-данные очищены")}>Очистить админ-данные</button>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function AdminAccessState({ title, text, code, action }) {
  return (
    <main className="admin-page">
      <div className="admin-page__container">
        <section className="admin-hero admin-hero--access">
          <div>
            <p className="admin-hero__kicker">Protected area</p>
            <h1>{title}</h1>
            <p>{text}</p>
            {code ? <code className="admin-access-code">{code}</code> : null}
          </div>
          {action ?? <Link to="/" className="admin-hero__link">На главную</Link>}
        </section>
      </div>
    </main>
  );
}

function FormShell({ title, onSubmit, children }) {
  return (
    <form className="admin-card admin-form" onSubmit={onSubmit}>
      <h2>{title}</h2>
      <div className="admin-form__grid">{children}</div>
    </form>
  );
}

function AdminInput({ label, value, onChange, type = "text", ...props }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} {...props} />
    </label>
  );
}

function AdminTextarea({ label, value, onChange, rows = 5, ...props }) {
  return (
    <label className="admin-field admin-field--wide">
      <span>{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={rows} {...props} />
    </label>
  );
}

function AdminList({ items, type, titleKey, onRemove }) {
  return (
    <div className="admin-card">
      <h2>Сохранено</h2>
      {items.length === 0 ? (
        <p className="admin-empty">Пока пусто.</p>
      ) : (
        <div className="admin-list">
          {items.map((item) => (
            <article key={item.id} className="admin-list__item">
              <div>
                <strong>{item[titleKey] || item.id}</strong>
                <span>{item.id}</span>
              </div>
              <button type="button" onClick={() => onRemove(type, item.id)}>
                Удалить
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;
