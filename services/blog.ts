import path from "path";
import fs from "fs/promises";
import yaml from "yaml";

interface Post {
  content: string;
  title: string;
  slug: string;
  date: Date;
  hidden: boolean;
}

function toTitleCase(str: string) {
  return str.replaceAll(/\w\S*/g, (substr) => {
    const head = substr.slice(0, 1);
    const tail = substr.slice(1);
    return [head.toUpperCase(), tail.toLowerCase()].join("");
  });
}

export async function getPost(
  dirName: string,
  opts: {
    blogPath?: string;
    timeOffset?: string;
  } = {}
): Promise<Post> {
  const { blogPath = "./blog", timeOffset = "+07:00" } = opts;

  const postPath = path.join(process.cwd(), blogPath, dirName);

  const [content, meta] = await Promise.all([
    (async () => {
      const contentPath = path.join(postPath, "content.md");
      const content = await fs.readFile(contentPath, { encoding: "utf-8" });

      return content;
    })(),
    (async () => {
      const metaPath = path.join(postPath, "meta.yml");

      let metaYaml: string;
      try {
        metaYaml = await fs.readFile(metaPath, { encoding: "utf-8" });
      } catch (error) {
        // If we cannot read the meta (the file does not exist), fall back to
        // a default meta retrieved from directory name.
        const [strDate, strTitle] = dirName.split(".");

        return {
          title: toTitleCase(strTitle.replaceAll(/[-]/g, " ")),
          slug: strTitle,
          date: new Date(`${strDate}T00:00:00${timeOffset}`),
          hidden: false,
        };
      }

      // Splitting parsing the YAML here so that if it errors (e.g. invalid syntax),
      // the error will propagate out.
      const meta = yaml.parse(metaYaml);

      return {
        title: meta.title,
        slug: meta.slug,
        date: new Date(meta.date),
        hidden: meta.hidden,
      };
    })(),
  ]);

  return {
    content,
    title: meta.title,
    slug: meta.slug,
    date: meta.date,
    hidden: meta.hidden,
  };
}
