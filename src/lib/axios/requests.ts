// 호출 가능한 api를 한 파일에서 관리!

const requests = {
  fetchTest: `/noticeTest`,
  fetchHome: `/home/parent`, // T
  stockList: `/invest/stockList`,
  investSummary: `/invest/investSummary`,
};

export default requests;
