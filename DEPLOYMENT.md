# 처음 해보는 GitHub 업로드와 무료 웹 공개

확인일: 2026-10-01. 이 문서는 Windows PowerShell과 현재 QuizGame 프로젝트를 기준으로 합니다.

## 1. 이번에 사용할 방법

**GitHub Free 계정 + 공개 저장소 + GitHub Pages**를 사용합니다.

GitHub는 코드 보관 장소이고, GitHub Pages는 그 코드로 만든 웹페이지를 제공하는 서비스입니다. 현재 게임은 별도의 데이터 서버가 필요 없는 구조여서 이 방법에 맞습니다. 무료 계정의 공개 저장소에서 Pages를 사용할 수 있습니다. [GitHub Pages 안내](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

이 안내서의 구성에서는 다음 비용이 발생하지 않습니다.

| 항목 | 사용 방식 |
|---|---|
| 코드 보관 | GitHub Free의 공개 저장소 |
| 웹페이지 제공 | GitHub Pages |
| 웹 주소 | 제공되는 `github.io` 주소 사용 |
| 자동 검사·배포 | 공개 저장소에서 GitHub 표준 실행 환경 사용 |

공개 저장소에서 표준 GitHub Actions 실행 환경을 사용하는 것은 무료입니다. 여기 작성한 자동 배포 설정은 `ubuntu-latest` 표준 환경을 사용합니다. 유료 대형 실행 환경이나 별도 도메인은 신청할 필요가 없습니다. [Actions 요금 안내](https://docs.github.com/en/billing/concepts/product-billing/github-actions)

Pages는 사이트 크기 1GB, 월 전송량 100GB의 소프트 제한 등이 있습니다. 현재 게임의 배포 파일은 약 0.26MB이고 별도 이미지·동영상이 없으므로 가족 몇 명이 사용하는 규모에는 여유가 있다고 판단합니다. 무료 정책은 변경될 수 있어 현재 공식 문서 기준으로 안내합니다. [Pages 제한](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

### 공개 전에 알아둘 동작

- **사이트는 공개 웹사이트입니다.** 가족에게만 주소를 보내도 비밀번호가 있는 가족 전용 공간이 되지는 않습니다.
- **공개 저장소의 소스 코드도 볼 수 있습니다.** 이 방식에서는 문제와 정답도 코드에 포함되어 공개됩니다.
- 가족은 GitHub 가입 없이 게임 주소에 접속하면 됩니다.
- 공개 후에는 내 PC를 꺼도 게임이 열립니다. GitHub가 배포 파일을 제공합니다.
- 랭킹은 각 브라우저에 따로 저장됩니다. 아빠 휴대전화의 점수가 엄마 휴대전화에 보이지 않습니다.
- 가족 공용 랭킹을 만들려면 별도의 온라인 저장 기능을 추가해야 합니다. 이번 MVP에는 없습니다.
- 로컬 주소에서 저장한 점수는 새 인터넷 주소로 자동 이동하지 않습니다.

사이트 공개 범위는 [GitHub의 배포 설정 안내](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)에서도 확인할 수 있습니다.

## 2. 진행 흐름 이해하기

```text
내 PC의 QuizGame 폴더
        ↓ Git으로 변경 내용을 기록하고 업로드
GitHub의 QuizGame 저장소
        ↓ GitHub Actions가 검사하고 웹용 파일을 생성
GitHub Pages
        ↓
가족이 인터넷 주소로 접속
```

처음 나오는 용어는 다음 의미입니다.

- **Git**: 파일 변경 이력을 관리하는 도구. 현재 PC에 설치되어 있습니다.
- **저장소(repository)**: 한 프로젝트의 파일과 이력을 모아 두는 장소.
- **커밋(commit)**: 현재 변경 내용을 이름 붙여 기록하는 것.
- **푸시(push)**: 내 PC의 커밋을 GitHub로 올리는 것.
- **브랜치(branch)**: 변경 이력의 작업 줄기. 여기서는 기본 줄기인 `main` 하나를 사용합니다.
- **빌드(build)**: 개발용 코드를 브라우저가 실행할 배포 파일로 바꾸는 것.
- **배포(deploy)**: 완성된 웹 파일을 인터넷에서 열 수 있게 게시하는 것.
- **GitHub Actions**: 검사·빌드·배포 명령을 GitHub에서 자동 실행하는 기능.

현재 상태는 **로컬 준비와 검증 완료**입니다. Git 저장소 생성, GitHub 업로드, 인터넷 공개는 아직 실행하지 않았습니다.

## 3. GitHub 계정 준비

1. 브라우저에서 [GitHub](https://github.com/)를 엽니다.
2. 계정이 있으면 **Sign in**, 없으면 **Sign up**을 누릅니다.
3. 무료 개인 계정을 만듭니다. 사용자 이름은 나중에 사이트 주소의 일부가 됩니다.
4. 이메일 확인 요청이 오면 인증을 완료합니다.
5. 추가 인증 설정을 요구하면 GitHub 화면의 안내를 따릅니다.

예를 들어 사용자 이름이 `myquizfamily`라면 게임 주소는 나중에 `https://myquizfamily.github.io/QuizGame/` 형태가 됩니다. 이것은 예시이며 현재 만들어진 주소가 아닙니다. [계정 만들기 공식 안내](https://docs.github.com/en/account-and-profile/how-tos/account-management/creating-an-account-on-github)

### 커밋에 사용할 이메일 준비

공개 커밋에는 작성자 이름과 이메일이 포함됩니다. 실제 이메일 공개를 피하려면 다음처럼 준비합니다.

1. GitHub 오른쪽 위 프로필 사진 → **Settings**.
2. 왼쪽 **Emails**.
3. **Keep my email addresses private**를 켭니다.
4. 그 화면의 `…@users.noreply.github.com` 주소를 복사해 둡니다.

주소 형식은 계정마다 다르므로 예시를 만들어 쓰지 말고 **본인 화면의 주소를 그대로 복사**하세요. 이 설정은 GitHub 계정의 이메일 공개 설정에 영향을 주며 언제든 다시 바꿀 수 있습니다. 위험도는 낮습니다. [커밋 이메일 공식 안내](https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address)

## 4. GitHub에 빈 저장소 만들기

이 단계는 GitHub 계정에 새 공개 저장 공간을 만듭니다. 아직 게임 파일을 업로드하지 않습니다. 위험도는 낮고, 다른 저장소에는 영향이 없습니다.

1. [새 저장소 만들기](https://github.com/new)를 엽니다.
2. **Owner**가 본인 계정인지 확인합니다.
3. **Repository name**에 `QuizGame`을 입력합니다.
4. **Description**은 `가족과 함께 즐기는 상식 퀴즈 게임`처럼 적어도 되고 비워도 됩니다.
5. 공개 범위는 **Public**을 선택합니다.
6. **Add a README file**은 선택하지 않습니다.
7. **Add .gitignore**는 선택하지 않습니다.
8. **Choose a license**는 이번에는 선택하지 않습니다.
9. **Create repository**를 누릅니다.

README와 제외 파일 설정은 로컬에 이미 있습니다. 빈 저장소로 만들어야 서로 다른 초기 이력 때문에 업로드가 충돌하는 일을 피하기 쉽습니다. [저장소 생성 공식 안내](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)

새 화면의 **HTTPS** 주소를 복사합니다. 보통 `https://github.com/본인아이디/QuizGame.git` 형태입니다. 뒤에서 사용합니다.

## 5. VS Code에서 QuizGame만 열기

1. VS Code 메뉴에서 **파일 → 새 창**을 선택합니다.
2. 새 창에서 **파일 → 폴더 열기**를 선택합니다.
3. `E:\CodexProjects\QuizGame`을 선택합니다.
4. 왼쪽 파일 목록에 `PRD.md`, `package.json`, `src`가 보이는지 확인합니다.
5. **터미널 → 새 터미널**을 엽니다. PowerShell을 사용합니다.

아래 명령은 한 단계씩 실행합니다. `#`으로 시작하는 줄은 설명이므로 함께 붙여 넣어도 됩니다. 오류가 나오면 다음 단계로 넘어가지 말고 오류를 확인하세요.

```powershell
# 반드시 퀴즈게임 폴더 안으로 이동합니다.
cd E:\CodexProjects\QuizGame
# 현재 작업 폴더가 QuizGame인지 확인합니다.
Get-Location
# 이미 설치된 Git의 버전을 확인합니다.
git --version
```

현재 위치가 `E:\CodexProjects`까지만 나오면 안 됩니다. 이 안내서는 **QuizGame 한 프로젝트만** 올리는 절차입니다.

## 6. 내 PC에서 첫 변경 기록 만들기

이 단계는 `QuizGame\.git`이라는 변경 이력 폴더를 만들고 프로젝트 전용 작성자 정보를 설정합니다. 게임 소스나 다른 프로젝트의 설정을 바꾸지 않습니다. 위험도는 낮습니다. 커밋을 남겨 두면 이후 변경을 이전 상태와 비교하고 복원할 수 있습니다. 아직 인터넷으로 전송하지 않습니다.

```powershell
# 현재 QuizGame 폴더의 변경 이력을 시작하고 기본 브랜치를 main으로 지정합니다.
git init -b main
```

처음 실행하면 `Initialized empty Git repository ...QuizGame/.git/`와 비슷한 문구가 나옵니다. 이미 초기화한 뒤라면 반복할 필요가 없습니다.

아래 **두 값은 본인 값으로 바꾸어** 실행합니다. `원하는작성자이름`은 실명 대신 별명이어도 됩니다.

```powershell
# 이 프로젝트의 변경 기록에 표시할 이름을 지정합니다.
git config --local user.name "원하는작성자이름"
# GitHub Emails 화면에서 복사한 본인의 비공개용 이메일을 지정합니다.
git config --local user.email "본인-noreply-이메일"
# 프로젝트 전용 작성자 이름을 확인합니다.
git config --local user.name
# 프로젝트 전용 이메일을 확인합니다.
git config --local user.email
```

`--local`은 **이 프로젝트에만 적용**한다는 뜻입니다. 작성자 이름은 로그인 계정과는 별개입니다. [Git 작성자 이름 설정](https://docs.github.com/en/get-started/git-basics/setting-your-username-in-git)

```powershell
# 기록할 파일을 선택하기 전에 현재 상태를 확인합니다.
git status --short
# .gitignore에서 제외한 항목을 빼고 현재 프로젝트의 변경 파일을 선택합니다.
git add .
# 첫 업로드에 포함할 파일 이름을 확인합니다.
git diff --cached --name-only
```

포함되어야 할 핵심 항목:

- `src/` 아래 소스 파일
- `index.html`, `package.json`, `package-lock.json`
- `tsconfig.json`, `vite.config.ts`
- `.github/workflows/deploy.yml`
- `.gitignore`, `AGENTS.md`, `PRD.md`와 설명 문서
- 검사 설정·검사 파일

제외되어야 할 항목:

- `node_modules/`: 설치된 도구 사본
- `.npm-cache/`: 다운로드 임시 자료
- `dist/`: 자동 배포에서 다시 만드는 웹 파일
- `test-results/`, `playwright-report/`: 검사 결과·캡처
- `.review-backups/`: 수정 전 백업
- `.env` 등 개인 설정 파일
- 다른 프로젝트 파일

`git add .`는 점을 포함해 입력합니다. 여기서 점은 **현재 폴더**를 의미합니다. 위 목록과 맞는지 확인한 뒤 커밋합니다.

```powershell
# 현재 프로젝트의 첫 버전을 로컬 변경 이력에 저장합니다.
git commit -m "Create Quiz 40 MVP"
# 아직 기록하지 않은 변경이 남았는지 확인합니다.
git status
```

`nothing to commit, working tree clean`이 나오면 현재 변경이 모두 기록된 상태입니다.

## 7. GitHub에 올리기

**이 단계부터 코드가 인터넷의 공개 저장소로 전송됩니다.** 대상은 4단계에서 만든 본인의 `QuizGame` 저장소입니다. 위험도는 보통입니다. 공개 이후 사이트를 내리거나 파일을 삭제할 수 있지만, 이미 다른 사람이 내려받은 복사본까지 회수할 수는 없습니다. 업로드 목록에 개인 파일이 없는지 확인한 상태에서 실행합니다.

아래의 `본인아이디` 부분을 바꾸거나, 앞서 복사한 **본인 저장소의 HTTPS 주소 전체**를 따옴표 안에 붙여 넣습니다.

```powershell
# 업로드할 GitHub 저장소의 주소를 origin이라는 이름으로 연결합니다.
git remote add origin "https://github.com/본인아이디/QuizGame.git"
# 연결된 주소가 본인의 QuizGame 저장소인지 확인합니다.
git remote -v
# 로컬 main 브랜치의 기록을 GitHub에 처음 업로드합니다.
git push -u origin main
```

`origin`은 연결 주소의 별명이고, `-u`는 다음부터 `git push`만으로 같은 곳에 올릴 수 있게 연결을 기억하는 옵션입니다.

로그인 창이나 브라우저가 열리면 본인 계정으로 로그인합니다. **Sign in with your browser** 선택지가 있으면 사용할 수 있습니다. 사용자 이름·비밀번호만 묻는 오래된 방식이 나오면 일반 계정 비밀번호를 반복 입력하지 마세요. Git 명령의 HTTPS 인증에는 자격 증명 관리자나 토큰 등이 쓰입니다. 비밀번호·토큰은 채팅이나 소스 파일에 적지 않습니다. [GitHub 인증 방식](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github)

완료되면 브라우저의 GitHub 저장소 화면을 새로고침합니다. 파일 목록에서 `src`, `package.json`, `.github`가 보이면 업로드가 된 것입니다.

첫 업로드 직후 자동 배포가 시작될 수 있습니다. 아직 Pages 설정 전이라 **Configure Pages**에서 실패했다면 다음 단계 후 다시 실행하면 됩니다. 파일 업로드를 다시 할 필요는 없습니다.

## 8. 웹페이지 공개 기능 켜기

이 단계는 `QuizGame`의 배포 결과를 공개 웹사이트로 제공합니다. 위험도는 보통이며, 주소를 아는 외부인도 접속할 수 있습니다. 계정 전체의 다른 프로젝트를 공개하는 설정은 아닙니다. 나중에 Pages를 게시 취소하고 배포 작업을 끄면 공개를 중단할 수 있습니다.

1. GitHub의 **QuizGame 저장소 화면**을 엽니다.
2. 상단의 **Settings**를 누릅니다. 오른쪽 프로필 메뉴의 계정 Settings와 구분하세요.
3. 왼쪽 메뉴에서 **Pages**를 누릅니다.
4. **Build and deployment**의 **Source**에서 **GitHub Actions**를 선택합니다.
5. 별도의 템플릿을 생성할 필요가 없습니다. `.github/workflows/deploy.yml`을 이미 준비했습니다.
6. 상단 **Actions** 탭으로 이동합니다.
7. 왼쪽의 **Deploy Quiz 40**을 선택합니다.
8. **Run workflow**를 누르고 브랜치가 `main`인지 확인한 뒤 실행합니다.

설정 메뉴 이름은 서비스 화면 변경에 따라 조금 달라질 수 있습니다. [공식 Pages 설정 절차](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

자동 작업은 다음 순서로 진행됩니다.

1. 코드를 가져옴.
2. Node.js 24를 GitHub 실행 환경에 준비.
3. `package-lock.json`에 기록된 버전으로 도구 설치.
4. 문제 구조와 게임 로직 검사.
5. 배포용 `dist` 생성.
6. 웹 파일 업로드 및 Pages 게시.

노란색 상태는 진행 중, 초록 체크는 성공, 빨간 표시가 있으면 실패입니다. 보통 몇 분 걸리지만 대기 시간은 달라질 수 있습니다. `build`와 `deploy`가 모두 성공했는지 확인합니다. 현재 자동 배포는 코드 검사·기능 테스트·빌드를 실행하며, PC의 Edge를 이용하는 브라우저 검사는 로컬에서 실행하는 구조입니다. [배포 작업 구성 공식 안내](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## 9. 가족에게 공유할 주소 확인

1. 저장소 **Settings → Pages**로 돌아갑니다.
2. 게시된 주소 또는 **Visit site**를 찾습니다.
3. 주소를 클릭해 게임을 시작합니다.

예시 주소는 `https://본인아이디.github.io/QuizGame/`입니다. 실제로 표시된 주소를 복사하세요. 저장소 이름의 대소문자도 유지합니다.

주소는 세 가지를 구분하면 쉽습니다.

| 주소 형태 | 용도 |
|---|---|
| `https://github.com/아이디/QuizGame` | 코드와 설명서를 보는 곳 |
| `https://아이디.github.io/QuizGame/` | 가족이 실제 게임하는 곳 |
| `http://127.0.0.1:5173` | 내 PC에서 개발할 때 쓰는 곳 |

가족에게는 **두 번째 게임 주소**를 보냅니다. 가족 휴대전화에 도구를 설치할 필요는 없습니다.

공개 후 직접 확인할 항목:

- 휴대전화에서 게임 주소가 열리는지.
- Wi-Fi를 끄고 휴대전화 데이터 연결로도 열리는지.
- 답을 고르면 정오답과 해설이 표시되는지.
- 끝까지 풀고 닉네임을 등록할 수 있는지.
- 같은 브라우저에서 새로고침한 뒤 랭킹 기록이 남는지.

각 가족의 랭킹이 서로 다르게 보이는 것은 현재 구현의 정상 동작입니다. 게임 종료 화면을 캡처해 가족끼리 점수를 비교할 수 있습니다.

## 10. 나중에 게임을 수정해서 다시 올리기

다음 명령은 현재 QuizGame의 변경분을 기록하고 공개 사이트를 갱신합니다. 업로드 후 자동 배포가 실행되어 가족이 보는 게임이 바뀝니다. 위험도는 보통이며, 이전 커밋으로 변경을 되돌리고 다시 배포할 수 있습니다. 문제를 바꿀 때는 `AGENTS.md`에 따라 정답과 출처도 검토합니다.

```powershell
# 퀴즈게임 폴더로 이동합니다.
cd E:\CodexProjects\QuizGame
# 문제 구조와 게임 로직이 유지되는지 검사합니다.
npm.cmd test
# 배포 파일을 만들며 TypeScript 오류를 검사합니다.
npm.cmd run build
# 변경한 파일 목록을 확인합니다.
git status --short
# 변경 내용을 기록 대상으로 선택합니다.
git add .
# 실제 기록할 변경을 확인합니다.
git diff --cached
# 이번 변경을 이름 붙여 기록합니다. 따옴표 안 설명은 바꿔도 됩니다.
git commit -m "Improve quiz content"
# GitHub로 올립니다. 자동 검사와 재배포가 시작됩니다.
git push
```

`git diff` 화면이 길어서 멈춘 것처럼 보이면 `q`를 눌러 나오면 됩니다. 검사에서 실패하면 문제를 해결하고 나서 업로드합니다.

처음 만든 저장소와 연결은 유지되므로 `git init`, `git remote add origin`은 반복하지 않습니다. 사이트가 예전 화면이면 Actions의 성공을 확인한 뒤 `Ctrl+F5`로 새로고침합니다.

## 11. 자주 막히는 지점

| 상황 | 먼저 확인할 내용 |
|---|---|
| `npm.ps1` 실행 정책 오류 | 이 문서처럼 `npm.cmd`를 사용합니다. 시스템 실행 정책을 바꿀 필요가 없습니다. |
| `not a git repository` | 현재 폴더가 QuizGame인지, 6단계의 초기화를 했는지 확인합니다. |
| `Author identity unknown` | 프로젝트 전용 이름과 이메일을 설정했는지 확인합니다. |
| `remote origin already exists` | `git remote -v`로 기존 연결을 확인합니다. 같은 주소면 추가 단계를 건너뜁니다. |
| `Repository not found` | 저장소 주소·철자·로그인 계정·저장소 생성 여부를 확인합니다. |
| `Permission denied` 또는 인증 실패 | 로그인한 계정이 저장소를 만든 계정인지 확인합니다. |
| `rejected` 또는 `fetch first` | GitHub 쪽에 별도 변경 이력이 있을 수 있습니다. 강제로 덮어쓰지 말고 메시지를 확인합니다. |
| Pages에서 유료 전환 안내 | 저장소가 Public인지, 무료 개인 계정의 공개 저장소인지 확인합니다. |
| Actions의 Configure Pages 실패 | Settings → Pages의 Source를 GitHub Actions로 선택한 뒤 다시 실행합니다. |
| Actions에 작업이 안 보임 | `.github/workflows/deploy.yml`이 저장소 최상위에 있고 `main`에 올라갔는지 확인합니다. |
| 배포 초록 체크 직후 404 | Settings → Pages의 실제 주소를 사용하고 잠시 후 다시 확인합니다. |
| README만 보임 | `github.com` 주소와 `github.io` 게임 주소를 구분합니다. |
| 게임이 빈 화면 | Actions의 Build 로그와 브라우저 오류를 확인합니다. 경로 설정이 있는 `vite.config.ts`가 업로드됐는지 확인합니다. |
| 다른 휴대전화에 점수가 없음 | 현재 랭킹은 브라우저별 저장입니다. 온라인 공용 랭킹은 아직 없습니다. |

오류를 도움 요청할 때는 실패한 단계와 오류 문구를 알려주세요. 비밀번호나 인증 토큰은 제외합니다.

## 12. 공개를 중단하고 싶을 때

저장소를 바로 삭제하기보다 **Actions → Deploy Quiz 40 → 메뉴 → Disable workflow**로 자동 배포를 끈 뒤, **Settings → Pages → Unpublish site**가 제공되면 게시를 취소합니다. 자동 배포를 끄는 것만으로 기존 사이트가 내려가지는 않습니다. 게시 취소와 코드 저장소 공개 범위는 별개입니다. 공개 저장소의 코드는 계속 보일 수 있습니다.

이 안내는 현재 메뉴 기준이므로 실제 화면에서 항목을 확인한 뒤 진행합니다. 공개 중단은 가족의 접속에도 영향을 주며, 다시 배포하면 사이트를 재개할 수 있습니다. 위험도는 보통입니다.

메뉴 위치는 [GitHub의 사이트 게시 취소 안내](https://docs.github.com/en/pages/getting-started-with-github-pages/unpublishing-a-github-pages-site)에서도 확인할 수 있습니다.

## 13. 준비된 파일과 검증 한계

- `vite.config.ts`: 저장소 이름이 붙은 주소에서도 파일 경로가 맞도록 설정.
- `.github/workflows/deploy.yml`: 검사 후 GitHub Pages에 배포하는 순서.
- `.gitignore`: 설치 도구·캐시·백업·개인 설정 파일을 업로드 대상에서 제외.
- `CONTENT_REVIEW.md`: 50문제의 사실관계와 수정 근거.
- `VERIFICATION.md`: 실제 수행한 검사 결과.
- `playwright.production.config.ts`, `scripts/serve-built-site.mjs`: 배포 파일을 `/QuizGame/` 주소에서 검사하는 로컬 도구.

GitHub Pages 경로 설정은 [Vite 배포 안내](https://vite.dev/guide/static-deploy)와 [상대 경로 설정](https://vite.dev/guide/build#relative-base)을 참고했습니다.

**GitHub 원격 실행은 아직 검증하지 않았습니다.** 이 안내서 7~9단계를 완료한 뒤 Actions 성공과 실제 인터넷 주소를 확인해야 온라인 공개 완료입니다. 실제 휴대전화·Safari의 동작은 공개 후 확인하세요.
