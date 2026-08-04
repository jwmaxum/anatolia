/**
 * 테스트: Admin ID/Password 검증 및 비밀번호 변경 로직
 */

const DEFAULT_ADMIN_ID = 'siteadmin';
const INITIAL_ADMIN_PW = '!admin1004';

function validateAdminLogin(username: string, passwordInput: string, currentSavedPw?: string): boolean {
  const validPw = currentSavedPw || INITIAL_ADMIN_PW;
  return username.trim() === DEFAULT_ADMIN_ID && passwordInput === validPw;
}

function changeAdminPassword(currentPw: string, newPw: string, confirmPw: string, savedPw?: string) {
  const stored = savedPw || INITIAL_ADMIN_PW;
  if (currentPw !== stored) {
    return { success: false, error: '현재 비밀번호가 일치하지 않습니다.' };
  }
  if (!newPw || newPw.length < 6) {
    return { success: false, error: '새 비밀번호는 최소 6자리 이상이어야 합니다.' };
  }
  if (newPw !== confirmPw) {
    return { success: false, error: '새 비밀번호 확인이 일치하지 않습니다.' };
  }
  return { success: true, newPassword: newPw };
}

describe('Admin ID / Password 로그인 검증', () => {
  it('올바른 아이디 siteadmin 및 초기 비밀번호 !admin1004로 로그인 성공', () => {
    expect(validateAdminLogin('siteadmin', '!admin1004')).toBe(true);
  });

  it('아이디에 공백이 있어도 trim 후 로그인 성공', () => {
    expect(validateAdminLogin(' siteadmin ', '!admin1004')).toBe(true);
  });

  it('잘못된 아이디 입력 시 로그인 실패', () => {
    expect(validateAdminLogin('admin', '!admin1004')).toBe(false);
  });

  it('잘못된 비밀번호 입력 시 로그인 실패', () => {
    expect(validateAdminLogin('siteadmin', 'wrongpassword')).toBe(false);
  });

  it('변경되어 저장된 비밀번호로 로그인 성공', () => {
    expect(validateAdminLogin('siteadmin', 'newSecret2026!', 'newSecret2026!')).toBe(true);
    expect(validateAdminLogin('siteadmin', '!admin1004', 'newSecret2026!')).toBe(false);
  });
});

describe('비밀번호 변경 로직 검증', () => {
  it('올바른 정보 입력 시 비밀번호 변경 성공', () => {
    const res = changeAdminPassword('!admin1004', 'newPass123!', 'newPass123!');
    expect(res.success).toBe(true);
    expect(res.newPassword).toBe('newPass123!');
  });

  it('현재 비밀번호 오입력 시 변경 실패', () => {
    const res = changeAdminPassword('wrongPw', 'newPass123!', 'newPass123!');
    expect(res.success).toBe(false);
    expect(res.error).toBe('현재 비밀번호가 일치하지 않습니다.');
  });

  it('새 비밀번호 6자 미만 시 변경 실패', () => {
    const res = changeAdminPassword('!admin1004', '123', '123');
    expect(res.success).toBe(false);
    expect(res.error).toBe('새 비밀번호는 최소 6자리 이상이어야 합니다.');
  });

  it('새 비밀번호 확인 불일치 시 변경 실패', () => {
    const res = changeAdminPassword('!admin1004', 'newPass123!', 'different123!');
    expect(res.success).toBe(false);
    expect(res.error).toBe('새 비밀번호 확인이 일치하지 않습니다.');
  });
});
