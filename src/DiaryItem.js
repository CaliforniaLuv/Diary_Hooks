import React, { useContext, useEffect, useRef, useState } from "react";
import { DiaryDispatchContext } from "./App";

function DiaryItem({ id, author, content, created_data, emotion }) {
  const { onDelete, onEdit } = useContext(DiaryDispatchContext);

  const handleRemove = () => {
    if (window.confirm(`${id}를 삭제하시겠습니까?`)) {
      onDelete(id);
    }
  };

  const [isEdit, setIsEdit] = useState(false);
  const toggleIsEdit = () => setIsEdit(!isEdit);

  const [localContent, setLocalContent] = useState(content);

  const handleQuitEdit = () => {
    setIsEdit(false);
    setLocalContent(content);
  };

  const editFocus = useRef();

  const handleEdit = () => {
    if (localContent.length < 5) {
      editFocus.current.focus();
      return;
    }

    if (window.confirm(`${id}번 째 일기를 수정하시겠습니까?`)) {
      onEdit(id, localContent);
      toggleIsEdit();
    }
  };

  return (
    <li className="DiaryItem">
      <div className="info">
        <span>
          작성자 : {author} ㅣ 감정점수 : {emotion}
        </span>
        <br />
        <span className="date">
          작성 시간(ms) : {new Date(created_data).toLocaleDateString()}
        </span>
      </div>
      <p className="content">
        {isEdit ? (
          <>
            <textarea
              ref={editFocus}
              value={localContent}
              onChange={(e) => setLocalContent(e.target.value)}
            />
          </>
        ) : (
          <>{content}</>
        )}
      </p>
      {isEdit ? (
        <>
          <button onClick={handleQuitEdit}>수정 취소</button>
          <button onClick={handleEdit}>수정 완료</button>
        </>
      ) : (
        <>
          <button className="DiaryItem_Remove" onClick={handleRemove}>
            X
          </button>
          <button onClick={toggleIsEdit}>수정하기</button>
        </>
      )}
    </li>
  );
}

export default React.memo(DiaryItem);
