import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendHorizonalIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { createThreadAPI } from "@/api";
import { NavigateFn } from "@tanstack/react-router";

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

type FormValues = {
  message: string;
};

function SubmitButton({ isDisabled }: { isDisabled: boolean }) {
  return (
    <Button
      className="ml-1"
      size="icon"
      type="submit"
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-label="Send Message"
    >
      <SendHorizonalIcon className="h-4 w-4" />
    </Button>
  );
}

export function StartThreadForm({
  widgetId,
  jwt,
  navigate,
}: {
  widgetId: string;
  jwt: string;
  navigate: NavigateFn;
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const { formState } = form;
  const { isSubmitting, errors } = formState;

  const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const { message } = values;
    const response = await createThreadAPI(widgetId, jwt, {
      message,
    });
    const { error, data } = response;
    if (error) {
      const { message } = error;
      form.setError("root.serverError", {
        message: message || "Please try again later.",
      });
      return;
    }
    if (data) {
      const { threadId } = data;
      console.log("******** should be navigating now.....");
      await navigate({ to: `/threads/$threadId`, params: { threadId } });
    } else {
      form.setError("root.serverError", {
        message: "Something went wrong. Please try again later.",
      });
    }
  };

  const isDisabled = isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-between items-center"
      >
        <FormField
          control={form.control}
          name="message"
          disabled={false}
          render={({ field }) => (
            <FormItem className="space-y-2 w-full">
              <FormControl>
                <Textarea
                  className="resize-none"
                  placeholder="Send us a message"
                  title="Send us a message"
                  required
                  autoFocus
                  {...field}
                  onKeyDown={onEnterPress}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <SubmitButton isDisabled={isDisabled} />
      </form>
      {errors?.root?.serverError && (
        <FormMessage className="text-xs mt-1">
          {errors?.root?.serverError?.message}
        </FormMessage>
      )}
    </Form>
  );
}
