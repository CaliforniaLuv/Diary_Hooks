import { useContext } from "react";
import { DiaryStateContext } from "./App.js";
import DiaryItem from "./DiaryItem.js";

function DiaryList() {
  const diaryList = useContext(DiaryStateContext);

  return (
    <div className="DiaryList">
      <h1>일기 리스트</h1>
      <h2>{diaryList.length}개의 일기가 있습니다.</h2>

      <ul>
        {diaryList.map((el) => (
          <DiaryItem key={el.id} {...el} />
        ))}
      </ul>
    </div>
  );
}

// 다른 타입의 프롭스일 경우 map은 오류가 발생하므로 사전에 방지
DiaryList.defalutProps = {
  diaryList: [],
};

export default DiaryList;
