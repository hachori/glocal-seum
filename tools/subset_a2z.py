"""에이투지체(A2Z, SIL OFL 1.1) 4~8 굵기를 웹용 WOFF2로 줄인다.

- 글자: 한글 11,172자 + 한글 자모 + 영문·숫자·문장 부호·기호(‘’·〈〉~ 등). 굵기마다 약 95KB.
- 이름표(name)는 모두 남김(라이선스 문구 nameID 13·14 유지).
사용: python subset_a2z.py <글꼴 폴더> <출력 폴더>
"""
import sys
from pathlib import Path

from fontTools import subset

SRC, OUT = Path(sys.argv[1]), Path(sys.argv[2])
WEIGHTS = {400: "4Regular", 500: "5Medium", 600: "6SemiBold", 700: "7Bold", 800: "8ExtraBold"}


def ksx1001_hangul():
    out = []
    for c in range(0xAC00, 0xD7A4):
        try:
            if len(chr(c).encode("euc_kr")) == 2:      # 8바이트 조합형 표현은 KS X 1001 밖
                out.append(c)
        except UnicodeEncodeError:
            pass
    return out


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    codes = set(range(0xAC00, 0xD7A4))      # 한글 11,172자 전부(조합 글리프라 2,350자만 둘 때와 8KB 차이)
    for a, b in [(0x20, 0x7E), (0xA0, 0xFF), (0x2010, 0x2027), (0x2030, 0x203A), (0x2190, 0x2199),
                 (0x2460, 0x2473), (0x25A0, 0x25FF), (0x3000, 0x303F), (0x3131, 0x318E), (0xFF01, 0xFF5E)]:
        codes.update(range(a, b + 1))
    codes.update([0x2122, 0x2212, 0x00D7])
    print("hangul", len(ksx1001_hangul()), "total codepoints", len(codes))
    for w, tag in WEIGHTS.items():
        src = SRC / f"에이투지체-{tag}.ttf"
        dst = OUT / f"A2Z-{w}.woff2"
        opt = subset.Options()
        opt.flavor = "woff2"
        opt.name_IDs = ["*"]
        opt.name_languages = ["*"]
        opt.layout_features = ["*"]
        opt.notdef_outline = True
        font = subset.load_font(str(src), opt)
        sub = subset.Subsetter(opt)
        sub.populate(unicodes=codes)
        sub.subset(font)
        subset.save_font(font, str(dst), opt)
        print(dst.name, src.stat().st_size, "->", dst.stat().st_size)


if __name__ == "__main__":
    main()
