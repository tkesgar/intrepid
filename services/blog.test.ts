import { getPost } from "./blog";

const TEST_BLOG_PATH = "./tests/test-blog";

describe("getPost", () => {
  it("should return the post data", async () => {
    const post = await getPost("2021-07-08.test", { blogPath: TEST_BLOG_PATH });

    expect(post).toMatchSnapshot();
  });

  it("should return the complete meta data from meta.yml", async () => {
    const post = await getPost("2021-07-08.test", { blogPath: TEST_BLOG_PATH });

    expect(post.title).toBe("Test Post");
    expect(post.slug).toBe("test-post");
    expect(post.date).toEqual(new Date("2021-07-08T21:56:39+07:00"));
  });

  it("should return the post data without meta.yml", async () => {
    const post = await getPost("2021-07-08.test-no-meta", {
      blogPath: TEST_BLOG_PATH,
    });

    expect(post.title).toBe("Test No Meta");
    expect(post.slug).toBe("test-no-meta");
    expect(post.date).toEqual(new Date("2021-07-08T00:00:00+07:00"));
  });
});
