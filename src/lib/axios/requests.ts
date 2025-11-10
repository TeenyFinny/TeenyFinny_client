// 호출 가능한 api를 한 파일에서 관리!

const requests = {
  fetchTest: `/noticeTest`,
  fetchHome: `/home/parent`, // T
  stockList: `/stock/list`,
};

export default requests;
