"""프로그램 화면 p01~p12(각 폴더의 index.html)를 만든다.

- 내용(자료 링크·소개·대상 등)은 화면을 열 때 assets/data/materials.json에서 읽으므로,
  링크만 바꿀 때는 이 스크립트를 다시 돌릴 필요가 없다.
- 프로그램 이름·영역을 바꾸거나 머리글·바닥글(tools/program.template.html)을 고쳤을 때만 다시 돌린다.
사용: python tools/build_pages.py   (웹사이트 폴더에서)
"""
import html
import json
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
TEMPLATE = SITE / "tools" / "program.template.html"
DATA = SITE / "assets" / "data" / "materials.json"


def main():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    domains = {d["id"]: d for d in data["domains"]}
    tpl = TEMPLATE.read_text(encoding="utf-8")
    for p in data["programs"]:
        page = (tpl.replace("{{ID}}", p["id"])
                   .replace("{{NO}}", p["id"][1:])
                   .replace("{{NAME}}", html.escape(p["name"]))
                   .replace("{{DOMAIN}}", p["domain"])
                   .replace("{{DOMAIN_NAME}}", html.escape(domains[p["domain"]]["name"])))
        out = SITE / p["id"] / "index.html"
        out.parent.mkdir(exist_ok=True)
        out.write_text(page, encoding="utf-8", newline="\n")
        print(out.relative_to(SITE).as_posix(), p["name"])


if __name__ == "__main__":
    main()
