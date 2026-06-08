import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  createBlankScene,
  emptyAdminContent,
  normalizeId,
} from "../admin/adminContent";
import { authors as baseAuthors } from "../data/authors";
import { chapterStoryLibrary } from "../data/stories";
import { works as baseWorks } from "../data/works";
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
  const { canMutateAdminData, checkingAdmin, isDemoAdmin } = useAdminAccess();
  const {
    content,
    updateContent,
    isRemoteLoading,
    syncStatus,
    syncError,
  } = useAdminContent({ canWrite: canMutateAdminData });
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
  const demoContent = useMemo(
    () => ({
      authors: baseAuthors.map((author) => ({
        id: author.slug ?? makeId(author.canonicalName ?? author.name, "author"),
        name: author.name,
        period: author.period,
        description: author.description,
      })),
      works: baseWorks.map((work) => ({
        id: work.id,
        title: work.title,
        author: work.author,
        year: work.year,
        description: work.description,
      })),
      chapters: Object.values(chapterStoryLibrary).map((chapter) => ({
        id: chapter.id,
        workId: chapter.workId,
        chapterTitle: chapter.chapterTitle,
      })),
      translations: emptyAdminContent.translations,
    }),
    []
  );
  const displayContent = canMutateAdminData ? content : demoContent;
  const syncLabel = isDemoAdmin ? t("adminDemoSync") : syncStatus === "remote" ? "Supabase" : t("adminLocalStorage");
  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label ?? t("adminSectionFallback");

  const workOptions = useMemo(
    () => displayContent.works.map((work) => ({ id: work.id, title: work.title })),
    [displayContent.works]
  );

  const showMessage = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2600);
  };

  const saveSharedContent = async (updater, successMessage) => {
    if (!canMutateAdminData) {
      showMessage(t("adminDemoSaveBlocked"));
      return false;
    }

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
    if (!canMutateAdminData) {
      showMessage(t("adminDemoSaveBlocked"));
      return;
    }

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

  const exportJson = JSON.stringify(displayContent, null, 2);

  if (checkingAdmin || (canMutateAdminData && isRemoteLoading)) {
    return (
      <AdminAccessState
        title={t("adminCheckingTitle")}
        text={t("adminCheckingText")}
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
            <p className="admin-hero__kicker">{isDemoAdmin ? t("adminDemoKicker") : t("adminStudioKicker")}</p>
            <h1>{isDemoAdmin ? t("adminDemoTitle") : t("adminStudioTitle")}</h1>
            <p>
              {isDemoAdmin ? t("adminDemoText") : t("adminStudioText")}
            </p>
            <div className="admin-hero__meta" aria-label={t("adminPanelStatus")}>
              <span>{canMutateAdminData ? t("adminAccessMeta") : t("adminDemoAccessMeta")}</span>
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
            <strong>{displayContent.authors.length}</strong>
            <span>{t("adminStatAuthors")}</span>
          </article>
          <article>
            <strong>{displayContent.works.length}</strong>
            <span>{t("adminStatWorks")}</span>
          </article>
          <article>
            <strong>{displayContent.chapters.length}</strong>
            <span>{t("adminStatChapters")}</span>
          </article>
          <article>
            <strong>{displayContent.translations.length}</strong>
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
            {canMutateAdminData ? <FormShell title={t("adminAddAuthor")} onSubmit={addAuthor}>
              <AdminInput label={t("adminFieldName")} value={authorForm.name} onChange={(name) => setAuthorForm({ ...authorForm, name })} required />
              <AdminInput label={t("period")} value={authorForm.period} onChange={(period) => setAuthorForm({ ...authorForm, period })} />
              <AdminInput label={t("adminFieldPhotoUrl")} value={authorForm.image} onChange={(image) => setAuthorForm({ ...authorForm, image })} />
              <AdminTextarea label={t("adminFieldDescription")} value={authorForm.description} onChange={(description) => setAuthorForm({ ...authorForm, description })} required />
              <button className="admin-submit" type="submit">{t("adminSaveAuthor")}</button>
            </FormShell> : <AdminReadOnlyCard title={t("adminReadOnlyTitle")} text={t("adminReadOnlyText")} />}
            <AdminList items={displayContent.authors} type="authors" titleKey="name" onRemove={removeItem} savedLabel={t("adminSaved")} emptyLabel={t("adminEmpty")} removeLabel={t("deleteComment")} canRemove={canMutateAdminData} />
          </section>
        ) : null}

        {activeTab === "works" ? (
          <section className="admin-panel">
            {canMutateAdminData ? <FormShell title={t("adminAddWork")} onSubmit={addWork}>
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
            </FormShell> : <AdminReadOnlyCard title={t("adminReadOnlyTitle")} text={t("adminReadOnlyText")} />}
            <AdminList items={displayContent.works} type="works" titleKey="title" onRemove={removeItem} savedLabel={t("adminSaved")} emptyLabel={t("adminEmpty")} removeLabel={t("deleteComment")} canRemove={canMutateAdminData} />
          </section>
        ) : null}

        {activeTab === "chapters" ? (
          <section className="admin-panel">
            {canMutateAdminData ? <FormShell title={t("adminAddChapter")} onSubmit={addChapter}>
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
            </FormShell> : <AdminReadOnlyCard title={t("adminReadOnlyTitle")} text={t("adminReadOnlyText")} />}
            <AdminList items={displayContent.chapters} type="chapters" titleKey="chapterTitle" onRemove={removeItem} savedLabel={t("adminSaved")} emptyLabel={t("adminEmpty")} removeLabel={t("deleteComment")} canRemove={canMutateAdminData} />
          </section>
        ) : null}

        {activeTab === "translations" ? (
          <section className="admin-panel">
            {canMutateAdminData ? <FormShell title={t("adminAddTranslation")} onSubmit={addTranslation}>
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
            </FormShell> : <AdminReadOnlyCard title={t("adminReadOnlyTitle")} text={t("adminReadOnlyText")} />}
            <AdminList items={displayContent.translations} type="translations" titleKey="entityId" onRemove={removeItem} savedLabel={t("adminSaved")} emptyLabel={t("adminEmpty")} removeLabel={t("deleteComment")} canRemove={canMutateAdminData} />
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
              {canMutateAdminData ? (
                <>
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
                </>
              ) : <AdminReadOnlyCard title={t("adminReadOnlyTitle")} text={t("adminReadOnlyText")} />}
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

function AdminReadOnlyCard({ title, text }) {
  return (
    <div className="admin-card admin-readonly-card">
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function AdminList({ items, type, titleKey, onRemove, savedLabel, emptyLabel, removeLabel, canRemove }) {
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
              {canRemove ? <button type="button" onClick={() => onRemove(type, item.id)}>
                {removeLabel}
              </button> : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;
