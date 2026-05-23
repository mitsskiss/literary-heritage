import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";
import { useI18n } from "../i18n/I18nContext";
import "./BookSocial.css";

const MAX_COMMENT_LENGTH = 800;

function getWorkUrl(workId) {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}${window.location.pathname}#/reading/${workId}`;
}

function BookSocial({ work }) {
  const { t } = useI18n();
  const { user, profile } = useAuth();
  const [comments, setComments] = useState([]);
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [draftComment, setDraftComment] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const workUrl = useMemo(() => getWorkUrl(work.id), [work.id]);
  const authorName =
    profile?.display_name || user?.user_metadata?.display_name || user?.email?.split("@")[0] || t("guestReader");

  const loadSocialData = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase || !work?.id) return;

    setIsLoading(true);
    setMessage("");

    const [{ count }, commentsResult, userLikeResult] = await Promise.all([
      supabase
        .from("work_likes")
        .select("*", { count: "exact", head: true })
        .eq("work_id", work.id),
      supabase
        .from("work_comments")
        .select("id, work_id, user_id, author_name, body, created_at")
        .eq("work_id", work.id)
        .order("created_at", { ascending: false })
        .limit(40),
      user
        ? supabase
            .from("work_likes")
            .select("work_id")
            .eq("work_id", work.id)
            .eq("user_id", user.id)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ]);

    if (commentsResult.error || userLikeResult.error) {
      setMessage(t("socialSetupRequired"));
    } else {
      setComments(commentsResult.data ?? []);
      setHasLiked(Boolean(userLikeResult.data));
      setLikesCount(count ?? 0);
    }

    setIsLoading(false);
  }, [t, user, work?.id]);

  useEffect(() => {
    loadSocialData();
  }, [loadSocialData]);

  const handleLike = async () => {
    if (!user) {
      setMessage(t("signInToInteract"));
      return;
    }

    setMessage("");

    if (hasLiked) {
      const { error } = await supabase
        .from("work_likes")
        .delete()
        .eq("work_id", work.id)
        .eq("user_id", user.id);

      if (error) {
        setMessage(t("socialActionFailed"));
        return;
      }

      setHasLiked(false);
      setLikesCount((count) => Math.max(0, count - 1));
      return;
    }

    const { error } = await supabase.from("work_likes").insert({
      work_id: work.id,
      user_id: user.id,
    });

    if (error) {
      setMessage(t("socialActionFailed"));
      return;
    }

    setHasLiked(true);
    setLikesCount((count) => count + 1);
  };

  const handleShare = async () => {
    const shareData = {
      title: work.title,
      text: `${work.title} — ${work.author}`,
      url: workUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(workUrl);
        setMessage(t("shareLinkCopied"));
      }
    } catch (error) {
      if (error?.name !== "AbortError") setMessage(t("socialActionFailed"));
    }
  };

  const handleSubmitComment = async (event) => {
    event.preventDefault();

    const body = draftComment.trim();
    if (!body) return;

    setIsSubmitting(true);
    setMessage("");

    const { data, error } = await supabase
      .from("work_comments")
      .insert({
        work_id: work.id,
        user_id: user?.id ?? null,
        author_name: authorName,
        body,
      })
      .select("id, work_id, user_id, author_name, body, created_at")
      .single();

    setIsSubmitting(false);

    if (error) {
      const needsSetup = ["23502", "42501", "PGRST301"].includes(error.code);
      setMessage(needsSetup ? t("socialSetupRequired") : t("socialActionFailed"));
      return;
    }

    setComments((current) => [data, ...current]);
    setDraftComment("");
    setMessage(t("commentPublished"));
  };

  const handleDeleteComment = async (commentId) => {
    const { error } = await supabase
      .from("work_comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      setMessage(t("socialActionFailed"));
      return;
    }

    setComments((current) => current.filter((comment) => comment.id !== commentId));
  };

  return (
    <section className="book-social" aria-label={t("communityDiscussion")}>
      <div className="book-social__header">
        <div>
          <p>{t("communityDiscussion")}</p>
          <h2>{t("bookCommunityTitle")}</h2>
        </div>
        <div className="book-social__actions">
          <button
            type="button"
            className={hasLiked ? "is-active" : ""}
            onClick={handleLike}
            disabled={!isSupabaseConfigured}
          >
            {hasLiked ? t("liked") : t("likeWork")} · {likesCount}
          </button>
          <button type="button" onClick={handleShare}>
            {t("shareWork")}
          </button>
        </div>
      </div>

      {!isSupabaseConfigured ? (
        <p className="book-social__message">{t("socialNeedsSupabase")}</p>
      ) : null}

      {message ? <p className="book-social__message">{message}</p> : null}

      <form className="book-social__form" onSubmit={handleSubmitComment}>
        <label>
          <span>{t("writeComment")}</span>
          <textarea
            value={draftComment}
            onChange={(event) => setDraftComment(event.target.value)}
            maxLength={MAX_COMMENT_LENGTH}
            rows={4}
            placeholder={t("commentPlaceholder")}
          />
        </label>
        <div className="book-social__formFooter">
          <small>
            {draftComment.length}/{MAX_COMMENT_LENGTH}
          </small>
          <button type="submit" disabled={isSubmitting || !draftComment.trim()}>
            {isSubmitting ? t("pleaseWait") : t("publishComment")}
          </button>
        </div>
      </form>

      <div className="book-social__comments">
        <div className="book-social__commentsTitle">
          <strong>{t("comments", { count: comments.length })}</strong>
          {isLoading ? <span>{t("pleaseWait")}</span> : null}
        </div>

        {comments.length > 0 ? (
          comments.map((comment) => (
            <article className="book-social__comment" key={comment.id}>
              <div>
                <strong>{comment.author_name || t("reader")}</strong>
                <span>{new Date(comment.created_at).toLocaleString()}</span>
              </div>
              <p>{comment.body}</p>
              {user?.id === comment.user_id ? (
                <button type="button" onClick={() => handleDeleteComment(comment.id)}>
                  {t("deleteComment")}
                </button>
              ) : null}
            </article>
          ))
        ) : (
          <p className="book-social__empty">{t("noCommentsYet")}</p>
        )}
      </div>
    </section>
  );
}

export default BookSocial;
