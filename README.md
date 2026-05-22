# PENTA LAB — 설문 시스템

GitHub Pages 배포: `https://daniel-donggil-lee.github.io/penta-lab/`

---

## 페이지 구조

| 경로 | 용도 |
|------|------|
| `/survey` | 1차 설문 (신규 응답자 공통) |
| `/survey/deep/[respondent-id]` | 2차 딥 설문 (응답자별 개인화) |
| `/admin` | 어드민 (1차 설문과 동일, 내부용) |

---

## 딥 설문 시스템

1차 설문 응답자에게 개별 맞춤 2차 설문을 보내는 구조.

### 응답자 추가 방법

1. `data/respondents/` 에 JSON 파일 생성 (예: `hong-hyunju.json`)
2. `app/survey/deep/[id]/page.tsx` 의 `RESPONDENT_IDS` 배열에 ID 추가
3. `app/survey/deep/[id]/DeepSurveyClient.tsx` 상단에 import + RESPONDENTS 맵에 등록
4. 빌드 → 배포

### 응답자 JSON 스키마

```json
{
  "id": "dalcom-kim",
  "name": "김문영",
  "org": "달콤쌤 인문학 / 더채움 교육연구소",
  "phone": "010-xxxx-xxxx",
  "email": "xxx@naver.com",
  "type": "online",
  "students": "200명~",
  "instructors": "0명",
  "staff": "1명",
  "duration": "3년~",
  "tools": {
    "수강생 소통": ["카카오 오픈채팅", "네이버카페"],
    "강의 진행": ["Zoom"],
    "콘텐츠 제작·편집": ["미리캔버스", "Canva"],
    "강의 판매·배포": ["클래스101"],
    "결제·정산": ["계좌이체 수동"],
    "마케팅·퍼널": ["인스타그램"],
    "내부 협업·문서 관리": ["엑셀·한글", "노션"],
    "데이터·성과 분석": ["없음"]
  },
  "pains": ["수강생 진도 추적 안 됨", "..."],
  "painDetails": { "수강생 진도 추적 안 됨": "상세 설명..." },
  "buildBudget": "~500만원",
  "maintBudget": "~30만원/월",
  "startTiming": "아직 탐색 중",
  "sectionNote": "참고 메모 (선택)",
  "isPentaPartner": true
}
```

### 딥 설문 섹션 (A~G, 7개)

| 섹션 | 제목 | 핵심 질문 |
|------|------|----------|
| A | 시간 양화 | 스태프 근무시간, 업무 비중, 희망 업무시간, 스텝 고용 의사 |
| B | 수강생 라이프사이클 | 동시/누적 인원, 신규 vs 재등록, 기수/상시, 완강률, 이탈 시점 |
| C | 콘텐츠·홍보 워크플로우 | 제작 소요시간, 게시 빈도/희망 빈도, 유입 유도, 자동화 의향 |
| D | 결제·매출 흐름 | PG 전환 의향, 환불 빈도, 매출 확인 주기, 세금계산서 |
| E | 채널 데이터 추적 | 광고 예산, 효과 측정, 카페 회원, 오픈채팅, 등록 경로 |
| F | 의사결정 지표 | 보고 싶은 숫자, 못 보고 있는 정보, 직관 vs 데이터 |
| G | 변화 수용도 | 학습 가용 시간, 디지털 적응력, 성공/실패 사례, 자동화 제외 영역 |

### 응답 저장

- Google Sheets ID: `1pdW8Xif8ZA75UbkAAbnn02wosNbO5kNnmuJ462E-nqw`
- 1차 설문 → `설문_응답` 탭 (17컬럼)
- 2차 딥 설문 → `딥설문_응답` 탭 (5컬럼: 타임스탬프, 응답자ID, 응답자명, 기관명, 응답내용)
- GAS Web App 엔드포인트로 GET 요청 → append

---

## 기술 스택

- Next.js (App Router, static export)
- Tailwind CSS
- GitHub Pages 배포 (`npx gh-pages -d out`)
- `basePath: "/penta-lab"`, `output: "export"`

## 빌드 & 배포

```bash
npx next build          # 정적 빌드 → out/
npx gh-pages -d out     # GitHub Pages 배포
```

## GAS Web App

- URL: `https://script.google.com/macros/s/AKfycbxN3NaaZpCPPZfH7gEJVOGnyzJp9kvH5KtTXBMh86gnp6OCxcFPN8dGaK7THmVQb9vJoQ/exec`
- 요청 형식: `GET ?payload={JSON}`
- payload: `{ "action": "append", "sheet": "탭명", "values": [...] }`
