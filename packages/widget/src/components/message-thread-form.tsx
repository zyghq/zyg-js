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
import { sendThreadMessageAPI } from "@/api";

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

type FormValues = z.infer<typeof formSchema>;

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

export function MessageThreadForm({
  disabled,
  widgetId,
  threadId,
  jwt,
  refetch,
}: {
  disabled: boolean;
  widgetId: string;
  threadId: string;
  jwt: string;
  refetch: () => void;
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
    const { error } = await sendThreadMessageAPI(widgetId, threadId, jwt, {
      message,
    });
    if (error) {
      const { message } = error;
      form.setError("root.serverError", {
        message: message || "Please try again later.",
      });
      return;
    }
    form.reset({ message: "" });
    refetch();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-between items-center"
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="space-y-2 w-full">
              <FormControl>
                <Textarea
                  disabled={disabled}
                  className="resize-none"
                  placeholder="Send us a message"
                  title="Send us a message"
                  required
                  {...field}
                  onKeyDown={onEnterPress}
                />
              </FormControl>
              {errors?.root?.serverError && (
                <FormMessage>{errors?.root?.serverError?.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
        <SubmitButton isDisabled={isSubmitting || disabled} />
      </form>
    </Form>
  );
}
