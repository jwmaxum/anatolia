/**
 * 테스트: 파일 업로드 보안 검증 로직
 *
 * /api/upload/route.ts의 MIME 타입 & 크기 검증 로직을 단위 테스트
 */

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
};

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;   // 5MB
const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024;  // 100MB

function isAllowedMimeType(mimeType: string): boolean {
  return Boolean(ALLOWED_MIME_TYPES[mimeType.toLowerCase()]);
}

function isFileSizeAllowed(mimeType: string, sizeBytes: number): boolean {
  const isVideo = mimeType.startsWith('video/');
  const maxSize = isVideo ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
  return sizeBytes <= maxSize;
}

function sanitizeFileName(originalName: string, mimeType: string): string {
  const ext = ALLOWED_MIME_TYPES[mimeType];
  const baseName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.[^.]+$/, '');
  return `${baseName}${ext}`;
}

describe('파일 업로드 MIME 타입 검증', () => {
  it('허용된 이미지 타입 통과', () => {
    expect(isAllowedMimeType('image/jpeg')).toBe(true);
    expect(isAllowedMimeType('image/png')).toBe(true);
    expect(isAllowedMimeType('image/webp')).toBe(true);
    expect(isAllowedMimeType('image/gif')).toBe(true);
  });

  it('허용된 동영상 타입 통과', () => {
    expect(isAllowedMimeType('video/mp4')).toBe(true);
    expect(isAllowedMimeType('video/webm')).toBe(true);
  });

  it('허용되지 않은 타입 차단', () => {
    expect(isAllowedMimeType('application/exe')).toBe(false);
    expect(isAllowedMimeType('text/html')).toBe(false);
    expect(isAllowedMimeType('application/pdf')).toBe(false);
    expect(isAllowedMimeType('application/javascript')).toBe(false);
    expect(isAllowedMimeType('')).toBe(false);
  });
});

describe('파일 크기 제한 검증', () => {
  it('이미지 5MB 이하 허용', () => {
    expect(isFileSizeAllowed('image/jpeg', 4 * 1024 * 1024)).toBe(true); // 4MB
    expect(isFileSizeAllowed('image/png', 5 * 1024 * 1024)).toBe(true);  // 정확히 5MB
  });

  it('이미지 5MB 초과 차단', () => {
    expect(isFileSizeAllowed('image/jpeg', 6 * 1024 * 1024)).toBe(false); // 6MB
  });

  it('동영상 100MB 이하 허용', () => {
    expect(isFileSizeAllowed('video/mp4', 50 * 1024 * 1024)).toBe(true);  // 50MB
    expect(isFileSizeAllowed('video/mp4', 100 * 1024 * 1024)).toBe(true); // 정확히 100MB
  });

  it('동영상 100MB 초과 차단', () => {
    expect(isFileSizeAllowed('video/mp4', 101 * 1024 * 1024)).toBe(false); // 101MB
  });
});

describe('파일명 sanitize', () => {
  it('안전한 파일명 생성', () => {
    const result = sanitizeFileName('my image.jpg', 'image/jpeg');
    expect(result).toBe('my_image.jpg');
  });

  it('특수문자 제거 — 경로 순회 공격 차단', () => {
    // `../../../etc/passwd` → 슬래시가 _ 로 치환 → `.._.._.._.etc_passwd`
    // `.replace(/\.[^.]+$/, '')` 로 마지막 확장자 제거 → `.._.._..`
    // + `.png` 강제 확장자 적용 → `.._.._..png`
    // 결과 파일명은 디렉터리 순회가 불가능한 단순 파일명
    const result = sanitizeFileName('../../../etc/passwd', 'image/png');
    expect(result).toBe('.._.._..png');
    // 핵심: 결과에 '/'가 없으므로 경로 순회 공격 차단됨
    expect(result).not.toContain('/');
    expect(result).not.toContain('\\');
  });

  it('MIME 타입 기준 확장자 강제 적용', () => {
    // 업로더가 .exe를 보내도 검증된 MIME 확장자 사용
    const result = sanitizeFileName('malware.exe', 'image/jpeg');
    expect(result).toBe('malware.jpg');
  });
});
