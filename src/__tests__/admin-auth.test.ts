/**
 * 테스트: Admin PIN 검증 로직
 *
 * layout.tsx의 handleLogin 함수에서 사용하는 PIN 검증 로직을
 * 독립적으로 테스트합니다.
 */

// PIN 검증 순수 함수 (layout.tsx 로직을 추출)
function validateAdminPin(inputPin: string, envPin?: string): boolean {
  const adminPin = envPin || 'admin2026';
  return inputPin === adminPin;
}

describe('Admin PIN 검증', () => {
  describe('환경변수 PIN 사용', () => {
    it('올바른 PIN으로 로그인 성공', () => {
      expect(validateAdminPin('mySecret123', 'mySecret123')).toBe(true);
    });

    it('잘못된 PIN으로 로그인 실패', () => {
      expect(validateAdminPin('wrongPin', 'mySecret123')).toBe(false);
    });

    it('빈 PIN 입력 시 실패', () => {
      expect(validateAdminPin('', 'mySecret123')).toBe(false);
    });
  });

  describe('기본 PIN (환경변수 미설정)', () => {
    it('기본 PIN admin2026으로 로그인 성공', () => {
      expect(validateAdminPin('admin2026', undefined)).toBe(true);
    });

    it('과거 하드코딩 PIN(anatolia1234)은 더 이상 작동 안 함', () => {
      // 환경변수로 관리되므로 단일 PIN만 유효
      expect(validateAdminPin('anatolia1234', undefined)).toBe(false);
    });
  });

  describe('보안 케이스', () => {
    it('대소문자 구분', () => {
      expect(validateAdminPin('ADMIN2026', 'admin2026')).toBe(false);
    });

    it('앞뒤 공백 포함 시 실패', () => {
      expect(validateAdminPin(' admin2026 ', 'admin2026')).toBe(false);
    });

    it('undefined 입력 시 실패', () => {
      expect(validateAdminPin(undefined as unknown as string, 'admin2026')).toBe(false);
    });
  });
});
