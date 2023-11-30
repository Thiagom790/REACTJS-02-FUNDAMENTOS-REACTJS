import { ChangeEvent, FormEvent, InvalidEvent, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import styles from "./Post.module.css";
import { Comment } from "./Comment";
import { Avatar } from "./Avatar";

interface Author {
  name: string;
  avatarUrl: string;
  role: string;
}

interface Content {
  type: "paragraph" | "link";
  content: string;
}

interface PostProps {
  author: Author;
  content: Content[];
  publishedAt: Date;
}

export function Post({ author, content, publishedAt }: PostProps) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(["bla", "ble", "bli"]);
  const isNewCommentInvalid = comment.trim() === "";

  const publishedDate = format(publishedAt, "dd 'de' LLLL 'às' HH:mm'h'", {
    locale: ptBR,
  });

  const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true,
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    // pegando o valor do input
    // console.log(event.target.comment.value);

    setComments((prevState) => [...prevState, comment]);
    setComment("");
  };

  const deleteComment = (comment: string) => {
    // imutabilidade -> não alterar o estado atual, mas sim criar um novo valor
    setComments((prevState) => prevState.filter((c) => c !== comment));
  };

  const handleNewCommentInvalid = (
    event: InvalidEvent<HTMLTextAreaElement>
  ) => {
    event.target.setCustomValidity("O comentário não pode ser vazio");
  };

  const handleNewCommentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    event.target.setCustomValidity("");
    setComment(event.target.value);
  };

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar src={author.avatarUrl} />
          <div className={styles.authorInfo}>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
          </div>
        </div>
        <time title={publishedDate} dateTime={publishedAt.toISOString()}>
          {publishedDateRelativeToNow}
        </time>
      </header>

      <div className={styles.content}>
        {content.map((line, index) => {
          if (line.type === "paragraph") {
            return <p key={index}>{line.content}</p>;
          }

          if (line.type === "link") {
            return (
              <p key={index}>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  {line.content}
                </a>
              </p>
            );
          }
        })}
      </div>

      <form className={styles.commentForm} onSubmit={handleSubmit}>
        <strong>Deixe seu feedback</strong>

        <textarea
          placeholder="Deixe um comentário"
          name="comment"
          value={comment}
          onChange={handleNewCommentChange}
          required
          onInvalid={handleNewCommentInvalid}
        />

        <footer>
          <button type="submit" disabled={isNewCommentInvalid}>
            Publicar
          </button>
        </footer>
      </form>

      <div className={styles.commentList}>
        {comments.map((comment) => (
          <Comment key={comment} content={comment} onDelete={deleteComment} />
        ))}
      </div>
    </article>
  );
}
