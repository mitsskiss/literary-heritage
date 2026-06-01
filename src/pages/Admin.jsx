import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  createBlankScene,
  emptyAdminContent,
  normalizeId,
} from "../admin/adminContent";
import { useAdminAccess } from "../hooks/useAdminAccess";
import { useAdminContent } from "../hooks/useAdminContent";
import { useI18n } from "../i18n/useI18n";
import "./Admin.css";

const tabIds = ["authors", "works", "chapters", "translations", "data"];

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
  return normalizeId(value, fallback);
}

function Admin() {
  const { t } = useI18n();
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
  const tabs = tabIds.map((id) => ({
    id,
    label: t(`adminTab_${id}`),
  }));
  const syncLabel = syncStatus === "remote" ? "Supabase" : t("adminLocalStorage");
  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label ?? t("adminSectionFallback");

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

    showMessage(result?.error?.message ?? t("adminSaveDenied"));
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
    }), t("adminAuthorSaved"));

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
    }), t("adminWorkSaved"));

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
      }), t("adminChapterSaved"));

      if (saved) setChapterForm(initialChapter);
    } catch {
      showMessage(t("adminJsonError"));
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
    }), t("adminTranslationSaved"));

    if (saved) setTranslationForm(initialTranslation);
  };

  const removeItem = async (type, id) => {
    await saveSharedContent((current) => ({
      ...current,
      [type]: current[type].filter((item) => item.id !== id),
    }), t("adminDeleted"));
  };

  const importContent = async () => {
    try {
      const parsed = JSON.parse(importValue);
      const saved = await saveSharedContent(parsed, t("adminImported"));
      if (saved) setImportValue("");
    } catch {
      showMessage(t("adminImportError"));
    }
  };

  const exportJson = JSON.stringify(content, null, 2);

  if (requiresSetup) {
    return (
      <AdminAccessState
        title={t("adminSetupTitle")}
        text={t("adminSetupText")}
        protectedLabel={t("adminProtectedArea")}
        homeLabel={t("navHome")}
      />
    );
  }

  if (checkingAdmin || isRemoteLoading) {
    return (
      <AdminAccessState
        title={t("adminCheckingTitle")}
        text={t("adminCheckingText")}
        protectedLabel={t("adminProtectedArea")}
        homeLabel={t("navHome")}
      />
    );
  }

  if (!user) {
    return (
      <AdminAccessState
        title={t("adminSignInTitle")}
        text={t("adminSignInText")}
        protectedLabel={t("adminProtectedArea")}
        homeLabel={t("navHome")}
        action={<Link to="/auth" className="admin-hero__link">{t("signIn")}</Link>}
      />
    );
  }

  if (!isAdmin) {
    return (
      <AdminAccessState
        title={t("adminNoAccessTitle")}
        text={t("adminNoAccessText")}
        code={user.id}
        protectedLabel={t("adminProtectedArea")}
        homeLabel={t("navHome")}
      />
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-page__container">
        <header className="admin-hero">
          <div>
            <p className="admin-hero__kicker">{t("adminStudioKicker")}</p>
            <h1>{t("adminStudioTitle")}</h1>
            <p>
              {t("adminStudioText")}
            </p>
            <div className="admin-hero__meta" aria-label={t("adminPanelStatus")}>
              <span>{t("adminAccessMeta")}</span>
              <span>{t("adminSyncMeta", { mode: syncLabel })}</span>
              <span>{t("adminActiveMeta", { section: activeTabLabel })}</span>
            </div>
            {syncError ? <p className="admin-hero__sync">{syncError}</p> : null}
          </div>
          <Link to="/works" className="admin-hero__link">
            {t("openAllWorks")}
          </Link>
        </header>

        <section className="admin-stats" aria-label={t("adminSummary")}>
          <article>
            <strong>{content.authors.length}</strong>
            <span>{t("adminStatAuthors")}</span>
          </article>
          <article>
            <strong>{content.works.length}</strong>
            <span>{t("adminStatWorks")}</span>
          </article>
          <article>
            <strong>{content.chapters.length}</strong>
            <span>{t("adminStatChapters")}</span>
          </article>
          <article>
            <strong>{content.translations.length}</strong>
            <span>{t("adminStatTranslations")}</span>
          </article>
        </section>

        <nav className="admin-tabs" aria-label={t("adminTabsLabel")}>
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
            <FormShell title={t("adminAddAuthor")} onSubmit={addAuthor}>
              <AdminInput label={t("adminFieldName")} value={authorForm.name} onChange={(name) => setAuthorForm({ ...authorForm, name })} required />
              <AdminInput label={t("period")} value={authorForm.period} onChange={(period) => setAuthorForm({ ...authorForm, period })} />
              <AdminInput label={t("adminFieldPhotoUrl")} value={authorForm.image} onChange={(image) => setAuthorForm({ ...authorForm, image })} />
              <AdminTextarea label={t("adminFieldDescription")} value={authorForm.description} onChange={(description) => setAuthorForm({ ...authorForm, description })} required />
              <button className="admin-submit" type="submit">{t("adminSaveAuthor")}</button>
            </FormShell>
            <AdminList items={content.authors} type="authors" titleKey="name" onRemove={removeItem} savedLabel={t("adminSaved")} emptyLabel={t("adminEmpty")} removeLabel={t("deleteComment")} />
          </section>
        ) : null}

        {activeTab === "works" ? (
          <section className="admin-panel">
            <FormShell title={t("adminAddWork")} onSubmit={addWork}>
              <AdminInput label={t("adminFieldOptionalId")} value={workForm.id} onChange={(id) => setWorkForm({ ...workForm, id })} />
              <AdminInput label={t("adminFieldTitle")} value={workForm.title} onChange={(title) => setWorkForm({ ...workForm, title })} required />
              <AdminInput label={t("adminFieldAuthor")} value={workForm.author} onChange={(author) => setWorkForm({ ...workForm, author })} required />
              <AdminInput label={t("adminFieldCoverUrl")} value={workForm.image} onChange={(image) => setWorkForm({ ...workForm, image })} />
              <AdminInput label={t("adminFieldYear")} type="number" value={workForm.year} onChange={(year) => setWorkForm({ ...workForm, year })} />
              <AdminInput label={t("adminFieldThemes")} value={workForm.themes} onChange={(themes) => setWorkForm({ ...workForm, themes })} placeholder={t("adminThemesPlaceholder")} />
              <AdminInput label={t("adminFieldType")} value={workForm.type} onChange={(type) => setWorkForm({ ...workForm, type })} />
              <AdminInput label={t("period")} value={workForm.period} onChange={(period) => setWorkForm({ ...workForm, period })} />
              <AdminInput label={t("adminFieldReadingTime")} type="number" value={workForm.readingTime} onChange={(readingTime) => setWorkForm({ ...workForm, readingTime })} />
              <AdminTextarea label={t("adminFieldDescription")} value={workForm.description} onChange={(description) => setWorkForm({ ...workForm, description })} required />
              <AdminTextarea label={t("adminFieldFragment")} value={workForm.fragmentText} onChange={(fragmentText) => setWorkForm({ ...workForm, fragmentText })} />
              <AdminTextarea label={t("adminFieldFragmentNote")} value={workForm.fragmentNote} onChange={(fragmentNote) => setWorkForm({ ...workForm, fragmentNote })} />
              <button className="admin-submit" type="submit">{t("adminAddWorkButton")}</button>
            </FormShell>
            <AdminList items={content.works} type="works" titleKey="title" onRemove={removeItem} savedLabel={t("adminSaved")} emptyLabel={t("adminEmpty")} removeLabel={t("deleteComment")} />
          </section>
        ) : null}

        {activeTab === "chapters" ? (
          <section className="admin-panel">
            <FormShell title={t("adminAddChapter")} onSubmit={addChapter}>
              <label className="admin-field">
                <span>{t("work")}</span>
                <select
                  value={chapterForm.workId}
                  onChange={(event) => setChapterForm({ ...chapterForm, workId: event.target.value })}
                  required
                >
                  <option value="">{t("adminSelectWork")}</option>
                  {workOptions.map((work) => (
                    <option key={work.id} value={work.id}>{work.title}</option>
                  ))}
                </select>
              </label>
              <AdminInput label={t("adminFieldChapterNumber")} type="number" value={chapterForm.chapterNumber} onChange={(chapterNumber) => setChapterForm({ ...chapterForm, chapterNumber })} />
              <AdminInput label={t("adminFieldChapterTitle")} value={chapterForm.chapterTitle} onChange={(chapterTitle) => setChapterForm({ ...chapterForm, chapterTitle })} required />
              <AdminInput label={t("adminFieldTagline")} value={chapterForm.tagline} onChange={(tagline) => setChapterForm({ ...chapterForm, tagline })} />
              <AdminInput label={t("adminFieldMinutes")} type="number" value={chapterForm.estimatedMinutes} onChange={(estimatedMinutes) => setChapterForm({ ...chapterForm, estimatedMinutes })} />
              <AdminInput label={t("adminFieldReadingPoints")} type="number" value={chapterForm.completionXp} onChange={(completionXp) => setChapterForm({ ...chapterForm, completionXp })} />
              <AdminTextarea
                label={t("adminFieldScenesJson")}
                value={chapterForm.scenes}
                onChange={(scenes) => setChapterForm({ ...chapterForm, scenes })}
                rows={18}
              />
              <button
                type="button"
                className="admin-secondary"
                onClick={() => setChapterForm({ ...chapterForm, scenes: JSON.stringify([createBlankScene(1)], null, 2) })}
              >
                {t("adminInsertSceneTemplate")}
              </button>
              <button className="admin-submit" type="submit">{t("adminSaveChapter")}</button>
            </FormShell>
            <AdminList items={content.chapters} type="chapters" titleKey="chapterTitle" onRemove={removeItem} savedLabel={t("adminSaved")} emptyLabel={t("adminEmpty")} removeLabel={t("deleteComment")} />
          </section>
        ) : null}

        {activeTab === "translations" ? (
          <section className="admin-panel">
            <FormShell title={t("adminAddTranslation")} onSubmit={addTranslation}>
              <label className="admin-field">
                <span>{t("adminFieldType")}</span>
                <select value={translationForm.entityType} onChange={(event) => setTranslationForm({ ...translationForm, entityType: event.target.value })}>
                  <option value="work">{t("work")}</option>
                  <option value="author">{t("searchTypeAuthor")}</option>
                  <option value="chapter">{t("chapters")}</option>
                </select>
              </label>
              <AdminInput label={t("adminFieldEntityId")} value={translationForm.entityId} onChange={(entityId) => setTranslationForm({ ...translationForm, entityId })} required />
              <label className="admin-field">
                <span>{t("language")}</span>
                <select value={translationForm.language} onChange={(event) => setTranslationForm({ ...translationForm, language: event.target.value })}>
                  <option value="en">English</option>
                  <option value="ru">Русский</option>
                  <option value="kk">Қазақша</option>
                </select>
              </label>
              <AdminInput label={t("adminFieldTitle")} value={translationForm.title} onChange={(title) => setTranslationForm({ ...translationForm, title })} />
              <AdminInput label={t("adminFieldAuthorName")} value={translationForm.name} onChange={(name) => setTranslationForm({ ...translationForm, name })} />
              <AdminInput label={t("period")} value={translationForm.period} onChange={(period) => setTranslationForm({ ...translationForm, period })} />
              <AdminInput label={t("adminFieldChapterTagline")} value={translationForm.tagline} onChange={(tagline) => setTranslationForm({ ...translationForm, tagline })} />
              <AdminTextarea label={t("adminFieldDescription")} value={translationForm.description} onChange={(description) => setTranslationForm({ ...translationForm, description })} />
              <button className="admin-submit" type="submit">{t("adminSaveTranslation")}</button>
            </FormShell>
            <AdminList items={content.translations} type="translations" titleKey="entityId" onRemove={removeItem} savedLabel={t("adminSaved")} emptyLabel={t("adminEmpty")} removeLabel={t("deleteComment")} />
          </section>
        ) : null}

        {activeTab === "data" ? (
          <section className="admin-panel">
            <div className="admin-card">
              <h2>{t("adminExportImport")}</h2>
              <p>
                {t("adminExportImportText")}
              </p>
              <textarea value={exportJson} readOnly rows={14} />
              <textarea
                value={importValue}
                onChange={(event) => setImportValue(event.target.value)}
                rows={8}
                placeholder={t("adminImportPlaceholder")}
              />
              <div className="admin-actions">
                <button type="button" className="admin-submit" onClick={importContent}>{t("adminImport")}</button>
                <button type="button" className="admin-danger" onClick={() => saveSharedContent(emptyAdminContent, t("adminCleared"))}>{t("adminClearData")}</button>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function AdminAccessState({ title, text, code, action, protectedLabel, homeLabel }) {
  return (
    <main className="admin-page">
      <div className="admin-page__container">
        <section className="admin-hero admin-hero--access">
          <div>
            <p className="admin-hero__kicker">{protectedLabel}</p>
            <h1>{title}</h1>
            <p>{text}</p>
            {code ? <code className="admin-access-code">{code}</code> : null}
          </div>
          {action ?? <Link to="/" className="admin-hero__link">{homeLabel}</Link>}
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

function AdminList({ items, type, titleKey, onRemove, savedLabel, emptyLabel, removeLabel }) {
  return (
    <div className="admin-card">
      <h2>{savedLabel}</h2>
      {items.length === 0 ? (
        <p className="admin-empty">{emptyLabel}</p>
      ) : (
        <div className="admin-list">
          {items.map((item) => (
            <article key={item.id} className="admin-list__item">
              <div>
                <strong>{item[titleKey] || item.id}</strong>
                <span>{item.id}</span>
              </div>
              <button type="button" onClick={() => onRemove(type, item.id)}>
                {removeLabel}
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;
