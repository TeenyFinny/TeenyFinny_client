// 호출 가능한 api를 한 파일에서 관리!

/*
    호출 예시
    export async function getTest() {
        const res = await api.get(requests.fetchTest);
        return res.data;
    }
*/

const requests = {
    fetchTest: `/noticeTest`,
};

export default requests;