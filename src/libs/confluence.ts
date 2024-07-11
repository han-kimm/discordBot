import axios from "axios";
import { config } from "dotenv";
import { writeFile, readFile } from "fs/promises";
import { htmlToText } from "html-to-text";

config();
const username = process.env.ATLASSIAN_USERNAME;
const accessToken = process.env.ATLASSIAN_API_KEY;
const baseUrl = "https://ecubelabs.atlassian.net";
const spaceKey = "SW";

axios.defaults.baseURL = baseUrl;
axios.defaults.headers.common["Authorization"] = `Basic ${Buffer.from(
  `${username}:${accessToken}`
).toString("base64")}`;
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";

// NOTE: Confluence의 특정 페이지의 자식 페이지들의 ID를 가져오는 함수
// ID를 먼저 가져오고, 이후에 페이지의 내용을 가져오는 방식으로 사용
export async function getChildrenPageIds(pageId: string) {
  const response = await axios.get(
    `/wiki/api/v2/pages/${pageId}/children?limit=250`
  );
  const results = response.data.results;
  return results.map((result: any) => result.id);
}

export async function getAllChildrenPageIds(pageId: string) {
  let result: string[] = [];
  const childrenPageIds = await getChildrenPageIds(pageId);
  if (childrenPageIds.length === 0) {
    return result;
  }
  result = [...result, ...childrenPageIds];
  for (const childPageId of childrenPageIds) {
    const res = await getAllChildrenPageIds(childPageId);
    result = [...result, ...res];
  }
  return result;
}

export async function savePageIds(id: string) {
  const ids = await getAllChildrenPageIds(id);
  ids.unshift(id);
  await writeFile(
    __dirname.replace("libs", "assets") + `/confluencePageIds-${id}.json`,
    JSON.stringify(ids, null, 2)
  );
}

export async function loadPageIds(filePath: string) {
  const data = await readFile(filePath, "utf-8");
  return JSON.parse(data);
}

export async function getContentById(id: string) {
  const response = await axios.get(
    `/wiki/api/v2/pages/${id}?body-format=export_view`
  );
  const title = response.data.title;
  const value = response.data.body.export_view.value;
  return {
    pageContent: htmlToText(title + value),
    url: `${baseUrl}/wiki/spaces/${spaceKey}/pages/${id}`,
  };
}

export async function getAllPageContents(parentPageId: string) {
  const ids = await getAllChildrenPageIds(parentPageId);
  const contents = await Promise.all(
    ids.map((id: string) => getContentById(id))
  );

  return contents;
}

export async function getAllPageContentsWithJSON(filePath: string) {
  const ids = await loadPageIds(filePath);
  const contents = await Promise.all(
    ids.map((id: string) => getContentById(id))
  );
  return contents;
}

export async function saveAllpageContents(parentPageId: string) {
  const contents = await getAllPageContents(parentPageId);

  await writeFile(
    __dirname.replace("libs", "assets") +
      `/confluenceContents-${parentPageId}.json`,
    JSON.stringify(contents, null, 2)
  );
}

export async function getAllPageContentsFromJSON(
  filePath: string
): Promise<
  | { pageContent: string; url: string }[]
  | { pageContent: string; metadata: { [key: string]: any } }[]
> {
  const data = await readFile(
    __dirname.replace("libs", "assets") + `/${filePath}`,
    "utf-8"
  );
  return JSON.parse(data);
}
