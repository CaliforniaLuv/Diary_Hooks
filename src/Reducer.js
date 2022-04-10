// useState을 무분별하게 한 컴포넌트 안에 여러번 호출하면
// 너무 가독성이 안좋고 코드가 무거워 보여 reducer로 해결이 가능하다.

// useState의 즉시 변경을 위한 함수형 업데이트를 별도로 지정해줄 필요가
// 없는 관계로 useCallback의 종속배열에 딜레마에 빠질 필요가 없어
// 편리하다.
const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      return action.data;
    }

    case "CREATE": {
      const created_data = new Date().getDate();
      const newItem = {
        ...action.data,
        created_data,
      };
      return [newItem, ...state];
    }

    case "DELETE": {
      return state.filter((el) => el.id !== action.targetId);
    }

    case "EDIT": {
      return state.map((el) =>
        el.id === action.targetId ? { ...el, content: action.newContent } : el
      );
    }

    default:
      return state;
  }
};

export default reducer;
