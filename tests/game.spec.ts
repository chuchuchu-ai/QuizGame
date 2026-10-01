import { expect, test } from '@playwright/test';
import { questions } from '../src/data/questions';

test('40문제 완주, 정오답, 중복 방지, 저장, 새로고침, 재시작', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./');
  await page.getByRole('button', { name: '랭킹 보기' }).click();
  await expect(page.getByText('첫 번째 주인공을 기다려요')).toBeVisible();
  await page.getByRole('button', { name: '새로운 도전 시작' }).click();
  const seen = new Set<string>();
  for (let i = 0; i < 40; i++) {
    const title = await page.locator('h1').innerText();
    expect(seen.has(title)).toBe(false); seen.add(title);
    const question = questions.find(q => q.question === title)!;
    const next = page.getByRole('button', { name: i === 39 ? '결과 보기' : '다음 문제' });
    await expect(next).toBeDisabled();
    await expect(page.locator('.choice')).toHaveCount(5);
    await page.locator('.choice').nth(i % 2 === 0 ? question.answer : (question.answer + 1) % 5).click();
    await expect(page.locator('.feedback')).toContainText(i % 2 === 0 ? '정답입니다!' : '오답입니다.');
    await expect(page.locator('.feedback')).toContainText(question.explanation);
    await expect(page.locator('.choice:disabled')).toHaveCount(5);
    await next.click();
  }
  await expect(page.locator('.big-score')).toContainText('200');
  await expect(page.locator('.result-stats')).toContainText('50%');
  await expect(page.locator('.category-row')).toHaveCount(5);
  await page.getByRole('button', { name: '점수 등록', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('닉네임을 입력해주세요.');
  await page.getByLabel('닉네임').fill('테스트 퀴즈왕');
  await page.getByRole('button', { name: '점수 등록', exact: true }).click();
  await expect(page.getByRole('button', { name: '등록 완료' })).toBeDisabled();
  await page.getByRole('button', { name: '랭킹 보기' }).click();
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await expect(page.locator('tbody')).toContainText('테스트 퀴즈왕');
  await page.reload();
  await page.getByRole('button', { name: '랭킹 보기' }).click();
  await expect(page.locator('tbody')).toContainText('200');
  await page.getByRole('button', { name: '새로운 도전 시작' }).click();
  await expect(page.locator('.score')).toContainText('0점');
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('홈 화면이 작은 화면에도 맞고 키보드로 시작할 수 있다', async ({ page }, testInfo) => {
  await page.goto('./');
  await page.screenshot({ path: testInfo.outputPath('home.png'), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('button', { name: '게임 시작' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.choice')).toHaveCount(5);
  await page.screenshot({ path: testInfo.outputPath('quiz.png'), fullPage: true });
  await page.getByRole('button', { name: '홈으로', exact: true }).click({ noWaitAfter: true });
  // 자동화 브라우저는 확인 창을 기본 취소하므로 진행 중 게임을 유지합니다.
  await expect(page.locator('.choice')).toHaveCount(5);
});
