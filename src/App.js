import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import reducer from "./Reducer";

export const DiaryStateContext = React.createContext();

export const DiaryDispatchContext = React.createContext();

function App() {
  // const [data, setData] = useState([]);

  // 컴포넌트 파일 안의 setState 상태 함수 사용이 많으면 지저분 하므로
  // 코드 가독성 및 경량화를 위해 useReducer로 상태함수 관리
  const [data, dispatch] = useReducer(reducer, []);

  const dataId = useRef(0);

  const getData = async () => {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    ).then((db) => db.json());

    const initData = res.slice(0, 20).map((el) => {
      return {
        author: el.email,
        content: el.body,
        // 0 ~ 4까지의 랜덤
        emotion: Math.floor(Math.random() * 5) + 1,
        created_date: new Date().getTime(),
        id: dataId.current++,
      };
    });
    dispatch({ type: "INIT", data: initData });
    // setData(initData);
  };

  useEffect(() => {
    getData();
  }, []);

  const onCreate = useCallback((author, content, emotion) => {
    // const created_date = new Date().getTime();
    // const newItem = {
    //   author,
    //   content,
    //   emotion,
    //   created_date,
    //   id: dataId.current,
    // };

    dispatch({
      type: "CREATE",
      data: { author, content, emotion, id: dataId.current },
    });
    dataId.current += 1;

    // data가 계속 바뀌면 결국 useCallback의 효과가 무용지물이 되버림.
    // 이런 딜레마를 해결해주는 방법이 함수형 업데이트이며
    //  바로 상태 함수에 콜백함수로 실행시켜주도록 하면 된다.
    // 함수형 업데이트는 즉시 반응해서 상태값을 변화 시킨다.
    // 기존 상태값 변화는 state 변경 시도 -> 리렌더링 발생 -> state 변경사항 반영 현상이 일어남

    // setData((data) => [newItem, ...data]);
  }, []);

  const onDelete = useCallback((targetId) => {
    dispatch({ type: "DELETE", targetId });

    // const newDiary = data.filter((el) => el.id !== tagetId);
    // setData((data) => data.filter((el) => el.id !== tagetId));
  }, []);

  const onEdit = useCallback((targetId, newContent) => {
    dispatch({ type: "EDIT", targetId, newContent });

    // setData((data) =>
    //   data.map((el) =>
    //     el.id === targetId ? { ...el, content: newContent } : el
    //   )
    // );
  }, []);

  // 함수형 props context로 묶기
  // useMemo로 묶는 이유는 리렌더링마다 재생성하는 것은 비효율적이므로
  const memoizedDispatches = useMemo(() => {
    return { onCreate, onDelete, onEdit };
  }, []);

  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((el) => el.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRatio };
  }, [data.length]);

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatches}>
        <div className="App">
          <DiaryEditor />
          <div>전체 일기: {data.length}</div>
          <div>기분 좋은 일기 개수: {goodCount}</div>
          <div>기분 나쁜 일기 개수: {badCount}</div>
          <div>기분 좋은 일기 비율: {goodRatio}</div>
          <DiaryList />
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
