// 호출 가능한 api를 한 파일에서 관리!

const requests = {
  fetchTest: `/noticeTest`,
  fetchHome: `/home/parent`, // TODO: /home/parent => 자녀 0, /home/noChild => 자녀 0, 자녀 대시보드 생성 후 /home 으로 통합 예정
  fetchProgress: '/quiz/progress',
  fetchQuiz: 'quiz/info',
};

export default requests;
