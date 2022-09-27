import { useRouter } from "next/router";
import { Box, Button, TextInput } from "@laodeaksarr/design-system";
import { useForm } from "@mantine/form";

import { trpc } from "~/utils/trpc";

import Layout from "@/layout/Layout";

function CreatePostPage() {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      title: "",
      //body: "<p>Your initial <b>html value</b> or an empty string to init editor without value</p>",
      body: [],
    },
  });

  const { isLoading, mutate } = trpc.post.createPost.useMutation({
    onSuccess(post) {
      router.push(`/posts/${post.slug}`);
    },
  });

  async function handleSubmit(values: { title: string; body: any }) {
    const { title, body } = values;

    mutate({
      title,
      body,
    });
  }

  return (
    <Layout footer header>
      <Box>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            required
            id="title"
            label="Title"
            aria-label="Title"
            placeholder="Your post title"
            {...form.getInputProps("title")}
          />
          <Button
            aria-label="Send message"
            isLoading={isLoading}
            variant="primary"
            type="submit"
          >
            Create post
          </Button>
        </form>
      </Box>
    </Layout>
  );
}

export default CreatePostPage;
