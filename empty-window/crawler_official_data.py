"""
职路导航官方数据采集脚本

能做什么：
1. 从研招网抓 2025 国家线、34 所自划线高校复试线页面。
2. 从国家公务员局 2025 国考专题发现并下载职位表 Excel，或读取你手动下载好的 Excel。
3. 按网站现有 DATA.majors 结构生成 JSON / JS 片段。
4. 可选自动更新 app.js 里的 DATA 覆盖层。

重要说明：
- 研招网不统一公开“所有院校所有专业报录比”，很多报录比只在各院校研究生院官网或第三方平台零散发布。
- 国家公务员局职位表不含“往年进面分数”，进面分通常在面试名单或各地补充公告中。
- 所以脚本不会伪造这些数据；抓不到的官方字段会写成“官方未统一公开”。
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.parse import urljoin

import pandas as pd
import requests
from bs4 import BeautifulSoup


YZ_NATIONAL_LINE_URL = "https://yz.chsi.com.cn/kyzx/kp/202502/20250224/2293352975.html"
YZ_34_LINE_INDEX = "https://yz.chsi.com.cn/kyzx/fsfsx34/"
GWY_2025_INDEX = "http://bm.scs.gov.cn/kl2025"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
    )
}


MAJOR_ALIASES: dict[str, list[str]] = {
    "计算机科学与技术": ["计算机科学与技术", "计算机", "软件工程", "人工智能", "数据科学", "网络空间安全"],
    "临床医学": ["临床医学", "医学", "内科学", "外科学", "儿科学"],
    "法学": ["法学", "法律", "民商法", "刑法", "诉讼法"],
    "金融": ["金融", "金融学", "金融硕士", "应用经济学"],
    "教育学": ["教育学", "教育", "小学教育", "学前教育", "教育技术"],
    "汉语言文学": ["汉语言文学", "中国语言文学", "中文", "汉语言", "文秘"],
    "英语": ["英语", "英语语言文学", "翻译", "商务英语", "外国语言文学"],
    "会计学": ["会计学", "会计", "审计", "财务会计"],
    "电气工程": ["电气工程", "电气", "电力系统", "自动化"],
    "土木工程": ["土木工程", "土木", "结构工程", "岩土工程", "工程管理"],
    "软件工程": ["软件工程", "软件", "计算机"],
    "市场营销": ["市场营销", "营销", "工商管理", "品牌管理"],
    "财务管理": ["财务管理", "财管", "会计", "财政"],
    "机械工程": ["机械工程", "机械", "机电", "智能制造"],
    "化学工程": ["化学工程", "化工", "化学", "应用化学"],
    "生物医学工程": ["生物医学工程", "生医工", "医疗器械", "生物工程"],
    "药学": ["药学", "药物制剂", "药理", "中药学"],
    "护理学": ["护理学", "护理", "助产"],
    "心理学": ["心理学", "应用心理", "心理健康教育"],
    "应用经济学": ["应用经济学", "经济学", "产业经济", "区域经济", "国际贸易"],
}


COMMON_LINKS = {
    "研招网": "https://yz.chsi.com.cn/",
    "研招资讯": "https://yz.chsi.com.cn/kyzx/",
    "硕士专业目录": "https://yz.chsi.com.cn/zsml/",
    "国家公务员局2025国考专题": GWY_2025_INDEX,
    "国家公务员局": "https://www.scs.gov.cn/",
    "国家大学生就业服务平台": "https://www.ncss.cn/",
}


@dataclass
class SourceNote:
    name: str
    url: str
    status: str


def log(msg: str) -> None:
    print(msg, flush=True)


def fetch(url: str, timeout: int = 20) -> requests.Response:
    resp = requests.get(url, headers=HEADERS, timeout=timeout)
    resp.raise_for_status()
    if not resp.encoding or resp.encoding.lower() == "iso-8859-1":
        resp.encoding = resp.apparent_encoding
    time.sleep(0.5)
    return resp


def normalize_text(value: Any) -> str:
    if value is None:
        return ""
    text = str(value)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def table_to_records(df: pd.DataFrame) -> list[dict[str, str]]:
    df = df.copy()
    df.columns = [normalize_text(c) for c in df.columns]
    rows: list[dict[str, str]] = []
    for _, row in df.iterrows():
        obj = {normalize_text(k): normalize_text(v) for k, v in row.to_dict().items()}
        if any(obj.values()):
            rows.append(obj)
    return rows


def scrape_yz_national_lines(notes: list[SourceNote]) -> list[dict[str, str]]:
    log("1/4 正在抓研招网 2025 国家线...")
    try:
        html = fetch(YZ_NATIONAL_LINE_URL).text
        tables = pd.read_html(html)
        records: list[dict[str, str]] = []
        for table in tables:
            records.extend(table_to_records(table))
        notes.append(SourceNote("研招网2025国家线", YZ_NATIONAL_LINE_URL, f"成功，表格 {len(tables)} 个"))
        return records
    except Exception as exc:
        notes.append(SourceNote("研招网2025国家线", YZ_NATIONAL_LINE_URL, f"失败：{exc}"))
        return []


def discover_yz_34_line_links(notes: list[SourceNote]) -> list[str]:
    log("2/4 正在发现研招网 34 所自划线高校复试线页面...")
    links: set[str] = set()
    try:
        html = fetch(YZ_34_LINE_INDEX).text
        soup = BeautifulSoup(html, "html.parser")
        for a in soup.find_all("a", href=True):
            text = normalize_text(a.get_text())
            href = urljoin(YZ_34_LINE_INDEX, a["href"])
            if "2025" in text and ("复试" in text or "分数" in text):
                links.add(href)
        notes.append(SourceNote("研招网34所复试线索引", YZ_34_LINE_INDEX, f"发现 {len(links)} 个链接"))
    except Exception as exc:
        notes.append(SourceNote("研招网34所复试线索引", YZ_34_LINE_INDEX, f"失败：{exc}"))
    return sorted(links)


def scrape_yz_school_lines(urls: list[str], notes: list[SourceNote]) -> list[dict[str, str]]:
    records: list[dict[str, str]] = []
    for i, url in enumerate(urls, 1):
        try:
            html = fetch(url).text
            soup = BeautifulSoup(html, "html.parser")
            title = normalize_text(soup.find(["h1", "h2"]).get_text() if soup.find(["h1", "h2"]) else soup.title.get_text())
            tables = pd.read_html(html)
            for table in tables:
                for row in table_to_records(table):
                    row["_school_page_title"] = title
                    row["_school_page_url"] = url
                    records.append(row)
            log(f"  已抓 {i}/{len(urls)}：{title}")
        except Exception as exc:
            notes.append(SourceNote("研招网院校复试线", url, f"失败：{exc}"))
    if urls:
        notes.append(SourceNote("研招网院校复试线", YZ_34_LINE_INDEX, f"成功解析记录 {len(records)} 条"))
    return records


def discover_gwy_excel(notes: list[SourceNote]) -> str | None:
    log("3/4 正在国家公务员局专题页发现职位表 Excel...")
    try:
        html = fetch(GWY_2025_INDEX).text
        soup = BeautifulSoup(html, "html.parser")
        candidates: list[str] = []
        for a in soup.find_all("a", href=True):
            text = normalize_text(a.get_text())
            href = urljoin(GWY_2025_INDEX, a["href"])
            if re.search(r"\.(xls|xlsx)$", href, re.I) or "招考简章" in text or "职位" in text:
                candidates.append(href)
        for url in candidates:
            if re.search(r"\.(xls|xlsx)(\?|$)", url, re.I):
                notes.append(SourceNote("国家公务员局职位表", url, "自动发现 Excel"))
                return url
        notes.append(SourceNote("国家公务员局职位表", GWY_2025_INDEX, "未在首页直接发现 Excel，请用 --gwy-excel 指定下载好的职位表"))
    except Exception as exc:
        notes.append(SourceNote("国家公务员局职位表", GWY_2025_INDEX, f"失败：{exc}"))
    return None


def download_file(url: str, out_dir: Path) -> Path:
    out_dir.mkdir(parents=True, exist_ok=True)
    name = url.split("/")[-1].split("?")[0] or "gwy_positions.xls"
    if not re.search(r"\.(xls|xlsx)$", name, re.I):
        name = "gwy_positions.xls"
    target = out_dir / name
    resp = fetch(url, timeout=40)
    target.write_bytes(resp.content)
    return target


def read_excel_safely(path: Path) -> pd.DataFrame:
    raw = pd.read_excel(path, header=None)
    header_row = 0
    for i in range(min(10, len(raw))):
        row_text = " ".join(normalize_text(x) for x in raw.iloc[i].tolist())
        if "专业" in row_text and ("职位" in row_text or "部门" in row_text):
            header_row = i
            break
    df = pd.read_excel(path, header=header_row)
    df.columns = [normalize_text(c) for c in df.columns]
    return df.dropna(how="all")


def find_col(columns: list[str], keywords: list[str]) -> str | None:
    for key in keywords:
        for col in columns:
            if key in col:
                return col
    return None


def scrape_gwy_positions(excel_path: Path | None, notes: list[SourceNote]) -> pd.DataFrame:
    if excel_path is None:
        notes.append(SourceNote("国考职位表解析", "", "跳过：未提供 Excel"))
        return pd.DataFrame()
    log(f"4/4 正在解析国考职位表：{excel_path}")
    try:
        df = read_excel_safely(excel_path)
        notes.append(SourceNote("国考职位表解析", str(excel_path), f"成功，{len(df)} 行"))
        return df
    except Exception as exc:
        notes.append(SourceNote("国考职位表解析", str(excel_path), f"失败：{exc}"))
        return pd.DataFrame()


def row_contains_major(row_text: str, aliases: list[str]) -> bool:
    if "不限" in row_text:
        return True
    return any(alias in row_text for alias in aliases)


def build_gong_posts(df: pd.DataFrame, major: str, limit: int = 8) -> list[dict[str, str]]:
    if df.empty:
        return [
            {
                "name": "官方职位表未成功读取",
                "req": "请重新运行脚本，或用 --gwy-excel 指定国家公务员局职位表 Excel",
                "score": "国家公务员局职位表不含往年进面分数，以官方面试名单为准",
            }
        ]
    cols = list(df.columns)
    dept_col = find_col(cols, ["部门名称", "招录机关", "部门"])
    office_col = find_col(cols, ["用人司局", "司局"])
    title_col = find_col(cols, ["招考职位", "职位名称", "职位"])
    major_col = find_col(cols, ["专业"])
    edu_col = find_col(cols, ["学历"])
    ratio_col = find_col(cols, ["面试人员比例", "面试比例"])
    aliases = MAJOR_ALIASES[major]
    picked: list[dict[str, str]] = []
    for _, row in df.iterrows():
        row_text = " ".join(normalize_text(x) for x in row.to_dict().values())
        if not row_contains_major(row_text, aliases):
            continue
        name_parts = [normalize_text(row.get(c)) for c in [dept_col, office_col, title_col] if c]
        name = " / ".join([p for p in name_parts if p]) or "国考岗位"
        req_parts = []
        if major_col:
            req_parts.append("专业：" + normalize_text(row.get(major_col)))
        if edu_col:
            req_parts.append("学历：" + normalize_text(row.get(edu_col)))
        if ratio_col:
            req_parts.append("面试比例：" + normalize_text(row.get(ratio_col)))
        picked.append(
            {
                "name": name,
                "req": "；".join(req_parts) or "详见官方职位表",
                "score": "职位表不含往年进面分数，以国家公务员局面试名单/各机关公告为准",
            }
        )
        if len(picked) >= limit:
            break
    if not picked:
        picked.append(
            {
                "name": "未匹配到明确岗位",
                "req": f"请在官方职位表中搜索：{'、'.join(aliases[:4])}",
                "score": "以官方职位表和面试名单为准",
            }
        )
    return picked


def infer_line_for_major(national_records: list[dict[str, str]], major: str) -> str:
    text = json.dumps(national_records, ensure_ascii=False)
    category_map = {
        "临床医学": "医学",
        "护理学": "医学",
        "药学": "医学",
        "法学": "法学",
        "金融": "经济学",
        "应用经济学": "经济学",
        "教育学": "教育学",
        "汉语言文学": "文学",
        "英语": "文学",
        "会计学": "管理学",
        "财务管理": "管理学",
        "市场营销": "管理学",
        "计算机科学与技术": "工学",
        "软件工程": "工学",
        "电气工程": "工学",
        "土木工程": "工学",
        "机械工程": "工学",
        "化学工程": "工学",
        "生物医学工程": "工学",
        "心理学": "教育学",
    }
    category = category_map.get(major, major)
    if category in text:
        return f"2025 国家线：研招网已发布，专业门类参考「{category}」；详见来源链接"
    return "2025 国家线：请查看研招网官方分数线页面"


def build_school_items(school_records: list[dict[str, str]], national_records: list[dict[str, str]], major: str) -> list[dict[str, str]]:
    aliases = MAJOR_ALIASES[major]
    matched: list[dict[str, str]] = []
    for row in school_records:
        row_text = " ".join(row.values())
        if any(alias in row_text for alias in aliases):
            title = row.get("_school_page_title", "研招网院校复试线")
            school_name = re.sub(r"2025.*", "", title).strip(" -_：:") or title[:18]
            matched.append(
                {
                    "name": school_name,
                    "ratio": "研招网未统一公开报录比，请以院校研究生院公布为准",
                    "line": "2025 复试线：已匹配研招网页面，详见官方链接",
                    "note": row.get("_school_page_url", YZ_34_LINE_INDEX),
                }
            )
        if len(matched) >= 3:
            break
    if matched:
        return matched
    return [
        {
            "name": "研招网专业目录/目标院校",
            "ratio": "研招网未统一公开报录比",
            "line": infer_line_for_major(national_records, major),
            "note": "请结合院校研究生院复试线公告核对",
        }
    ]


def build_major_json(national_records: list[dict[str, str]], school_records: list[dict[str, str]], gwy_df: pd.DataFrame) -> dict[str, Any]:
    majors: dict[str, Any] = {}
    for major, aliases in MAJOR_ALIASES.items():
        majors[major] = {
            "aliases": aliases[1:],
            "schools": build_school_items(school_records, national_records, major),
            "tutors": [
                "导师与课程数据需以各院校研究生院/学院官网公布为准。",
                "脚本已整理研招网分数线和官方入口，可继续扩展院校官网采集规则。",
            ],
            "competitions": [
                {"name": "挑战杯", "desc": "科研、社会实践、创新作品积累。", "url": "https://www.tiaozhanbei.net/"},
                {"name": "中国国际大学生创新大赛", "desc": "创新创业项目和团队实践。", "url": "https://cy.ncss.cn/"},
                {"name": "全国大学生数学建模竞赛", "desc": "建模、数据分析、工程优化能力展示。", "url": "https://www.mcm.edu.cn/"},
            ],
            "resources": [
                {"name": name, "url": url}
                for name, url in COMMON_LINKS.items()
                if name in ["研招网", "研招资讯", "硕士专业目录"]
            ],
            "jobs": [
                {
                    "name": "待接入就业岗位库",
                    "salary": "以国家大学生就业服务平台和企业校招公告为准",
                    "req": "脚本本次重点采集研招网和国考官方数据",
                }
            ],
            "growth": [
                '查看国家大学生就业服务平台：<a class="text-brand font-semibold" target="_blank" rel="noopener" href="https://www.ncss.cn/">官方入口</a>',
                "根据目标院校复试要求补齐竞赛、科研、实习和证书材料。",
            ],
            "gongPosts": build_gong_posts(gwy_df, major),
        }
    return majors


def make_output_data(majors: dict[str, Any], notes: list[SourceNote]) -> dict[str, Any]:
    return {
        "meta": {
            "generatedAt": time.strftime("%Y-%m-%d %H:%M:%S"),
            "warning": "官方源不统一公开所有院校所有专业报录比；国考职位表不含往年进面分数。本数据保留官方来源和缺失说明，避免伪造。",
            "sources": [note.__dict__ for note in notes],
        },
        "majors": majors,
    }


def write_outputs(data: dict[str, Any], out_json: Path, out_js: Path) -> None:
    out_json.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    out_js.write_text("DATA.majors = " + json.dumps(data["majors"], ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    log(f"已生成 JSON：{out_json}")
    log(f"已生成 JS 片段：{out_js}")


def patch_app_js(app_path: Path, data: dict[str, Any]) -> None:
    text = app_path.read_text(encoding="utf-8")
    marker = "DATA = buildExpandedData2025();"
    patch = (
        "DATA = buildExpandedData2025();\n"
        "// crawler_official_data.py 自动更新：只覆盖专业数据，不改功能逻辑。\n"
        "DATA.majors = "
        + json.dumps(data["majors"], ensure_ascii=False, indent=2)
        + ";\n"
    )
    pattern = re.compile(
        r"DATA = buildExpandedData2025\(\);\n(?:// crawler_official_data\.py 自动更新：只覆盖专业数据，不改功能逻辑。\nDATA\.majors = .*?;\n)?",
        re.S,
    )
    if marker not in text:
        raise RuntimeError("没有在 app.js 中找到 DATA = buildExpandedData2025();，为安全起见不自动修改。")
    new_text = pattern.sub(patch, text, count=1)
    app_path.write_text(new_text, encoding="utf-8")
    log(f"已自动更新：{app_path}")


def main() -> int:
    parser = argparse.ArgumentParser(description="抓取研招网/国家公务员局官方数据并生成职路导航 JSON")
    parser.add_argument("--gwy-excel", help="已经下载好的国家公务员局招考简章 Excel 路径；自动发现失败时使用")
    parser.add_argument("--out-json", default="zhilu_generated_data.json", help="输出 JSON 文件")
    parser.add_argument("--out-js", default="zhilu_generated_data_snippet.js", help="输出可粘贴到 app.js 的 JS 片段")
    parser.add_argument("--patch-app", default="", help="可选：自动更新 app.js，例如 --patch-app app.js")
    parser.add_argument("--cache-dir", default=".cache_official_data", help="下载缓存目录")
    args = parser.parse_args()

    notes: list[SourceNote] = []
    national_records = scrape_yz_national_lines(notes)
    school_links = discover_yz_34_line_links(notes)
    school_records = scrape_yz_school_lines(school_links, notes)

    excel_path: Path | None = Path(args.gwy_excel) if args.gwy_excel else None
    if excel_path is None:
        excel_url = discover_gwy_excel(notes)
        if excel_url:
            try:
                excel_path = download_file(excel_url, Path(args.cache_dir))
            except Exception as exc:
                notes.append(SourceNote("国考职位表下载", excel_url, f"失败：{exc}"))
    gwy_df = scrape_gwy_positions(excel_path, notes)

    majors = build_major_json(national_records, school_records, gwy_df)
    data = make_output_data(majors, notes)
    write_outputs(data, Path(args.out_json), Path(args.out_js))
    if args.patch_app:
        patch_app_js(Path(args.patch_app), data)

    log("\n完成。请打开 zhilu_generated_data.json 查看结果。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
