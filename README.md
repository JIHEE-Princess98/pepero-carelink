# 🍫 한컴케어링크 11.11 빼빼로 업무성향 테스트

Next.js + NestJS + Tailwind CSS v3 + Framer Motion 기반의 귀여운 10문항 업무성향 테스트입니다.

## 실행

Node.js 20 이상 권장.

```bash
npm install
npm run dev
```

- 웹: http://localhost:8000
- API: http://localhost:8080/results/count

## 게임 흐름

1. 이름 또는 닉네임 입력
2. 업무 성향 10문항
3. 선물 상자 공개 애니메이션
4. 16가지 유형 중 하나와 빼빼로 맛, 업무 강점, 결과 공유

## 참고

- 본 테스트는 **오락용**이며 공식 MBTI 검사 또는 심리 진단이 아닙니다.
- NestJS API는 현재 **인메모리 참여 수 집계**입니다. 서버 재시작 시 초기화되며, 운영 사용 시 DB 연결 및 요청 제한을 추가하세요.
- 이름은 API로 전달되지만 저장하지 않습니다. API에는 유형과 맛만 보관합니다.
- 프론트엔드(Vercel): `NEXT_PUBLIC_API_URL=https://<api-domain>`을 설정하세요. 이 값은 빌드 시 브라우저 코드에 포함되므로 API 배포 후 변경하면 Vercel을 재배포해야 합니다.
- 백엔드: `WEB_ORIGIN=https://pepero-carelink.vercel.app`을 설정하세요. 여러 프론트 주소를 허용할 경우 쉼표로 구분합니다.
- 현재 공유는 텍스트 공유/복사이며 결과 이미지 생성은 포함하지 않습니다.
